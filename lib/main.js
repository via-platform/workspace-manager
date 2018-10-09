const {CompositeDisposable, Disposable, Emitter, axios} = require('via');
const WorkspaceManagerStatusView = require('./workspace-manager-status-view');

class WorkspaceManager {
    async initialize(){
        this.emitter = new Emitter();
        this.disposables = new CompositeDisposable();
        this.statusViewAttached = false;

        this.disposables.add(via.commands.add('via-workspace', {
            'workspace-manager:save-workspace': this.save.bind(this),
            'workspace-manager:switch-workspace': this.load.bind(this)
        }));
    }

    load(){
        axios.get('https://data.via.world/api/v1/workspaces', via.user.headers())
        .then(response => {
            if(!response.data.length){
                return via.console.error('You do not have any saved workspaces.');
            }

            this.actions.omnibar.search({
                name: 'Switch Workspace',
                placeholder: 'Search For A Saved Workspace...',
                didConfirmSelection: selection => {
                    via.workspace.reset();
                    via.workspace.deserialize(selection.workspace.schema, via.deserializers);
                    via.console.alert(`Switched workspace to ${selection.name}.`);
                },
                maxResultsPerCategory: 60,
                items: response.data.map(workspace => ({name: workspace.name, workspace}))
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    async save(){
        if(this.modal){
            return this.modal.show();
        }

        this.modal = await via.modal.form(
            {
                title: 'Save Workspace'
            },
            {
                options: {
                    confirmText: 'Save Workspace',
                    title: 'Save Workspace'
                },
                fields: {
                    workspaceTitle: {
                        type: 'string',
                        title: 'Workspace Title'
                    }
                }
            }
        );

        this.modal.on('did-confirm', data => {
            this.modal = undefined;

            if(data.workspaceTitle){
                axios.post(`https://data.via.world/api/v1/workspaces`, {name: data.workspaceTitle, schema: via.workspace.serialize()}, via.user.headers())
                .then(workspace => via.console.alert(`Workspace saved as '${data.workspaceTitle}'.`))
                .catch(({error, detail}) => via.console.error(error, detail));
            }else{
                via.console.error('Please enter a workspace title.');
            }
        });

        this.modal.on('did-cancel', () => {
            this.modal = undefined;
        });
    }

    consumeActionBar(actions){
        this.actions = actions;
    }

    consumeStatusBar(status){
        this.status = status;
        this.attachStatusBarView();
    }

    attachStatusBarView(){
        if(!this.statusViewAttached){
            this.statusViewAttached = new WorkspaceManagerStatusView({status: this.status, action: this.action, manager: this});
        }
    }

    deactivate(){
        if(this.statusViewAttached) this.statusViewAttached.destroy();
        this.disposables.dispose();
        this.emitter.dispose();
    }
}

module.exports = new WorkspaceManager();
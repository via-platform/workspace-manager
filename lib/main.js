const {CompositeDisposable, Disposable, Emitter} = require('via');
const WorkspaceManagerStatusView = require('./workspace-manager-status-view');

class WorkspaceManager {
    async initialize(){
        this.emitter = new Emitter();
        this.disposables = new CompositeDisposable();
        this.statusViewAttached = false;

        this.disposables.add(via.commands.add('via-workspace', {
            'workspace-manager:save-workspace': () => {},
            'workspace-manager:load-workspace': () => {}
        }));
    }

    load(){

    }

    save(){
        
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
            this.statusViewAttached = new WorkspaceManagerStatusView({status: this.status, action: this.action});
        }
    }

    deactivate(){
        if(this.statusViewAttached) this.statusViewAttached.destroy();
        this.disposables.dispose();
        this.emitter.dispose();
    }
}

module.exports = new WorkspaceManager();
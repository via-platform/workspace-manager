const etch = require('etch');
const $ = etch.dom;

module.exports = class WorkspaceManagerStatusView {
    constructor({status, action, manager}){
        this.status = status;
        this.action = action;
        this.manager = manager;

        etch.initialize(this);

        this.statusBarTile = this.status.addRightTile({item: this});
    }

    render(){
        return $.div({classList: 'workspace-manager-status toolbar-button', onClick: () => this.manager.load()},
            $.svg({class: 'workspace-manager-status-icon', viewBox: '0 0 18 10', width: 18, height: 10},
                $.rect({x: 0, y: 0, width: 8, height: 7}),
                $.rect({x: 10, y: 0, width: 8, height: 7}),
                $.rect({x: 6, y: 9, width: 6, height: 1})
            ),
            'Switch Workspace'
        );
    }

    update(){}

    destroy(){
        this.statusBarTile.destroy();
    }
}
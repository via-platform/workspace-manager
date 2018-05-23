const {CompositeDisposable, Disposable, Emitter} = require('via');
const etch = require('etch');
const $ = etch.dom;

module.exports = class WorkspaceManagerStatusView {
    constructor({status, action}){
        this.status = status
        this.action = action
        this.disposables = new CompositeDisposable();

        etch.initialize(this);

        this.statusBarTile = this.status.addLeftTile({item: this});

        // this.disposables.add(via.workspace.getCenter().onDidChangeActivePaneItem(() => {
        //     this.updateImageSize()
        // }))
    }

    render(){
        return $.div({classList: 'workspace-manager-status toolbar-button'},
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
        this.disposables.dispose();
    }

    getImageSize({
        originalHeight,
        originalWidth,
        imageSize
    }){
        this.imageSizeStatus.textContent = `${originalWidth}x${originalHeight} ${bytes(imageSize)}`
        this.imageSizeStatus.style.display = ''
    }

    updateImageSize(){
        if(this.imageLoadDisposable){
            this.imageLoadDisposable.dispose()
        }

        const editor = via.workspace.getCenter().getActivePaneItem()
        if(editor instanceof ImageEditor && editor.view instanceof ImageEditorView){
            this.editorView = editor.view
            if(this.editorView.loaded){
                this.getImageSize(this.editorView)
            }

            this.imageLoadDisposable = this.editorView.onDidLoad(() => {
                if(editor === via.workspace.getCenter().getActivePaneItem()){
                    this.getImageSize(this.editorView)
                }
            })
        } else {
            this.imageSizeStatus.style.display = 'none'
        }
    }
}
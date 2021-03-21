import {colorToHTML} from "../utils/color";

export default class Handles {
    constructor(model){
        this.model = model;
        this.model.pointAdded.add(this.addHandle, this);
        this.model.pointRemoved.add(this.removeHandle, this);

        this.initDom();
    }

    initDom(){
        this.dom = document.createElement("div");
        this.dom.classList.add("handlesContainer");

        this.handles = this.model.points.map(point => {
            return {
                model:point,
                dom:this.createHandleDom(point.color)
            };
        });
        this.handles.forEach(handle => this.dom.appendChild(handle.dom));
    }

    createHandleDom(color){
        const dom = document.createElement("div");
        dom.classList.add("handle");
        this.setHandleDomColor(dom, color);
        return dom;
    }

    getHandleByDom(dom){
        return this.handles.find(handle => handle.dom === dom);
    }

    addHandle(point){
        const handle = {
            model:point,
            dom:this.createHandleDom(point.color)
        };
        this.handles.push(handle);
        this.dom.appendChild(handle.dom);
    }

    removeHandle(point){
        const id = this.handles.findIndex(handle => handle.model === point);
        if(id !== -1){
            const handle = this.handles[id];
            this.dom.removeChild(handle.dom);
            this.handles.splice(id, 1);
        }
    }

    setHandleDomColor(handleDom, color){
        handleDom.style.backgroundColor = colorToHTML(color);
    }

    setHandleDomPosition(handleDom, position){
        Object.assign(handleDom.style, {
            top:position.y + "px",
            left:position.x + "px",
        });
    }

    update(){
        this.handles.forEach(handle =>
            this.setHandleDomPosition(handle.dom, handle.model)
        );
    }

}

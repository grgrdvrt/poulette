import {
    getColorInMesh
} from "../utils/color";

const minDragDist = 5;

export default class PointerControl {
    constructor(model, handles, mesh){
        this.model = model;
        this.handles = handles;
        this.mesh = mesh;

        this.initialDraggingPosition = null;
        this.draggingHandle = null;
        this.selectionHandle = null;

        this.isTouchDown = false;
        this.pointerPosition = {
            x:undefined,
            y:undefined,
        };

        this.handles.dom.addEventListener("mousedown", this.onHandleDown);
        this.mesh.dom.addEventListener("mousedown", this.onMeshDown);

        this.handles.dom.addEventListener("touchstart", this.onHandleDown);
        this.mesh.dom.addEventListener("touchstart", this.onMeshDown);
    }

    updatePointerPosition(e){
        if(e.type === "touchend"){
            return;
        }
        const rect = this.mesh.dom.getBoundingClientRect();
        this.pointerPosition.x = ((e.touches?.[0] || e)?.pageX - rect.x) || 0;
        this.pointerPosition.y = ((e.touches?.[0] || e)?.pageY - rect.y) || 0;
    }

    onHandleDown = e => {
        this.updatePointerPosition(e);
        this.draggingHandle = this.handles.getHandleByDom(e.target);
        if(this.draggingHandle){
            this.initialDraggingPosition = {...this.pointerPosition};
            document.addEventListener("mouseup", this.onStopDragHandle);
            document.addEventListener("mousemove", this.onDragHandle);

            document.addEventListener("touchend", this.onStopDragHandle);
            document.addEventListener("touchmove", this.onDragHandle);
        }
    }

    onMeshDown = e => {
        this.updatePointerPosition(e);
        const color = getColorInMesh(
            this.model.triangles,
            this.pointerPosition.x,
            this.pointerPosition.y
        );
        if(color){
            this.selectionHandle = {
                dom:this.handles.createHandleDom(color),
                model:{...this.pointerPosition, color}
            };
            this.handles.dom.appendChild(this.selectionHandle.dom);
            this.handles.setHandleDomPosition(this.selectionHandle.dom, this.pointerPosition);
            document.addEventListener("mouseup", this.onStopDragSelection);
            document.addEventListener("mousemove", this.onDragSelection);

            document.addEventListener("touchend", this.onStopDragSelection);
            document.addEventListener("touchmove", this.onDragSelection);
        }
    }

    onDragHandle = e => {
        this.updatePointerPosition(e);
        this.draggingHandle.model.x = this.pointerPosition.x;
        this.draggingHandle.model.y = this.pointerPosition.y;
    }

    onStopDragHandle = e => {
        this.updatePointerPosition(e);
        if(this.model.isPointInArea(this.pointerPosition)){
            if(Math.hypot(
                this.pointerPosition.x - this.initialDraggingPosition.x,
                this.pointerPosition.y - this.initialDraggingPosition.y,
            ) < minDragDist){
                this.model.selectPoint(this.draggingHandle.model);
            }
        }
        else{
            this.model.remove(this.draggingHandle.model);
        }
        this.draggingHandle = null;
        document.removeEventListener("mouseup", this.onStopDragHandle);
        document.removeEventListener("mousemove", this.onDragHandle);

        document.removeEventListener("touchend", this.onStopDragHandle);
        document.removeEventListener("touchmove", this.onDragHandle);
    }

    onDragSelection = e => {
        this.updatePointerPosition(e);
        const color = getColorInMesh(
            this.model.triangles,
            this.pointerPosition.x,
            this.pointerPosition.y
        );
        if(color){
            this.selectionHandle.model.color = color;
            this.handles.setHandleDomColor(this.selectionHandle.dom, color);
            this.model.selectColor(color);
        }
        this.handles.setHandleDomPosition(this.selectionHandle.dom, this.pointerPosition);
    }

    onStopDragSelection = e => {
        this.updatePointerPosition(e);
        if(this.model.isPointInArea(this.pointerPosition)){
            const point = this.model.add(this.selectionHandle.model.color, this.pointerPosition);
            this.model.selectPoint(point);
        }
        this.handles.dom.removeChild(this.selectionHandle.dom);
        this.selectionHandle = null;

        document.removeEventListener("mouseup", this.onStopDragSelection);
        document.removeEventListener("mousemove", this.onDragSelection);

        document.removeEventListener("touchend", this.onStopDragSelection);
        document.removeEventListener("touchmove", this.onDragSelection);
    }
}

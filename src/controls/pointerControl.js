import Signal from "../utils/signal";

const minDragDist = 5;

export default class PointerControl {
    constructor(pointsModel, pointsView, meshView){
        this.pointsModel = pointsModel;
        this.pointsView = pointsView;
        this.meshView = meshView;

        this.colorSelected = new Signal();

        this.initialDraggingPosition = null;
        this.draggingPoint = null;
        this.selectionPoint = null;

        this.isTouchDown = false;
        this.pointerPosition = {
            x:undefined,
            y:undefined,
        };

        this.pointsView.dom.addEventListener("mousedown", this.onPointDown);
        this.meshView.dom.addEventListener("mousedown", this.onMeshDown);

        this.pointsView.dom.addEventListener("touchstart", this.onPointDown);
        this.meshView.dom.addEventListener("touchstart", this.onMeshDown);
    }

    updatePointerPosition(e){
        if(e.type === "touchend"){
            return;
        }
        const rect = this.meshView.dom.getBoundingClientRect();
        this.pointerPosition.x = ((e.touches?.[0] || e)?.pageX - rect.x) || 0;
        this.pointerPosition.y = ((e.touches?.[0] || e)?.pageY - rect.y) || 0;
    }

    isPointInArea(position){
        return position.x >= 0
            && position.y >= 0
            && position.x <= this.meshView.width
            && position.y <= this.meshView.height;
    }

    onPointDown = e => {
        this.updatePointerPosition(e);
        this.draggingPoint = this.pointsView.getPointByDom(e.target);
        if(this.draggingPoint){
            this.initialDraggingPosition = {...this.pointerPosition};
            document.addEventListener("mouseup", this.onStopDragPoint);
            document.addEventListener("mousemove", this.onDragPoint);

            document.addEventListener("touchend", this.onStopDragPoint);
            document.addEventListener("touchmove", this.onDragPoint);
        }
    }

    onMeshDown = e => {
        this.updatePointerPosition(e);
        const color = this.pointsModel.getColorAt(
            this.pointerPosition.x,
            this.pointerPosition.y
        );
        if(color){
            this.selectionPoint = {
                dom:this.pointsView.createPointDom(color),
                model:{...this.pointerPosition, color}
            };
            this.pointsView.dom.appendChild(this.selectionPoint.dom);
            this.pointsView.setPointDomPosition(this.selectionPoint.dom, this.pointerPosition);
            document.addEventListener("mouseup", this.onStopDragSelection);
            document.addEventListener("mousemove", this.onDragSelection);

            document.addEventListener("touchend", this.onStopDragSelection);
            document.addEventListener("touchmove", this.onDragSelection);
        }
    }

    onDragPoint = e => {
        this.updatePointerPosition(e);
        this.draggingPoint.model.x = this.pointerPosition.x;
        this.draggingPoint.model.y = this.pointerPosition.y;
    }

    onStopDragPoint = e => {
        this.updatePointerPosition(e);
        if(this.isPointInArea(this.pointerPosition)){
            if(Math.hypot(
                this.pointerPosition.x - this.initialDraggingPosition.x,
                this.pointerPosition.y - this.initialDraggingPosition.y,
            ) < minDragDist){
                this.colorSelected.dispatch(this.draggingPoint.model.color);
            }
        }
        else{
            this.pointsModel.remove(this.draggingPoint.model);
        }
        this.draggingPoint = null;
        document.removeEventListener("mouseup", this.onStopDragPoint);
        document.removeEventListener("mousemove", this.onDragPoint);

        document.removeEventListener("touchend", this.onStopDragPoint);
        document.removeEventListener("touchmove", this.onDragPoint);
    }

    onDragSelection = e => {
        this.updatePointerPosition(e);
        const color = this.pointsModel.getColorAt(
            this.pointerPosition.x,
            this.pointerPosition.y
        );
        if(color){
            this.selectionPoint.model.color = color;
            this.pointsView.setPointDomColor(this.selectionPoint.dom, color);
            this.colorSelected.dispatch(color);
        }
        this.pointsView.setPointDomPosition(this.selectionPoint.dom, this.pointerPosition);
    }

    onStopDragSelection = e => {
        this.updatePointerPosition(e);
        if(this.isPointInArea(this.pointerPosition)){
            this.pointsModel.add(this.selectionPoint.model.color, this.pointerPosition);
            this.colorSelected.dispatch(this.selectionPoint.model.color);
        }
        this.pointsView.dom.removeChild(this.selectionPoint.dom);
        this.selectionPoint = null;

        document.removeEventListener("mouseup", this.onStopDragSelection);
        document.removeEventListener("mousemove", this.onDragSelection);

        document.removeEventListener("touchend", this.onStopDragSelection);
        document.removeEventListener("touchmove", this.onDragSelection);
    }
}

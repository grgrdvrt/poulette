export default class PointsView {
    constructor(pointsModel){
        this.pointsModel = pointsModel;
        this.pointsModel.pointAdded.add(this.addPoint, this);
        this.pointsModel.pointRemoved.add(this.removePoint, this);

        this.initDom();
    }

    initDom(){
        this.dom = document.createElement("div");
        this.dom.classList.add("pointsContainer");

        this.points = this.initPoints();
        this.points.forEach(pt => this.dom.appendChild(pt.dom));
    }

    initPoints(){
        return this.pointsModel.points.map(point => {
            return {
                model:point,
                dom:this.createPointDom(point.color)
            };
        });
    }

    createPointDom(color){
        const emt = document.createElement("div");
        emt.classList.add("colorPoint");
        this.setPointDomColor(emt, color);
        return emt;
    }

    getPointByDom(dom){
        return this.points.find(pt => pt.dom === dom);
    }

    addPoint(point){
        const pt = {
            model:point,
            dom:this.createPointDom(point.color)
        };
        this.points.push(pt);
        this.dom.appendChild(pt.dom);
    }

    removePoint(point){
        const id = this.points.findIndex(pt => pt.model === point);
        if(id !== -1){
            const item = this.points[id];
            this.dom.removeChild(item.dom);
            this.points.splice(id, 1);
        }
    }

    setPointDomColor(pointDom, color){
        const r = Math.round(color.r * 255);
        const g = Math.round(color.g * 255);
        const b = Math.round(color.b * 255);
        pointDom.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }

    setPointDomPosition(pointDom, position){
        Object.assign(pointDom.style, {
            top:position.y + "px",
            left:position.x + "px",
        });
    }

    update(){
        this.points.forEach(pt =>
            this.setPointDomPosition(pt.dom, pt.model)
        );
    }

}

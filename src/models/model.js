import Signal from "../utils/signal";
import {
    getProjectedPoint,
    triangulate,
} from "../utils/geom";
import {hexToRgb} from "../utils/color";

export default class Model{
    constructor(width, height){
        this.width = width;
        this.height = height;

        this.pointRemoved = new Signal();
        this.pointAdded = new Signal();
        this.colorAdded = new Signal();

        this.points = [];
    }

    add(color, position){
        const point = {
            color,
            x:position.x,
            y:position.y
        };
        this.points.push(point);
        this.updateTriangles();
        this.pointAdded.dispatch(point);
        this.colorAdded.dispatch(color);
        return point;
    }

    remove(point){
        const id = this.points.indexOf(point);
        if(id !== -1){
            this.points.splice(id, 1);
            this.updateTriangles();
            this.pointRemoved.dispatch(point);
        }
        return point;
    }

    updateTriangles(){
        this.triangles = triangulate(this.points);
    }


    isPointInArea(position){
        return position.x >= 0
            && position.y >= 0
            && position.x <= this.width
            && position.y <= this.height;
    }

}

import Signal from "../utils/signal";
import {
    getProjectedPoint,
    triangulate,
} from "../utils/geom";

const maxEdgeLength = 300;

export default class PointsModel{
    constructor(width, height){
        this.width = width;
        this.height = height;

        this.pointRemoved = new Signal();
        this.pointAdded = new Signal();
        this.colorAdded = new Signal();

        this.points = [];
        this.allColors = [
            0xffffff,
            0x000000,

            0xff0000,
            0x00ff00,
            0x0000ff,

            0x00ffff,
            0xff00ff,
            0xffff00,
        ];
    }

    add(color, position){
        const point = {
            color,
            x:position.x,
            y:position.y
        };
        this.points.push(point);
        if(!this.allColors.includes(color)){
            this.allColors.push(color);
        }
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

}

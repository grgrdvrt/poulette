import Signal from "../utils/signal";
import {
    getProjectedPoint,
    triangulate,
} from "../utils/geom";
import {
    lerp,
    sign,
    isPointInTriangle,
    barycentricCoordinates,
    rgbToGamma,
    rgbToLinear,
} from "../utils/maths";

const maxEdgeLength = 300;

export default class PointsModel{
    constructor(){
        this.pointRemoved = new Signal();
        this.pointAdded = new Signal();

        this.points = [];
    }

    add(color, position){
        const point = {
            color,
            x:position.x,
            y:position.y
        };
        this.points.push(point);
        this.pointAdded.dispatch(point);
        this.updateTriangles();
        return point;
    }

    remove(point){
        const id = this.points.indexOf(point);
        if(id !== -1){
            this.points.splice(id, 1);
            this.pointRemoved.dispatch(point);
            this.updateTriangles();
        }
        return point;
    }

    updateTriangles(){
        this.triangles = triangulate(this.points).filter(tri => !!tri);
    }

    getColorAt(x, y){
        const pt = {x, y};
        const tri = this.triangles.find(tri => {
            return isPointInTriangle(pt, ...tri);
        });

        return tri
            ? this.getColorInTriangle(tri, pt)
            : this.getColorOutsideTriangles(pt);
    }

    getColorOutsideTriangles(pt){
        const segments = [];
        this.triangles.forEach(([a, b, c]) => {
            segments.push([a, b], [a, c], [b, c]);
        });

        const {v0, v1, u, px, py} = segments.reduce((best, [v0, v1]) => {
            const {x, y, u} = getProjectedPoint(v0, v1, pt);
            const dist = Math.hypot(pt.x - x, pt.y - y);
            return dist < best.dist ? {dist, u, v0, v1, px:x, py:y} : best;
        }, {dist:Number.POSITIVE_INFINITY, u:0, v0:null, v1:null});

        return this.interpolateColor(v0.color, v1.color, u);
    }

    interpolateColor(c1, c2, t){
        const al = rgbToLinear(c1);
        const bl = rgbToLinear(c2);
        return rgbToGamma({
            r:lerp(al.r, bl.r, t),
            g:lerp(al.g, bl.g, t),
            b:lerp(al.b, bl.b, t),
        });
    }

    getColorInTriangle(tri, pt){
        const [w1, w2, w3] = barycentricCoordinates(pt, ...tri);

        const al = rgbToLinear(tri[0].color);
        const bl = rgbToLinear(tri[1].color);
        const cl = rgbToLinear(tri[2].color);

        return rgbToGamma({
            r:al.r * w1 + bl.r * w2 + cl.r * w3,
            g:al.g * w1 + bl.g * w2 + cl.g * w3,
            b:al.b * w1 + bl.b * w2 + cl.b * w3,
        });
    }
}

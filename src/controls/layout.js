const minVel = 0.01;
const pointsRepulsion = 0.05;
const fr = 0.7;
const minDist = 75;
const marginSizeRatio = 0.05;
const marginRepulsion = 0.05;

export default class Layout {
    constructor(pointsModel){
        this.pointsModel = pointsModel;
        this.vels = new Map();

        this.margins = {
            left:marginSizeRatio * this.pointsModel.width,
            right:(1 - marginSizeRatio) * this.pointsModel.width,
            top:marginSizeRatio * this.pointsModel.height,
            bottom:(1 - marginSizeRatio) * this.pointsModel.height,
        };

        this.points = this.pointsModel.points.map(pt => {
            return {
                vel:{x:0, y:0},
                model:pt,
            };
        });

        this.pointsModel.pointAdded.add(this.addPoint, this);
        this.pointsModel.pointRemoved.add(this.removePoint, this);
    }

    addPoint(point){
        this.points.push({model:point, vel:{x:0, y:0}});
    }

    removePoint(point){
        this.points = this.points.filter(pt => pt.model != point);
    }

    update(excludedPoints){
        this.points.forEach((a, i) => {
            for(let j = i + 1; j < this.points.length; j++){
                const b = this.points[j];

                const dx = a.model.x - b.model.x;
                const dy = a.model.y - b.model.y;
                const dist = Math.hypot(dx, dy);
                if(dist < minDist){
                    const diff = minDist - dist;
                    const r = pointsRepulsion * 0.5 * diff / dist;
                    a.vel.x += dx * r;
                    a.vel.y += dy * r;
                    b.vel.x -= dx * r;
                    b.vel.y -= dy * r;
                }
            }
            let dx = 0, dy = 0;
            if(a.model.x < this.margins.left){
                dx = this.margins.left - a.model.x;
            }
            else if(a.model.x > this.margins.right){
                dx = this.margins.right - a.model.x;
            }
            if(a.model.y < this.margins.top){
                dy = this.margins.top - a.model.y;
            }
            else if(a.model.y > this.margins.bottom){
                dy = this.margins.bottom - a.model.y;
            }
            a.vel.x += dx * marginRepulsion;
            a.vel.y += dy * marginRepulsion;
        });
        excludedPoints.forEach(pt => {
            if(pt){
                this.points.filter(p => p.model === pt.model).forEach(p => {
                    p.vel.x = p.vel.y = 0;
                });
            }
        });
        this.points.forEach(point => {
            const {vel, model} = point;
            vel.x *= fr;
            vel.y *= fr;
            if(Math.hypot(vel.x, vel.y) < minVel){
                vel.x = vel.y = 0;
            }
            model.x += vel.x;
            model.y += vel.y;
        });
    }
}

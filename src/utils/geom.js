import {clamp} from "./maths";
const EPSILON = 1.0e-6;

export function computeCircumcircle(v0, v1, v2) {
    // From: http://www.exaflop.org/docs/cgafaq/cga1.html

    const A = v1.x - v0.x;
    const B = v1.y - v0.y;
    const C = v2.x - v0.x;
    const D = v2.y - v0.y;

    const E = A*(v0.x + v1.x) + B*(v0.y + v1.y);
    const F = C*(v0.x + v2.x) + D*(v0.y + v2.y);

    const G = 2.0*(A*(v2.y - v1.y)-B*(v2.x - v1.x));

    let dx, dy;
    let center;

    if(Math.abs(G) < EPSILON) {

        const minx = Math.min(v0.x, v1.x, v2.x);
        const miny = Math.min(v0.y, v1.y, v2.y);
        const maxx = Math.max(v0.x, v1.x, v2.x);
        const maxy = Math.max(v0.y, v1.y, v2.y);

        center = {
            x:( minx + maxx) / 2,
            y:( miny + maxy ) / 2
        };

        dx = center.x - minx;
        dy = center.y - miny;
    }
    else {
        const cx = (D*E - B*F) / G;
        const cy = (A*F - C*E) / G;

        center = {x:cx, y:cy};

        dx = center.x - v0.x;
        dy = center.y - v0.y;
    }

    const radiusSquared = dx * dx + dy * dy;
    return {
        center,
        radiusSquared,
    };
}

export function isInCircle(circle, v) {
    const dx = circle.center.x - v.x;
    const dy = circle.center.y - v.y;
    return (dx * dx + dy * dy <= circle.radiusSquared);
}

//https://stackoverflow.com/questions/10301001/perpendicular-on-a-line-segment-from-a-given-point
export function getProjectedPoint(a, b, pt){
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist2 = dx * dx + dy * dy;
    const u = clamp(0, 1, ((pt.x - a.x) * dx + (pt.y - a.y) * dy) / dist2);
    const x = a.x + u * dx;
    const y = a.y + u * dy;
    return {x, y, u};
}


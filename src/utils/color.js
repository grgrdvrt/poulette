import {lerp, sign} from "../utils/maths";

import {
    isPointInTriangle,
    barycentricCoordinates,
    getProjectedPoint,
} from "../utils/geom";

const gamma = 2.2;
export function rgbToLinear(rgb){
    return {
        r:rgb.r ** gamma,
        g:rgb.g ** gamma,
        b:rgb.b ** gamma,
    };
}

const iGamma = 1/2.2;
export function rgbToGamma(rgb){
    return {
        r:rgb.r ** iGamma,
        g:rgb.g ** iGamma,
        b:rgb.b ** iGamma,
    };
}

export function getColorInMesh(triangles, x, y){
    const pt = {x, y};
    const tri = triangles.find(tri => {
        return isPointInTriangle(pt, ...tri);
    });

    return tri
        ? getColorInTriangle(tri, pt)
        : getColorOutsideTriangles(triangles, pt);
}

export function getColorOutsideTriangles(triangles, pt){
    const segments = [];
    triangles.forEach(([a, b, c]) => {
        segments.push([a, b], [a, c], [b, c]);
    });

    const {v0, v1, u, px, py} = segments.reduce((best, [v0, v1]) => {
        const {x, y, u} = getProjectedPoint(v0, v1, pt);
        const dist = Math.hypot(pt.x - x, pt.y - y);
        return dist < best.dist ? {dist, u, v0, v1, px:x, py:y} : best;
    }, {dist:Number.POSITIVE_INFINITY, u:0, v0:null, v1:null});

    return interpolateColors(v0.color, v1.color, u);
}

export function interpolateColors(c1, c2, t){
    const al = rgbToLinear(c1);
    const bl = rgbToLinear(c2);
    return rgbToGamma({
        r:lerp(al.r, bl.r, t),
        g:lerp(al.g, bl.g, t),
        b:lerp(al.b, bl.b, t),
    });
}

export function getColorInTriangle(tri, pt){
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

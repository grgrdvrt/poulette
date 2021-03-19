export function lerp(a, b, t){
    return a + t * (b - a);
}

export function clamp(min, max, v){
    return Math.max(min, Math.min(v, max));
}

export function sign (p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

export function isPointInTriangle (pt, v1, v2, v3)
{
    const d1 = sign(pt, v1, v2);
    const d2 = sign(pt, v2, v3);
    const d3 = sign(pt, v3, v1);

    const has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    const has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

    return !(has_neg && has_pos);
}

export function barycentricCoordinates(pt, v1, v2, v3){
    const r = (v2.y - v3.y) * (v1.x - v3.x) + (v3.x - v2.x) * (v1.y - v3.y);
    const w1 = ((v2.y - v3.y) * (pt.x - v3.x) + (v3.x - v2.x) * (pt.y - v3.y)) / r;
    const w2 = ((v3.y - v1.y) * (pt.x - v3.x) + (v1.x - v3.x) * (pt.y - v3.y)) / r;
    const w3 = 1 - w1 - w2;
    return [w1, w2, w3];
}


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

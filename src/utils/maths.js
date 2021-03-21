export function lerp(a, b, t){
    return a + t * (b - a);
}

export function clamp(min, max, v){
    return Math.max(min, Math.min(v, max));
}

export function sign (p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

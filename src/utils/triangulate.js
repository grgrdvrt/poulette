import {
    isInCircle,
    computeCircumcircle,
} from "./geom";

export default function triangulate(vertices) {
    const triangles = [];
    const circles = [];

    const st = createBoundingTriangle(vertices);

    triangles.push(st);
    circles.push(computeCircumcircle(...st));

    for(let i in vertices) {
        addVertex(vertices[i], triangles, circles);
    }

    return triangles.filter(([a, b, c]) => {
        return st.indexOf(a) === -1
            && st.indexOf(b) === -1
            && st.indexOf(c) === -1;
    });
}


function createBoundingTriangle(vertices) {
    let xMin, yMin, xMax, yMax;
    xMin = yMin = Number.POSITIVE_INFINITY;
    xMax = yMax = Number.NEGATIVE_INFINITY;
    vertices.forEach(({x, y}) => {
        xMin = Math.min(x, xMin);
        yMin = Math.min(y, yMin);
        xMax = Math.max(x, xMax);
        yMax = Math.max(y, yMax);
    });

    const dx = (xMax - xMin) * 10;
    const dy = (yMax - yMin) * 10;

    return [
        {x:xMin - dx,   y:yMin - dy*3},
        {x:xMin - dx,   y:yMax + dy},
        {x:xMax + dx*3, y:yMax + dy},
    ];
}


function removeDuplicateEdges(edges) {
    return edges.filter(([a1, b1], i) => {
        for(let j = 0; j < edges.length; j++){
            if(j !== i){
                const [a2, b2] = edges[j];
                if((a1 === a2 && b1 === b2) || (a1 === b2 && b1 === a2)) {
                    return false;
                }
            }
        }
        return true;
    });
}


function addVertex(vertex, triangles, circles) {
    const edges = [];

    triangles.forEach((tri, i) => {
        if(isInCircle(circles[i], vertex)) {
            edges.push(
                [tri[0], tri[1]],
                [tri[1], tri[2]],
                [tri[2], tri[0]],
            );
            delete triangles[i];
            delete circles[i];
        }
    });

    removeDuplicateEdges(edges).forEach(([a, b]) => {
        const tri = [a, b, vertex];
        triangles.push(tri);
        circles.push(computeCircumcircle(...tri));
    });
}

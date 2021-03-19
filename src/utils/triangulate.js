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
        return !(a === st[0] || a === st[1] || a === st[2] ||
                 b === st[0] || b === st[1] || b === st[2] ||
                 c === st[0] || c === st[1] || c === st[2]);
    });
}


function createBoundingTriangle(vertices) {
    let minx, miny, maxx, maxy;
    for(let i in vertices) {
        var vertex = vertices[i];
        if(minx === undefined || vertex.x < minx) { minx = vertex.x; }
        if(miny === undefined || vertex.y < miny) { miny = vertex.y; }
        if(maxx === undefined || vertex.x > maxx) { maxx = vertex.x; }
        if(maxy === undefined || vertex.y > maxy) { maxy = vertex.y; }
    }

    const dx = (maxx - minx) * 10;
    const dy = (maxy - miny) * 10;

    return [
        {x:minx - dx,   y:miny - dy*3},
        {x:minx - dx,   y:maxy + dy},
        {x:maxx + dx*3, y:maxy + dy},
    ];

}


function removeDuplicateEdges(edges) {
    const uniqueEdges = [];
    mainLoop: for(let i = 0; i < edges.length; i++){
        const edge1 = edges[i];

        for(let j = 0; j < edges.length; j++){
            if(j !== i){
                const edge2 = edges[j];

                if((edge1[0] === edge2[0] && edge1[1] === edge2[1])
                   || (edge1[0] === edge2[1] && edge1[1] === edge2[0])) {
                    continue mainLoop;
                }
            }
        }

        uniqueEdges.push(edge1);
    }

    return uniqueEdges;
}


function addVertex(vertex, triangles, circles) {
    const edges = [];

    for(let i in triangles) {
        const triangle = triangles[i];

        if(isInCircle(circles[i], vertex)) {
            edges.push([triangle[0], triangle[1]]);
            edges.push([triangle[1], triangle[2]]);
            edges.push([triangle[2], triangle[0]]);

            delete triangles[i];
            delete circles[i];
        }
    }

    const uniqueEdges = removeDuplicateEdges(edges);

    for(let i in uniqueEdges) {
        const tri = [...uniqueEdges[i], vertex];
        triangles.push(tri);
        circles.push(computeCircumcircle(...tri));
    }
}

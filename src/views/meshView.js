import {
    createShader,
    createProgram
} from "../utils/webgl";

const vertexShaderSource = `
precision mediump float;

attribute vec2 a_position;
attribute vec3 a_color;

varying vec3 v_color;
const float gamma = 2.2;

vec3 toLinear(vec3 v) {
  return pow(v, vec3(gamma));
}


void main() {
    gl_Position = vec4(a_position, 0, 1);
    // v_color = a_color;
    v_color = toLinear(a_color);
}
`;

const fragmentShaderSource = `
precision mediump float;
varying vec3 v_color;
const float gamma = 2.2;

vec3 toGamma(vec3 v) {
  return pow(v, vec3(1.0 / gamma));
}

void main() {
    gl_FragColor = vec4(toGamma(v_color), 1);
    // gl_FragColor = vec4(v_color, 1);
}
`;


export default class MeshView{
    constructor(pointsModel, width, height){
        this.pointsModel = pointsModel;
        this.width = width;
        this.height = height;

        this.initDom();
        this.gl = this.initGL();
    }

    initDom(){
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.dom = this.canvas;
        this.dom.classList.add("meshCanvas");
    }

    initGL(){
        const gl = this.canvas.getContext("webgl");
        gl.viewport(0, 0, this.width, this.height);

        const program = createProgram(
            gl,
            createShader(gl, gl.VERTEX_SHADER, vertexShaderSource),
            createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource),
        );
        gl.useProgram(program);


        this.initPositionAttribute(gl, program);
        this.initColorAttribute(gl, program);
        this.indexBuffer = gl.createBuffer();
        return gl;
    }

    initPositionAttribute(gl, program){
        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        this.positionBuffer = gl.createBuffer();
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(
            positionAttributeLocation, 2, gl.FLOAT, false, 0, 0
        );
    }

    initColorAttribute(gl, program){
        const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
        this.colorBuffer = gl.createBuffer();
        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(
            colorAttributeLocation, 3, gl.FLOAT, false, 0, 0
        );
    }

    update(){
        const gl = this.gl;

        const nPoints = this.pointsModel.points.length;
        const positions = new Float32Array(2 * nPoints);
        const colors = new Float32Array(3 * nPoints);
        this.pointsModel.points.forEach((pt, i) => {

            positions[2 * i] = 2 * pt.x / this.width - 1;
            positions[2 * i + 1] = 1 - 2 * pt.y / this.height;

            colors[3 * i] = pt.color.r;
            colors[3 * i + 1] = pt.color.g;
            colors[3 * i + 2] = pt.color.b;
        });

        const indices = [];
        this.pointsModel.triangles.forEach(t => {
            indices.push(...t.map(p => this.pointsModel.points.indexOf(p)));
        });

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STREAM_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STREAM_DRAW);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
    }
}


import Model from "./models/model";

import Handles from "./views/handles";
import Mesh from "./views/mesh";
import DeletedColors from "./views/deletedColors";

import Layout from "./controls/layout";
import PointerControl from "./controls/pointerControl";
import {
    colorToHTML,
    hexToRgb,
} from "./utils/color";


class Main {
    constructor(){
        this.model = new Model(400, 400);
        const initialColors = [
            0xffffff,//white
            0x000000,//black
            0xe32b2b,//red
            0xffab2e,//orange
            0xffe500,//yellow
            0x85ff5c,//green
            0x57c7ff,//blue
            0xff99dd,//pink
        ].map(hexToRgb);

        this.initPoints(initialColors);
        this.initDom();
        document.body.appendChild(this.dom);

        this.layout = new Layout(this.model);
        this.pointerControl = new PointerControl(this.model, this.handles, this.mesh);
        this.pointerControl.colorSelected.add(this.onColorSelected, this);
    }

    initDom(){
        this.dom = document.createElement("div");
        this.dom.classList.add("mainContainer");
        Object.assign(this.dom.style, {
            width:this.model.width + "px",
            height:this.model.height + "px",
        });

        this.mesh = new Mesh(this.model);
        this.dom.appendChild(this.mesh.dom);

        this.handles = new Handles(this.model);
        this.dom.appendChild(this.handles.dom);

        this.deletedColors = new DeletedColors(this.model);
        this.dom.appendChild(this.deletedColors.dom);
    }

    onColorSelected(color){
        this.dom.style.backgroundColor = colorToHTML(color);
    }

    initPoints(colors){
        colors.forEach(color => {
            this.model.add(
                color,
                {
                    x:Math.random() + 0.5 * this.model.width,
                    y:Math.random() + 0.5 * this.model.height,
                }
            );
        });
    }

    update(){
        this.layout.update([this.pointerControl.draggingPoint]);
        this.model.updateTriangles();
        this.handles.update();
        this.mesh.update();
        requestAnimationFrame(this.update.bind(this));
    }
}


const main = new Main();
main.update();

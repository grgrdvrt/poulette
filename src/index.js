import Model from "./models/model";

import ColorPreview from "./views/colorPreview";
import Mesh from "./views/mesh";
import Handles from "./views/handles";
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
    }

    initDom(){
        this.dom = document.createElement("div");
        this.dom.classList.add("mainContainer");
        this.dom.style.height = this.model.height + "px";

        this.paletteContainer = document.createElement("div");
        this.dom.appendChild(this.paletteContainer);
        this.paletteContainer.classList.add("paletteContainer");
        Object.assign(this.paletteContainer.style, {
            width:this.model.width + "px",
            height:this.model.height + "px",
        });

        this.preview = new ColorPreview(this.model);
        this.paletteContainer.appendChild(this.preview.dom);

        this.mesh = new Mesh(this.model);
        this.paletteContainer.appendChild(this.mesh.dom);

        this.handles = new Handles(this.model);
        this.paletteContainer.appendChild(this.handles.dom);

        this.deletedColors = new DeletedColors(this.model);
        this.dom.appendChild(this.deletedColors.dom);
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

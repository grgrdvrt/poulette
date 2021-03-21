import PointsModel from "./models/pointsModel";

import PointsView from "./views/pointsView";
import MeshView from "./views/meshView";

import Layout from "./controls/layout";
import PointerControl from "./controls/pointerControl";


class Main {
    constructor(){
        this.pointsModel = new PointsModel(400, 400);
        const initialColors = [
            0xffffff,//white
            0x000000,//black
            0xe32b2b,//red
            0xffab2e,//orange
            0xffe500,//yellow
            0x85ff5c,//green
            0x57c7ff,//blue
            0xff99dd,//pink
        ].map(c => ({
            r:(c >> 16) / 255,
            g:(c >> 8 & 0xff) / 255,
            b:(c & 0xff) / 255,
        }));

        this.initPoints(initialColors);

        this.dom = document.createElement("div");
        this.dom.classList.add("mainContainer");
        Object.assign(this.dom.style, {
            width:this.pointsModel.width + "px",
            height:this.pointsModel.height + "px",
        });
        document.body.appendChild(this.dom);

        this.meshView = new MeshView(this.pointsModel);
        this.dom.appendChild(this.meshView.dom);

        this.pointsView = new PointsView(this.pointsModel);
        this.dom.appendChild(this.pointsView.dom);

        this.layout = new Layout(this.pointsModel);
        this.pointerControl = new PointerControl(this.pointsModel, this.pointsView, this.meshView);
        this.pointerControl.colorSelected.add(this.onColorSelected, this);
    }

    onColorSelected(color){
        const r = Math.round(color.r * 255);
        const g = Math.round(color.g * 255);
        const b = Math.round(color.b * 255);
        this.dom.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }

    initPoints(colors){
        colors.forEach(color => {
            this.pointsModel.add(
                color,
                {
                    x:Math.random() + 0.5 * this.pointsModel.width,
                    y:Math.random() + 0.5 * this.pointsModel.height,
                }
            );
        });
    }

    update(){
        this.layout.update([this.pointerControl.draggingPoint]);
        this.pointsModel.updateTriangles();
        this.pointsView.update();
        this.meshView.update();
        requestAnimationFrame(this.update.bind(this));
    }
}


const main = new Main();
main.update();

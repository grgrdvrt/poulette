import Signal from "../utils/signal";
import { colorToHTML } from "../utils/color";

export default class DeletedColors{
    constructor(model){
        this.model = model;
        this.items = new Map();
        this.model.pointRemoved.add(this.addColor, this);
        this.colorRetreived = new Signal();
        this.initDom();
    }

    initDom(){
        this.dom = document.createElement("div");
        this.dom.classList.add("deletedColors");
        this.dom.addEventListener("click", this.onColorClicked);
    }

    addColor(point){
        const item = document.createElement("button");
        item.classList.add("deletedColorItem");
        item.style.backgroundColor = colorToHTML(point.color);
        this.items.set(item, point.color);
        this.dom.appendChild(item);
    }

    onColorClicked = e => {
        if(this.items.has(e.target)){
            const item = e.target;
            const color = this.items.get(item);
            item.remove();
            this.items.delete(item);
            this.model.add(
                color,
                {
                    x:Math.random() - 0.5 + 0.5 * this.model.width,
                    y:Math.random() - 0.5 + 0.5 * this.model.height
                }
            );
            this.colorRetreived.dispatch(color);
        }
    }
}

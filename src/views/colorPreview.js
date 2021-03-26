import { colorToHTML } from "../utils/color";

export default class ColorPreview{
    constructor(model){
        this.model = model;
        this.model.pointSelected.add(this.onPointSelected, this);
        this.model.colorSelected.add(this.onColorSelected, this);
        this.initDom();
    }

    initDom(){
        this.dom = document.createElement("div");
        this.dom.classList.add("colorPreview");
        Object.assign(
            this.dom.style,
            {
                width:this.model.width + "px",
                height:this.model.height + "px",
            }
        );

        this.transitionElement = document.createElement("div");
        this.transitionElement.classList.add("colorPreviewTransition");
        const radius = Math.hypot(this.model.width, this.model.height);
        Object.assign(
            this.transitionElement.style,
            {
                width: 2 * radius + "px",
                height: 2 * radius + "px",
                borderRadius:radius + "px",
            }
        );
        this.dom.appendChild(this.transitionElement);
        this.transitionElement.addEventListener("transitionend", () => {
            this.transitionElement.classList.remove("finalState");
            this.dom.style.backgroundColor = colorToHTML(this.color);
        });
    }

    onPointSelected(point){
        this.setColor(point.color, point);
    }

    onColorSelected(color){
        this.setColor(color);
    }

    setColor(color, position){
        this.color = color;
        if(position){
            Object.assign(
                this.transitionElement.style,
                {
                    top:position.y + "px",
                    left:position.x + "px",
                    backgroundColor:colorToHTML(color),
                }
            );
            this.transitionElement.classList.add("finalState");
        }
        else{
            this.dom.style.backgroundColor = colorToHTML(color);
        }
    }
}

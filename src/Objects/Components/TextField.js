import { Component } from "./Component";


export class TextField extends Component {
    constructor(world, componentType, idNum, x, y, width, height) {
        super(world, componentType, idNum, x, y, width, height);

        this.editable = false;
        this.text = "Text";

        this.createComponent();
    }

    createComponent() {
        this.element.style.padding = "5px";
        this.element.style.width = "fit-content";

        this.element.innerHTML = `
            ${this.text}
        `;

        this.registerTextFieldEvents();
    }

    registerTextFieldEvents() {
        this.element.addEventListener("dblclick", (e) => this.onDoubleClick(e));
        this.element.addEventListener("keydown", (e) => this.onKeyDown(e));
        this.element.addEventListener("input", (e) => this.onInput(e));
    }

    onDoubleClick(e) {
        if(e.button === 0) {
            this.editable = true;
            this.element.contentEditable = this.editable;
        }
    }

    onKeyDown(e) {
        if(e.key === "Enter") {
            this.editable = false;
            this.element.contentEditable = this.editable;
        }
    }

    onInput(e) {
        this.text = this.element.innerText;
    }
}
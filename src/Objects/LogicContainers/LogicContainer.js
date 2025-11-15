import { DraggableObject } from "../DraggableObject";

export class LogicContainer extends DraggableObject {
    constructor(world, x, y, width, height) {
        super(world, x, y);
        this.size = { width: width, height: height };

        this.createElement();
        this.registerEvents();
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("logicContainer");
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
        this.element.style.width = `${this.size.width}px`;
        this.element.style.height = `${this.size.height}px`;

        this.element.innerHTML = ``;
        this.world.appendChild(this.element);
    }
}
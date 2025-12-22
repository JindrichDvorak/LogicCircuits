import { WorldObject, InteractionMode, stateManager } from "../../State/StateManager";
import { state } from "../../State/state";


export const ComponentType = Object.freeze({
    TEXT_FIELD: "Text",
    TRANSISTOR: "Transistor",
    RESISTOR: "Resistor",
    GROUND: "Ground",
    GATE: "Gate",
    CIRCUIT: "Circuit"
});

export class Component {
    constructor(world, componentType, idNum, x, y, width, height) {
        this.world = world;
        this.componentType = componentType;
        const id = `${componentType}-${idNum}`;
        this.id = id;

        // * Interaction:
        this.element;
        this.position = { x: x, y: y };

        this.size = { width: width, height: height };

        this.isDragging = false;
        this.lastMousePosition = { x: 0, y: 0 };
        this.isFixed = false;
        this.holdTime = 500;
        this.holdTimer;
        this.mouseLeave = false;

        // * Component logic:
        this.nodes = [];

        this.createElement();
        this.registerEvents();
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("component");
        this.element.style.width = `${this.size.width}px`;
        this.element.style.height = `${this.size.height}px`;
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;

        this.element.innerHTML = ``;

        this.world.appendChild(this.element);

        this.move();
    }

    move() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;

        this.nodes.forEach((node) => {
            node.moveWithComponent(this.position);
        });
    }

    //Events:
    registerEvents() {
        this.element.addEventListener("mousedown", (e) => this.onMouseDown(e));
        window.addEventListener("mousemove", (e) => this.onMouseMove(e));
        window.addEventListener("mouseup", (e) => this.onMouseUp(e));
        this.element.addEventListener("mouseleave", (e) => this.onMouseLeave(e));

        // * Disable context menu:
        this.element.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    onMouseDown(e) {
        //e.preventDefault();
        this.mouseLeave = false;
        if(e.button === 0) {
            this.element.classList.add("animate");

            this.holdTimer = setTimeout(() => {
                stateManager.interactionMode.set(InteractionMode.DRAGGING);

                this.isDragging = true;
            }, this.holdTime);

            this.lastMousePosition = { x: e.clientX, y: e.clientY };

            stateManager.selectedWorldObject.set({
                id: this.id,
                type: WorldObject.COMPONENT
            });

            e.stopPropagation();
        } else if(e.button === 2) {
            stateManager.setDefaultState();
            stateManager.selectedWorldObject.set({
                id: this.id,
                type: WorldObject.COMPONENT
            });
            e.stopPropagation();
        }
    }

    onMouseMove(e) {
        if(this.isFixed) return;
        if(!this.isDragging) return;

        const dx = e.clientX - this.lastMousePosition.x;
        const dy = e.clientY - this.lastMousePosition.y;

        this.position.x += dx;
        this.position.y += dy;
        this.lastMousePosition = { x: e.clientX, y: e.clientY };

        this.move();
    }

    onMouseUp(e) {
        if(e.button === 0) {
            if(this.isDragging) {
                stateManager.setDefaultState();
            }
            
            this.element.classList.remove("animate");
            this.isDragging = false;
            clearTimeout(this.holdTimer);
        }
    }

    onMouseLeave(e) {
        clearTimeout(this.holdTimer);
        if(!this.isDragging) {
            this.element.classList.remove("animate");
        }
        this.mouseLeave = true;
    }
}
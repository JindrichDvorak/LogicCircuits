import { WorldObject, InteractionMode, stateManager } from "../../State/StateManager";


export const ComponentType = Object.freeze({
    TEXT_FIELD: "Text",
    TRANSISTOR: "Transistor",
    RESISTOR: "Resistor",
    GROUND: "Ground",
    BUFFER_GATE: "Buffer",
    NOT_GATE: "NOT",
    AND_GATE: "AND",
    OR_GATE: "OR",
    XOR_GATE: "XOR",
    NAND_GATE: "NAND",
    NOR_GATE: "NOR",
    NXOR_GATE: "NXOR",
    HALF_ADDER_CIRCUIT: "Half adder",
    FULL_ADDER_CIRCUIT: "Full adder"
});

export class Component {
    constructor(camera, componentType, idNum, x, y, width, height) {
        this.camera = camera;
        this.world = camera.world;
        this.componentType = componentType;
        const id = `${componentType}-${idNum}`;
        this.id = id;

        // * Interaction:
        this.element;
        this.position = { x: x, y: y };
        this.angle = 0;

        this.size = { width: width, height: height };

        this.isDragging = false;
        this.lastMousePosition = { x: 0, y: 0 };
        this.isFixed = false;
        this.holdTime = 150;
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

    rotate() {
        this.angle += 90;
        if(this.angle === 360) this.angle = 0;

        this.element.style.transform = `rotate(${this.angle}deg)`;

        const centerX = this.size.width / 2;
        const centerY = this.size.height / 2;
        let relX;
        let relY;
        this.nodes.forEach((node) => {
            relX = node.relativePosition.x - centerX;
            relY = node.relativePosition.y - centerY;

            node.relativePosition.x = centerX - relY;
            node.relativePosition.y = centerY + relX;

            node.moveWithComponent(this.position);
        });
    }

    setupOutputState() {
        this.nodes.forEach((node) => node.logicState.allowSignal = true);

        this.nodes.forEach((node) => node.logicState.signal());
    }

    setNodeComponentId(componentId) {
        this.nodes.forEach((node) => node.componentId = componentId);
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
            if(stateManager.interactionMode.get() === InteractionMode.CONNECTING) {
                stateManager.setDefaultInteractionState();
                e.preventDefault();
            }

            //this.element.classList.add("animate");

            this.holdTimer = setTimeout(() => {
                stateManager.interactionMode.set(InteractionMode.DRAGGING);

                this.isDragging = true;
            }, this.holdTime);

            const mousePosition = this.camera.screenToWorldCoords(e.clientX, e.clientY);
            this.lastMousePosition = { x: mousePosition.x, y: mousePosition.y };

            stateManager.selectedWorldObject.set({
                id: this.id,
                type: WorldObject.COMPONENT
            });
            stateManager.interactionTrigger.signal();

            e.stopPropagation();
        } else if(e.button === 2) {
            stateManager.setDefaultInteractionState();
            stateManager.selectedWorldObject.set({
                id: this.id,
                type: WorldObject.COMPONENT
            });
            stateManager.interactionTrigger.signal();
            e.stopPropagation();
        }
    }

    onMouseMove(e) {
        if(this.isFixed) return;
        if(!this.isDragging) return;

        this.element.style.visibility = "visible";

        const mousePosition = this.camera.screenToWorldCoords(e.clientX, e.clientY);
        const dx = mousePosition.x - this.lastMousePosition.x;
        const dy = mousePosition.y - this.lastMousePosition.y;

        this.position.x += dx;
        this.position.y += dy;
        this.lastMousePosition = { x: mousePosition.x, y: mousePosition.y };

        this.move();
    }

    onMouseUp(e) {
        if(e.button === 0) {
            //this.element.classList.remove("animate");
            this.isDragging = false;
            clearTimeout(this.holdTimer);
        }
    }

    onMouseLeave(e) {
        clearTimeout(this.holdTimer);
        if(!this.isDragging) {
            //this.element.classList.remove("animate");
        }
        this.mouseLeave = true;
    }
}
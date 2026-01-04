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
    FULL_ADDER_CIRCUIT: "Full adder",
    TWO_BIT_INPUT: "2-bit input",
    THREE_BIT_INPUT: "3-bit input",
    FOUR_BIT_INPUT: "4-bit input",
    EIGHT_BIT_INPUT: "8-bit input",
    TWO_BIT_OUTPUT: "2-bit output",
    THREE_BIT_OUTPUT: "3-bit output",
    FOUR_BIT_OUTPUT: "4-bit output",
    EIGHT_BIT_OUTPUT: "8-bit output",
    TWO_TO_ONE_MUX: "2-1 MUX",
    FOUR_TO_ONE_MUX: "4-1 MUX",
    EIGHT_TO_ONE_MUX: "8-1 MUX",
    ONE_TO_TWO_DEMUX: "1-2 DEMUX",
    ONE_TO_FOUR_DEMUX: "1-4 DEMUX",
    ONE_TO_EIGHT_DEMUX: "1-8 DEMUX"
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
        this.labels = [];
        this.controls = [];
        this.controlButtons = [];
        this.controlStates = [];
        this.tempElement;
        this.lockedControls = false;

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
        this.labels.forEach((label) => {
            label.style.transform = `rotate(${-this.angle}deg)`;
        });
        this.controls.forEach((control) => {
            control.style.transform = `rotate(${-this.angle}deg)`;
        });

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

    setupLabel(label, innerHTML, x, y) {
        label.classList.add("label");
        label.innerHTML = innerHTML;
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;

        this.element.appendChild(label);
        this.labels.push(label);
    }

    setupControlSwitch(controlSwitch, innerHTML, x, y, onClick, allowRotation = true) {
        controlSwitch.classList.add("componentButton");
        controlSwitch.style.left = `${x}px`;
        controlSwitch.style.top = `${y}px`;
        controlSwitch.innerHTML = innerHTML;
        controlSwitch.addEventListener("click", () => onClick());

        this.element.appendChild(controlSwitch);
        if(allowRotation) this.controls.push(controlSwitch);
        this.controlButtons.push(controlSwitch);
    }

    calculateControlSwitchSize(innerHTML) {
        const tempElement = stateManager.tempElement;
        tempElement.innerHTML = innerHTML;

        return length = Math.max(tempElement.offsetWidth, tempElement.offsetHeight);
    }

    lockControls(value) {
        if(value) {
            this.controlButtons.forEach((button) => {
                button.style.visibility = "hidden";
                button.classList.remove("componentButton");
                button.classList.add("lockedComponentButton");
            });
        } else {
            this.controlButtons.forEach((button) => {
                button.style.visibility = "visible";
                button.classList.remove("lockedComponentButton");
                button.classList.add("componentButton");
            });
        }
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
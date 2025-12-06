import { Elements, InteractionMode, stateManager } from "../../State/StateManager";
import { state } from "../../State/state";


export const NodeType = Object.freeze({
    INPUT: "input",
    NODE: "node",
    OUTPUT: "output"
});

export class Node {
    constructor(world, x, y, id, nodeType) {
        this.world = world;
        this.id = id;

        // * Interaction:
        this.element;
        this.position = { x: x, y: y };

        this.size = { width: 20, height: 20 };

        // TODO: Think of something better:
        if(nodeType === NodeType.NODE) this.size = { width: 10, height: 10 };

        this.isDragging = false;
        this.lastMousePosition = { x: 0, y: 0 };
        this.isFixed = false;
        this.holdTime = 500;
        this.holdTimer;

        // * Node logic:
        this.nodeType = nodeType;
        this.inputNodeId = -1;
        this.parentNodeId = -1;
        this.childNodeIds = [];
        this.outputNodeIds = [];

        // * Wiring:
        this.wires = [];
        this.rewireTrigger = state();

        //CSS:
        this.borderWidth = 0;
        if(nodeType === NodeType.NODE) this.borderWidth = 0;

        // TODO: Remove:
        this.color;
        this.wasJerked = false;

        this.createElement();
        this.registerEvents();
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("node");
        this.element.style.width = `${this.size.width}px`;
        this.element.style.height = `${this.size.height}px`;
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
        //this.element.style.border = `solid ${this.borderWidth}px`;

        const numId = this.id.split("-", 2)[1];
        this.element.innerHTML = `
            <div style="display: flex; height: 100%; justify-content: center; align-items: center;">${numId}</div>
        `;
        if(this.nodeType === NodeType.NODE) this.element.innerHTML = ``;

        this.world.appendChild(this.element);

        this.move();
    }

    move() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;

        this.rewireTrigger.signal();
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
        if(e.button === 0) {
            // * State -----------------------------------------------
            stateManager.interactionMode.set(InteractionMode.NORMAL);
            stateManager.interactedElementType.set(Elements.NODE);
            stateManager.interactedElementSubtype.set(this.nodeType);
            stateManager.interactedElementId.set(this.id);

            stateManager.interactionTrigger.signal();
            // * -----------------------------------------------------
            
            this.element.classList.add("animate");

            this.holdTimer = setTimeout(() => {
                // * State -----------------------------------------------
                stateManager.interactionMode.set(InteractionMode.DRAGGING);
                stateManager.interactionTrigger.signal();
                // * -----------------------------------------------------

                this.isDragging = true;
            }, this.holdTime);

            this.lastMousePosition = { x: e.clientX, y: e.clientY };          
            //e.stopPropagation();
        } else if(e.button === 2) {
            // * State -----------------------------------------------
            stateManager.interactionMode.set(InteractionMode.CONNECTING);
            stateManager.interactedElementType.set(Elements.NODE);
            stateManager.interactedElementSubtype.set(this.nodeType);
            stateManager.interactedElementId.set(this.id);

            stateManager.connectingNodeId.set(this.id);
            switch(this.nodeType) {
                case NodeType.INPUT: {
                    stateManager.inputNodeId.set(this.id);
                    break;
                } case NodeType.NODE: {
                    stateManager.inputNodeId.set(this.inputNodeId);
                    break;
                }
            }

            stateManager.lastNodeId.set(this.id);
            stateManager.currentNodeId.set(this.id);
            stateManager.parentNodeId.set(this.parentNodeId);
            stateManager.childNodeIds.set(this.childNodeIds);

            stateManager.interactionTrigger.signal();
            // * -----------------------------------------------------

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
                // * State -----------------------------------------------
                stateManager.interactionMode.set(InteractionMode.NORMAL);
                stateManager.interactionTrigger.signal();
                // * -----------------------------------------------------
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
    }
}
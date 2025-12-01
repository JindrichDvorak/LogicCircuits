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
        this.size = { width: 25, height: 25 };
        this.mouseOffset = { x: 0, y: 0 };
        this.isDragging = false;
        this.isFixed = false;
        this.holdTime = 500;
        this.holdTimer;

        // * Node logic:
        this.nodeType = nodeType;
        this.inputNodeId = -1;
        this.parentNodeId = -1;
        this.childNodeIds = [];

        // * Wiring:
        this.wires = [];
        this.rewireTrigger = state();

        // TODO: Remove:
        this.color;

        this.createElement();
        this.registerEvents();
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("node");
        this.element.style.width = `${this.size.width}px`;
        this.element.style.height = `${this.size.height}px`;
        this.element.style.left = `${this.position.x - this.size.width / 2}px`;
        this.element.style.top = `${this.position.y - this.size.height / 2}px`;

        const numId = this.id.split("-", 2)[1];
        this.element.innerHTML = `
            <div style="display: flex; height: 100%; justify-content: center; align-items: center;">${numId}</div>
        `;
        this.world.appendChild(this.element);
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

            this.mouseOffset = { 
                x: e.clientX - this.element.offsetLeft, 
                y: e.clientY - this.element.offsetTop 
            };            
            e.stopPropagation();
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

        this.position = { 
            x: e.clientX - this.mouseOffset.x, 
            y: e.clientY - this.mouseOffset.y 
        };

        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;

        this.rewireTrigger.signal();
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
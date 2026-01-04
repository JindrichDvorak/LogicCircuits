import { WorldObject, InteractionMode, stateManager } from "../../State/StateManager";
import { state } from "../../State/state";
import { stateNeg } from "../../logic";


/* TODO:
    * Fix node jerk on hover (border). 
    * Add input and output node text labels.
        * Remove numbering inside input and output nodes.                           !DONE!
        * Add input and output node grouping (multiple nodes with one label).
            ? Add sublabeling within node groups.
    ! Add "input logic state" -- 0, or 1.                                           !DONE!
        ! Add logic state propagation (input -> wires -> output).                   !DONE!
        ? Add an optional time delay for logic state propagation through wires.
        ! Unsubscribe from logic state propagation uppon node deletion.             !DONE!
        ! Connected nodes should immediately set their logic state to parent 
            ! node value.                                                           !DONE!
                ? Add an optional setting, that allows logic state propagation 
                    ? only after the circuit path is complete (input -> output).
    * Fix state management.
        * Remove debugUI state.
*/
export const NodeType = Object.freeze({
    INPUT: "input",
    NODE: "node",
    OUTPUT: "output"
});

export class Node {
    constructor(camera, id, nodeType, x, y, width, height, isComponentNode) {
        this.camera = camera;
        this.world = this.camera.world;
        this.id = id;

        // * Interaction:
        this.element;
        this.position = { x: x, y: y };
        this.size = { width: width, height: height };

        this.isDragging = false;
        this.lastMousePosition = { x: 0, y: 0 };
        this.isFixed = false;
        this.holdTime = 150;
        this.holdTimer;
        this.mouseLeave = false;

        // * Node connection logic:
        this.nodeType = nodeType;
        this.inputNodeId = -1;
        this.parentNodeId = -1;
        this.childNodeIds = [];
        this.outputNodeIds = [];

        // * Wiring:
        this.wires = [];
        this.rewireTrigger = state();

        // * Node logic state:
        if(isComponentNode && nodeType === NodeType.INPUT) {
            this.logicState;
        } else {
            this.logicState = state(0);
            this.logicState.subscribe(() => this.onLogicStateChange());
        }
        this.unsubFromParentLogicState;
        this.componentParentNodeId = -1;
        this.componentChildNodeId = -1;
        this.isGrounded = false;
        this.isResistorNode = false;
        this.isTransistorNode = false;
        this.foundRTL = false;
        this.connectedToRTL = false;

        // * Component node logic:
        this.isComponentNode = isComponentNode;
        this.relativePosition = { x: 0, y: 0 };
        this.transistorOn = false;
        this.componentId = -1;
        this.isManualInputNode = false;
        this.nodeNumber = state(-1);
        this.nodeNumber.allowSignal = false;

        // TODO: Find a better solution:
        // ! After loading, input nodes react to mouseup events originating from world.
        this.isBlocked = true;

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

        if(this.nodeType === NodeType.NODE) {
            this.element.innerHTML = ``;
            this.element.style.background = "black";
        }

        this.world.appendChild(this.element);

        /*// TODO: Remove:
        const text = document.createElement("span");
        text.innerText = this.id;
        text.style.background = "white";
        text.style.left = `${this.size.width + 10}px`;
        text.style.position = "absolute";
        this.element.appendChild(text);*/

        this.move();
    }

    move() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;

        this.rewireTrigger.signal();
    }

    moveWithComponent(componentPosisiton) {
        this.position = {
            x: componentPosisiton.x + this.relativePosition.x - this.size.width / 2,
            y: componentPosisiton.y + this.relativePosition.y - this.size.height / 2
        };

        this.move();
    }

    onLogicStateChange() {
        if(!this.logicState.allowSignal) this.logicState.set(0);

        if(this.logicState.get() === 0) {
            if(this.nodeType === NodeType.INPUT || this.nodeType === NodeType.OUTPUT) {
                this.element.style.background = "white";
            } else {
                this.element.style.background = "black";
            }
            this.wires.forEach((wire) => {
                wire.wireColor = "black";
                wire.drawWire();
            });
        } else {
            this.element.style.background = "red";
            this.wires.forEach((wire) => {
                wire.wireColor = "red";
                wire.drawWire();
            });
        }
    }

    connectLogicStates(parentLogicState) {
        this.unsubFromParentLogicState = parentLogicState.subscribe(() => {
            this.logicState.set(parentLogicState.get());
        });
    }

    addChildNode(childNodeId) {
        this.childNodeIds.push(childNodeId);
    }

    removeChildNode(childNodeId) {
        this.childNodeIds.splice(this.childNodeIds.indexOf(childNodeId), 1);
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

    // TODO: Fix e.stopPropagation():
    onMouseDown(e) {
        // TODO: Remove:
        this.isBlocked = false;

        this.mouseLeave = false;
        if(e.button === 0) {
            if(stateManager.interactionMode.get() === InteractionMode.CONNECTING) {
                if(this.nodeType === NodeType.OUTPUT && this.inputNodeId === -1) {
                    stateManager.connectOutputTrigger.signal(this.id);
                } else {
                    stateManager.interactionMode.set(InteractionMode.NORMAL);
                    stateManager.selectedWorldObject.set({
                        id: this.id,
                        type: WorldObject.NODE
                    });
                }
            } else {
                stateManager.interactionMode.set(InteractionMode.NORMAL);
                stateManager.selectedWorldObject.set({
                    id: this.id,
                    type: WorldObject.NODE
                });

                if(!this.isFixed) {
                    //this.element.classList.add("animate");
                    this.holdTimer = setTimeout(() => {
                        stateManager.interactionMode.set(InteractionMode.DRAGGING);

                        this.isDragging = true;
                    }, this.holdTime);

                    const mousePosition = this.camera.screenToWorldCoords(e.clientX, e.clientY);
                    this.lastMousePosition = { x: mousePosition.x, y: mousePosition.y };
                }
                
            }
            e.stopPropagation();
        } else if(e.button === 2) {
            if(this.nodeType !== NodeType.OUTPUT) stateManager.interactionMode.set(InteractionMode.CONNECTING);

            stateManager.selectedWorldObject.set({
                id: this.id,
                type: WorldObject.NODE
            });

            e.stopPropagation();
        }
        // TODO: Remove:
        stateManager.interactionTrigger.signal();
    }

    onMouseMove(e) {
        if(this.isFixed) return;
        if(!this.isDragging) return;

        stateManager.interactionMode.set(InteractionMode.DRAGGING);

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
        // TODO: Remove:
        if(this.isBlocked) return;

        if(e.button === 0) {
            if(this.isDragging) {
                stateManager.setDefaultInteractionState();
            } else if(this.nodeType === NodeType.INPUT && !this.mouseLeave && (!this.isComponentNode || this.isManualInputNode)) {
                this.logicState.set(stateNeg(this.logicState));
                stateManager.recalcualteResistanceTrigger.signal();
                stateManager.interactionTrigger.signal();
            }
            
            //this.element.classList.remove("animate");
            this.isDragging = false;
            clearTimeout(this.holdTimer);

            this.isDragging = false;
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
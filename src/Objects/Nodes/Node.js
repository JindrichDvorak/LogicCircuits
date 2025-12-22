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
    constructor(world, id, nodeType, x, y, width, height, isComponentNode) {
        this.world = world;
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
        if(isComponentNode && nodeType === NodeType.OUTPUT) {
            this.isGlobalOutput = true;
        } else {
            this.isGlobalOutput = false;
        }
        this.isJoint = false;
        this.isConnectedToTransistor = false;
        this.isConnectedToResistor = false;

        // * Component node logic:
        this.isComponentNode = isComponentNode;
        this.relativePosition = { x: 0, y: 0 };

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
        this.mouseLeave = false;
        if(e.button === 0) {
            if(stateManager.interactionMode.get() === InteractionMode.CONNECTING) {
                if(this.nodeType === NodeType.OUTPUT && this.inputNodeId === -1) {
                    stateManager.outputNodeId.set(this.id);

                    stateManager.connectOutputTrigger.signal();

                    stateManager.setDefaultState();

                    e.stopPropagation();
                }
            } else {
                stateManager.interactionMode.set(InteractionMode.NORMAL);
                stateManager.currentNodeId.set(this.id);
                stateManager.selectedWorldObject.set({
                    id: this.id,
                    type: WorldObject.NODE
                });

                if(!this.isFixed) {
                    this.element.classList.add("animate");

                    this.holdTimer = setTimeout(() => {
                        stateManager.interactionMode.set(InteractionMode.DRAGGING);

                        this.isDragging = true;
                    }, this.holdTime);

                    this.lastMousePosition = { x: e.clientX, y: e.clientY };
                }
                
            }
            e.stopPropagation();
        } else if(e.button === 2) {
            if(this.nodeType !== NodeType.OUTPUT) stateManager.interactionMode.set(InteractionMode.CONNECTING);

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
            stateManager.selectedWorldObject.set({
                id: this.id,
                type: WorldObject.NODE
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
            } else if(this.nodeType === NodeType.INPUT && !this.mouseLeave && !this.isComponentNode) {
                this.logicState.set(stateNeg(this.logicState));
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
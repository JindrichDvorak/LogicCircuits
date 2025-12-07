import { state, stateCollection, stateExpression } from "./state";


export const InteractionMode = Object.freeze({
    NORMAL: "Normal",
    DRAGGING: "Dragging",
    CONNECTING: "Connecting",
    CREATING_NODE: "Creating node"
});

export const Elements = Object.freeze({
    WORLD: "World",
    LOGIC_CONTAINER: "Logic container",
    NODE: "Node",
});

class StateManager {
    constructor() {
        this.interactionMode = state(InteractionMode.NORMAL);
        
        this.interactedElementType = state(Elements.WORLD);
        this.interactedElementSubtype = state("Undefined");
        this.interactedElementId = state("Undefined");

        this.inputNodeId = state(-1);
        this.connectingNodeId = state(-1);
        this.lastNodeId = state(-1);
        this.currentNodeId = state(-1);
        this.parentNodeId = state(-1);
        this.childNodeIds = state([]);
        this.outputNodeId = state(-1);

        // * Triggers:
        // *    Logic triggers:
        this.connectOutputTrigger = state();

        // *    UI triggers:
        this.interactionTrigger = state();
    }

    setDefaultState() {
        this.interactionMode = state(InteractionMode.NORMAL);
        
        this.interactedElementType = state(Elements.WORLD);
        this.interactedElementSubtype = state("Undefined");
        this.interactedElementId = state("Undefined");

        this.inputNodeId = state(-1);
        this.connectingNodeId = state(-1);
        this.lastNodeId = state(-1);
        this.currentNodeId = state(-1);
        this.parentNodeId = state(-1);
        this.childNodeIds = state([]);
        this.outputNodeId = state(-1);

        this.interactionTrigger.signal();
    }
}

export const stateManager = new StateManager();
import { state, stateCollection, stateExpression } from "./state";


export const InteractionMode = Object.freeze({
    NORMAL: "Normal",
    DRAGGING: "Dragging",
    CONNECTING: "Connecting",
    CREATING_NODE: "Creating node"
});

export const WorldObject = Object.freeze({
    NODE: "Node",
    COMPONENT: "Component"
});

class StateManager {
    constructor() {
        this.interactionMode = state(InteractionMode.NORMAL);
        this.selectedWorldObject = state({
            id: -1,
            type: undefined
        });

        // * Node connection state:
        this.inputNodeId = state(-1);
        this.connectingNodeId = state(-1);
        this.lastNodeId = state(-1);
        this.currentNodeId = state(-1);
        this.outputNodeId = state(-1);

        // * Triggers:
        // *    Logic triggers:
        this.connectOutputTrigger = state();
        this.deleteComponentNodeTrigger = state();
    }

    setDefaultState() {
        this.interactionMode = state(InteractionMode.NORMAL);
        this.selectedWorldObject = state({
            id: -1,
            type: undefined
        });

        // * Node connection state:
        this.inputNodeId = state(-1);
        this.connectingNodeId = state(-1);
        this.lastNodeId = state(-1);
        this.currentNodeId = state(-1);
        this.outputNodeId = state(-1);
    }
}

export const stateManager = new StateManager();
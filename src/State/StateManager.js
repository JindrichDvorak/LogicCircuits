import { state, stateCollection, stateExpression } from "./state";


export const InteractionMode = Object.freeze({
    NORMAL: "Normal",
    DRAGGING: "Dragging",
    CONNECTING: "Connecting",
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
        this.interactedElementId = state("Undefined");
        this.interactionTrigger = state();
    }
}

export const stateManager = new StateManager();
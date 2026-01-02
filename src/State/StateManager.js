import { state, stateCollection, stateExpression } from "./state";


export const InteractionMode = Object.freeze({
    NORMAL: "Normal",
    DRAGGING: "Dragging",
    CONNECTING: "Connecting",
    CREATING_NODE: "Creating node",
    ERROR: "Error"
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
        this.errorMessage = "";

        this.clearWorld = false;

        this.tempElement;

        // * Circuit state:
        this.resistorPresent = state(false);
        this.groundPresent = state(false);
        this.transistorPresent = state(false);

        // * Triggers:
        // *    Logic triggers:
        this.connectOutputTrigger = state();
        this.deleteComponentNodeTrigger = state();
        this.recalcualteResistanceTrigger = state();

        // TODO: Debug triggers:
        this.interactionTrigger = state();
    }

    setDefaultInteractionState() {
        this.interactionMode = state(InteractionMode.NORMAL);
        this.selectedWorldObject = state({
            id: -1,
            type: undefined
        });
        this.errorMessage = "";
    }
}

export const stateManager = new StateManager();
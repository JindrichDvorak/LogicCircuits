import { state, stateCollection, stateExpression } from "./state";


export const CursorState = Object.freeze({
    NORMAL: 1,
    DRAGGING: 2,
    CONNECTING: 3,
});

class StateManager {
    constructor() {
        this.cursorState = state(0);
        this.newState = state(-1);
        this.mouseState = stateCollection(this.cursorState, this.newState);
    }
}

export const stateManager = new StateManager();
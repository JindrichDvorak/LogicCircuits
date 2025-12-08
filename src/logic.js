export function logicNeg(value) {
    if(value === 0) return 1;
    else return 0;
}

export function logicAdd(value1, value2) {
    const sum = value1 + value2;
    if(sum === 1 || sum === 2) return 1;
    else return 0;
}

export function logicMult(value1, value2) {
    return value1 * value2;
}

export function stateNeg(state) {
    const value = state.get();
    return logicNeg(value);
}

export function stateAdd(state1, state2) {
    const value1 = state1.get();
    const value2 = state2.get();
    return logicAdd(value1, value2);
}

export function stateMult(state1, state2) {
    const value1 = state1.get();
    const value2 = state2.get();
    return logicMult(value1, value2);
}
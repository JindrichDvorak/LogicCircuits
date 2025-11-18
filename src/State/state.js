export function state(initialValue) {
    let value = initialValue;
    const reactions = new Set();

    function get() {
        return value;
    }

    function set(newValue) {
        if(value !== newValue) {
            value = newValue;

            reactions.forEach((reaction) => reaction(value));
        }
    }

    function subscribe(func) {
        reactions.add(func);

        return () => {
            unsubscribe(func);
        };
    }

    function unsubscribe(func) {
        reactions.delete(func);
    }

    return { get, set, subscribe, unsubscribe };
}

export function stateExpression(expression, ...values) {
    const expressionResult = expression(...values.map((value) => value.get()));
    const expressionState = state(expressionResult);

    values.forEach((value) => {
        value.subscribe(() => {
            expressionState.set(expression(...values.map((value) => value.get())));
        });
    });

    return expressionState;
}

export function stateCollection(...values) {
    return stateExpression(() => Math.random(), ...values);
}
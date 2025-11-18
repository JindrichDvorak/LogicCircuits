import { stateManager } from "./State/StateManager";


export function debugUILogic() {
    const debugUI = document.getElementById("debugUI");
    debugUI.classList.add("debugUI");

    debugUI.innerHTML = `
        <div>${stateManager.interactionMode.get()}</div>
    `;

    const unsubscribe = stateManager.interactionMode.subscribe(() => {
        debugUI.innerHTML = `
            <div>${stateManager.interactionMode.get()}</div>
        `;
    });
}
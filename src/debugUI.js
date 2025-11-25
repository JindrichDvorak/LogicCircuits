import { stateManager } from "./State/StateManager";


export function debugUILogic() {
    const debugUI = document.getElementById("debugUI");
    debugUI.classList.add("debugUI");

    debugUI.innerHTML = `
        <div>Interaction:</div>
        <ul>
            <li>Mode: ${stateManager.interactionMode.get()}</li>
            <li>Element type: ${stateManager.interactedElementType.get()}</li>
            <li>Element id: ${stateManager.interactedElementId.get()}</li>
        </ul>
    `;

    const unsubscribe = stateManager.interactionTrigger.subscribe(() => {
        debugUI.innerHTML = `
            <div>Interaction:</div>
            <ul>
                <li>Mode: ${stateManager.interactionMode.get()}</li>
                <li>Element type: ${stateManager.interactedElementType.get()}</li>
                <li>Element id: ${stateManager.interactedElementId.get()}</li>
            </ul>
        `;
        console.log("I have been redrawn!");
    });
}
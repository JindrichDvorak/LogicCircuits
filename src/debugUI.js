import { InteractionMode, stateManager } from "./State/StateManager";


export function debugUILogic() {
    const debugUI = document.getElementById("debugUI");
    debugUI.classList.add("debugUI");

    debugUI.innerHTML = `
        <div>Interaction:</div>
        <ul>
            <li>Mode: ${stateManager.interactionMode.get()}</li>
            <li>Element type: ${stateManager.interactedElementType.get()} 
                (${stateManager.interactedElementSubtype.get()}-${stateManager.interactedElementId.get()})</li>
        </ul>
    `;

    const unsubscribe = stateManager.interactionTrigger.subscribe(() => {
        let childNodeString = "<ul>";
            stateManager.childNodeIds.get().forEach((childId) => {
                childNodeString += `<li>${childId}</li>`;
            });
            childNodeString += "</ul>";

            debugUI.innerHTML = `
                <div>Interaction:</div>
                <ul>
                    <li>Mode: ${stateManager.interactionMode.get()}</li>
                    <li>Element type: ${stateManager.interactedElementType.get()} 
                        (${stateManager.interactedElementId.get()})</li>
                </ul>
                <div>Connecting:</div>
                <ul>
                    <li>Input: ${stateManager.inputNodeId.get()}</li>
                    <li>Connecting: ${stateManager.connectingNodeId.get()}</li>
                    <li>Last: ${stateManager.lastNodeId.get()}</li>
                    <li>Current: ${stateManager.currentNodeId.get()}</li>
                    <li>Parent: ${stateManager.parentNodeId.get()}</li>
                    <li>Children:</li>
                    ${childNodeString}
                </ul>
            `;
    });
}
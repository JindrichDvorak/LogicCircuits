import { InteractionMode, stateManager, WorldObject } from "./State/StateManager";


export function interactionInfoLogic(nodeManager, componentManager) {
    const interactionInfo = document.getElementById("interactionInfo");
    interactionInfo.classList.add("interactionInfo");

    interactionInfo.innerHTML = `
        <div>Interaction:</div>
        <ul>
            <li>Mode: ${stateManager.interactionMode.get()}</li>
            <li>Element type: ${stateManager.selectedWorldObject.get().type} 
                (${stateManager.selectedWorldObject.get().id})</li>
        </ul>
    `;

    const unsubscribe = stateManager.selectedWorldObject.subscribe(() => {
        interactionInfo.innerHTML = `
            <div>Interaction:</div>
            <ul>
                <li>Mode: ${stateManager.interactionMode.get()}</li>
                <li>Element type: ${stateManager.selectedWorldObject.get().type} 
                    (${stateManager.selectedWorldObject.get().id})</li>
            </ul>
        `;
    });
}
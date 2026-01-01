import { InteractionMode, stateManager, WorldObject } from "./State/StateManager";


export function debugUILogic(nodeManager) {
    const debugUI = document.getElementById("debugUI");
    debugUI.classList.add("debugUI");

    debugUI.innerHTML = `
        <div>Interaction:</div>
        <ul>
            <li>Mode: ${stateManager.interactionMode.get()}</li>
            <li>Element type: ${stateManager.selectedWorldObject.get().type} 
                (${stateManager.selectedWorldObject.get().id})</li>
        </ul>
    `;

    const unsubscribe = stateManager.interactionTrigger.subscribe(() => {
        if(stateManager.selectedWorldObject.get().type === WorldObject.NODE) {
            const selectedNode = nodeManager.getNodeById(stateManager.selectedWorldObject.get().id);
            if(selectedNode) {
                let childNodeString = "<ul>";
                selectedNode.childNodeIds.forEach((childId) => {
                    childNodeString += `<li>${childId}</li>`;
                });
                childNodeString += "</ul>";

                let outputNodeString = "<ul>";
                selectedNode.outputNodeIds.forEach((outputId) => {
                    outputNodeString += `<li>${outputId}</li>`;
                });
                outputNodeString += "</ul>";

                debugUI.innerHTML = `
                    <div>Interaction:</div>
                    <ul>
                        <li>Mode: ${stateManager.interactionMode.get()}</li>
                        <li>Element type: ${stateManager.selectedWorldObject.get().type} 
                            (${stateManager.selectedWorldObject.get().id})</li>
                    </ul>
                    <div>${stateManager.selectedWorldObject.get().id}:</div>
                    <ul>
                        <li>Parent: ${selectedNode.parentNodeId}</li>
                        <li>Input: ${selectedNode.inputNodeId}</li>
                        <li>Component: ${selectedNode.componentId}</li>
                        <li>Logic state: ${selectedNode.logicState.get()}</li>
                        <li>Connected to RTL: ${selectedNode.connectedToRTL}</li>
                        <li>Is open: ${selectedNode.logicState.allowSignal}</li>
                        <li>Resistance: ${selectedNode.resistorCount}</li>
                        <li>Child nodes:</li>
                            ${childNodeString}
                        <li>Output nodes:</li>
                            ${outputNodeString}
                    </ul>
                `;
            }
        } else {
            debugUI.innerHTML = `
                <div>Interaction:</div>
                <ul>
                    <li>Mode: ${stateManager.interactionMode.get()}</li>
                    <li>Element type: ${stateManager.selectedWorldObject.get().type} 
                        (${stateManager.selectedWorldObject.get().id})</li>
                </ul>
            `;
        }
    });
}
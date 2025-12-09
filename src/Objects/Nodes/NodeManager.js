import { stateManager, InteractionMode, WorldObject } from "../../State/StateManager";
import { Node, NodeType } from "./Node";
import { Wire } from "./Wire";

/* TODO:
    * Modify node-user interaction through stateManager --> Use fever state variables.
    ? Input node deletion: If node doesn't have any children, delete it, otherwise, delete the connected node chain first.
*/
export class NodeManager {
    constructor(world) {
        this.world = world;

        this.inputNodes = [];
        this.nodes = [];
        this.outputNodes = [];

        this.inputCounter = 0;
        this.nodeCounter = 0;
        this.outputCounter = 0;

        this.wireHolder = document.createElement("div");
        this.wireHolder.style.width = "1px";
        this.wireHolder.style.height = "1px";
        this.wireHolder.style.position = "absolute";
        this.world.appendChild(this.wireHolder);

        this.inputNodeWidth = 15;
        this.inputNodeHeight = 15;
        this.nodeWidth = 10;
        this.nodeHeight = 10;
        this.outputNodeWidth = 15;
        this.outputNodeHeight = 15;

        stateManager.connectOutputTrigger.subscribe(() => this.connectOutputNode());
    }

    getNodeById(nodeId) {
        const nodeType = nodeId.split("-", 2)[0];
        let desirredNode;
        switch(nodeType) {
            case NodeType.INPUT: {
                this.inputNodes.forEach((node) => {
                    if(node.id === nodeId) {
                        desirredNode = node;
                        return;
                    }
                });
                break;
            } case NodeType.OUTPUT: {
                this.outputNodes.forEach((node) => {
                    if(node.id === nodeId) {
                        desirredNode = node;
                        return;
                    }
                });
                break;
            } case NodeType.NODE: {
                this.nodes.forEach((node) => {
                    if(node.id === nodeId) {
                        desirredNode = node;
                        return;
                    }
                });
                break;
            }
        }
        return desirredNode;
    }

    createInputNode(x, y, mouseX, mouseY, isComponentNode) {
        const id = `${NodeType.INPUT}-${this.inputCounter}`;
        const node = new Node(this.world, id, NodeType.INPUT, x - this.inputNodeWidth / 2, y - this.inputNodeHeight / 2, 
            this.inputNodeWidth, this.inputNodeHeight, isComponentNode);
        this.inputNodes.push(node);
        this.inputCounter++;

        if(!isComponentNode) {
            stateManager.interactionMode.set(InteractionMode.CREATING_NODE);
            stateManager.selectedWorldObject.set({
                id: node.id,
                type: WorldObject.NODE
            });

            node.lastMousePosition = { x: mouseX, y: mouseY };
            node.isDragging = true;
        } else {
            node.isFixed = true;
            node.relativePosition = { x: x, y: y };
        }

        return node;
    }

    createNode(x, y) {
        const id = `${NodeType.NODE}-${this.nodeCounter}`;
        const node = new Node(this.world, id, NodeType.NODE, x - this.nodeWidth / 2, y - this.nodeHeight / 2, 
            this.nodeWidth, this.nodeHeight, false);
        this.nodes.push(node);

        const inputId = stateManager.inputNodeId.get();
        node.inputNodeId = inputId;
        node.parentNodeId = stateManager.lastNodeId.get();

        const parentNode = this.getNodeById(node.parentNodeId);
        parentNode.childNodeIds.push(node.id);

        const wire = new Wire(parentNode, node, this.wireHolder);
        node.wires.push(wire);

        node.connectLogicStates(parentNode.logicState);
        parentNode.logicState.signal();

        stateManager.currentNodeId.set(id);
        stateManager.selectedWorldObject.set({
            id: id,
            type: WorldObject.NODE
        });

        this.nodeCounter++;
    }

    createOuputNode(x, y, mouseX, mouseY, isComponentNode) {
        const id = `${NodeType.OUTPUT}-${this.outputCounter}`;
        const node = new Node(this.world, id, NodeType.OUTPUT, x - this.outputNodeWidth / 2, y - this.outputNodeHeight / 2, 
            this.outputNodeWidth, this.outputNodeHeight, isComponentNode);
        this.outputNodes.push(node);
        this.outputCounter++;

        if(!isComponentNode) {
            stateManager.interactionMode.set(InteractionMode.CREATING_NODE);
            stateManager.selectedWorldObject.set({
                id: id,
                type: WorldObject.NODE
            });

            node.lastMousePosition = { x: mouseX, y: mouseY };
            node.isDragging = true;
        } else {
            node.isFixed = true;
            node.relativePosition = { x: x, y: y };
        }

        return node;
    }

    connectOutputNode() {
        const outputNodeId = stateManager.outputNodeId.get();
        const outputNode = this.getNodeById(outputNodeId);
        const node = this.getNodeById(stateManager.currentNodeId.get());

        node.childNodeIds.push(outputNodeId);
        const wire = new Wire(outputNode, node, this.wireHolder);
        outputNode.wires.push(wire);
        outputNode.childNodeIds.push(node.id);

        outputNode.connectLogicStates(node.logicState);
        node.logicState.signal();

        outputNode.inputNodeId = node.inputNodeId;

        if(node.nodeType !== NodeType.INPUT) {
            const inputNode = this.getNodeById(node.inputNodeId);
            inputNode.outputNodeIds.push(outputNodeId);
        }
    }

    deleteNode(node) {
        node.wires.forEach((wire) => {
            wire.unsubStart();
            wire.unsubEnd();
            
            wire.element.remove();
        });
        node.wires = [];

        if(node.unsubFromParentLogicState) node.unsubFromParentLogicState();

        node.element.remove();

        switch(node.nodeType) {
            case NodeType.INPUT: {
                this.inputNodes.splice(this.inputNodes.indexOf(node), 1);
                break;
            } case NodeType.OUTPUT: {
                this.outputNodes.splice(this.outputNodes.indexOf(node), 1);
                break;
            } case NodeType.NODE: {
                this.nodes.splice(this.nodes.indexOf(node), 1);
                break;
            }
        }
    }

    deleteOutputNode(outputNode) {
        if(outputNode.childNodeIds.length > 0) {
            const node = this.getNodeById(outputNode.childNodeIds[0]);
            node.childNodeIds.splice(node.childNodeIds.indexOf(outputNode.id), 1);
        }

        if(outputNode.inputNodeId !== -1) {
            const inputNode = this.getNodeById(outputNode.inputNodeId);
            inputNode.outputNodeIds.splice(inputNode.outputNodeIds.indexOf(outputNode.id), 1);
        }

        this.deleteNode(outputNode);
    }

    deleteChildren(node) {
        node.childNodeIds.forEach((childId) => {
            const childNode = this.getNodeById(childId);
            if(childNode.nodeType !== NodeType.OUTPUT) {
                this.deleteChildren(childNode);
                this.deleteNode(childNode);
            } else {
                childNode.childNodeIds = [];
                childNode.inputNodeId = -1;
                
                const wire = childNode.wires[0];
                wire.unsubStart();
                wire.unsubEnd();
                wire.element.remove();
                childNode.wires = [];

                childNode.unsubFromParentLogicState();
                childNode.logicState.set(0);
            }
        });
        node.childNodeIds = [];
    }

    deleteNodeChain(node) {
        this.deleteChildren(node);
        if(node.parentNodeId !== -1) {
            const parentNode = this.getNodeById(node.parentNodeId);
            if(parentNode) parentNode.childNodeIds.splice(parentNode.childNodeIds.indexOf(node.id), 1);
        }
        this.deleteNode(node);

        stateManager.setDefaultState();
    }

    deleteGeneralNode(node) {
        if(!node) return;

        if(node.nodeType === NodeType.OUTPUT) this.deleteOutputNode(node);
        else this.deleteNodeChain(node);
    }

    deleteGeneralNodeById(nodeId) {
        const node = this.getNodeById(nodeId);

        if(node.isComponentNode) return;

        this.deleteGeneralNode(node);
    }
}
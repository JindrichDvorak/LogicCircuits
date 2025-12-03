import { stateManager } from "../../State/StateManager";
import { Node, NodeType } from "./Node";
import { Wire } from "./Wire";


export class NodeManager {
    constructor(world) {
        this.world = world;

        this.inputNodes = [];
        this.nodes = [];
        this.outputNodes = [];

        this.inputCounter = 0;
        this.nodeCounter = 0;
        this.outputCounter = 0;
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

    addChildNode(childNode) {
        const parentNode = this.getNodeById(childNode.parentNodeId);
        parentNode.childNodeIds.push(childNode.id);

        const wire = new Wire(parentNode, childNode);
        childNode.wires.push(wire);
    }

    createInputNode(x, y) {
        const id = `${NodeType.INPUT}-${this.inputCounter}`;
        const node = new Node(this.world, x, y, id, NodeType.INPUT);
        this.inputNodes.push(node);

        // TODO: Remove:
        switch(this.inputCounter) {
            case 0: {
                node.color = "peachpuff";
                break;
            } case 1: {
                node.color = "palegreen";
                break;
            } case 2: {
                node.color = "powderblue";
                break;
            }
        }

        this.inputCounter++;
    }

    createNode(x, y) {
        const id = `${NodeType.NODE}-${this.nodeCounter}`;
        const node = new Node(this.world, x, y, id, NodeType.NODE);
        this.nodes.push(node);

        const inputId = stateManager.inputNodeId.get();
        const inputNode = this.getNodeById(inputId);
        node.inputNodeId = inputId;
        node.parentNodeId = stateManager.lastNodeId.get();
        node.element.style.background = `${inputNode.color}`;

        this.addChildNode(node);
        // TODO: Find a better solution:
        //this.jerkParents(node);

        stateManager.currentNodeId.set(id);
        stateManager.parentNodeId.set(node.parentNodeId);
        stateManager.childNodeIds.set(node.childNodeIds);

        stateManager.interactionTrigger.signal();

        this.nodeCounter++;
    }

    createOuputNode(x, y) {
        const id = `${NodeType.OUTPUT}-${this.outputCounter}`;
        const node = new Node(this.world, x, y, id, NodeType.OUTPUT);
        this.outputNodes.push(node);
        this.outputCounter++;
    }

    jerkNode(node) {
        const dx = node.position.x - node.size.width / 2;
        const dy = node.position.y - node.size.height / 2;
        const dx1 = dx + Math.random();
        const dy1 = dy + Math.random();

        node.element.style.left = `${dx1}px`;
        node.element.style.top = `${dy1}px`;
        node.rewireTrigger.signal();
    }

    jerkParents(node) {
        this.jerkNode(node);
        const parentId = node.parentNodeId;
        const parentNode = this.getNodeById(parentId);
        if(parentNode.nodeType === NodeType.INPUT) this.jerkNode(parentNode);
        else this.jerkParents(parentNode);
    }

    deleteNode(node) {
        node.wires.forEach((wire) => {
            wire.unsubStart();
            wire.unsubEnd();
            
            wire.element.remove();
        });
        node.wires = [];

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

    deleteChildren(node) {
        node.childNodeIds.forEach((childId) => {
            const childNode = this.getNodeById(childId);
            this.deleteChildren(childNode);
            this.deleteNode(childNode);
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
}
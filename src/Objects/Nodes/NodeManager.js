import { stateManager, InteractionMode, WorldObject } from "../../State/StateManager";
import { Node, NodeType } from "./Node";
import { Wire } from "./Wire";
import { stateNeg } from "../../logic";
import { getRandomNumberId } from "../../utils";


/* TODO:
    * Modify node-user interaction through stateManager --> Use fever state variables.
    ? Input node deletion: If node doesn't have any children, delete it, otherwise, delete the connected node chain first.  !DONE!
*/
export class NodeManager {
    constructor(camera) {
        this.camera = camera;
        this.world = this.camera.world;

        this.inputNodes = [];
        this.nodes = [];
        this.outputNodes = [];

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

        this.manualInteraction = false;

        stateManager.connectOutputTrigger.subscribe((id) => this.connectOutputNode(id));
        stateManager.recalcualteResistanceTrigger.subscribe(() => {
            if(stateManager.transistorPresent.get() && !stateManager.clearWorld) {
                this.setupNodePaths();
            }
        });
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
        const id = `${NodeType.INPUT}-${getRandomNumberId()}`;
        let node;
        if(this.manualInteraction) {
            node = new Node(this.camera, id, NodeType.INPUT, x - this.inputNodeWidth / 2, y - this.inputNodeHeight / 2, 
                this.inputNodeWidth, this.inputNodeHeight, isComponentNode);
            node.isDragging = true;
        } else {
            node = new Node(this.camera, id, NodeType.INPUT, x, y, this.inputNodeWidth, this.inputNodeHeight, isComponentNode);
        }
        this.inputNodes.push(node);

        if(!isComponentNode) {
            stateManager.interactionMode.set(InteractionMode.CREATING_NODE);
            stateManager.selectedWorldObject.set({
                id: node.id,
                type: WorldObject.NODE
            });
            node.lastMousePosition = { x: mouseX, y: mouseY };
            node.logicState.allowSignal = true;

            if(this.manualInteraction) node.element.style.visibility = "hidden";

            stateManager.interactionTrigger.signal();
        } else {
            node.isFixed = true;
            node.relativePosition = { x: x, y: y };
        }

        return node;
    }

    createNode(x, y) {
        const id = `${NodeType.NODE}-${getRandomNumberId()}`;
        let node;
        if(this.manualInteraction) {
            node = new Node(this.camera, id, NodeType.NODE, x - this.nodeWidth / 2, y - this.nodeHeight / 2, 
                this.nodeWidth, this.nodeHeight, false);
        } else {
            node = new Node(this.camera, id, NodeType.NODE, x, y, this.nodeWidth, this.nodeHeight, false);
        }
        this.nodes.push(node);
        node.logicState.allowSignal = true;

        node.parentNodeId = stateManager.selectedWorldObject.get().id;
        const parentNode = this.getNodeById(node.parentNodeId);
        parentNode.addChildNode(node.id);
        node.componentId = parentNode.componentId;

        if(parentNode.inputNodeId === -1) {
            node.inputNodeId = parentNode.id;
        } else {
            node.inputNodeId = parentNode.inputNodeId;
        }

        const wire = new Wire(parentNode, node, this.wireHolder);
        node.wires.push(wire);

        node.connectLogicStates(parentNode.logicState);
        parentNode.logicState.signal();

        stateManager.selectedWorldObject.set({
            id: id,
            type: WorldObject.NODE
        });

        return node;
    }

    createOutputNode(x, y, mouseX, mouseY, isComponentNode) {
        const id = `${NodeType.OUTPUT}-${getRandomNumberId()}`;
        let node;
        if(this.manualInteraction) {
            node = new Node(this.camera, id, NodeType.OUTPUT, x - this.outputNodeWidth / 2, y - this.outputNodeHeight / 2, 
                this.outputNodeWidth, this.outputNodeHeight, isComponentNode);
            node.isDragging = true;
        } else {
            node = new Node(this.camera, id, NodeType.OUTPUT, x, y, this.outputNodeWidth, this.outputNodeHeight, isComponentNode);
        }
        node.element.classList.add("output");
        this.outputNodes.push(node);
        node.logicState.allowSignal = true;

        if(!isComponentNode) {
            stateManager.interactionMode.set(InteractionMode.CREATING_NODE);
            stateManager.selectedWorldObject.set({
                id: id,
                type: WorldObject.NODE
            });
            node.lastMousePosition = { x: mouseX, y: mouseY };

            if(this.manualInteraction) node.element.style.visibility = "hidden";

            stateManager.interactionTrigger.signal();
        } else {
            node.isFixed = true;
            node.relativePosition = { x: x, y: y };
        }

        return node;
    }

    connectOutputNode(outputNodeId) {
        const outputNode = this.getNodeById(outputNodeId);
        const node = this.getNodeById(stateManager.selectedWorldObject.get().id);

        let inputNodeId;
        if(node.inputNodeId === -1) {
            inputNodeId = node.id;
        } else {
            inputNodeId = node.inputNodeId;
        }
        const inputNode = this.getNodeById(inputNodeId);

        if(outputNode.isComponentNode) {
            if(outputNode.componentId === node.componentId) {
                stateManager.interactionMode.set(InteractionMode.NORMAL);
                stateManager.selectedWorldObject.set({
                    id: outputNodeId,
                    type: WorldObject.NODE
                });

                return;
            }
        }

        node.addChildNode(outputNodeId)
        const wire = new Wire(outputNode, node, this.wireHolder);
        outputNode.wires.push(wire);
        outputNode.addChildNode(node.id);

        outputNode.connectLogicStates(node.logicState);
        node.logicState.signal();

        if(outputNode.isTransistorNode || outputNode.isResistorNode) {
            this.propagateInputNodeId(outputNode, inputNodeId);
        } else {
            outputNode.inputNodeId = inputNodeId;
            inputNode.outputNodeIds.push(outputNodeId);

            this.setConnectedToRTL(inputNode);
        }

        stateManager.interactionMode.set(InteractionMode.NORMAL);
        stateManager.selectedWorldObject.set({
            id: outputNodeId,
            type: WorldObject.NODE
        });

        this.setupNodePaths();
    }

    setConnectedToRTL(inputNode) {
        this.propagateInputNodeId(inputNode, -2);
        if(inputNode.foundRTL) inputNode.connectedToRTL = true;
        else inputNode.connectedToRTL = false;
        inputNode.foundRTL = false;
    }

    /* * inputNodeId:
            * -1 --> disconnect relevant output nodes from input.
            * -2 --> check whether or not the input node is connected to RTL elements.
    */      
    propagateInputNodeId(currentNode, inputNodeId) {
        let nextNode;
        if(currentNode.nodeType === NodeType.OUTPUT && (currentNode.isTransistorNode || currentNode.isResistorNode)) {
            nextNode = this.getNodeById(currentNode.componentChildNodeId);
            if(inputNodeId === -2) {
                const inputNode = this.getNodeById(nextNode.inputNodeId);
                inputNode.foundRTL = true;
            } else {
                nextNode.inputNodeId = inputNodeId;
            }
            this.propagateInputNodeId(nextNode, inputNodeId);
        } else if(currentNode.nodeType === NodeType.INPUT || currentNode.nodeType === NodeType.NODE) {
            currentNode.childNodeIds.forEach((childNodeId) => {
                nextNode = this.getNodeById(childNodeId);
                this.propagateInputNodeId(nextNode, inputNodeId);
            });
        } else {
            const outputNodeId = currentNode.id;
            let inputNode;
            if(inputNodeId === -1) {
                inputNode = this.getNodeById(currentNode.inputNodeId);
                if(inputNode.outputNodeIds.includes(outputNodeId)) {
                    inputNode.outputNodeIds.splice(inputNode.outputNodeIds.indexOf(outputNodeId), 1);
                }
            } else if(inputNodeId === -2) {
                if(currentNode.isGrounded) {
                    inputNode = this.getNodeById(currentNode.inputNodeId);
                    inputNode.foundRTL = true;
                }
            } else {
                inputNode = this.getNodeById(inputNodeId);
                if(!inputNode.outputNodeIds.includes(outputNodeId)) {
                    inputNode.outputNodeIds.push(outputNodeId);
                }
            }
        }
        if(inputNodeId !== -2) currentNode.inputNodeId = inputNodeId;
    }

    getPrecedingNode(node) {
        if(!node) return;

        let nextNode;
        switch(node.nodeType) {
            case NodeType.INPUT: {
                if(node.isComponentNode) {
                    if(node.isTransistorNode || node.isResistorNode) nextNode = this.getNodeById(node.componentParentNodeId);
                }

                break;
            } case NodeType.NODE: {
                nextNode = this.getNodeById(node.parentNodeId);

                break;
            } case NodeType.OUTPUT: {
                if(node.childNodeIds.length !== 0) nextNode = this.getNodeById(node.childNodeIds[0]);

                break;
            }
        }
        return nextNode;
    }

    calculatePathResistance(inputNode) {
        if(inputNode.outputNodeIds.length === 0) return;

        if(stateManager.resistorPresent.get() || stateManager.transistorPresent.get() || stateManager.groundPresent.get()) {
            const pathResistances = [];
            let resistance = 0;
            inputNode.outputNodeIds.forEach((outputNodeId) => {
                let nextNode = this.getNodeById(outputNodeId);
                while(nextNode.id !== inputNode.id) {
                    if(nextNode.isResistorNode && nextNode.nodeType === NodeType.OUTPUT) resistance++;
                    if(nextNode.isGrounded) resistance += -0.5;
                    if(nextNode.isTransistorNode && nextNode.nodeType === NodeType.OUTPUT && !nextNode.transistorOn) {
                        resistance += 1000;
                    }

                    nextNode = this.getPrecedingNode(nextNode);
                }
                pathResistances.push(resistance);
                resistance = 0;
            });

            const minResistance = Math.min(...pathResistances);
            for(let pathCounter = 0; pathCounter < pathResistances.length; pathCounter++) {
                if(pathResistances[pathCounter] !== minResistance) {
                    let node = this.getNodeById(inputNode.outputNodeIds[pathCounter]);
                    while(node.id !== inputNode.id) {
                        node.resistorCount = pathResistances[pathCounter];
                        node.logicState.allowSignal = false;
                        if(node.nodeType !== NodeType.INPUT) node.logicState.set(0);

                        node = this.getPrecedingNode(node);
                    }
                }
            }
            for(let pathCounter = 0; pathCounter < pathResistances.length; pathCounter++) {
                if(pathResistances[pathCounter] === minResistance) {
                    let node = this.getNodeById(inputNode.outputNodeIds[pathCounter]);
                    while(node.id !== inputNode.id) {
                        node.resistorCount = pathResistances[pathCounter];
                        node.logicState.allowSignal = true;

                        node = this.getPrecedingNode(node);
                    }
                }
            }
        }
    }

    setupNodePaths() {
        this.inputNodes.forEach((node) => {
            node.logicState.allowSignal = true;
        });
        this.nodes.forEach((node) => node.logicState.allowSignal = true);
        this.outputNodes.forEach((node) => node.logicState.allowSignal = true);

        this.inputNodes.forEach((node) => {
            if(!node.isComponentNode && node.connectedToRTL) {
                node.logicState.set(stateNeg(node.logicState));
                node.logicState.set(stateNeg(node.logicState));
            }
        });
    
        this.inputNodes.forEach((inputNode) => {
            if(!(inputNode.isResistorNode || inputNode.isTransistorNode) && inputNode.connectedToRTL) {
                this.calculatePathResistance(inputNode);
            }
        });

        this.inputNodes.forEach((node) => {
            if(!node.isComponentNode && node.connectedToRTL) {
                node.logicState.set(stateNeg(node.logicState));
                node.logicState.set(stateNeg(node.logicState));
            }
        });
        stateManager.interactionTrigger.signal();
    }

    deleteNode(node) {
        node.wires.forEach((wire) => {
            wire.unsubStart();
            wire.unsubEnd();
            
            wire.element.remove();
        });
        node.wires = [];

        if(node.unsubFromParentLogicState) node.unsubFromParentLogicState();
        if(node.parentNodeId !== -1) {
            const parentNode = this.getNodeById(node.parentNodeId);
            parentNode.removeChildNode(node.id);
        }
        
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
            node.removeChildNode(outputNode.id);
        }

        if(outputNode.inputNodeId !== -1) {
            const inputNode = this.getNodeById(outputNode.inputNodeId);
            inputNode.outputNodeIds.splice(inputNode.outputNodeIds.indexOf(outputNode.id), 1);
        }

        if(!stateManager.clearWorld) this.setupNodePaths();
        this.deleteNode(outputNode);
    }

    disconnectOutputNode(outputNode) {        
        const inputNode = this.getNodeById(outputNode.inputNodeId);
        if(outputNode.isTransistorNode || outputNode.isResistorNode) {
            if(inputNode.outputNodeIds.includes(outputNode.id)) this.propagateInputNodeId(outputNode, -1);
        } else {
            if(inputNode) inputNode.outputNodeIds.splice(inputNode.outputNodeIds.indexOf(outputNode.id), 1);
            outputNode.inputNodeId = -1;
        }
        
        const parentNode = this.getNodeById(outputNode.childNodeIds[0]);
        parentNode.removeChildNode(outputNode.id);

        const wire = outputNode.wires[0];
        wire.unsubStart();
        wire.unsubEnd();
        wire.element.remove();
        outputNode.wires = [];

        outputNode.childNodeIds = [];
        outputNode.unsubFromParentLogicState();
        outputNode.logicState.set(0);
    }

    deleteChildren(node) {
        if(node.childNodeIds.length === 0) return;

        if(node.nodeType === NodeType.OUTPUT) {
            this.disconnectOutputNode(node);
        } else {
            const childNodeIds = [...node.childNodeIds];
            childNodeIds.forEach((childId) => {
                const childNode = this.getNodeById(childId);
                if(childNode.nodeType === NodeType.NODE) {
                    this.deleteChildren(childNode);
                    this.deleteNode(childNode);
                } else if(childNode.nodeType === NodeType.OUTPUT) {
                    this.disconnectOutputNode(childNode);
                }
            });
        }
        this.setupNodePaths();
    }

    deleteNodeChain(node) {
        this.deleteChildren(node);
        if(node.parentNodeId !== -1) {
            const parentNode = this.getNodeById(node.parentNodeId);
            if(parentNode) parentNode.removeChildNode(node.id);
        }
        this.deleteNode(node);

        stateManager.setDefaultInteractionState();
    }

    deleteGeneralNode(node) {
        if(!node) return;

        if(node.nodeType === NodeType.OUTPUT) this.deleteOutputNode(node);
        else this.deleteNodeChain(node);
    }

    deleteGeneralNodeById(nodeId) {
        const node = this.getNodeById(nodeId);

        if(node.isComponentNode) this.deleteChildren(node);
        else if(node.nodeType === NodeType.INPUT && node.childNodeIds.length > 0) {
            this.deleteChildren(node);
        } else this.deleteGeneralNode(node);
    }

    clearAllNodes() {
        const inputNodes = [...this.inputNodes];
        inputNodes.forEach((node) => {
            if(node.childNodeIds.length > 0) this.deleteChildren(node);
        });
        inputNodes.forEach((node) => this.deleteGeneralNode(node));

        const outputNodes = [...this.outputNodes];
        outputNodes.forEach((node) => this.deleteGeneralNode(node));
    }
}
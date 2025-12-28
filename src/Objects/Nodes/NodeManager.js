import { stateManager, InteractionMode, WorldObject } from "../../State/StateManager";
import { Node, NodeType } from "./Node";
import { Wire } from "./Wire";
import { stateNeg } from "../../logic";


/* TODO:
    * Modify node-user interaction through stateManager --> Use fever state variables.
    ? Input node deletion: If node doesn't have any children, delete it, otherwise, delete the connected node chain first.  !DONE!
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
        this.universalNodeCounter = 0;

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
        stateManager.recalcualteResistanceTrigger.subscribe(() => {
            if(stateManager.transistorPresent.get()) {
                this.inputNodes.forEach((inputNode) => {
                    if(!(inputNode.isResistorNode || inputNode.isTransistorNode)) {
                        this.setupNodePaths(inputNode);
                    }
                });
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
        const id = `${NodeType.INPUT}-${this.universalNodeCounter}`;
        const node = new Node(this.world, id, NodeType.INPUT, x - this.inputNodeWidth / 2, y - this.inputNodeHeight / 2, 
            this.inputNodeWidth, this.inputNodeHeight, isComponentNode);
        this.inputNodes.push(node);
        this.inputCounter++;
        this.universalNodeCounter++;

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
        const id = `${NodeType.NODE}-${this.universalNodeCounter}`;
        const node = new Node(this.world, id, NodeType.NODE, x - this.nodeWidth / 2, y - this.nodeHeight / 2, 
            this.nodeWidth, this.nodeHeight, false);
        this.nodes.push(node);

        node.parentNodeId = stateManager.lastNodeId.get();
        const parentNode = this.getNodeById(node.parentNodeId);
        parentNode.addChildNode(node.id);

        if(parentNode.inputNodeId === -1) {
            node.inputNodeId = parentNode.id;
        } else {
            node.inputNodeId = parentNode.inputNodeId;
        }

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
        this.universalNodeCounter++;
    }

    createOutputNode(x, y, mouseX, mouseY, isComponentNode) {
        const id = `${NodeType.OUTPUT}-${this.universalNodeCounter}`;
        const node = new Node(this.world, id, NodeType.OUTPUT, x - this.outputNodeWidth / 2, y - this.outputNodeHeight / 2, 
            this.outputNodeWidth, this.outputNodeHeight, isComponentNode);
        this.outputNodes.push(node);
        this.outputCounter++;
        this.universalNodeCounter++;

        if(!isComponentNode) {
            stateManager.interactionMode.set(InteractionMode.CREATING_NODE);
            stateManager.selectedWorldObject.set({
                id: id,
                type: WorldObject.NODE
            });

            node.isGlobalOutput = true;

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

        node.addChildNode(outputNodeId)
        const wire = new Wire(outputNode, node, this.wireHolder);
        outputNode.wires.push(wire);
        outputNode.addChildNode(node.id);

        outputNode.connectLogicStates(node.logicState);
        node.logicState.signal();

        let inputNodeId;
        if(node.inputNodeId === -1) {
            inputNodeId = node.id;
        } else {
            inputNodeId = node.inputNodeId;
        }

        const inputNode = this.getNodeById(inputNodeId);
        if((outputNode.isTransistorNode || outputNode.isResistorNode) && !inputNode.isComponentNode) {
            this.propagateInputNodeId(outputNode, inputNodeId);
        } else {
            outputNode.inputNodeId = inputNodeId;
            inputNode.outputNodeIds.push(outputNodeId);
        }

        this.setupNodePaths(inputNode);
    }

    propagateInputNodeId(currentNode, inputNodeId) {
        currentNode.inputNodeId = inputNodeId;

        let nextNode;
        if(currentNode.nodeType === NodeType.OUTPUT && (currentNode.isTransistorNode || currentNode.isResistorNode)) {
            nextNode = this.getNodeById(currentNode.componentChildNodeId);
            nextNode.inputNodeId = inputNodeId;
            this.propagateInputNodeId(nextNode, inputNodeId);
        } else if(currentNode.nodeType === NodeType.INPUT || currentNode.nodeType === NodeType.NODE) {
            currentNode.childNodeIds.forEach((childNodeId) => {
                nextNode = this.getNodeById(childNodeId);
                this.propagateInputNodeId(nextNode, inputNodeId);
            });
        } else {
            const inputNode = this.getNodeById(inputNodeId);
            const outputNodeId = currentNode.id;
            if(!inputNode.outputNodeIds.includes(outputNodeId)) {
                inputNode.outputNodeIds.push(outputNodeId);
            }
        }
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

    /*findNearestJoint(node) {
        if(!node) {
            this.resistorCount = 0;
            this.groundedPath = false;
            return;
        }

        let jointNode;
        let nextNode;
        if(node.isJoint) {
            jointNode = node;
        } else {
            if(node.nodeType === NodeType.OUTPUT) {
                if(node.isGrounded) this.groundedPath = true;
                if(node.isResistorNode) this.resistorCount++;
            }
            nextNode = this.getPrecedingNode(node);
            if(nextNode) if(nextNode.isJoint) jointNode = nextNode;
        }

        if(jointNode) {
            node.resistorCount = this.resistorCount;
            node.connectedToGround = this.groundedPath;
            this.resistorCount = 0;
            this.groundedPath = false;
            return jointNode;
        } else if(nextNode) {
            return this.findNearestJoint(nextNode);
        } else {
            this.resistorCount = 0;
            this.groundedPath = false;
            return;
        }
    }*/

    setupNodePaths(inputNode) {
        // TODO: "Hide" this somewhere?
        this.inputNodes.forEach((node) => node.isOpen = true);
        this.nodes.forEach((node) => node.isOpen = true);
        this.outputNodes.forEach((node) => node.isOpen = true);

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
                        node.isOpen = false;

                        node = this.getPrecedingNode(node);
                    }
                }
            }
            for(let pathCounter = 0; pathCounter < pathResistances.length; pathCounter++) {
                if(pathResistances[pathCounter] === minResistance) {
                    let node = this.getNodeById(inputNode.outputNodeIds[pathCounter]);
                    while(node.id !== inputNode.id) {
                        node.isOpen = true;

                        node = this.getPrecedingNode(node);
                    }
                }
            }
        }

        this.inputNodes.forEach((node) => {
            if(!node.isComponentNode) {
                node.logicState.set(stateNeg(node.logicState));
                node.logicState.set(stateNeg(node.logicState));
            }
        });
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
            node.removeChildNode(outputNode.id);
        }

        if(outputNode.inputNodeId !== -1) {
            const inputNode = this.getNodeById(outputNode.inputNodeId);
            inputNode.outputNodeIds.splice(inputNode.outputNodeIds.indexOf(outputNode.id), 1);

            this.setupNodePaths(inputNode);
        }

        this.deleteNode(outputNode);
    }

    deleteChildren(node) {
        node.childNodeIds.forEach((childId) => {
            const childNode = this.getNodeById(childId);
            if(childNode.nodeType !== NodeType.OUTPUT) {
                this.deleteChildren(childNode);
                if(childNode.nodeType !== NodeType.INPUT) this.deleteNode(childNode);
                else childNode.isOpen = true;
            } else {
                childNode.childNodeIds = [];
                
                const inputNode = this.getNodeById(childNode.inputNodeId);
                if(inputNode) inputNode.outputNodeIds.splice(inputNode.outputNodeIds.indexOf(childNode.id), 1);
                childNode.inputNodeId = -1;
                
                const wire = childNode.wires[0];
                wire.unsubStart();
                wire.unsubEnd();
                wire.element.remove();
                childNode.wires = [];

                childNode.isOpen = true;
                childNode.logicState.set(0);
                childNode.unsubFromParentLogicState();
            }
        });
        node.childNodeIds = [];
        node.isJoint = false;

        if(node.inputNodeId !== -1) {
            const inputNode = this.getNodeById(node.inputNodeId);
            if(inputNode) this.setupNodePaths(inputNode);
        }
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
}
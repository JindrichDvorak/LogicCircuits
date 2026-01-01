import { ComponentType } from "./Objects/Components/Component";
import { NodeType } from "./Objects/Nodes/Node";
import { WorldObject } from "./State/StateManager";
import { stateManager, InteractionMode } from "./State/StateManager";


export class SaveManager {
    constructor(camera, nodeManager, componentManager) {
        this.camera = camera;
        this.nodeManager = nodeManager;
        this.componentManager = componentManager;

        this.fileNameInput = document.getElementById("fileNameInput");
        this.anchor = document.createElement("a");

        this.data;
        this.nodeObjects = [];
        this.chainStart = true;

        this.input = document.getElementById("fileInput");
        this.input.onchange = () => {
            const file = this.input.files[0];
            const fileReader = new FileReader();
            fileReader.onload = async () => {
                this.data = await JSON.parse(fileReader.result);
                this.load();
            };
            fileReader.readAsText(file);
        };

        this.relativeStringIndent = 0;
        const offsetString = `
                {
        `;
        this.stringIndent = this.calculateStringIndent(offsetString);
        this.indentFirstLine = false;
    }

    removeExcesIndent(strings, ...values) {
        let rawString = strings.raw.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
        rawString = rawString.replace(/^\n|\n\s*$/g, "");

        const lines = rawString.split("\n");

        let excesIndent = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^\s*/)[0].length));
        excesIndent -= this.relativeStringIndent;
        if(excesIndent < 0) excesIndent += this.relativeStringIndent;

        return lines.map(l => l.slice(excesIndent)).join("\n");
    }

    addIndent(string, indent) {
        const lines = string.split("\n");
        let indentString = "";
        for(let i = 0; i < indent; i++) {
            indentString += " ";
        }

        let newLines = [];
        let newLine;
        let i = 0;
        lines.forEach((line) => {
            if(i === 0 && !this.indentFirstLine) newLine = line;
            else newLine = indentString + line;
            newLines.push(newLine);
            i++;
        });

        return newLines.join("\n");
    }

    calculateStringIndent(string) {
        const newString = string.replace(/^\n|\n\s*$/g, "");
        return newString.match(/^\s*/)[0].length;
    }

    createComponentString() {
        let componentString = "";
        if(this.componentManager.components.length === 0) componentString = "]";
        else {
            let componentObjectString;
            this.relativeStringIndent = 4;
            this.componentManager.components.forEach((component) => {
                if(component.componentType === ComponentType.TEXT_FIELD) {
                    componentObjectString = this.removeExcesIndent`
                        {
                            "componentType": "${component.componentType}",
                            "id": "${component.id}",
                            "x": ${component.position.x},
                            "y": ${component.position.y},
                            "angle": ${component.angle},
                            "text": "${component.text}"
                        }
                    `;
                } else {
                    let nodeIdString = component.nodes.map(n => `"${n.id}"`).join(",\n");

                    const offsetString = `
                        {
                    `;
                    const indent = this.calculateStringIndent(offsetString) + 8;
                    nodeIdString = this.addIndent(nodeIdString, indent);

                    componentObjectString = this.removeExcesIndent`
                        {
                            "componentType": "${component.componentType}",
                            "id": "${component.id}",
                            "x": ${component.position.x},
                            "y": ${component.position.y},
                            "angle": ${component.angle},
                            "nodeIds": [
                                ${nodeIdString}
                            ]
                        }
                    `;
                } 

                componentString += componentObjectString + ",\n";
            });
            this.relativeStringIndent = 0;
            componentString = componentString.slice(0, -2) + "\n]";
        }

        return this.addIndent(componentString, this.stringIndent);
    }

    createParentNodeString(nodeType, isComponentNode) {
        if(nodeType === NodeType.OUTPUT) return;

        let parentNodeString = "";
        let nodes = [];
        let listName;
        if(nodeType === NodeType.INPUT) {
            this.nodeManager.inputNodes.forEach((node) => {
                if(node.isComponentNode === isComponentNode) nodes.push(node);
            });
        } else {
            nodes = this.nodeManager.nodes;
        }

        if(nodes.length === 0) {
            parentNodeString = "]";
        } else {
            let nodeString;
            let connectedNodesString;
            let childNodeString;
            this.relativeStringIndent = 4;
            nodes.forEach((node) => {
                const childNodeCount = node.childNodeIds.length;
                if(childNodeCount === 0) connectedNodesString = "[]";
                else {
                    let currentChildNum = 1;
                    connectedNodesString = `[\n`;
                    node.childNodeIds.forEach((childNodeId) => {
                        const childNode = this.nodeManager.getNodeById(childNodeId);
                        if(currentChildNum !== childNodeCount) {
                            childNodeString = `
                                    {
                                        "nodeType": "${childNode.nodeType}",
                                        "id": "${childNode.id}",
                                        "x": ${childNode.position.x},
                                        "y": ${childNode.position.y}
                                    }
                            `;

                            childNodeString = childNodeString.replace(/^\n|\n\s*$/g, "");
                            connectedNodesString += childNodeString + ",\n";
                        } else {
                            childNodeString = `
                                    {
                                        "nodeType": "${childNode.nodeType}",
                                        "id": "${childNode.id}",
                                        "x": ${childNode.position.x},
                                        "y": ${childNode.position.y}
                                    }
                                ]
                            `;

                            childNodeString = childNodeString.replace(/^\n|\n\s*$/g, "");
                            connectedNodesString += childNodeString;
                        }
                        currentChildNum++;
                    });
                }

                nodeString = this.removeExcesIndent`
                            {
                                "id": "${node.id}",
                                "x": ${node.position.x},
                                "y": ${node.position.y},
                                "connectedNodes": ${connectedNodesString}
                            }
                `;

                parentNodeString += nodeString + ",\n";
            });
            this.relativeStringIndent = 0;
            parentNodeString = parentNodeString.slice(0, -2) + "\n]";
        }

        return this.addIndent(parentNodeString, this.stringIndent);
    }

    createOutputNodeString() {
        let outputNodeString = "";
        const nodes = [];
        this.nodeManager.outputNodes.forEach((node) => {
            if(!node.isComponentNode) nodes.push(node);
        });

        if(nodes.length === 0) outputNodeString = "]";
        else {
            let nodeString;
            this.relativeStringIndent = 4;
            nodes.forEach((node) => {
                nodeString = this.removeExcesIndent`
                    {
                        "id": "${node.id}",
                        "x": ${node.position.x},
                        "y": ${node.position.y}
                    }
                `;

                outputNodeString += nodeString + ",\n";
            });
            this.relativeStringIndent = 0;
            outputNodeString = outputNodeString.slice(0, -2) + "\n]";
        }

        return this.addIndent(outputNodeString, this.stringIndent);
    }

    save() {
        const cameraString = this.addIndent(this.removeExcesIndent`
                    "x": ${this.camera.position.x},
                    "y": ${this.camera.position.y},
                    "zoom": ${this.camera.zoom}
                }
            `, this.stringIndent);
        const componentString = this.createComponentString();
        const inputNodeString = this.createParentNodeString(NodeType.INPUT, false);
        const componentOutputNodeString = this.createParentNodeString(NodeType.INPUT, true);
        const outputNodeString = this.createOutputNodeString();
        const nodeString = this.createParentNodeString(NodeType.NODE, false);

        const dataString = this.removeExcesIndent`
            {
                "fileName": "${this.fileNameInput.innerText}",
                "camera": {
                ${cameraString},
                "components": [
                ${componentString},
                "inputNodes": [
                ${inputNodeString},
                "componentOutputNodes": [
                ${componentOutputNodeString},
                "outputNodes": [
                ${outputNodeString},
                "nodes": [
                ${nodeString}
            }
        `;
        const blob = new Blob([dataString], { type: "application/json" });
        this.anchor.href = URL.createObjectURL(blob);
        this.anchor.download = `${this.fileNameInput.innerText}.json`;
        this.anchor.click();
    }

    setupComponent(component, componentObject) {
        for(let i = 0; i < component.nodes.length; i++) {
            component.nodes[i].id = componentObject.nodeIds[i];
        }
        component.id = componentObject.id;

        component.move();
    }

    rotateComponent(component, angle) {
        const rotationCount = Math.floor(angle / 90);
        for(let i = 0; i < rotationCount; i++) {
            component.rotate();
        }
    }

    clearWorld() {
        stateManager.clearWorld = true;
        this.componentManager.clearAllComponents();
        this.nodeManager.clearAllNodes();
        stateManager.clearWorld = false;
    }

    openLoadDialog() {
        this.input.click();
    }

    loadComponents() {
        this.data.components.forEach((componentObject) => {
            let component;
            switch(componentObject.componentType) {
                case ComponentType.TEXT_FIELD: {
                    component = this.componentManager.createTextField(componentObject.x, componentObject.y, 0, 0);

                    component.text = componentObject.text;
                    component.element.innerText = componentObject.text;

                    break;
                } case ComponentType.TRANSISTOR: {
                    component = this.componentManager.createTransistor(componentObject.x, componentObject.y, 0, 0);

                    // TODO: Find a better solution:
                    this.setupComponent(component, componentObject);

                    component.collectorNode.componentChildNodeId = component.emitterNode.id;
                    component.emitterNode.componentParentNodeId = component.collectorNode.id;

                    break;
                } case ComponentType.RESISTOR: {
                    component = this.componentManager.createResistor(componentObject.x, componentObject.y, 0, 0);

                    // TODO: Find a better solution:
                    this.setupComponent(component, componentObject);

                    component.inNode.componentChildNodeId = component.outNode.id;
                    component.outNode.componentParentNodeId = component.inNode.id;

                    break;
                } case ComponentType.GROUND: {
                    component = this.componentManager.createGround(componentObject.x, componentObject.y, 0, 0);

                    break;
                } case ComponentType.BUFFER_GATE: {
                    component = this.componentManager.createBuffer(componentObject.x, componentObject.y, 0, 0);

                    break;
                } case ComponentType.NOT_GATE: {
                    component = this.componentManager.createNOT(componentObject.x, componentObject.y, 0, 0);

                    break;
                } case ComponentType.AND_GATE: {
                    component = this.componentManager.createAND(componentObject.x, componentObject.y, 0, 0);

                    break;
                } case ComponentType.OR_GATE: {
                    component = this.componentManager.createOR(componentObject.x, componentObject.y, 0, 0);

                    break;
                } case ComponentType.XOR_GATE: {
                    component = this.componentManager.createXOR(componentObject.x, componentObject.y, 0, 0);

                    break;
                } case ComponentType.NAND_GATE: {
                    component = this.componentManager.createNAND(componentObject.x, componentObject.y, 0, 0);
                    
                    break;
                } case ComponentType.NOR_GATE: {
                    component = this.componentManager.createNOR(componentObject.x, componentObject.y, 0, 0);

                    break;
                } case ComponentType.NXOR_GATE: {
                    component = this.componentManager.createNXOR(componentObject.x, componentObject.y, 0, 0);

                    break;
                } case ComponentType.HALF_ADDER_CIRCUIT: {
                    component = this.componentManager.createHalfAdder(componentObject.x, componentObject.y, 0, 0);

                    break;
                } case ComponentType.FULL_ADDER_CIRCUIT: {
                    component = this.componentManager.createFullAdder(componentObject.x, componentObject.y, 0, 0);

                    break;
                }
            }
            this.setupComponent(component, componentObject);
            this.rotateComponent(component, componentObject.angle);
        });
    }

    loadNodes() {
        let node;
        this.data.inputNodes.forEach((nodeObject) => {
            node = this.nodeManager.createInputNode(nodeObject.x, nodeObject.y, 0, 0, false);
            node.id = nodeObject.id;

            // TODO: Remove:
            node.isBlocked = true;
        });

        this.data.outputNodes.forEach((nodeObject) => {
            node = this.nodeManager.createOutputNode(nodeObject.x, nodeObject.y, 0, 0, false);
            node.id = nodeObject.id;
        });

        stateManager.setDefaultInteractionState();
    }

    findNextNodeObject(nodeId) {
        let nextNodeObject;
        for(let i = 0; i < this.nodeObjects.length; i++) {
            const nodeObject = this.nodeObjects[i];
            if(nodeObject.id === nodeId) {
                nextNodeObject = nodeObject;
                break;
            }
        }
        return nextNodeObject;
    }

    linkNodes(parentNodeObject, childNodes) {
        let parentNode;
        if(this.chainStart) {
            parentNode = this.nodeManager.getNodeById(parentNodeObject.id);

            this.chainStart = false;
        } else {
            const grandparentNode = this.nodeManager.getNodeById(stateManager.selectedWorldObject.get().id);
            parentNode = this.nodeManager.createNode(parentNodeObject.x, parentNodeObject.y);

            grandparentNode.removeChildNode(parentNode.id);
            parentNode.id = parentNodeObject.id;
            grandparentNode.addChildNode(parentNode.id);
        }

        childNodes.forEach((childNodeObject) => {
            stateManager.interactionMode.set(InteractionMode.CONNECTING);
            stateManager.selectedWorldObject.set({
                id: parentNode.id,
                type: WorldObject.NODE
            });

            if(childNodeObject.nodeType === NodeType.NODE) {
                const nextNodeObject = this.findNextNodeObject(childNodeObject.id);
                this.linkNodes(childNodeObject, nextNodeObject.connectedNodes);
            } else {
                this.nodeManager.connectOutputNode(childNodeObject.id);
            }
        });
    }

    connectWires() {
        this.nodeObjects = [...this.data.nodes];

        this.data.inputNodes.forEach((inputNodeObject) => {
            this.chainStart = true;
            const childNodes = inputNodeObject.connectedNodes;
            if(childNodes.length !== 0) this.linkNodes(inputNodeObject, childNodes);
        });

        this.data.componentOutputNodes.forEach((inputNodeObject) => {
            this.chainStart = true;
            const childNodes = inputNodeObject.connectedNodes;
            if(childNodes.length !== 0) this.linkNodes(inputNodeObject, childNodes);
        });

        this.nodeManager.inputNodes.forEach((inputNode) => {
            if(!(inputNode.isResistorNode || inputNode.isTransistorNode)) this.nodeManager.setConnectedToRTL(inputNode);
        });

        this.nodeManager.setupNodePaths();

        stateManager.setDefaultInteractionState();
    }

    load() {
        if(!this.data.fileName) return;

        this.clearWorld();

        this.fileNameInput.innerText = this.data.fileName;

        this.camera.position = {
            x: this.data.camera.x,
            y: this.data.camera.y,
        };
        this.camera.zoom = this.data.camera.zoom;
        this.camera.transformWorld();

        this.loadComponents();

        this.loadNodes();

        this.connectWires();

        this.componentManager.components.forEach((component) => component.setupOutputState());
    }
}
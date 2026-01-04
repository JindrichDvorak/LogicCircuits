import { Component } from "../Component";
import { stateExpression } from "../../../State/state";

import imgSVG from "/fullAdder.svg?raw";


export class FullAdder extends Component {
    constructor(world, componentType, idNum, x, y, width, height, nodeManager) {
        super(world, componentType, idNum, x, y, width, height);

        this.aNode;
        this.bNode;
        this.cInNode;
        this.sNode;
        this.cNode;

        this.aState;
        this.bState;
        this.cInState;
        this.sState;
        this.cState;

        this.createComponent(nodeManager);
    }

    createComponent(nodeManager) {
        const img = imgSVG.replace("<svg", `<svg width="${this.size.width}px"`);
        this.element.innerHTML = img;

        // TODO: This needs to be size invariant --> remove and replace:
        const nodeOffsetSide = 3;

        const labelA = document.createElement("div");
        this.setupLabel(labelA, "A", 41.5, 20.5);

        this.aNode = nodeManager.createOutputNode(this.size.width / 2 - 26, 0, 0, 0, true);
        this.nodes.push(this.aNode);
        this.aState = this.aNode.logicState;

        const labelB = document.createElement("div");
        this.setupLabel(labelB, "B", 92.5, 20.5);

        this.bNode = nodeManager.createOutputNode(this.size.width / 2 + 23.5, 0, 0, 0, true);
        this.nodes.push(this.bNode);
        this.bState = this.bNode.logicState;

        const labelCin = document.createElement("div");
        this.setupLabel(labelCin, "C<sub>i</sub>", 26, 51);

        this.cInNode = nodeManager.createOutputNode(0, this.size.height / 2 - nodeOffsetSide, 0, 0, true);
        this.nodes.push(this.cInNode);
        this.cInState = this.cInNode.logicState;

        const labelS = document.createElement("div");
        this.setupLabel(labelS, "S", 66, 82.5);

        this.sNode = nodeManager.createInputNode(this.size.width / 2 - 0.5, this.size.height, 0, 0, true);
        this.nodes.push(this.sNode);
        this.sState = this.sNode.logicState;

        const labelCout = document.createElement("div");
        this.setupLabel(labelCout, "C<sub>o</sub>", 102.5, 51);

        const adderLabel = document.createElement("div");
        this.setupLabel(adderLabel, `<span style="color: white;">.</span>Full\nadder`, 60, 45);

        this.cNode = nodeManager.createInputNode(this.size.width, this.size.height / 2 - nodeOffsetSide, 0, 0, true);
        this.nodes.push(this.cNode);
        this.cState = this.cNode.logicState;

        this.sNode.logicState = stateExpression(
            () => this.componentLogicS(this.aState, this.bState, this.cInState), 
            this.aState,
            this.bState,
            this.cInState
        );
        this.sNode.logicState.subscribe(() => this.sNode.onLogicStateChange());

        this.cNode.logicState = stateExpression(
            () => this.componentLogicC(this.aState, this.bState, this.cInState), 
            this.aState,
            this.bState,
            this.cInState
        );
        this.cNode.logicState.subscribe(() => this.cNode.onLogicStateChange());

        this.setupOutputState();
        this.setNodeComponentId(this.id);
    }

    componentLogicS(aState, bState, cInState) {
        const value1 = aState.get();
        const value2 = bState.get();
        const value3 = cInState.get();

        let result;
        if(value1 === 0 && value2 === 0 && value3 === 0) {
            result = 0;
        } else if(value1 === 1 && value2 === 0 && value3 === 0) {
            result = 1;
        } else if(value1 === 0 && value2 === 1 && value3 === 0) {
            result = 1;
        } else if(value1 === 1 && value2 === 1 && value3 === 0) {
            result = 0;
        } else if(value1 === 0 && value2 === 0 && value3 === 1) {
            result = 1;
        } else if(value1 === 1 && value2 === 0 && value3 === 1) {
            result = 0;
        } else if(value1 === 0 && value2 === 1 && value3 === 1) {
            result = 0;
        } else {
            result = 1;
        }
        return result;
    }

    componentLogicC(aState, bState, cInState) {
        const value1 = aState.get();
        const value2 = bState.get();
        const value3 = cInState.get();

        let result;
        if(value1 === 0 && value2 === 0 && value3 === 0) {
            result = 0;
        } else if(value1 === 1 && value2 === 0 && value3 === 0) {
            result = 0;
        } else if(value1 === 0 && value2 === 1 && value3 === 0) {
            result = 0;
        } else if(value1 === 1 && value2 === 1 && value3 === 0) {
            result = 1;
        } else if(value1 === 0 && value2 === 0 && value3 === 1) {
            result = 0;
        } else if(value1 === 1 && value2 === 0 && value3 === 1) {
            result = 1;
        } else if(value1 === 0 && value2 === 1 && value3 === 1) {
            result = 1;
        } else {
            result = 1;
        }
        return result;
    }
}
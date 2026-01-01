import { Component } from "../Component";
import { stateExpression } from "../../../State/state";

import imgSVG from "/halfAdder.svg?raw";


export class HalfAdder extends Component {
    constructor(world, componentType, idNum, x, y, width, height, nodeManager) {
        super(world, componentType, idNum, x, y, width, height);

        this.aNode;
        this.bNode;
        this.sNode;
        this.cNode;

        this.aState;
        this.bState;
        this.sState;
        this.cState;

        this.createComponent(nodeManager);
    }

    createComponent(nodeManager) {
        const img = imgSVG.replace("<svg", `<svg width="${this.size.width}px"`);
        this.element.innerHTML = img;

        // TODO: This needs to be size invariant --> remove and replace:
        const nodeOffsetTop = 17;
        const nodeOffsetBot = 23;

        this.aNode = nodeManager.createOutputNode(0, nodeOffsetTop, 0, 0, true);
        this.nodes.push(this.aNode);
        this.aState = this.aNode.logicState;

        this.bNode = nodeManager.createOutputNode(0, this.size.height - nodeOffsetBot, 0, 0, true);
        this.nodes.push(this.bNode);
        this.bState = this.bNode.logicState;

        this.cNode = nodeManager.createInputNode(this.size.width, nodeOffsetTop, 0, 0, true);
        this.nodes.push(this.cNode);
        this.cState = this.cNode.logicState;

        this.sNode = nodeManager.createInputNode(this.size.width, this.size.height - nodeOffsetBot, 0, 0, true);
        this.nodes.push(this.sNode);
        this.sState = this.sNode.logicState;

        this.sNode.logicState = stateExpression(
            () => this.componentLogicS(this.aState, this.bState), 
            this.aState,
            this.bState
        );
        this.sNode.logicState.subscribe(() => this.sNode.onLogicStateChange());

        this.cNode.logicState = stateExpression(
            () => this.componentLogicC(this.aState, this.bState), 
            this.aState,
            this.bState
        );
        this.cNode.logicState.subscribe(() => this.cNode.onLogicStateChange());

        this.setupOutputState();
        this.setNodeComponentId(this.id);
    }

    componentLogicS(aState, bState) {
        const value1 = aState.get();
        const value2 = bState.get();

        let result;
        if(value1 === 0 && value2 === 0) {
            result = 0;
        } else if(value1 === 1 && value2 === 0) {
            result = 1;
        } else if(value1 === 0 && value2 === 1) {
            result = 1;
        } else {
            result = 0;
        }
        return result;
    }

    componentLogicC(aState, bState) {
        const value1 = aState.get();
        const value2 = bState.get();

        let result;
        if(value1 === 0 && value2 === 0) {
            result = 0;
        } else if(value1 === 1 && value2 === 0) {
            result = 0;
        } else if(value1 === 0 && value2 === 1) {
            result = 0;
        } else {
            result = 1;
        }
        return result;
    }
}
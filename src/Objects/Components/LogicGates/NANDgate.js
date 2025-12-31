import { Component } from "../Component";
import { stateExpression } from "../../../State/state";

import { stateMult, logicNeg } from "../../../logic";
import imgSVG from "/NAND.svg?raw";


export class NANDgate extends Component {
    constructor(world, componentType, idNum, x, y, width, height, nodeManager) {
        super(world, componentType, idNum, x, y, width, height);

        this.aNode;
        this.bNode;
        this.outNode;

        this.aState;
        this.bState;
        this.outState;

        this.createComponent(nodeManager);
    }

    createComponent(nodeManager) {
        const img = imgSVG.replace("<svg", `<svg width="${this.size.width}px"`);
        this.element.innerHTML = img;

        // TODO: This needs to be size invariant --> remove and replace:
        const inputNodeOffset = 12.5;
        const outputNodeOffset = 2.5;

        this.aNode = nodeManager.createOutputNode(0, inputNodeOffset, 0, 0, true);
        this.nodes.push(this.aNode);
        this.aState = this.aNode.logicState;

        this.bNode = nodeManager.createOutputNode(0, this.size.height - inputNodeOffset, 0, 0, true);
        this.nodes.push(this.bNode);
        this.bState = this.bNode.logicState;

        this.outNode = nodeManager.createInputNode(this.size.width, this.size.height / 2 - outputNodeOffset, 0, 0, true);
        this.nodes.push(this.outNode);
        this.outState = this.outNode.logicState;

        this.outNode.logicState = stateExpression(
            () => this.componentLogic(this.aState, this.bState), 
            this.aState,
            this.bState
        );
        this.outNode.logicState.subscribe(() => this.outNode.onLogicStateChange());

        this.setupOutputState();
    }

    componentLogic(aState, bState) {
        return logicNeg(stateMult(aState, bState));
    }
}
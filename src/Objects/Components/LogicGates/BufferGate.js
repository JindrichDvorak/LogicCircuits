import { Component } from "../Component";
import { stateExpression } from "../../../State/state";

import imgSVG from "/buffer.svg?raw";


export class BufferGate extends Component {
    constructor(world, componentType, idNum, x, y, width, height, nodeManager) {
        super(world, componentType, idNum, x, y, width, height);

        this.inNode;
        this.outNode;

        this.inState;
        this.outState;

        this.createComponent(nodeManager);
    }

    createComponent(nodeManager) {
        const img = imgSVG.replace("<svg", `<svg width="${this.size.width}px"`);
        this.element.innerHTML = img;

        // TODO: This needs to be size invariant --> remove and replace:
        const nodeOffset = -2.5;

        this.inNode = nodeManager.createOutputNode(0, this.size.height / 2 + nodeOffset, 0, 0, true);
        this.nodes.push(this.inNode);
        this.inState = this.inNode.logicState;

        this.outNode = nodeManager.createInputNode(this.size.width, this.size.height / 2 + nodeOffset, 0, 0, true);
        this.nodes.push(this.outNode);
        this.outState = this.outNode.logicState;

        this.outNode.logicState = stateExpression(
            () => this.componentLogic(this.inState), 
            this.inState
        );
        this.outNode.logicState.subscribe(() => this.outNode.onLogicStateChange());
    }

    componentLogic(inState) {
        if(inState.get() == 0) {
            return 0;
        } else {
            return 1;
        }
    }
}
import { Component } from "../Component";
import { stateExpression } from "../../../State/state";

import imgSVG from "/resistor.svg?raw";


/* TODO:
    ! Find a more elegant solution for "curent direction".
*/
export class Resistor extends Component {
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

        this.inNode = nodeManager.createOutputNode(this.size.width / 2, 0, 0, 0, true);
        this.nodes.push(this.inNode);
        this.inState = this.inNode.logicState;

        this.outNode = nodeManager.createInputNode(this.size.width / 2, this.size.height, 0, 0, true);
        this.nodes.push(this.outNode);
        this.outState = this.outNode.logicState;

        this.inNode.componentChildNodeId = this.outNode.id;
        this.inNode.isResistorNode = true;
        this.outNode.componentParentNodeId = this.inNode.id;
        this.outNode.isResistorNode = true;

        this.outNode.logicState = stateExpression(
            () => this.componentLogic(this.inState), 
            this.inState
        );
        this.outNode.logicState.subscribe(() => this.outNode.onLogicStateChange());

        this.setupOutputState();
        this.setNodeComponentId(this.id);
    }

    componentLogic(inState) {
        if(inState.get() == 0) {
            return 0;
        } else {
            return 1;
        }
    }
}
import { Component } from "../Component";
import { stateExpression } from "../../../State/state";

import imgSVG from "/transistorBJT.svg?raw";


export class Transistor extends Component {
    constructor(world, id, x, y, width, height, nodeManager) {
        super(world, id, x, y, width, height);

        this.img;

        this.baseNode;
        this.collectorNode;
        this.emitterNode;

        this.baseState;
        this.collectorState;
        this.emitterState;

        this.createComponent(nodeManager);
    }

    createComponent(nodeManager) {
        const img = imgSVG.replace("<svg", `<svg width="${this.size.width}px"`);
        this.element.innerHTML = img;

        const nodeOffset = 30;

        this.baseNode = nodeManager.createOutputNode(0, this.size.height / 2, 0, 0, true);
        this.nodes.push(this.baseNode);
        this.baseState = this.baseNode.logicState;

        this.collectorNode = nodeManager.createOutputNode(this.size.width / 2 + nodeOffset, 0, 0, 0, true);
        this.nodes.push(this.collectorNode);
        this.collectorState = this.collectorNode.logicState;

        this.emitterNode = nodeManager.createInputNode(this.size.width / 2 + nodeOffset, this.size.height, 0, 0, true);
        this.nodes.push(this.emitterNode);
        this.emitterState = this.emitterNode.logicState;

        this.emitterNode.logicState = stateExpression(
            () => this.componentLogic(this.baseState, this.collectorState), 
            this.baseState,
            this.collectorState
        );
        this.emitterNode.logicState.subscribe(() => this.emitterNode.onLogicStateChange());
    }

    componentLogic(baseState, collectorState) {
        // TODO: It could be more elegant:
        if(collectorState.get() == 0) {
            return 0;
        } else {
            if(baseState.get() === 0) {
                return 0;
            } else {
                return collectorState.get();
            }
        }
    }
}
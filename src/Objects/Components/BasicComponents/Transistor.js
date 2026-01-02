import { Component } from "../Component";
import { stateExpression } from "../../../State/state";

import imgSVG from "/transistorBJT.svg?raw";


export class Transistor extends Component {
    constructor(world, componentType, idNum, x, y, width, height, nodeManager) {
        super(world, componentType, idNum, x, y, width, height);

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

        const nodeOffset = 28.5;

        this.baseNode = nodeManager.createOutputNode(0, this.size.height / 2 - 2.5, 0, 0, true);
        this.nodes.push(this.baseNode);
        this.baseState = this.baseNode.logicState;

        this.collectorNode = nodeManager.createOutputNode(this.size.width / 2 + nodeOffset, 0, 0, 0, true);
        this.nodes.push(this.collectorNode);
        this.collectorState = this.collectorNode.logicState;

        this.emitterNode = nodeManager.createInputNode(this.size.width / 2 + nodeOffset, this.size.height, 0, 0, true);
        this.nodes.push(this.emitterNode);
        this.emitterState = this.emitterNode.logicState;

        this.collectorNode.componentChildNodeId = this.emitterNode.id;
        this.collectorNode.isTransistorNode = true;
        this.emitterNode.componentParentNodeId = this.collectorNode.id;
        this.emitterNode.isTransistorNode = true;

        this.emitterNode.logicState = stateExpression(
            () => this.componentLogic(this.baseState, this.collectorState), 
            this.baseState,
            this.collectorState
        );
        this.emitterNode.logicState.subscribe(() => this.emitterNode.onLogicStateChange());

        this.setupOutputState();
        this.setNodeComponentId(this.id);
    }

    componentLogic(baseState, collectorState) {
        // TODO: It could be more elegant:
        if(collectorState.get() == 0) {
            if(baseState.get() === 0) {
                this.collectorNode.transistorOn = false;
                return 0;
            } else {
                this.collectorNode.transistorOn = true;
                return 0;
            }
        } else {
            if(baseState.get() === 0) {
                this.collectorNode.transistorOn = false;
                return 0;
            } else {
                this.collectorNode.transistorOn = true;
                return collectorState.get();
            }
        }
    }
}
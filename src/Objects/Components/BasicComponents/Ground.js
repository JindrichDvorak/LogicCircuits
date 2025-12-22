import { Component } from "../Component";
import { stateExpression } from "../../../State/state";

import imgSVG from "/ground.svg?raw";


export class Ground extends Component {
    constructor(world, componentType, idNum, x, y, width, height, nodeManager) {
        super(world, componentType, idNum, x, y, width, height);

        this.inNode;

        this.createComponent(nodeManager);
    }

    createComponent(nodeManager) {
        const img = imgSVG.replace("<svg", `<svg width="${this.size.width}px"`);
        this.element.innerHTML = img;

        const nodeOffset = 1.15;

        this.inNode = nodeManager.createOutputNode(this.size.width / 2 - nodeOffset, 0, 0, 0, true);
        this.nodes.push(this.inNode);
        this.inNode.isGlobalOutput = true;
    }
}
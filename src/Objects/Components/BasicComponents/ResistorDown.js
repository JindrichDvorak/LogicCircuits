import { Component } from "../Component";
import { stateExpression } from "../../../State/state";

/* TODO:
    ! Find a more elegant solution for "curent direction".
*/
export class ResistorDown extends Component {
    constructor(world, id, x, y, width, height, nodeManager) {
        super(world, id, x, y, width, height);

        this.inNode;
        this.outNode;

        this.inState;
        this.outState;

        this.createComponent(nodeManager);
    }

    createComponent(nodeManager) {
        this.element.innerHTML = `
            <img
                src="/resistor.svg" 
                width="${this.size.width}px" 
                style="user-select: none;"
            />
        `;

        this.inNode = nodeManager.createOuputNode(this.size.width / 2, -10, 0, 0, true);
        this.nodes.push(this.inNode);
        this.inState = this.inNode.logicState;

        this.outNode = nodeManager.createInputNode(this.size.width / 2, this.size.height, 0, 0, true);
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
            // ! Remove this!
            return 0;
        }
    }
}
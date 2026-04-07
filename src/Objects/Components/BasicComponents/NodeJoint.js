import { Component } from "../Component";
import { stateExpression } from "../../../State/state";
import { stateManager } from "../../../State/StateManager";

import imgSVG from "/joint.svg?raw";
import { NodeType } from "../../Nodes/Node";


export class NodeJoint extends Component {
    constructor(world, componentType, idNum, x, y, width, height, nodeManager) {
        super(world, componentType, idNum, x, y, width, height);

        this.inNode0;
        this.inNode1;
        this.inNode2;
        this.inNode3;
        this.inNode4;
        this.inNode5;
        this.inNode6;
        this.inNode7;
        this.inNode8;
        this.inNode9;
        this.inNode10;
        this.inNode11;
        this.inNode12;
        this.inNode13;
        this.inNode14;
        this.inNode15;
        this.inNode16;
        this.inNode17;
        this.inNode18;
        this.inNode19;

        this.outNode;

        this.inNodeState0;
        this.inNodeState1;
        this.inNodeState2;
        this.inNodeState3;
        this.inNodeState4;
        this.inNodeState5;
        this.inNodeState6;
        this.inNodeState7;
        this.inNodeState8;
        this.inNodeState9;
        this.inNodeState10;
        this.inNodeState11;
        this.inNodeState12;
        this.inNodeState13;
        this.inNodeState14;
        this.inNodeState15;
        this.inNodeState16;
        this.inNodeState17;
        this.inNodeState18;
        this.inNodeState19;

        this.createComponent(nodeManager);
    }

    createComponent(nodeManager) {
        const img = imgSVG.replace("<svg", `<svg width="${this.size.width}px"`);
        this.element.innerHTML = img;

        this.inNode0 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode0);
        this.inNode0.element.style.visibility = "hidden";
        this.inNodeState0 = this.inNode0.logicState;
        this.inNode0.isNodeJointNode = true;

        this.inNode1 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode1);
        this.inNode1.element.style.visibility = "hidden";
        this.inNodeState1 = this.inNode1.logicState;
        this.inNode1.isNodeJointNode = true;

        this.inNode2 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode2);
        this.inNode2.element.style.visibility = "hidden";
        this.inNodeState2 = this.inNode2.logicState;
        this.inNode2.isNodeJointNode = true;

        this.inNode3 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode3);
        this.inNode3.element.style.visibility = "hidden";
        this.inNodeState3 = this.inNode3.logicState;
        this.inNode3.isNodeJointNode = true;

        this.inNode4 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode4);
        this.inNode4.element.style.visibility = "hidden";
        this.inNodeState4 = this.inNode4.logicState;
        this.inNode4.isNodeJointNode = true;

        this.inNode5 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode5);
        this.inNode5.element.style.visibility = "hidden";
        this.inNodeState5 = this.inNode5.logicState;
        this.inNode5.isNodeJointNode = true;

        this.inNode6 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode6);
        this.inNode6.element.style.visibility = "hidden";
        this.inNodeState6 = this.inNode6.logicState;
        this.inNode6.isNodeJointNode = true;

        this.inNode7 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode7);
        this.inNode7.element.style.visibility = "hidden";
        this.inNodeState7 = this.inNode7.logicState;
        this.inNode7.isNodeJointNode = true;

        this.inNode8 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode8);
        this.inNode8.element.style.visibility = "hidden";
        this.inNodeState8 = this.inNode8.logicState;
        this.inNode8.isNodeJointNode = true;

        this.inNode9 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode9);
        this.inNode9.element.style.visibility = "hidden";
        this.inNodeState9 = this.inNode9.logicState;
        this.inNode9.isNodeJointNode = true;

        this.inNode10 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode10);
        this.inNode10.element.style.visibility = "hidden";
        this.inNodeState10 = this.inNode10.logicState;
        this.inNode10.isNodeJointNode = true;

        this.inNode11 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode11);
        this.inNode11.element.style.visibility = "hidden";
        this.inNodeState11 = this.inNode11.logicState;
        this.inNode11.isNodeJointNode = true;

        this.inNode12 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode12);
        this.inNode12.element.style.visibility = "hidden";
        this.inNodeState12 = this.inNode12.logicState;
        this.inNode12.isNodeJointNode = true;

        this.inNode13 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode13);
        this.inNode13.element.style.visibility = "hidden";
        this.inNodeState13 = this.inNode13.logicState;
        this.inNode13.isNodeJointNode = true;

        this.inNode14 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode14);
        this.inNode14.element.style.visibility = "hidden";
        this.inNodeState14 = this.inNode14.logicState;
        this.inNode14.isNodeJointNode = true;

        this.inNode15 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode15);
        this.inNode15.element.style.visibility = "hidden";
        this.inNodeState15 = this.inNode15.logicState;
        this.inNode15.isNodeJointNode = true;

        this.inNode16 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode16);
        this.inNode16.element.style.visibility = "hidden";
        this.inNodeState16 = this.inNode16.logicState;
        this.inNode16.isNodeJointNode = true;

        this.inNode17 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode17);
        this.inNode17.element.style.visibility = "hidden";
        this.inNodeState17 = this.inNode17.logicState;
        this.inNode17.isNodeJointNode = true;

        this.inNode18 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode18);
        this.inNode18.element.style.visibility = "hidden";
        this.inNodeState18 = this.inNode18.logicState;
        this.inNode18.isNodeJointNode = true;

        this.inNode19 = nodeManager.createOutputNode(20, 20, 0, 0, true);
        this.nodes.push(this.inNode19);
        this.inNode19.element.style.visibility = "hidden";
        this.inNodeState19 = this.inNode19.logicState;
        this.inNode19.isNodeJointNode = true;

        this.outNode = nodeManager.createInputNode(40, 20, 0, 0, true);
        this.nodes.push(this.outNode);
        this.outNode.isNodeJointNode = true;

        this.outNode.logicState = stateExpression(
            () => this.componentLogic(this.inNodeState0, this.inNodeState1, this.inNodeState2, this.inNodeState3, this.inNodeState4, 
                this.inNodeState5, this.inNodeState6, this.inNodeState7, this.inNodeState8, this.inNodeState9, this.inNodeState10, 
                this.inNodeState11, this.inNodeState12, this.inNodeState13, this.inNodeState14, this.inNodeState15, this.inNodeState16, 
                this.inNodeState17, this.inNodeState18, this.inNodeState19),
                this.inNodeState0, this.inNodeState1, this.inNodeState2, this.inNodeState3, this.inNodeState4, this.inNodeState5, 
                this.inNodeState6, this.inNodeState7, this.inNodeState8, this.inNodeState9, this.inNodeState10, this.inNodeState11, 
                this.inNodeState12, this.inNodeState13, this.inNodeState14, this.inNodeState15, this.inNodeState16, this.inNodeState17, 
                this.inNodeState18, this.inNodeState19
        );
        this.outNode.logicState.subscribe(() => this.outNode.onLogicStateChange());

        this.changeVisual(stateManager.lockControls);

        this.setNodeComponentId(this.id);
    }

    componentLogic(a0State, a1State, a2State, a3State, a4State, a5State, a6State, a7State, a8State, a9State, a10State, a11State, a12State, 
        a13State, a14State, a15State, a16State, a17State, a18State, a19State) {

        const a0 = a0State.get();
        const a1 = a1State.get();
        const a2 = a2State.get();
        const a3 = a3State.get();
        const a4 = a4State.get();
        const a5 = a5State.get();
        const a6 = a6State.get();
        const a7 = a7State.get();
        const a8 = a8State.get();
        const a9 = a9State.get();
        const a10 = a10State.get();
        const a11 = a11State.get();
        const a12 = a12State.get();
        const a13 = a13State.get();
        const a14 = a14State.get();
        const a15 = a15State.get();
        const a16 = a16State.get();
        const a17 = a17State.get();
        const a18 = a18State.get();
        const a19 = a19State.get();

        return (
            a0 || a1 || a2 || a3 || a4 || a5 || a6 || a7 || a8 || a9 ||
            a10 || a11 || a12 || a13 || a14 || a15 || a16 || a17 || a18 || a19
        );
    }

    setSpecialNodeIds() {
        this.nodes.forEach((node) => {
            if(node.nodeType !== NodeType.INPUT) {
                node.componentChildNodeId = this.outNode.id;
                this.outNode.componentParentNodes.push(node.id);
            }
        });
    }

    changeVisual(lock) {
        if(lock) {
            this.element.style.visibility = "hidden";

            this.outNode.relativePosition = { x: 20, y: 20 };
            this.outNode.size = { width: 9, height: 9 };

            this.outNode.element.style.background = "black";
        } else {
            this.element.style.visibility = "visible";

            this.outNode.relativePosition = { x: 40, y: 20 };
            this.outNode.size = { width: 15, height: 15 };

            this.outNode.element.style.background = "white";
        }

        this.outNode.element.style.width = `${this.outNode.size.width}px`;
        this.outNode.element.style.height = `${this.outNode.size.height}px`;
        this.outNode.onLogicStateChange();
        this.move();
    }
}
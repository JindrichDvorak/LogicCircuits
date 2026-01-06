import { Component } from "../Component";
import { state, stateExpression } from "../../../State/state";

import imgSVG from "/1to8DEMUX.svg?raw";


export class OneToEightDEMUX extends Component {
    constructor(world, componentType, idNum, x, y, width, height, nodeManager) {
        super(world, componentType, idNum, x, y, width, height);

        this.aNode;
        this.bNode;
        this.cNode;
        this.dNode;
        this.eNode;
        this.fNode;
        this.gNode;
        this.hNode;

        this.opNodeA;
        this.opNodeB;
        this.opNodeC;

        this.inNode;

        this.opStateA;
        this.opStateB;
        this.opStateC;

        this.inState;

        this.digitLabel0;
        this.digitLabel1;
        this.digitLabel2;
        this.digitLabel3;
        this.digitLabel4;
        this.digitLabel5;
        this.digitLabel6;
        this.digitLabel7;

        this.opLabel0;
        this.opLabel1;
        this.opLabel2;

        this.muxLabel;

        this.digitSwitch;
        this.opSwitch;

        this.digitSwitchState;
        this.opSwitchState;

        // TODO: Should be moved into a global static class:
        // * Control switch labels:
        this.arrowDown = "<span>\u{2193}</span>";
        this.arrowUp = "<span>\u{2191}</span>";
        this.arrowLeft = "<span>\u{2190}</span>";
        this.arrowRight = "<span>\u{2192}</span>";
        this.arrowDownSize  = this.calculateControlSwitchSize(this.arrowDown);
        this.arrowUpSize  = this.calculateControlSwitchSize(this.arrowUp);
        this.arrowLeftSize  = this.calculateControlSwitchSize(this.arrowLeft);
        this.arrowRightSize  = this.calculateControlSwitchSize(this.arrowRight);

        this.createComponent(nodeManager);
    }

    createComponent(nodeManager) {
        const img = imgSVG.replace("<svg", `<svg width="${this.size.width}px"`);
        this.element.innerHTML = img;

        // TODO: This needs to be size invariant --> remove and replace:
        this.aNode = nodeManager.createInputNode(97, 28.1, 0, 0, true);
        this.nodes.push(this.aNode);
        this.aNode.nodeNumber.set(0);

        this.bNode = nodeManager.createInputNode(97, 47, 0, 0, true);
        this.nodes.push(this.bNode);
        this.bNode.nodeNumber.set(1);

        this.cNode = nodeManager.createInputNode(97, 65.75, 0, 0, true);
        this.nodes.push(this.cNode);
        this.cNode.nodeNumber.set(2);

        this.dNode = nodeManager.createInputNode(97, 84.75, 0, 0, true);
        this.nodes.push(this.dNode);
        this.dNode.nodeNumber.set(3);

        this.eNode = nodeManager.createInputNode(97, 103.5, 0, 0, true);
        this.nodes.push(this.eNode);
        this.eNode.nodeNumber.set(4);

        this.fNode = nodeManager.createInputNode(97, 122.5, 0, 0, true);
        this.nodes.push(this.fNode);
        this.fNode.nodeNumber.set(5);

        this.gNode = nodeManager.createInputNode(97, 141.5, 0, 0, true);
        this.nodes.push(this.gNode);
        this.gNode.nodeNumber.set(6);

        this.hNode = nodeManager.createInputNode(97, 160.25, 0, 0, true);
        this.nodes.push(this.hNode);
        this.hNode.nodeNumber.set(7);

        this.opNodeA = nodeManager.createOutputNode(28.5, 200, 0, 0, true);
        this.nodes.push(this.opNodeA);
        this.opStateA = this.opNodeA.logicState;

        this.opNodeB = nodeManager.createOutputNode(47.5, 200, 0, 0, true);
        this.nodes.push(this.opNodeB);
        this.opStateB = this.opNodeB.logicState;

        this.opNodeC = nodeManager.createOutputNode(66.5, 200, 0, 0, true);
        this.nodes.push(this.opNodeC);
        this.opStateC = this.opNodeC.logicState;

        this.inNode = nodeManager.createOutputNode(0, 94.25, 0, 0, true);
        this.nodes.push(this.inNode);
        this.inState = this.inNode.logicState;

        this.digitLabel0 = document.createElement("div");
        this.digitLabel0.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel0, "0", 67.5, 22.5);

        this.digitLabel1 = document.createElement("div");
        this.digitLabel1.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel1, "1", 67.5, 41.5);

        this.digitLabel2 = document.createElement("div");
        this.digitLabel2.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel2, "2", 67.5, 61);

        this.digitLabel3 = document.createElement("div");
        this.digitLabel3.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel3, "3", 67.5, 78.5);

        this.digitLabel4 = document.createElement("div");
        this.digitLabel4.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel4, "4", 67.5, 99);

        this.digitLabel5 = document.createElement("div");
        this.digitLabel5.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel5, "5", 67.5, 118);

        this.digitLabel6 = document.createElement("div");
        this.digitLabel6.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel6, "6", 67.5, 136);

        this.digitLabel7 = document.createElement("div");
        this.digitLabel7.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel7, "7", 67.5, 155);

        this.opLabel0 = document.createElement("div");
        this.opLabel0.style.fontSize = "x-small";
        this.setupLabel(this.opLabel0, "0", 26.5, 160);

        this.opLabel1 = document.createElement("div");
        this.opLabel1.style.fontSize = "x-small";
        this.setupLabel(this.opLabel1, "1", 45, 166.5);

        this.opLabel2 = document.createElement("div");
        this.opLabel2.style.fontSize = "x-small";
        this.setupLabel(this.opLabel2, "2", 65, 174);

        this.muxLabel = document.createElement("div");
        this.setupLabel(this.muxLabel, "DEMUX", 25, 88);

        this.digitSwitch = document.createElement("div");
        this.setupControlSwitch(this.digitSwitch, "componentButton", this.arrowDown, 23, 22.5, () => {
            if(this.digitSwitchState.get() === 0) {
                this.digitSwitchState.set(1);
            } else {
                this.digitSwitchState.set(0);
            }
        }, false);
        let length = this.arrowDownSize;
        this.digitSwitch.style.width = `${length}px`;
        this.digitSwitch.style.height = `${length}px`;
        this.digitSwitchState = state(0);
        this.controlStates.push(this.digitSwitchState);
        this.digitSwitchState.subscribe(() => {
            let length;
            if(this.digitSwitchState.get() === 0) {
                this.digitSwitch.innerHTML = this.arrowDown;
                length = this.arrowDownSize;
            } else {
                this.digitSwitch.innerHTML = this.arrowUp;
                length = this.arrowUpSize;
            }
            this.digitSwitch.style.width = `${length}px`;
            this.digitSwitch.style.height = `${length}px`;
        });

        this.opSwitch = document.createElement("div");
        this.setupControlSwitch(this.opSwitch, "componentButton", this.arrowRight, 23, 145, () => {
            if(this.opSwitchState.get() === 0) {
                this.opSwitchState.set(1);
            } else {
                this.opSwitchState.set(0);
            }
        }, false);
        length = this.arrowRightSize;
        this.opSwitch.style.width = `${length}px`;
        this.opSwitch.style.height = `${length}px`;
        this.opSwitchState = state(0);
        this.controlStates.push(this.opSwitchState);
        this.opSwitchState.subscribe(() => {
            let length;
            if(this.opSwitchState.get() === 0) {
                this.opSwitch.innerHTML = this.arrowRight;
                length = this.arrowRightSize;
            } else {
                this.opSwitch.innerHTML = this.arrowLeft;
                length = this.arrowLeftSize;
            }
            this.opSwitch.style.width = `${length}px`;
            this.opSwitch.style.height = `${length}px`;
        });

        this.aNode.logicState = stateExpression(
            () => this.componentLogic(this.aNode.nodeNumber, this.inState, this.opStateA, this.opStateB, this.opStateC, this.digitSwitchState, this.opSwitchState), 
            this.aNode.nodeNumber,
            this.inState,
            this.opStateA,
            this.opStateB,
            this.opStateC,
            this.digitSwitchState,
            this.opSwitchState
        );
        this.aNode.logicState.subscribe(() => this.aNode.onLogicStateChange());

        this.bNode.logicState = stateExpression(
            () => this.componentLogic(this.bNode.nodeNumber, this.inState, this.opStateA, this.opStateB, this.opStateC, this.digitSwitchState, this.opSwitchState), 
            this.bNode.nodeNumber,
            this.inState,
            this.opStateA,
            this.opStateB,
            this.opStateC,
            this.digitSwitchState,
            this.opSwitchState
        );
        this.bNode.logicState.subscribe(() => this.bNode.onLogicStateChange());

        this.cNode.logicState = stateExpression(
            () => this.componentLogic(this.cNode.nodeNumber, this.inState, this.opStateA, this.opStateB, this.opStateC, this.digitSwitchState, this.opSwitchState), 
            this.cNode.nodeNumber,
            this.inState,
            this.opStateA,
            this.opStateB,
            this.opStateC,
            this.digitSwitchState,
            this.opSwitchState
        );
        this.cNode.logicState.subscribe(() => this.cNode.onLogicStateChange());

        this.dNode.logicState = stateExpression(
            () => this.componentLogic(this.dNode.nodeNumber, this.inState, this.opStateA, this.opStateB, this.opStateC, this.digitSwitchState, this.opSwitchState), 
            this.dNode.nodeNumber,
            this.inState,
            this.opStateA,
            this.opStateB,
            this.opStateC,
            this.digitSwitchState,
            this.opSwitchState
        );
        this.dNode.logicState.subscribe(() => this.dNode.onLogicStateChange());

        this.eNode.logicState = stateExpression(
            () => this.componentLogic(this.eNode.nodeNumber, this.inState, this.opStateA, this.opStateB, this.opStateC, this.digitSwitchState, this.opSwitchState), 
            this.eNode.nodeNumber,
            this.inState,
            this.opStateA,
            this.opStateB,
            this.opStateC,
            this.digitSwitchState,
            this.opSwitchState
        );
        this.eNode.logicState.subscribe(() => this.eNode.onLogicStateChange());

        this.fNode.logicState = stateExpression(
            () => this.componentLogic(this.fNode.nodeNumber, this.inState, this.opStateA, this.opStateB, this.opStateC, this.digitSwitchState, this.opSwitchState), 
            this.fNode.nodeNumber,
            this.inState,
            this.opStateA,
            this.opStateB,
            this.opStateC,
            this.digitSwitchState,
            this.opSwitchState
        );
        this.fNode.logicState.subscribe(() => this.fNode.onLogicStateChange());

        this.gNode.logicState = stateExpression(
            () => this.componentLogic(this.gNode.nodeNumber, this.inState, this.opStateA, this.opStateB, this.opStateC, this.digitSwitchState, this.opSwitchState), 
            this.gNode.nodeNumber,
            this.inState,
            this.opStateA,
            this.opStateB,
            this.opStateC,
            this.digitSwitchState,
            this.opSwitchState
        );
        this.gNode.logicState.subscribe(() => this.gNode.onLogicStateChange());

        this.hNode.logicState = stateExpression(
            () => this.componentLogic(this.hNode.nodeNumber, this.inState, this.opStateA, this.opStateB, this.opStateC, this.digitSwitchState, this.opSwitchState), 
            this.hNode.nodeNumber,
            this.inState,
            this.opStateA,
            this.opStateB,
            this.opStateC,
            this.digitSwitchState,
            this.opSwitchState
        );
        this.hNode.logicState.subscribe(() => this.hNode.onLogicStateChange());

        this.setupOutputState();
        this.setNodeComponentId(this.id);
    }

    componentLogic(nodeNumber, inState, opStateA, opStateB, opStateC, digitSwitchState, opSwitchState) {
        const value = inState.get();
        const digitState = digitSwitchState.get();
        const opState = opSwitchState.get();

        const op0 = opStateA.get();
        const op1 = opStateB.get();
        const op2 = opStateC.get();
        let number;
        if(opState === 0) {
            number = op0 + op1 * 2 + op2 * 4;

            this.opLabel0.innerHTML = "0";
            this.opLabel1.innerHTML = "1";
            this.opLabel2.innerHTML = "2";
        } else {
            number = op2 + op1 * 2 + op0 * 4;

            this.opLabel0.innerHTML = "2";
            this.opLabel1.innerHTML = "1";
            this.opLabel2.innerHTML = "0";
        }

        if(digitState === 0) {
            this.digitLabel0.innerHTML = "0";
            this.digitLabel1.innerHTML = "1";
            this.digitLabel2.innerHTML = "2";
            this.digitLabel3.innerHTML = "3";
            this.digitLabel4.innerHTML = "4";
            this.digitLabel5.innerHTML = "5";
            this.digitLabel6.innerHTML = "6";
            this.digitLabel7.innerHTML = "7";

            if(number === nodeNumber.get()) return value;
            else return 0;
        } else {
            this.digitLabel0.innerHTML = "7";
            this.digitLabel1.innerHTML = "6";
            this.digitLabel2.innerHTML = "5";
            this.digitLabel3.innerHTML = "4";
            this.digitLabel4.innerHTML = "3";
            this.digitLabel5.innerHTML = "2";
            this.digitLabel6.innerHTML = "1";
            this.digitLabel7.innerHTML = "0";

            let currentNodeNumber;
            switch(nodeNumber.get()) {
                case 0: {
                    currentNodeNumber = 7;

                    break;
                } case 1: {
                    currentNodeNumber = 6;

                    break;
                } case 2: {
                    currentNodeNumber = 5;

                    break;
                } case 3: {
                    currentNodeNumber = 4;

                    break;
                } case 4: {
                    currentNodeNumber = 3;

                    break;
                } case 5: {
                    currentNodeNumber = 2;

                    break;
                } case 6: {
                    currentNodeNumber = 1;

                    break;
                } case 7: {
                    currentNodeNumber = 0;

                    break;
                }
            }

            if(number === currentNodeNumber) return value;
            else return 0;
        }
    }
}
import { Component } from "../Component";
import { state, stateExpression } from "../../../State/state";

import imgSVG from "/1to4DEMUX.svg?raw";


export class OneToFourDEMUX extends Component {
    constructor(world, componentType, idNum, x, y, width, height, nodeManager) {
        super(world, componentType, idNum, x, y, width, height);

        this.aNode;
        this.bNode;
        this.cNode;
        this.dNode;

        this.opNodeA;
        this.opNodeB;

        this.inNode;

        this.opStateA;
        this.opStateB;

        this.inState;

        this.digitLabel0;
        this.digitLabel1;
        this.digitLabel2;
        this.digitLabel3;

        this.opLabel0;
        this.opLabel1;

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

        this.opNodeA = nodeManager.createOutputNode(38, 125, 0, 0, true);
        this.nodes.push(this.opNodeA);
        this.opStateA = this.opNodeA.logicState;

        this.opNodeB = nodeManager.createOutputNode(57, 125, 0, 0, true);
        this.nodes.push(this.opNodeB);
        this.opStateB = this.opNodeB.logicState;

        this.inNode = nodeManager.createOutputNode(0, 56.5, 0, 0, true);
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

        this.opLabel0 = document.createElement("div");
        this.opLabel0.style.fontSize = "x-small";
        this.setupLabel(this.opLabel0, "0", 36.5, 88);

        this.opLabel1 = document.createElement("div");
        this.opLabel1.style.fontSize = "x-small";
        this.setupLabel(this.opLabel1, "1", 55, 95);

        this.muxLabel = document.createElement("div");
        this.setupLabel(this.muxLabel, "DEMUX", 25, 52.5);

        this.digitSwitch = document.createElement("div");
        this.setupControlSwitch(this.digitSwitch, this.arrowDown, 23, 22.5, () => {
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
        this.setupControlSwitch(this.opSwitch, this.arrowRight, 23, 75, () => {
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
            () => this.componentLogic(this.aNode.nodeNumber, this.inState, this.opStateA, this.opStateB, this.digitSwitchState, this.opSwitchState), 
            this.aNode.nodeNumber,
            this.inState,
            this.opStateA,
            this.opStateB,
            this.digitSwitchState,
            this.opSwitchState
        );
        this.aNode.logicState.subscribe(() => this.aNode.onLogicStateChange());

        this.bNode.logicState = stateExpression(
            () => this.componentLogic(this.bNode.nodeNumber, this.inState, this.opStateA, this.opStateB, this.digitSwitchState, this.opSwitchState), 
            this.bNode.nodeNumber,
            this.inState,
            this.opStateA,
            this.opStateB,
            this.digitSwitchState,
            this.opSwitchState
        );
        this.bNode.logicState.subscribe(() => this.bNode.onLogicStateChange());

        this.cNode.logicState = stateExpression(
            () => this.componentLogic(this.cNode.nodeNumber, this.inState, this.opStateA, this.opStateB, this.digitSwitchState, this.opSwitchState), 
            this.cNode.nodeNumber,
            this.inState,
            this.opStateA,
            this.opStateB,
            this.digitSwitchState,
            this.opSwitchState
        );
        this.cNode.logicState.subscribe(() => this.cNode.onLogicStateChange());

        this.dNode.logicState = stateExpression(
            () => this.componentLogic(this.dNode.nodeNumber, this.inState, this.opStateA, this.opStateB, this.digitSwitchState, this.opSwitchState), 
            this.dNode.nodeNumber,
            this.inState,
            this.opStateA,
            this.opStateB,
            this.digitSwitchState,
            this.opSwitchState
        );
        this.dNode.logicState.subscribe(() => this.dNode.onLogicStateChange());

        this.setupOutputState();
        this.setNodeComponentId(this.id);
    }

    componentLogic(nodeNumber, inState, opStateA, opStateB, digitSwitchState, opSwitchState) {
        const value = inState.get();
        const digitState = digitSwitchState.get();
        const opState = opSwitchState.get();

        const op0 = opStateA.get();
        const op1 = opStateB.get();
        let number;
        if(opState === 0) {
            number = op0 + op1 * 2;

            this.opLabel0.innerHTML = "0";
            this.opLabel1.innerHTML = "1";
        } else {
            number = op1 + op0 * 2;

            this.opLabel0.innerHTML = "1";
            this.opLabel1.innerHTML = "0";
        }

        if(digitState === 0) {
            this.digitLabel0.innerHTML = "0";
            this.digitLabel1.innerHTML = "1";
            this.digitLabel2.innerHTML = "2";
            this.digitLabel3.innerHTML = "3";

            if(number === nodeNumber.get()) return value;
            else return 0;
        } else {
            this.digitLabel0.innerHTML = "3";
            this.digitLabel1.innerHTML = "2";
            this.digitLabel2.innerHTML = "1";
            this.digitLabel3.innerHTML = "0";

            let currentNodeNumber;
            switch(nodeNumber.get()) {
                case 0: {
                    currentNodeNumber = 3;

                    break;
                } case 1: {
                    currentNodeNumber = 2;

                    break;
                } case 2: {
                    currentNodeNumber = 1;

                    break;
                } case 3: {
                    currentNodeNumber = 0;

                    break;
                } 
            }

            if(number === currentNodeNumber) return value;
            else return 0;
        }
    }
}
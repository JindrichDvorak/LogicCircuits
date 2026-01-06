import { Component } from "../Component";
import { state, stateExpression } from "../../../State/state";

import imgSVG from "/4to1MUX.svg?raw";


export class FourToOneMUX extends Component {
    constructor(world, componentType, idNum, x, y, width, height, nodeManager) {
        super(world, componentType, idNum, x, y, width, height);

        this.aNode;
        this.bNode;
        this.cNode;
        this.dNode;

        this.opNodeA;
        this.opNodeB;

        this.outNode;

        this.aState;
        this.bState;
        this.cState;
        this.dState;

        this.opStateA;
        this.opStateB;

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
        this.aNode = nodeManager.createOutputNode(0, 28.1, 0, 0, true);
        this.nodes.push(this.aNode);
        this.aState = this.aNode.logicState;

        this.bNode = nodeManager.createOutputNode(0, 47, 0, 0, true);
        this.nodes.push(this.bNode);
        this.bState = this.bNode.logicState;

        this.cNode = nodeManager.createOutputNode(0, 65.75, 0, 0, true);
        this.nodes.push(this.cNode);
        this.cState = this.cNode.logicState;

        this.dNode = nodeManager.createOutputNode(0, 84.75, 0, 0, true);
        this.nodes.push(this.dNode);
        this.dState = this.dNode.logicState;

        this.opNodeA = nodeManager.createOutputNode(38, 125, 0, 0, true);
        this.nodes.push(this.opNodeA);
        this.opStateA = this.opNodeA.logicState;

        this.opNodeB = nodeManager.createOutputNode(57, 125, 0, 0, true);
        this.nodes.push(this.opNodeB);
        this.opStateB = this.opNodeB.logicState;

        this.outNode = nodeManager.createInputNode(97, 56.5, 0, 0, true);
        this.nodes.push(this.outNode);

        this.digitLabel0 = document.createElement("div");
        this.digitLabel0.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel0, "0", 25, 22.5);

        this.digitLabel1 = document.createElement("div");
        this.digitLabel1.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel1, "1", 25, 41.5);

        this.digitLabel2 = document.createElement("div");
        this.digitLabel2.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel2, "2", 25, 61);

        this.digitLabel3 = document.createElement("div");
        this.digitLabel3.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel3, "3", 25, 78.5);

        this.opLabel0 = document.createElement("div");
        this.opLabel0.style.fontSize = "x-small";
        this.setupLabel(this.opLabel0, "0", 36.5, 95);

        this.opLabel1 = document.createElement("div");
        this.opLabel1.style.fontSize = "x-small";
        this.setupLabel(this.opLabel1, "1", 55, 88);

        this.muxLabel = document.createElement("div");
        this.setupLabel(this.muxLabel, "MUX", 40, 51);

        this.digitSwitch = document.createElement("div");
        this.setupControlSwitch(this.digitSwitch, "componentButton", this.arrowDown, 60, 22, () => {
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
        this.setupControlSwitch(this.opSwitch, "componentButton", this.arrowRight, 60, 75, () => {
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

        this.outNode.logicState = stateExpression(
            () => this.componentLogic(this.aState, this.bState, this.cState, this.dState, 
                this.opStateA, this.opStateB, this.digitSwitchState, this.opSwitchState), 
            this.aState,
            this.bState,
            this.cState,
            this.dState,
            this.opStateA,
            this.opStateB,
            this.digitSwitchState,
            this.opSwitchState
        );
        this.outNode.logicState.subscribe(() => this.outNode.onLogicStateChange());

        this.setupOutputState();
        this.setNodeComponentId(this.id);
    }

    componentLogic(aState, bState, cState, dState, opStateA, opStateB, digitSwitchState, opSwitchState) {

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
        } else {
            this.digitLabel0.innerHTML = "3";
            this.digitLabel1.innerHTML = "2";
            this.digitLabel2.innerHTML = "1";
            this.digitLabel3.innerHTML = "0";
        }

        const a0 = aState.get();
        const a1 = bState.get();
        const a2 = cState.get();
        const a3 = dState.get();
        switch(number) {
            case 0: {
                if(digitState === 0) return a0;
                else return a3;
            } case 1: {
                if(digitState === 0) return a1;
                else return a2;
            } case 2: {
                if(digitState === 0) return a2;
                else return a1;
            } case 3: {
                if(digitState === 0) return a3;
                else return a0;
            }
        }
    }
}
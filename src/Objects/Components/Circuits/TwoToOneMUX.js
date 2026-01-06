import { Component } from "../Component";
import { state, stateExpression } from "../../../State/state";

import imgSVG from "/2to1MUX.svg?raw";


export class TwoToOneMUX extends Component {
    constructor(world, componentType, idNum, x, y, width, height, nodeManager) {
        super(world, componentType, idNum, x, y, width, height);

        this.aNode;
        this.bNode;

        this.opNodeA;

        this.outNode;

        this.aState;
        this.bState;

        this.opStateA;

        this.digitLabel0;
        this.digitLabel1;

        this.opLabel0;

        this.muxLabel;

        this.digitSwitch;

        this.digitSwitchState;

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
        this.aNode = nodeManager.createOutputNode(0, 19.5, 0, 0, true);
        this.nodes.push(this.aNode);
        this.aState = this.aNode.logicState;

        this.bNode = nodeManager.createOutputNode(0, 57, 0, 0, true);
        this.nodes.push(this.bNode);
        this.bState = this.bNode.logicState;

        this.opNodeA = nodeManager.createOutputNode(42.5, 87, 0, 0, true);
        this.nodes.push(this.opNodeA);
        this.opStateA = this.opNodeA.logicState;

        this.outNode = nodeManager.createInputNode(87, 38.25, 0, 0, true);
        this.nodes.push(this.outNode);

        this.digitLabel0 = document.createElement("div");
        this.digitLabel0.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel0, "0", 23, 14);

        this.digitLabel1 = document.createElement("div");
        this.digitLabel1.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel1, "1", 23, 52);

        //this.opLabel0 = document.createElement("div");
        //this.opLabel0.style.fontSize = "x-small";
        //this.setupLabel(this.opLabel0, "0", 41, 55);

        this.muxLabel = document.createElement("div");
        this.setupLabel(this.muxLabel, "MUX", 32, 33.5);

        this.digitSwitch = document.createElement("div");
        this.setupControlSwitch(this.digitSwitch, "componentButton", this.arrowDown, 51.5, 20.75, () => {
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

        this.outNode.logicState = stateExpression(
            () => this.componentLogic(this.aState, this.bState, this.opStateA, this.digitSwitchState), 
            this.aState,
            this.bState,
            this.opStateA,
            this.digitSwitchState
        );
        this.outNode.logicState.subscribe(() => this.outNode.onLogicStateChange());

        this.setupOutputState();
        this.setNodeComponentId(this.id);
    }

    componentLogic(aState, bState, opStateA, digitSwitchState) {
        const op0 = opStateA.get();
        const digitState = digitSwitchState.get();
        
        if(digitState === 0) {
            this.digitLabel0.innerHTML = "0";
            this.digitLabel1.innerHTML = "1";
        } else {
            this.digitLabel0.innerHTML = "1";
            this.digitLabel1.innerHTML = "0";
        }

        const a0 = aState.get();
        const a1 = bState.get();
        switch(op0) {
            case 0: {
                if(digitState === 0) return a0;
                else return a1;
            } case 1: {
                if(digitState === 0) return a1;
                else return a0;
            }
        }
    }
}
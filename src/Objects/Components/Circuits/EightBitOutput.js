import { Component } from "../Component";
import { state, stateExpression } from "../../../State/state";

import imgSVG from "/8bitIO.svg?raw";


export class EightBitOutput extends Component {
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
        this.numberSwitchNode

        this.aState;
        this.bState;
        this.cState;
        this.dState;
        this.eState;
        this.fState;
        this.gState;
        this.hState;
        this.numberState;

        this.numberLabel;
        this.digitLabel0;
        this.digitLabel1;
        this.digitLabel2;
        this.digitLabel3;
        this.digitLabel4;
        this.digitLabel5;
        this.digitLabel6;
        this.digitLabel7;

        // TODO: There is no need for numberSwitch to be a button, make it into a label:
        this.numberSwitch;
        this.digitSwitch;

        this.numberSwitchState;
        this.digitSwitchState;

        // TODO: Should be moved into a global static class:
        // * Control switch labels:
        this.naturalNumbers = "<span>\u{02115}<sub>0</sub></span>";
        this.wholeNumbers = "<span>\u{02124}</span>";
        this.naturalNumbersSize = this.calculateControlSwitchSize(this.naturalNumbers);
        this.wholeNumbersSize = this.calculateControlSwitchSize(this.wholeNumbers);

        this.arrowDown = "<span>\u{2193}</span>";
        this.arrowUp = "<span>\u{2191}</span>";
        this.arrowDownSize  = this.calculateControlSwitchSize(this.arrowDown);
        this.arrowUpSize  = this.calculateControlSwitchSize(this.arrowUp);

        this.createComponent(nodeManager);
    }

    createComponent(nodeManager) {
        const img = imgSVG.replace("<svg", `<svg width="${this.size.width}px"`);
        this.element.innerHTML = img;

        // TODO: This needs to be size invariant --> remove and replace:
        this.aNode = nodeManager.createOutputNode(70, 9.25, 0, 0, true);
        this.nodes.push(this.aNode);
        this.aState = this.aNode.logicState;

        this.bNode = nodeManager.createOutputNode(70, 28, 0, 0, true);
        this.nodes.push(this.bNode);
        this.bState = this.bNode.logicState;

        this.cNode = nodeManager.createOutputNode(70, 47.25, 0, 0, true);
        this.nodes.push(this.cNode);
        this.cState = this.cNode.logicState;

        this.dNode = nodeManager.createOutputNode(70, 66, 0, 0, true);
        this.nodes.push(this.dNode);
        this.dState = this.dNode.logicState;

        this.eNode = nodeManager.createOutputNode(70, 84.75, 0, 0, true);
        this.nodes.push(this.eNode);
        this.eState = this.eNode.logicState;

        this.fNode = nodeManager.createOutputNode(70, 103.75, 0, 0, true);
        this.nodes.push(this.fNode);
        this.fState = this.fNode.logicState;

        this.gNode = nodeManager.createOutputNode(70, 122.5, 0, 0, true);
        this.nodes.push(this.gNode);
        this.gState = this.gNode.logicState;

        this.hNode = nodeManager.createOutputNode(70, 141.5, 0, 0, true);
        this.nodes.push(this.hNode);
        this.hState = this.hNode.logicState;

        this.numberSwitchNode = nodeManager.createOutputNode(28, 0, 0, 0, true);
        this.nodes.push(this.numberSwitchNode);
        this.numberSwitchState = this.numberSwitchNode.logicState;

        this.numberLabel = document.createElement("div");
        this.numberLabel.style.fontFamily = "monospace";
        this.setupLabel(this.numberLabel, "0", 21.75, 68);

        this.digitLabel0 = document.createElement("div");
        this.digitLabel0.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel0, "7", 40, 4.5);

        this.digitLabel1 = document.createElement("div");
        this.digitLabel1.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel1, "6", 40, 22.5);

        this.digitLabel2 = document.createElement("div");
        this.digitLabel2.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel2, "5", 40, 41.5);

        this.digitLabel3 = document.createElement("div");
        this.digitLabel3.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel3, "4", 40, 61);

        this.digitLabel4 = document.createElement("div");
        this.digitLabel4.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel4, "3", 40, 78.5);

        this.digitLabel5 = document.createElement("div");
        this.digitLabel5.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel5, "2", 40, 99);

        this.digitLabel6 = document.createElement("div");
        this.digitLabel6.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel6, "1", 40, 118);

        this.digitLabel7 = document.createElement("div");
        this.digitLabel7.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel7, "0", 40, 136);

        this.numberSwitch = document.createElement("div");
        this.setupControlSwitch(this.numberSwitch, this.naturalNumbers, 4, 3, () => {
            if(this.numberSwitchState.get() === 1) {
                this.numberSwitchState.set(-1);
            } else {
                this.numberSwitchState.set(1);
            }
        });
        let length = this.naturalNumbersSize;
        this.numberSwitch.style.width = `${length}px`;
        this.numberSwitch.style.height = `${length}px`;
        this.numberSwitchState.subscribe(() => {
            let length;
            if(this.numberSwitchState.get() === 0) {
                this.numberSwitch.innerHTML = this.naturalNumbers;
                length = this.naturalNumbersSize;
            } else {
                this.numberSwitch.innerHTML = this.wholeNumbers;
                length = this.wholeNumbersSize;
            }
            this.numberSwitch.style.width = `${length}px`;
            this.numberSwitch.style.height = `${length}px`;
        });

        this.digitSwitch = document.createElement("div");
        this.setupControlSwitch(this.digitSwitch, this.arrowUp, 4, 132, () => {
            if(this.digitSwitchState.get() === 0) {
                this.digitSwitchState.set(1);
            } else {
                this.digitSwitchState.set(0);
            }
        }, false);
        length = this.arrowUpSize;
        this.digitSwitch.style.width = `${length}px`;
        this.digitSwitch.style.height = `${length}px`;
        this.digitSwitchState = state(1);
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

        this.numberState = stateExpression(
            () => this.componentLogic(this.aState, this.bState, this.cState, this.dState, this.eState, this.fState, this.gState, this.hState, this.numberSwitchState, this.digitSwitchState), 
            this.aState,
            this.bState,
            this.cState,
            this.dState,
            this.eState,
            this.fState,
            this.gState,
            this.hState,
            this.numberSwitchState,
            this.digitSwitchState
        );

        this.setupOutputState();
        this.setNodeComponentId(this.id);
    }

    componentLogic(aState, bState, cState, dState, eState, fState, gState, hState, numberSwitchState, digitSwitchState) {
        const a0 = aState.get();
        const a1 = bState.get();
        const a2 = cState.get();
        const a3 = dState.get();
        const a4 = eState.get();
        const a5 = fState.get();
        const a6 = gState.get();
        const a7 = hState.get();

        let sign;
        if(numberSwitchState.get() === 0) sign = 1;
        else sign = -1;

        let number;
        if(digitSwitchState.get() === 0) {
            number = a0 + a1 * 2 + a2 * 4 + a3 * 8 + a4 * 16 + a5 * 32 + a6 * 64 + sign * a7 * 128;
            
            this.digitLabel0.innerHTML = "0";
            this.digitLabel1.innerHTML = "1";
            this.digitLabel2.innerHTML = "2";
            this.digitLabel3.innerHTML = "3";
            this.digitLabel4.innerHTML = "4";
            this.digitLabel5.innerHTML = "5";
            this.digitLabel6.innerHTML = "6";
            this.digitLabel7.innerHTML = "7";
        } else {
            number = a7 + a6 * 2 + a5 * 4 + a4 * 8 + a3 * 16 + a2 * 32 + a1 * 64 + sign * a0 * 128;

            this.digitLabel0.innerHTML = "7";
            this.digitLabel1.innerHTML = "6";
            this.digitLabel2.innerHTML = "5";
            this.digitLabel3.innerHTML = "4";
            this.digitLabel4.innerHTML = "3";
            this.digitLabel5.innerHTML = "2";
            this.digitLabel6.innerHTML = "1";
            this.digitLabel7.innerHTML = "0";
        }

        this.numberLabel.innerHTML = `${number}`;
        if(number >= 0) {
            if(number < 10) {
                this.numberLabel.style.left = `${21.75}px`;
                this.numberLabel.style.top = `${68}px`;
            } else if(number < 100) {
                this.numberLabel.style.left = `${18.75}px`;
                this.numberLabel.style.top = `${68}px`;
            } else {
                this.numberLabel.style.left = `${15}px`;
                this.numberLabel.style.top = `${68}px`;
            }
        } else {
            if(number > -10) {
                this.numberLabel.style.left = `${18.75}px`;
                this.numberLabel.style.top = `${68}px`;
            } if(number > -100) {
                this.numberLabel.style.left = `${15}px`;
                this.numberLabel.style.top = `${68}px`;
            } else {
                this.numberLabel.style.left = `${8}px`;
                this.numberLabel.style.top = `${68}px`;
            }
        }
    }
}
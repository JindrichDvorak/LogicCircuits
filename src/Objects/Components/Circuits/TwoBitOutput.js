import { Component } from "../Component";
import { state, stateExpression } from "../../../State/state";

import imgSVG from "/2bitIO.svg?raw";


export class TwoBitOutput extends Component {
    constructor(world, componentType, idNum, x, y, width, height, nodeManager) {
        super(world, componentType, idNum, x, y, width, height);

        this.aNode;
        this.bNode;
        this.numberSwitchNode;

        this.aState;
        this.bState;
        this.numberState;

        this.numberLabel;
        this.digitLabel0;
        this.digitLabel1;

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

        this.ioComponent = true;

        // TODO: This needs to be size invariant --> remove and replace:
        this.aNode = nodeManager.createOutputNode(70, 18.75, 0, 0, true);
        this.nodes.push(this.aNode);
        this.aState = this.aNode.logicState;
        this.aNode.isManualNode = true;

        this.bNode = nodeManager.createOutputNode(70, 56.5, 0, 0, true);
        this.nodes.push(this.bNode);
        this.bState = this.bNode.logicState;
        this.bNode.isManualNode = true;

        this.numberSwitchNode = nodeManager.createOutputNode(28, 0, 0, 0, true);
        this.nodes.push(this.numberSwitchNode);
        this.numberSwitchState = this.numberSwitchNode.logicState;
        this.numberSwitchNode.isManualNode = true;

        this.numberLabel = document.createElement("div");
        this.numberLabel.style.fontFamily = "monospace";
        this.numberLabel.style.fontSize = "medium";
        this.setupLabel(this.numberLabel, "0", 21.75, 68);

        this.digitLabel0 = document.createElement("div");
        this.digitLabel0.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel0, "1", 40, 13);

        this.digitLabel1 = document.createElement("div");
        this.digitLabel1.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel1, "0", 40, 51);

        this.numberSwitch = document.createElement("div");
        this.setupControlSwitch(this.numberSwitch, "lockedComponentButton", this.naturalNumbers, 4, 3.5, () => {});
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
        this.setupControlSwitch(this.digitSwitch, "componentButton", this.arrowUp, 4, 60.5, () => {
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
            () => this.componentLogic(this.aState, this.bState, this.numberSwitchState, this.digitSwitchState), 
            this.aState,
            this.bState,
            this.numberSwitchState,
            this.digitSwitchState
        );

        this.setupOutputState();
        this.setNodeComponentId(this.id);
    }

    componentLogic(aState, bState, numberSwitchState, digitSwitchState) {
        const a0 = aState.get();
        const a1 = bState.get();

        let sign;
        if(numberSwitchState.get() === 0) sign = 1;
        else sign = -1;

        let number;
        if(digitSwitchState.get() === 0) {
            number = a0 + sign * a1 * 2;
            
            this.digitLabel0.innerHTML = "0";
            this.digitLabel1.innerHTML = "1";
        } else {
            number = a1 + sign * a0 * 2;

            this.digitLabel0.innerHTML = "1";
            this.digitLabel1.innerHTML = "0";
        }

        this.numberLabel.innerHTML = `${number}`;
        if(number >= 0) {
            if(number < 10) {
                this.numberLabel.style.left = `${21.75}px`;
                this.numberLabel.style.top = `${30}px`;
            } else if(number < 100) {
                this.numberLabel.style.left = `${18.75}px`;
                this.numberLabel.style.top = `${30}px`;
            } else {
                this.numberLabel.style.left = `${15}px`;
                this.numberLabel.style.top = `${30}px`;
            }
        } else {
            if(number > -10) {
                this.numberLabel.style.left = `${18.75}px`;
                this.numberLabel.style.top = `${30}px`;
            } if(number > -100) {
                this.numberLabel.style.left = `${15}px`;
                this.numberLabel.style.top = `${30}px`;
            } else {
                this.numberLabel.style.left = `${8}px`;
                this.numberLabel.style.top = `${30}px`;
            }
        }
    }
}
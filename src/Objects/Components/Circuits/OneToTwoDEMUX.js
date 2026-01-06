import { Component } from "../Component";
import { state, stateExpression } from "../../../State/state";

import imgSVG from "/1to2DEMUX.svg?raw";


export class OneToTwoDEMUX extends Component {
    constructor(world, componentType, idNum, x, y, width, height, nodeManager) {
        super(world, componentType, idNum, x, y, width, height);

        this.aNode;
        this.bNode;

        this.opNodeA;

        this.inNode;

        this.opStateA;

        this.inState;

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
        this.aNode = nodeManager.createInputNode(87, 19.5, 0, 0, true);
        this.nodes.push(this.aNode);
        this.aNode.nodeNumber.set(0);

        this.bNode = nodeManager.createInputNode(87, 57, 0, 0, true);
        this.nodes.push(this.bNode);
        this.bNode.nodeNumber.set(1);

        this.opNodeA = nodeManager.createOutputNode(42.5, 87, 0, 0, true);
        this.nodes.push(this.opNodeA);
        this.opStateA = this.opNodeA.logicState;

        this.inNode = nodeManager.createOutputNode(0, 38.25, 0, 0, true);
        this.nodes.push(this.inNode);
        this.inState = this.inNode.logicState;

        this.digitLabel0 = document.createElement("div");
        this.digitLabel0.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel0, "0", 59, 14);

        this.digitLabel1 = document.createElement("div");
        this.digitLabel1.style.fontSize = "x-small";
        this.setupLabel(this.digitLabel1, "1", 58, 52);

        //this.opLabel0 = document.createElement("div");
        //this.opLabel0.style.fontSize = "x-small";
        //this.setupLabel(this.opLabel0, "0", 41, 55);

        this.muxLabel = document.createElement("div");
        this.setupLabel(this.muxLabel, "DEMUX", 22.5, 33.5);

        this.digitSwitch = document.createElement("div");
        this.setupControlSwitch(this.digitSwitch, "componentButton", this.arrowDown, 22, 20.5, () => {
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

        this.aNode.logicState = stateExpression(
            () => this.componentLogic(this.aNode.nodeNumber, this.inState, this.opStateA, this.digitSwitchState), 
            this.aNode.nodeNumber,
            this.inState,
            this.opStateA, 
            this.digitSwitchState
        );
        this.aNode.logicState.subscribe(() => this.aNode.onLogicStateChange());

        this.bNode.logicState = stateExpression(
            () => this.componentLogic(this.bNode.nodeNumber, this.inState, this.opStateA, this.digitSwitchState), 
            this.bNode.nodeNumber,
            this.inState,
            this.opStateA, 
            this.digitSwitchState
        );
        this.bNode.logicState.subscribe(() => this.bNode.onLogicStateChange());

        this.setupOutputState();
        this.setNodeComponentId(this.id);
    }

    componentLogic(nodeNumber, inState, opStateA, digitSwitchState) {
        const value = inState.get();
        const digitState = digitSwitchState.get();
        const op0 = opStateA.get();
        
        if(digitState === 0) {
            this.digitLabel0.innerHTML = "0";
            this.digitLabel1.innerHTML = "1";

            if(op0 === nodeNumber.get()) return value;
            else return 0;
        } else {
            this.digitLabel0.innerHTML = "1";
            this.digitLabel1.innerHTML = "0";

            let currentNodeNumber;
            switch(nodeNumber.get()) {
                case 0: {
                    currentNodeNumber = 1;

                    break;
                } case 1: {
                    currentNodeNumber = 0;

                    break;
                }
            }

            if(op0 === currentNodeNumber) return value;
            else return 0;
        }
    }
}
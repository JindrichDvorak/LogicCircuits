import { TextField } from "./TextField";
import { Ground } from "./BasicComponents/Ground";
import { Resistor } from "./BasicComponents/Resistor";
import { Transistor } from "./BasicComponents/Transistor";
import { NOTgate } from "./LogicGates/NOTgate";
import { BufferGate } from "./LogicGates/BufferGate";
import { ANDgate } from "./LogicGates/ANDgate";
import { NANDgate } from "./LogicGates/NANDgate";
import { ORgate } from "./LogicGates/ORgate";
import { NORgate } from "./LogicGates/NORgate";
import { XORgate } from "./LogicGates/XORgate";
import { NXORgate } from "./LogicGates/NXORgate";
import { HalfAdder } from "./Circuits/HalfAdder";
import { FullAdder } from "./Circuits/FullAdder";
import { ComponentType } from "./Component";
import { stateManager } from "../../State/StateManager";


/* TODO:
    ! Set width and height as variables.
*/
export class ComponentManager {
    constructor(world, nodeManager) {
        this.world = world;
        this.nodeManager = nodeManager;

        this.components = [];
        this.resistorCount = 0;
        this.groundCount = 0;
        this.transistorCount = 0;

        this.componentCounter = 0;
    }

    createTextField(x, y, mouseX, mouseY) {
        const component = new TextField(this.world, ComponentType.TEXT_FIELD, this.componentCounter, x - 35 / 2, y - 15 / 2, 35, 15);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createTransistor(x, y, mouseX, mouseY) {
        const component = new Transistor(this.world, ComponentType.TRANSISTOR, this.componentCounter, x - 100 / 2, y - 100 / 2, 100, 100, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;

        this.transistorCount++;
        stateManager.transistorPresent.set(true);
    }

    createResistor(x, y, mouseX, mouseY) {
        const component = new Resistor(this.world, ComponentType.RESISTOR, this.componentCounter, x - 20 / 2, y - 100 / 2, 20, 100, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;

        this.resistorCount++;
        stateManager.resistorPresent.set(true);
    }

    // TODO: Fix componentType:
    createGround(x, y, mouseX, mouseY) {
        const component = new Ground(this.world, ComponentType.GROUND, this.componentCounter, x - 60 / 2, y - 40 / 2, 60, 40, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;

        this.groundCount++;
        stateManager.groundPresent.set(true);
    }

    createBuffer(x, y, mouseX, mouseY) {
        const component = new BufferGate(this.world, ComponentType.GATE, this.componentCounter, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createNOT(x, y, mouseX, mouseY) {
        const component = new NOTgate(this.world, ComponentType.GATE, this.componentCounter, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createAND(x, y, mouseX, mouseY) {
        const component = new ANDgate(this.world, ComponentType.GATE, this.componentCounter, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createNAND(x, y, mouseX, mouseY) {
        const component = new NANDgate(this.world, ComponentType.GATE, this.componentCounter, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createOR(x, y, mouseX, mouseY) {
        const component = new ORgate(this.world, ComponentType.GATE, this.componentCounter, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createNOR(x, y, mouseX, mouseY) {
        const component = new NORgate(this.world, ComponentType.GATE, this.componentCounter, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createXOR(x, y, mouseX, mouseY) {
        const component = new XORgate(this.world, ComponentType.GATE, this.componentCounter, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createNXOR(x, y, mouseX, mouseY) {
        const component = new NXORgate(this.world, ComponentType.GATE, this.componentCounter, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createHalfAdder(x, y, mouseX, mouseY) {
        const component = new HalfAdder(this.world, ComponentType.CIRCUIT, this.componentCounter, x - 140 / 2, y - 80 / 2, 140, 80, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createFullAdder(x, y, mouseX, mouseY) {
        const component = new FullAdder(this.world, ComponentType.CIRCUIT, this.componentCounter, x - 140 / 2, y - 120 / 2, 140, 120, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    getComponentById(componentId) {
        let desirredComponent;
        this.components.forEach((component) => {
            if(component.id === componentId) {
                desirredComponent = component;
                return;
            }
        });
        return desirredComponent;
    }

    deleteComponent(component) {
        if(!component) return;

        // TODO: Find a more elegant solution:
        if(component.editable) return;

        component.nodes.forEach((node) => {
            this.nodeManager.deleteGeneralNode(node);
        });
        component.nodes = [];
        component.element.remove();

        if(component.componentType === ComponentType.RESISTOR) {
            this.resistorCount--;
            if(this.resistorCount === 0) 
                stateManager.resistorPresent.set(false);
        } else if(component.componentType === ComponentType.GROUND) {
            this.groundCount--;
            if(this.groundCount === 0) 
                stateManager.groundPresent.set(false);
        } else if(component.componentType === ComponentType.TRANSISTOR) {
            this.transistorCount--;
            if(this.transistorCount === 0) 
                stateManager.transistorPresent.set(false);
        }
        this.components.splice(this.components.indexOf(component), 1);
    }

    deleteComponentById(componentId) {
        const component = this.getComponentById(componentId);
        this.deleteComponent(component);
    }
}
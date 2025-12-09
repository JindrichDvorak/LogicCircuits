import { Ground } from "./BasicComponents/Ground";
import { ResistorDown } from "./BasicComponents/ResistorDown";
import { Transistor } from "./BasicComponents/Transistor";
import { NOTgate } from "./LogicGates/NOTgate";
import { BufferGate } from "./LogicGates/BufferGate";
import { ANDgate } from "./LogicGates/ANDgate";
import { NANDgate } from "./LogicGates/NANDgate";
import { ORgate } from "./LogicGates/ORgate";
import { NORgate } from "./LogicGates/NORgate";
import { XORgate } from "./LogicGates/XORgate";
import { NXORgate } from "./LogicGates/NXORgate";
import { ComponentType } from "./Component";


export class ComponentManager {
    constructor(world, nodeManager) {
        this.world = world;
        this.nodeManager = nodeManager;

        this.components = [];

        this.componentCounter = 0;
    }

    createTransistor(x, y, mouseX, mouseY) {
        const id = `${ComponentType.TRANSISTOR}-${this.componentCounter}`;
        // TODO: 
        //  * Add componentType into component constructor:
        //  ! Set width and height as variables:
        const component = new Transistor(this.world, id, x - 100 / 2, y - 100 / 2, 100, 100, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createResistor(x, y, mouseX, mouseY) {
        const id = `${ComponentType.RESISTOR}-${this.componentCounter}`;
        const component = new ResistorDown(this.world, id, x - 20 / 2, y - 100 / 2, 20, 100, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    // TODO: Fix componentType:
    createGround(x, y, mouseX, mouseY) {
        const id = `${ComponentType.RESISTOR}-${this.componentCounter}`;
        const component = new Ground(this.world, id, x - 60 / 2, y - 40 / 2, 60, 40, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createBuffer(x, y, mouseX, mouseY) {
        const id = `${ComponentType.RESISTOR}-${this.componentCounter}`;
        const component = new BufferGate(this.world, id, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createNOT(x, y, mouseX, mouseY) {
        const id = `${ComponentType.RESISTOR}-${this.componentCounter}`;
        const component = new NOTgate(this.world, id, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createAND(x, y, mouseX, mouseY) {
        const id = `${ComponentType.RESISTOR}-${this.componentCounter}`;
        const component = new ANDgate(this.world, id, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createNAND(x, y, mouseX, mouseY) {
        const id = `${ComponentType.RESISTOR}-${this.componentCounter}`;
        const component = new NANDgate(this.world, id, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createOR(x, y, mouseX, mouseY) {
        const id = `${ComponentType.RESISTOR}-${this.componentCounter}`;
        const component = new ORgate(this.world, id, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createNOR(x, y, mouseX, mouseY) {
        const id = `${ComponentType.RESISTOR}-${this.componentCounter}`;
        const component = new NORgate(this.world, id, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createXOR(x, y, mouseX, mouseY) {
        const id = `${ComponentType.RESISTOR}-${this.componentCounter}`;
        const component = new XORgate(this.world, id, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createNXOR(x, y, mouseX, mouseY) {
        const id = `${ComponentType.RESISTOR}-${this.componentCounter}`;
        const component = new NXORgate(this.world, id, x - 100 / 2, y - 60 / 2, 100, 60, this.nodeManager);
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

        component.nodes.forEach((node) => {
            this.nodeManager.deleteGeneralNode(node);
        });
        component.nodes = [];

        component.element.remove();
    }

    deleteComponentById(componentId) {
        const component = this.getComponentById(componentId);
        this.deleteComponent(component);
    }
}
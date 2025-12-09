import { ResistorDown } from "./BasicComponents/ResistorDown";
import { Transistor } from "./BasicComponents/Transistor";
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
        // TODO: Add componentType into component constructor:
        const component = new Transistor(this.world, id, x - 100 / 2, y - 100 / 2, 100, 100, this.nodeManager);
        component.lastMousePosition = { x: mouseX, y: mouseY };
        component.isDragging = true;

        this.components.push(component);
        this.componentCounter++;
    }

    createResistor(x, y, mouseX, mouseY) {
        const id = `${ComponentType.RESISTOR}-${this.componentCounter}`;
        // TODO: Add componentType into component constructor:
        const component = new ResistorDown(this.world, id, x - 20 / 2, y - 100 / 2, 20, 100, this.nodeManager);
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
import { stateManager, InteractionMode, WorldObject } from "./State/StateManager";

import { Camera } from "./Camera";
import { NodeManager } from "./Objects/Nodes/NodeManager";
import { ComponentManager } from "./Objects/Components/ComponentManager";

import { TextField } from "./Objects/TextField";


export class Application {
    constructor() {
        this.world = document.getElementById("world");
        this.scene = document.getElementById("scene");

        this.camera = new Camera(this.world, this.scene, 0, 0, 1);
        this.nodeManager = new NodeManager(this.world);
        this.componentManager = new ComponentManager(this.world, this.nodeManager);

        // TODO: Create a dedicated manager:
        this.textFieldCounter = 0;
        this.textFields = [];

        this.registerEvents();
    }

    // TODO: Move to manager:
    createTextField(x, y, mouseX, mouseY) {
        const id = `TextField-${this.textFieldCounter}`;
        const textField = new TextField(this.world, id, x - 30 / 2, y - 20 / 2, 30, 20);
        textField.lastMousePosition = { x: mouseX, y: mouseY };
        textField.isDragging = true;

        this.textFields.push(textField);
        this.textFieldCounter++;
    }

    registerEvents() {
        this.world.addEventListener("mousedown", (e) => this.onMouseDown(e));

        window.addEventListener("keydown", (e) => this.onKeyDown(e));

        // * Disable context menu:
        this.world.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    onMouseDown(e) {
        // ? Could this logic be moved to nodeManager?
        if(e.button === 0) {
            if(stateManager.interactionMode.get() === InteractionMode.CREATING_NODE) {
                const node = this.nodeManager.getNodeById(stateManager.currentNodeId.get());
                node.isDragging = false;
                stateManager.interactionMode.set(InteractionMode.NORMAL);
            } else if(stateManager.interactionMode.get() === InteractionMode.CONNECTING) {
                stateManager.lastNodeId.set(stateManager.currentNodeId.get());

                const coords = this.camera.screenToWorldCoords(e.clientX, e.clientY);
                this.nodeManager.createNode(coords.x, coords.y);
            } else {
                stateManager.setDefaultState();
            }
        } else if(e.button === 2) {
            stateManager.setDefaultState();
        }
    }

    onKeyDown(e) {
        if(e.key === "Delete") {
            const selectedWorldObject = stateManager.selectedWorldObject.get();
            if(selectedWorldObject.id === -1) return;

            switch(selectedWorldObject.type) {
                case WorldObject.NODE: {
                    const nodeId = selectedWorldObject.id;
                    this.nodeManager.deleteGeneralNodeById(nodeId);

                    break;
                } case WorldObject.COMPONENT: {
                    const componentId = selectedWorldObject.id;
                    this.componentManager.deleteComponentById(componentId);

                    break;
                }
            }

            stateManager.setDefaultState();
        }
    }
}
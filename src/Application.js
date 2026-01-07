import { stateManager, InteractionMode, WorldObject } from "./State/StateManager";

import { Camera } from "./Camera";
import { NodeManager } from "./Objects/Nodes/NodeManager";
import { ComponentManager } from "./Objects/Components/ComponentManager";
import { SaveManager } from "./SaveManager";


export class Application {
    constructor() {
        this.world = document.getElementById("world");
        this.scene = document.getElementById("scene");

        this.camera = new Camera(this.world, this.scene, 50000, 50000, 1);
        //this.camera = new Camera(this.world, this.scene, 0, 0, 1);
        this.nodeManager = new NodeManager(this.camera);
        this.componentManager = new ComponentManager(this.camera, this.nodeManager);

        this.saveManager = new SaveManager(this.camera, this.nodeManager, this.componentManager);

        this.showGrid = document.getElementById("showGrid");
        this.showGrid.addEventListener("click", () => this.toggleGrid());
        this.showGrid.checked = true;
        this.toggleGrid();
        
        stateManager.displayGrid = true;
        stateManager.displayGridFeedback.subscribe(() => {
            this.showGrid.checked = stateManager.displayGrid;
            this.toggleGrid();
        });

        this.lock = document.getElementById("lock");
        this.lock.addEventListener("click", () => this.toggleLock());
        this.lock.checked = false;
        this.toggleLock();

        stateManager.lockControls = false;
        stateManager.lockControlsFeedback.subscribe(() => {
            this.lock.checked = stateManager.lockControls;
            this.toggleLock();
        });

        this.createTempElement();

        this.registerEvents();
    }

    createTempElement() {
        const tempElement = document.createElement("span");
        tempElement.style.left = "0px";
        tempElement.style.top = "0px";
        tempElement.style.visibility = "hidden";
        tempElement.style.position = "absolute";
        tempElement.style.margin = "0";
        tempElement.style.padding = "0";
        tempElement.style.boxSizing = "border-box";
        tempElement.style.fontSize = "x-small";
        this.world.appendChild(tempElement);

        stateManager.tempElement = tempElement;
    }

    toggleGrid() {
        if(this.showGrid.checked) {
            this.world.classList.add("grid");
            stateManager.displayGrid = true;
        } else {
            this.world.classList.remove("grid");
            stateManager.displayGrid = false;
        }
    }

    toggleLock() {
        let value;
        if(this.lock.checked) {
            value = true;
        } else {
            value = false;
        }
        stateManager.lockControls = value;
        this.componentManager.lockComponentControls(value);
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
                const node = this.nodeManager.getNodeById(stateManager.selectedWorldObject.get().id);
                node.isDragging = false;
                stateManager.interactionMode.set(InteractionMode.NORMAL);
            } else if(stateManager.interactionMode.get() === InteractionMode.CONNECTING) {
                const coords = this.camera.screenToWorldCoords(e.clientX, e.clientY);
                this.nodeManager.manualInteraction = true;
                this.nodeManager.createNode(coords.x, coords.y);
                this.nodeManager.manualInteraction = false;
            }
        } else if(e.button === 2) {
            stateManager.setDefaultInteractionState();
        }
    }

    onKeyDown(e) {
        if(e.key === "Delete" || e.key === "Backspace") {
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

            stateManager.setDefaultInteractionState();
        } else if(e.key === "r") {
            if(stateManager.selectedWorldObject.get().type === WorldObject.COMPONENT) {
                const component = this.componentManager.getComponentById(stateManager.selectedWorldObject.get().id);
                component.rotate();
            }
        }
    }
}
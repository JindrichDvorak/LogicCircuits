import { stateManager, InteractionMode } from "./State/StateManager";

import { Camera } from "./Camera";
import { NodeManager } from "./Objects/Nodes/NodeManager";

export class Application {
    constructor() {
        this.world = document.getElementById("world");
        this.scene = document.getElementById("scene");

        this.camera = new Camera(this.world, this.scene, 50000, 50000, 1);
        this.nodeManager = new NodeManager(this.world);

        this.registerEvents();
    }

    registerEvents() {
        this.world.addEventListener("mousedown", (e) => this.onMouseDown(e));

        window.addEventListener("keydown", (e) => this.onKeyDown(e));

        // * Disable context menu:
        this.world.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    onMouseDown(e) {
        if(e.button === 0) {
            if(stateManager.interactionMode.get() === InteractionMode.CREATING_NODE) {
                const node = this.nodeManager.getNodeById(stateManager.currentNodeId.get());
                node.isDragging = false;
                stateManager.interactionMode.set(InteractionMode.NORMAL);
                stateManager.interactionTrigger.signal();
            } else if(stateManager.interactionMode.get() === InteractionMode.CONNECTING) {
                stateManager.lastNodeId.set(stateManager.currentNodeId.get());

                const coords = { x: e.offsetX, y: e.offsetY };
                this.nodeManager.createNode(coords.x, coords.y);
                stateManager.interactionTrigger.signal();
            }
        } else if(e.button === 2) {
            stateManager.interactionMode.set(InteractionMode.NORMAL);
            stateManager.interactionTrigger.signal();
        }
    }

    onKeyDown(e) {
        if(e.key === "Delete") {
            const nodeId = stateManager.currentNodeId.get();
            const node = this.nodeManager.getNodeById(nodeId);
            if(!node) return;
            this.nodeManager.deleteNodeChain(node);
        }
    }
}
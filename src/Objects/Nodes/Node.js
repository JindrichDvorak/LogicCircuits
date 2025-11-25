import { Elements, InteractionMode, stateManager } from "../../State/StateManager";


export class Node {
    constructor(world, id, x, y, width, height) {
        this.world = world;
        this.id = id;
        this.position = { x: x, y: y };
        this.size = { width: width, height: height };

        this.element;

        this.mouseOffset = { x: 0, y: 0 };
        this.isDragging = false;
        this.isFixed = false;
        
        this.holdTime = 500;
        this.holdTimer;

        this.createElement();
        this.registerEvents();
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("node");
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
        this.element.style.width = `${this.size.width}px`;
        this.element.style.height = `${this.size.height}px`;

        this.element.innerHTML = `
            <div style="display: flex; height: 100%; justify-content: center; align-items: center;">${this.id}</div>
        `;
        this.world.appendChild(this.element);
    }

    registerEvents() {
        this.element.addEventListener("mousedown", (e) => this.onMouseDown(e));
        window.addEventListener("mousemove", (e) => this.onMouseMove(e));
        window.addEventListener("mouseup", (e) => this.onMouseUp(e));
        this.element.addEventListener("mouseleave", (e) => this.onMouseLeave(e));
    }

    onMouseDown(e) {
        if(e.button === 0) {
            stateManager.interactionMode.set(InteractionMode.CONNECTING);
            stateManager.interactedElementType.set(Elements.NODE);
            stateManager.interactedElementId.set(this.id);
            stateManager.interactionTrigger.signal();
            
            this.element.classList.add("animate");

            this.holdTimer = setTimeout(() => {
                stateManager.interactionMode.set(InteractionMode.DRAGGING);
                stateManager.interactionTrigger.signal();

                this.isDragging = true;
            }, this.holdTime);

            this.mouseOffset = { 
                x: e.clientX - this.element.offsetLeft, 
                y: e.clientY - this.element.offsetTop 
            };
            e.stopPropagation();
        } 
    }

    onMouseMove(e) {
        if(this.isFixed) return;
        if(!this.isDragging) return;

        this.position = { 
            x: e.clientX - this.mouseOffset.x, 
            y: e.clientY - this.mouseOffset.y 
        };

        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }

    onMouseUp(e) {
        if(e.button === 0) {
            if(this.isDragging) {
                stateManager.interactionMode.set(InteractionMode.NORMAL);
                stateManager.interactionTrigger.signal();
            }
            
            this.element.classList.remove("animate");
            this.isDragging = false;
            clearTimeout(this.holdTimer);

            
        }
    }

    onMouseLeave(e) {
        clearTimeout(this.holdTimer);
        if(!this.isDragging) {
            this.element.classList.remove("animate");
        }
    }
}
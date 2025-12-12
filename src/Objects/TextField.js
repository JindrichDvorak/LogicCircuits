import { WorldObject, InteractionMode, stateManager } from "../State/StateManager";


export class TextField {
    constructor(world, id, x, y, width, height) {
        this.world = world;
        this.id = id;

        // * Interaction:
        this.element;
        this.position = { x: x, y: y };

        this.size = { width: width, height: height };

        this.isDragging = false;
        this.lastMousePosition = { x: 0, y: 0 };
        this.isFixed = false;
        this.holdTime = 500;
        this.holdTimer;
        this.mouseLeave = false;

        this.createElement();
        this.registerEvents();
    }

    createElement() {
        this.element = document.createElement("input");
        this.element.type = "text";
        this.element.id = `${this.id}`;
        this.element.style.position = "absolute";
        this.element.style.width = `${this.size.width}px`;
        this.element.style.height = `${this.size.height}px`;
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
        this.element.readOnly = "false";
        //this.element.ondblclick = `this.readOnly="";`;

        this.element.value = `Text field`;

        this.shadowInput = document.createElement("span");
        this.shadowInput.style.position = "absolute";
        this.shadowInput.style.width = "fit-content";
        this.shadowInput.style.height = "100%";
        this.shadowInput.style.left = "0px";
        this.shadowInput.style.top = "0px";
        this.shadowInput.style.display = "none";
        this.shadowInput.style.zIndex = "-1";

        this.world.appendChild(this.element);
        this.element.appendChild(this.shadowInput);

        this.move();
        this.resize();
    }

    move() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }

    resize() {
        const text = this.element.value;
        if(text.length > 0) {
            this.shadowInput.innerHTML = `${text}`;
            const shadowInputRect = this.shadowInput.getBoundingClientRect();

            if(shadowInputRect.width > 0) {
                this.element.style.width = `${shadowInputRect.width}px`;
            } else {
                this.element.style.width = "10px";
            }
        } else {
            this.element.style.width = "10px";
        }
        
    }

    //Events:
    registerEvents() {
        this.element.addEventListener("mousedown", (e) => this.onMouseDown(e));
        window.addEventListener("mousemove", (e) => this.onMouseMove(e));
        window.addEventListener("mouseup", (e) => this.onMouseUp(e));
        this.element.addEventListener("mouseleave", (e) => this.onMouseLeave(e));

        this.element.addEventListener("input", (e) => this.onInput(e));

        // * Disable context menu:
        this.element.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    onMouseDown(e) {
        //e.preventDefault();
        this.mouseLeave = false;
        if(e.button === 0) {
            this.element.classList.add("animate");

            this.holdTimer = setTimeout(() => {
                stateManager.interactionMode.set(InteractionMode.DRAGGING);

                this.isDragging = true;
            }, this.holdTime);

            this.lastMousePosition = { x: e.clientX, y: e.clientY };

            stateManager.selectedWorldObject.set({
                id: this.id,
                type: WorldObject.COMPONENT
            });

            //e.stopPropagation();
        } else if(e.button === 2) {
            stateManager.setDefaultState();
            stateManager.selectedWorldObject.set({
                id: this.id,
                type: WorldObject.COMPONENT
            });
            e.stopPropagation();
        }
    }

    onMouseMove(e) {
        if(this.isFixed) return;
        if(!this.isDragging) return;

        const dx = e.clientX - this.lastMousePosition.x;
        const dy = e.clientY - this.lastMousePosition.y;

        this.position.x += dx;
        this.position.y += dy;
        this.lastMousePosition = { x: e.clientX, y: e.clientY };

        this.move();
    }

    onMouseUp(e) {
        if(e.button === 0) {
            if(this.isDragging) {
                stateManager.setDefaultState();
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
        this.mouseLeave = true;
    }

    onInput(e) {
        this.resize();
        console.log("Halelujah");
    }
}
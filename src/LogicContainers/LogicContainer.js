export class LogicContainer {
    constructor(world, id, x, y, width, height) {
        this.world = world;
        this.id = id;
        this.position = { x: x, y: y };
        this.size = { width: width, height: height };

        this.element;

        this.isDragging = false;
        this.mouseOffset = { x: 0, y: 0 };
        this.maxPosition = { x: 0, y: 0 };

        this.createElement();
        this.registerEvents();
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("logicContainer");
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
        this.element.style.width = `${this.size.width}px`;
        this.element.style.height = `${this.size.height}px`;

        this.element.innerHTML = ``;
        this.world.appendChild(this.element);
    }

    registerEvents() {
        this.element.addEventListener("mousedown", (e) => this.onMouseDown(e));
        window.addEventListener("mousemove", (e) => this.onMouseMove(e));
        window.addEventListener("mouseup", (e) => this.onMouseUp(e));
    }

    onMouseDown(e) {
        if(e.button === 0) {
            this.isDragging = true;
            this.mouseOffset = { 
                x: e.clientX - this.element.offsetLeft, 
                y: e.clientY - this.element.offsetTop 
            };
        }
    }

    onMouseMove(e) {
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
            this.isDragging = false;
        }
    }
}
export class DraggableObject {
    constructor(world, x, y) {
        this.world = world;
        this.position = { x: x, y: y };

        this.element;

        this.isDragging = false;
        this.mouseOffset = { x: 0, y: 0 };
        this.isFixed = false;
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
            this.isDragging = false;
        }
    }
}
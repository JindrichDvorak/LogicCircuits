export class Camera {
    constructor(world, scene, x, y, zoom) {
        this.world = world;
        this.scene = scene;
        this.position = { x: x, y: y };

        this.isDragging = false;
        this.lastMousePosition = { x: 0, y: 0 };
        this.zoom = zoom;

        const sceneRect = this.scene.getBoundingClientRect();
        this.scenePosition = { x: sceneRect.left, y: sceneRect.top };

        this.registerEvents();
        this.transformWorld();
    }

    transformWorld() {
        this.world.style.transform = `translate(${-this.position.x}px, ${-this.position.y}px) scale(${this.zoom})`;
    }

    screenToSceneCoords(x, y) {
        return {
            x: x - this.scenePosition.x,
            y: y - this.scenePosition.y
        };
    }

    sceneToWorldCoords(x, y) {
        return {
            x: (x + this.position.x) / this.zoom,
            y: (y + this.position.y) / this.zoom
        };
    }

    screenToWorldCoords(x, y) {
        const sceneCoords = this.screenToSceneCoords(x, y);
        return this.sceneToWorldCoords(sceneCoords.x, sceneCoords.y);
    }

    registerEvents() {
        this.world.addEventListener("mousedown", (e) => this.onMouseDown(e));
        window.addEventListener("mousemove", (e) => this.onMouseMove(e));
        window.addEventListener("mouseup", (e) => this.onMouseUp(e));

        this.world.addEventListener("wheel", (e) => this.onMouseWheel(e));
    }

    onMouseDown(e) {
        if(e.button === 1) {
            this.isDragging = true;
            this.lastMousePosition = { x: e.clientX, y: e.clientY };
        }
    }

    onMouseMove(e) {
        if(!this.isDragging) return;

        const dx = this.lastMousePosition.x - e.clientX;
        const dy = this.lastMousePosition.y - e.clientY;

        this.position.x += dx;
        this.position.y += dy;
        this.lastMousePosition = { x: e.clientX, y: e.clientY };

        this.transformWorld();
    }

    onMouseUp(e) {
        if(e.button === 1) {
            this.isDragging = false;
        }
    }

    onMouseWheel(e) {
        // ! TBD
    }
}
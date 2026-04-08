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
        this.worldPosition = { x: this.scenePosition.x, y: this.scenePosition.y };

        this.isShiftPressed = false;
        this.angleSnappedMousePosition = { x: 0, y: 0 };
        this.lastClickedMousePosition = { x: 0, y: 0 };

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

    getAngleSnappedMousePosition() {
        return this.screenToWorldCoords(this.angleSnappedMousePosition.x, this.angleSnappedMousePosition.y);
    }

    registerEvents() {
        this.world.addEventListener("mousedown", (e) => this.onMouseDown(e));
        window.addEventListener("mousemove", (e) => this.onMouseMove(e));
        window.addEventListener("mouseup", (e) => this.onMouseUp(e));

        this.scene.addEventListener("wheel", (e) => this.onMouseWheel(e));

        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
    }

    onMouseDown(e) {
        if(e.button === 2) {
            this.isDragging = true;
            this.lastMousePosition = { x: e.clientX, y: e.clientY };
            this.lastClickedMousePosition = { x: e.clientX, y: e.clientY };
        } else if(e.button === 0) {
            this.lastClickedMousePosition = { x: e.clientX, y: e.clientY };
        }
        this.lastClickedMousePosition = { x: e.clientX, y: e.clientY };
    }

    onMouseMove(e) {
        let dx = this.lastMousePosition.x - e.clientX;
        let dy = this.lastMousePosition.y - e.clientY;

        if(this.isDragging) {
            this.position.x += dx;
            this.position.y += dy;
        }

        if(this.isShiftPressed) {
            dx = this.lastClickedMousePosition.x - e.clientX;
            dy = this.lastClickedMousePosition.y - e.clientY;
            const angle = Math.atan2(dx, dy);
            const length = Math.hypot(dx, dy);

            const snappedAngle = Math.round(angle / Math.PI) * Math.PI;
            this.angleSnappedMousePosition = {
                x: this.lastClickedMousePosition.x + length * Math.cos(snappedAngle),
                y: this.lastClickedMousePosition.y + length * Math.sin(snappedAngle)
            };
        }

        this.lastMousePosition = { x: e.clientX, y: e.clientY };

        this.transformWorld();
    }

    onMouseUp(e) {
        if(e.button === 2) {
            this.isDragging = false;
        }
    }

    onMouseWheel(e) {
        const zoomFactor = 1.1;
        const oldZoom = this.zoom;

        const mousePosition = { x: e.clientX, y: e.clientY };
        const oldPosition = this.screenToWorldCoords(mousePosition.x, mousePosition.y);

        if (e.deltaY < 0) {
            this.zoom *= zoomFactor;
        } else {
            this.zoom /= zoomFactor;
        }

        this.zoom = Math.min(Math.max(this.zoom, 0.4), 5);

        this.position.x -= oldPosition.x * oldZoom - oldPosition.x * this.zoom;
        this.position.y -= oldPosition.y * oldZoom - oldPosition.y * this.zoom;

        this.transformWorld();

        e.preventDefault()
    }

    onKeyDown(e) {
        if(e.key === "Shift") {
            this.isShiftPressed = true;
        }
    }

    onKeyUp(e) {
        if(e.key === "Shift") {
            this.isShiftPressed = false;
        }
    }
}
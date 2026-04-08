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

        this.testDiv = document.createElement("div");
        this.testDiv.style.width = "10px";
        this.testDiv.style.height = "10px";
        this.testDiv.style.position = "absolute";
        this.testDiv.style.border = "1px solid black";
        this.world.appendChild(this.testDiv);

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
        //return this.angleSnappedMousePosition;
    }

    toDegrees(angle) {
        return angle * 180 / Math.PI;
    }

    toRadians(angle) {
        return angle * Math.PI / 180;
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
        } else if(e.button === 0) {
            /*if(this.isShiftPressed) {
                const dx = this.lastClickedMousePosition.x - e.clientX;
                const dy = this.lastClickedMousePosition.y - e.clientY;
                let angle = Math.atan2(dy, -dx);
                const length = Math.hypot(dx, dy);

                angle = this.toDegrees(-angle);
                let snappedAngle = Math.round(angle / 45.0) * 45.0;
                
                console.log("----------------------------------");
                console.log(`Angle:    ${snappedAngle} :: ${this.toRadians(snappedAngle)}`);
                console.log(`LastPos:  ${this.lastClickedMousePosition.x},    ${this.lastClickedMousePosition.y}`);
                console.log(`Client:   ${e.clientX},    ${e.clientY}`);
                console.log(`Length:   ${length}`);
                console.log("----------------------------------");
                
                snappedAngle = this.toRadians(snappedAngle);
                
                this.angleSnappedMousePosition = {
                    x: this.lastClickedMousePosition.x + length * Math.cos(snappedAngle),
                    y: this.lastClickedMousePosition.y + length * Math.sin(snappedAngle)
                };
            }   */
        }
    }

    onMouseMove(e) {
        if(this.isDragging) {
            const dx = this.lastMousePosition.x - e.clientX;
            const dy = this.lastMousePosition.y - e.clientY;

            this.position.x += dx;
            this.position.y += dy;

            this.lastMousePosition = { x: e.clientX, y: e.clientY };

            this.transformWorld();
        }     

        if(this.isShiftPressed) {
            const dx = this.lastClickedMousePosition.x - e.clientX;
            const dy = this.lastClickedMousePosition.y - e.clientY;
            let angle = Math.atan2(dy, -dx);
            const length = Math.hypot(dx, dy);

            angle = this.toDegrees(-angle);
            let snappedAngle = Math.round(angle / 45.0) * 45.0;
            
            console.log("----------------------------------");
            console.log(`Angle:    ${snappedAngle} :: ${this.toRadians(snappedAngle)}`);
            console.log(`LastPos:  ${this.lastClickedMousePosition.x},    ${this.lastClickedMousePosition.y}`);
            console.log(`Client:   ${e.clientX},    ${e.clientY}`);
            console.log(`Length:   ${length}`);
            console.log("----------------------------------");
            
            snappedAngle = this.toRadians(snappedAngle);
            
            this.angleSnappedMousePosition = {
                x: this.lastClickedMousePosition.x + length * Math.cos(snappedAngle),
                y: this.lastClickedMousePosition.y + length * Math.sin(snappedAngle)
            };

            const newPos = this.screenToWorldCoords(this.angleSnappedMousePosition.x, this.angleSnappedMousePosition.y);
            this.testDiv.style.left = `${newPos.x}px`;
            this.testDiv.style.top = `${newPos.y}px`;
        }
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
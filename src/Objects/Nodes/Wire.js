export class Wire {
    constructor(startNode, endNode, wireHolder) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.wireHolder = wireHolder;

        this.element;

        this.wireColor = "black";
        this.wireWidth = 2;

        // ? DEBUG:
        this.showBoundngBox = false;
        this.borderWidth = 0;
        this.borderColor = "red";

        this.unsubStart;
        this.unsubEnd;

        this.createElement();
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.style.position = "absolute";
        this.element.style.zIndex = "-2";
        this.element.style.display = "block";
        if(this.showBoundngBox) this.element.style.border = `solid ${this.borderWidth}px ${this.borderColor}`;

        this.wireHolder.appendChild(this.element);

        this.unsubStart = this.startNode.rewireTrigger.subscribe(() => {
            this.drawWire();
        });
        this.unsubEnd = this.endNode.rewireTrigger.subscribe(() => {
            this.drawWire();
        });

        this.drawWire();
    }

    /* TODO:
        * This needs a serious refactor...
    */
    drawWire() {
        const startNodeWidth = this.startNode.size.width;
        const startNodeHeight = this.startNode.size.height;
        const endNodeWidth = this.endNode.size.width;
        const endNodeHeight = this.endNode.size.height;

        const x0 = this.startNode.position.x;
        const y0 = this.startNode.position.y;
        const x1 = this.endNode.position.x;
        const y1 = this.endNode.position.y;

        const dx = x1 - x0;
        const dy = y1 - y0;

        let width = Math.abs(dx);
        let height = Math.abs(dy);

        let startX;
        let startY;
        let endX;
        let endY;
        if(dx >= 0 && dy >= 0) {
            width += endNodeWidth - 2 * this.borderWidth;
            height += endNodeHeight - 2 * this.borderWidth;

            this.element.style.left = `${x0}px`;
            this.element.style.top = `${y0}px`;
            this.element.style.width = `${width}px`;
            this.element.style.height = `${height}px`;

            startX = startNodeWidth / 2;
            startY = startNodeHeight / 2;
            endX = width - endNodeWidth / 2;
            endY = height - endNodeHeight / 2; 
        } else if(dx < 0 && dy >= 0) {
            width += startNodeWidth + 2 * this.borderWidth;
            height += endNodeHeight - 2 * this.borderWidth;

            this.element.style.left = `${x0 - width + startNodeWidth}px`;
            this.element.style.top = `${y0}px`;
            this.element.style.width = `${width}px`;
            this.element.style.height = `${height}px`;

            startX = width - startNodeWidth / 2;
            startY = startNodeHeight / 2;
            endX = endNodeWidth / 2;
            endY = height - endNodeHeight / 2; 
        } else if(dx >= 0 && dy < 0) {
            width += endNodeWidth - 2 * this.borderWidth;
            height += startNodeHeight + 2 * this.borderWidth;

            this.element.style.left = `${x0}px`;
            this.element.style.top = `${y0 - height + startNodeHeight}px`;
            this.element.style.width = `${width}px`;
            this.element.style.height = `${height}px`;

            startX = startNodeWidth / 2;
            startY = height - startNodeHeight / 2;
            endX = width - endNodeWidth / 2;
            endY = endNodeHeight / 2; 
        } else if(dx < 0 && dy < 0) {
            width += startNodeWidth + 2 * this.borderWidth;
            height += startNodeHeight + 2 * this.borderWidth;

            this.element.style.left = `${x0 - width + startNodeWidth}px`;
            this.element.style.top = `${y0 - height + startNodeHeight}px`;
            this.element.style.width = `${width}px`;
            this.element.style.height = `${height}px`;

            startX = width - startNodeWidth / 2;
            startY = height - startNodeHeight / 2;
            endX = endNodeWidth / 2;
            endY = endNodeHeight / 2; 
        }

        this.element.innerHTML = `
            <svg width="100%" height="100%" style="display:block; overflow: visible;">
                <line 
                    stroke="${this.wireColor}" stroke-width="${this.wireWidth}" 
                    x1="${startX}" y1="${startY}" 
                    x2="${endX}" y2="${endY}"
                />
            </svg>
        `;
    }
}
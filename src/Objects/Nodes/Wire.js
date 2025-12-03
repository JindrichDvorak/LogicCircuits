export class Wire {
    constructor(startNode, endNode) {
        this.startNode = startNode;
        this.endNode = endNode;

        this.element;

        this.unsubStart;
        this.unsubEnd;

        this.createElement();
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.style.position = "absolute";
        this.element.style.border = "solid 2px red";
        this.element.style.zIndex = "-1";

        this.startNode.element.appendChild(this.element);

        this.unsubStart = this.startNode.rewireTrigger.subscribe(() => {
            this.drawWire();
        });
        this.unsubEnd = this.endNode.rewireTrigger.subscribe(() => {
            this.drawWire();
        });

        this.drawWire();
    }

    drawWire() {
        const { x: x0, y: y0 } = this.startNode.position;
        const { x: x1, y: y1 } = this.endNode.position;
        const dx = x1 - x0;
        const dy = y1 - y0;
        const startNodeWidth = this.startNode.size.width;
        const startNodeHeight = this.startNode.size.height;
        const endNodeWidth = this.endNode.size.width;
        const endNodeHeight = this.endNode.size.height;
        const width = Math.abs(dx) + (startNodeWidth + endNodeWidth) / 2;
        const height = Math.abs(dy) + (startNodeHeight + endNodeHeight) / 2;

        let startX;
        let startY;
        let endX;
        let endY;
        if(dx >= 0 && dy >= 0) {
            this.element.style.left = `${-this.startNode.borderWidth}px`;
            this.element.style.top = `${-this.startNode.borderWidth}px`;     

            this.element.style.width = `${width}px`;
            this.element.style.height = `${height}px`;

            startX = startNodeWidth / 2;
            startY = startNodeHeight / 2;
            endX = startX + dx;
            endY = startY + dy;
        } else if(dx < 0 && dy >= 0) {
            this.element.style.left = `${nodeWidth - width - this.startNode.borderWidth}px`;
            this.element.style.top = `${-this.startNode.borderWidth}px`;     

            this.element.style.width = `${width}px`;
            this.element.style.height = `${height}px`;

            startX = nodeWidth / 2;
            startY = nodeHeight / 2;
            endX = startX + dx;
            endY = startY + dy;
        } else if(dx >= 0 && dy < 0) {
            this.element.style.left = `${width - this.startNode.borderWidth}px`;
            this.element.style.top = `${-this.startNode.borderWidth}px`;     

            this.element.style.width = `${width}px`;
            this.element.style.height = `${height}px`;

            startX = nodeWidth / 2;
            startY = nodeHeight / 2;
            endX = startX + dx;
            endY = startY + dy;
        } else if(dx < 0 && dy < 0) {
            this.element.style.left = `${width - this.startNode.borderWidth}px`;
            this.element.style.top = `${-this.startNode.borderWidth}px`;     

            this.element.style.width = `${width}px`;
            this.element.style.height = `${height}px`;

            startX = nodeWidth / 2;
            startY = nodeHeight / 2;
            endX = startX + dx;
            endY = startY + dy;
        }
        /*
        if(dx >= 0 && height < nodeHeight / 2) {
            this.element.style.width = `${altWidth}px`;
            this.element.style.height = `${altHeight}px`;

            this.element.style.left = `${0}px`;
            this.element.style.top = `${0}px`;
            startX = nodeWidth / 2;
            startY = nodeHeight / 2;
            endX = startX + dx;
            endY = startY + dy;
        } else if(dx < 0 && height < nodeHeight / 2) {
            this.element.style.width = `${altWidth}px`;
            this.element.style.height = `${altHeight}px`;

            this.element.style.left = `${-width}px`;
            this.element.style.top = `${0}px`;
            startX = width;
            startY = nodeHeight / 2;
            endX = startX + dx;
            endY = startY + dy;
        } else if(width < nodeWidth / 2 && dy >= 0) {
            this.element.style.width = `${nodeWidth}px`;

            this.element.style.left = `${0}px`;
            this.element.style.top = `${-nodeHeight}px`;
            startX = nodeWidth / 2;
            startY = nodeHeight / 2;
            //endX = 
        } else if(width < nodeWidth / 2 && dy < 0) {

        } else if(dx >= 0 && dy >= 0) {
            this.element.style.left = `${nodeWidth / 2}px`;
            this.element.style.top = `${nodeHeight / 2}px`;
            startX = 0;
            startY = 0;
            endX = width;
            endY = height;
        } else if(dx >= 0 && dy < 0) {
            this.element.style.left = `${nodeWidth / 2}px`;
            this.element.style.top = `${nodeHeight / 2 - height}px`;
            startX = 0;
            startY = height;
            endX = width;
            endY = 0;
        } else if(dx < 0 && dy < 0) {
            this.element.style.left = `${nodeWidth / 2 - width}px`;
            this.element.style.top = `${nodeHeight / 2 - height}px`;
            startX = width;
            startY = height;
            endX = 0;
            endY = 0;
        } else {
            this.element.style.left = `${nodeWidth / 2 - width}px`;
            this.element.style.top = `${nodeHeight / 2}px`;
            startX = width;
            startY = 0;
            endX = 0;
            endY = height;
        }
        */

        this.element.innerHTML = `
            <svg width="100%" height="100%">
                <line 
                    stroke="red" stroke-width="2" 
                    x1="${startX}" y1="${startY}" 
                    x2="${endX}" y2="${endY}"
                ></line>
            </svg>
        `;
    }
}
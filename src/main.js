import { Application } from "./Application";

import { debugUILogic } from "./debugUI";


const app = new Application();

const newInput = document.getElementById("newInput");
newInput.addEventListener("click", () => {
  const coords = app.camera.screenToWorldCoords(500, 300);
  app.nodeManager.createInputNode(coords.x, coords.y);
});

debugUILogic();
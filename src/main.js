import { Application } from "./Application";

import { debugUILogic } from "./debugUI";


const app = new Application();

const newInput = document.getElementById("newInput");
newInput.addEventListener("click", () => {
  const coords = app.camera.screenToWorldCoords(30, 100);
  app.nodeManager.createInputNode(coords.x, coords.y);
});

debugUILogic();
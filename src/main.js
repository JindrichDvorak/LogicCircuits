import { Application } from "./Application";

import { debugUILogic } from "./debugUI";


const app = new Application();

const newInput = document.getElementById("newInput");
newInput.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.nodeManager.createInputNode(coords.x, coords.y, mouseX, mouseY);
});

const newOutput = document.getElementById("newOutput");
newOutput.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.nodeManager.createOuputNode(coords.x, coords.y, mouseX, mouseY);
});

const newCompoment = document.getElementById("newComponent");
newCompoment.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
});

debugUILogic();
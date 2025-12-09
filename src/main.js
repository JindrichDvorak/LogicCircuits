import { Application } from "./Application";


const app = new Application();

// TODO: Define these functions inside Application:
const newInput = document.getElementById("newInput");
newInput.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.nodeManager.createInputNode(coords.x, coords.y, mouseX, mouseY, false);
});

const newOutput = document.getElementById("newOutput");
newOutput.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.nodeManager.createOuputNode(coords.x, coords.y, mouseX, mouseY, false);
});

const newTransistor = document.getElementById("newTransistor");
newTransistor.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.componentManager.createTransistor(coords.x, coords.y, mouseX, mouseY);
});

const newResistor = document.getElementById("newResistor");
newResistor.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.componentManager.createResistor(coords.x, coords.y, mouseX, mouseY);
});
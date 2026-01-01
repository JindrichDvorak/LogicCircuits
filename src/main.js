import { stateManager } from "./State/StateManager"; 
import { Application } from "./Application";
import { debugUILogic } from "./debugUI";
import { interactionInfoLogic } from "./interactionFeedback";


const app = new Application();

// TODO: Define these functions inside Application:
// * Save, load and clear:
const fileNameInput = document.getElementById("fileNameInput");
fileNameInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter") {
    document.activeElement.blur();
    e.preventDefault();
  }
});

const saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", (e) => app.saveManager.save());

const loadButton = document.getElementById("loadButton");
loadButton.addEventListener("click", (e) => app.saveManager.openLoadDialog());

const clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", (e) => app.saveManager.clearWorld());

// * Controls:
// * IO:
const newInput = document.getElementById("newInput");
newInput.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.nodeManager.manualInteraction = true;
  app.nodeManager.createInputNode(coords.x, coords.y, mouseX, mouseY, false);
  app.nodeManager.manualInteraction = false;
});

const newOutput = document.getElementById("newOutput");
newOutput.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.nodeManager.manualInteraction = true;
  app.nodeManager.createOutputNode(coords.x, coords.y, mouseX, mouseY, false);
  app.nodeManager.manualInteraction = false;
});

const newTextField = document.getElementById("newTextField");
newTextField.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createTextField(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

// * RTL:
const newTransistor = document.getElementById("newTransistor");
newTransistor.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createTransistor(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const newResistor = document.getElementById("newResistor");
newResistor.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createResistor(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const newGround = document.getElementById("newGround");
newGround.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createGround(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

// * Gates:
const newBuffer = document.getElementById("newBuffer");
newBuffer.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createBuffer(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const newNOT = document.getElementById("newNOT");
newNOT.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createNOT(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const newAND = document.getElementById("newAND");
newAND.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createAND(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const newNAND = document.getElementById("newNAND");
newNAND.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createNAND(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const newOR = document.getElementById("newOR");
newOR.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createOR(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const newNOR = document.getElementById("newNOR");
newNOR.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createNOR(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const newXOR = document.getElementById("newXOR");
newXOR.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createXOR(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const newNXOR = document.getElementById("newNXOR");
newNXOR.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createNXOR(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

// * Circuits:
const newHalfAdder = document.getElementById("newHalfAdder");
newHalfAdder.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createHalfAdder(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const newFullAdder = document.getElementById("newFullAdder");
newFullAdder.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createFullAdder(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

interactionInfoLogic(app.nodeManager, app.componentManager);

// TODO: remove:
//debugUILogic(app.nodeManager);
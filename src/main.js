import { Application } from "./Application";


const app = new Application();

// TODO: Define these functions inside Application:
// * IO:
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
  app.nodeManager.createOutputNode(coords.x, coords.y, mouseX, mouseY, false);
});

// * RTL:
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

const newGround = document.getElementById("newGround");
newGround.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.componentManager.createGround(coords.x, coords.y, mouseX, mouseY);
});

// * Gates:
const newBuffer = document.getElementById("newBuffer");
newBuffer.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.componentManager.createBuffer(coords.x, coords.y, mouseX, mouseY);
});

const newNOT = document.getElementById("newNOT");
newNOT.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.componentManager.createNOT(coords.x, coords.y, mouseX, mouseY);
});

const newAND = document.getElementById("newAND");
newAND.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.componentManager.createAND(coords.x, coords.y, mouseX, mouseY);
});

const newNAND = document.getElementById("newNAND");
newNAND.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.componentManager.createNAND(coords.x, coords.y, mouseX, mouseY);
});

const newOR = document.getElementById("newOR");
newOR.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.componentManager.createOR(coords.x, coords.y, mouseX, mouseY);
});

const newNOR = document.getElementById("newNOR");
newNOR.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.componentManager.createNOR(coords.x, coords.y, mouseX, mouseY);
});

const newXOR = document.getElementById("newXOR");
newXOR.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.componentManager.createXOR(coords.x, coords.y, mouseX, mouseY);
});

const newNXOR = document.getElementById("newNXOR");
newNXOR.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.componentManager.createNXOR(coords.x, coords.y, mouseX, mouseY);
});
/*
// * Circuits:
const newHalfAdder = document.getElementById("newHalfAdder");
newHalfAdder.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.componentManager.createHalfAdder(coords.x, coords.y, mouseX, mouseY);
});

const newFullAdder = document.getElementById("newFullAdder");
newFullAdder.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = app.camera.screenToWorldCoords(mouseX, mouseY);
  app.componentManager.createFullAdder(coords.x, coords.y, mouseX, mouseY);
});*/
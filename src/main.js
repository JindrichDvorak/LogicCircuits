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

const newNodeJoint = document.getElementById("newNodeJoint");
newNodeJoint.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createNodeJoint(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
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

const new2bitInput = document.getElementById("new2bitInput");
new2bitInput.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createTwoBitInput(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const new3bitInput = document.getElementById("new3bitInput");
new3bitInput.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createThreeBitInput(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const new4bitInput = document.getElementById("new4bitInput");
new4bitInput.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createFourBitInput(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const new8bitInput = document.getElementById("new8bitInput");
new8bitInput.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createEightBitInput(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const new2bitOutput = document.getElementById("new2bitOutput");
new2bitOutput.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createTwoBitOutput(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const new3bitOutput = document.getElementById("new3bitOutput");
new3bitOutput.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createThreeBitOutput(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const new4bitOutput = document.getElementById("new4bitOutput");
new4bitOutput.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createFourBitOutput(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const new8bitOutput = document.getElementById("new8bitOutput");
new8bitOutput.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createEightBitOutput(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const new2to1MUX = document.getElementById("new2to1MUX");
new2to1MUX.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createTwoToOneMUX(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const new4to1MUX = document.getElementById("new4to1MUX");
new4to1MUX.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createFourToOneMUX(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const new8to1MUX = document.getElementById("new8to1MUX");
new8to1MUX.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createEightToOneMUX(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const new1to2DEMUX = document.getElementById("new1to2DEMUX");
new1to2DEMUX.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createOneToTwoDEMUX(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const new1to4DEMUX = document.getElementById("new1to4DEMUX");
new1to4DEMUX.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createOneToFourDEMUX(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

const new1to8DEMUX = document.getElementById("new1to8DEMUX");
new1to8DEMUX.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const coords = { x: mouseX, y: mouseY };
  app.componentManager.manualInteraction = true;
  app.componentManager.createOneToEightDEMUX(coords.x, coords.y, mouseX, mouseY);
  app.componentManager.manualInteraction = false;
});

// TODO: remove:
//debugUILogic(app.nodeManager);

const dataString = `

`;

//app.saveManager.data = await JSON.parse(dataString);
//app.saveManager.load();
/*
const component1 = app.componentManager.createOneToFourDEMUX(50110, 50220, 0, 0);
component1.move();

const component2 = app.componentManager.createOneToTwoDEMUX(50104.75, 50358.48, 0, 0);
component2.move();

const component3 = app.componentManager.createTwoToOneMUX(50222.85, 50358.13, 0, 0);
component3.move();*/

//interactionInfoLogic(app.nodeManager, app.componentManager);
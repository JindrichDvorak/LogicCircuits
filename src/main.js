import { Camera } from "./Camera";
import { LogicContainer } from "./Objects/LogicContainers/LogicContainer";
import { Node } from "./Objects/Nodes/Node";

import { debugUILogic } from "./debugUI";


const scene = document.getElementById("scene");
const world = document.getElementById("world");
const addButton = document.getElementById("addRect");
const addJoint = document.getElementById("addJoint");

const containers = [];
const nodes = [];

let counter = 0;

const camera = new Camera(scene, world, 50000, 50000, 1);

addButton.addEventListener("click", () => {
  const coords = camera.screenToWorldCoords(100, 100);
  const containter = new LogicContainer(world, coords.x, coords.y, 100, 50);
  containers.push(containter);
});

addJoint.addEventListener("click", () => {
  const coords = camera.screenToWorldCoords(100, 100);
  const node = new Node(world, counter, coords.x, coords.y, 25, 25);
  counter++;
});

debugUILogic();
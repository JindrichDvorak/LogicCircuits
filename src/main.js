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

let containerCounter = 0;
let nodeCounter = 0;

const camera = new Camera(scene, world, 50000, 50000, 1);

addButton.addEventListener("click", () => {
  const coords = camera.screenToWorldCoords(100, 100);
  const containter = new LogicContainer(world, containerCounter, coords.x, coords.y, 100, 50);
  containers.push(containter);
  containerCounter++;
});

addJoint.addEventListener("click", () => {
  const coords = camera.screenToWorldCoords(100, 100);
  const node = new Node(world, nodeCounter, coords.x, coords.y, 25, 25);
  nodes.push(node);
  nodeCounter++;
});

debugUILogic();
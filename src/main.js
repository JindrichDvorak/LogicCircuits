import { Camera } from "./Camera";
import { LogicContainer } from "./LogicContainers/LogicContainer";

const scene = document.getElementById("scene");
const world = document.getElementById("world");
const addButton = document.getElementById("addRect");

let counter = 1;
const containers = [];

const camera = new Camera(scene, world, 50000, 50000, 1);

addButton.addEventListener("click", () => {
  const coords = camera.screenToWorldCoords(100, 100);
  const containter = new LogicContainer(world, counter, coords.x, coords.y, 100, 50);
  containers.push(containter);
  counter++;
});
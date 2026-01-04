import { TextField } from "./TextField";
import { Ground } from "./BasicComponents/Ground";
import { Resistor } from "./BasicComponents/Resistor";
import { Transistor } from "./BasicComponents/Transistor";
import { NOTgate } from "./LogicGates/NOTgate";
import { BufferGate } from "./LogicGates/BufferGate";
import { ANDgate } from "./LogicGates/ANDgate";
import { NANDgate } from "./LogicGates/NANDgate";
import { ORgate } from "./LogicGates/ORgate";
import { NORgate } from "./LogicGates/NORgate";
import { XORgate } from "./LogicGates/XORgate";
import { NXORgate } from "./LogicGates/NXORgate";
import { HalfAdder } from "./Circuits/HalfAdder";
import { FullAdder } from "./Circuits/FullAdder";
import { TwoBitInput } from "./Circuits/TwoBitInput";
import { ThreeBitInput } from "./Circuits/ThreeBitInput";
import { FourBitInput } from "./Circuits/FourBitInput";
import { EightBitInput } from "./Circuits/EightBitInput";
import { TwoBitOutput } from "./Circuits/TwoBitOutput";
import { ThreeBitOutput } from "./Circuits/ThreeBitOutput";
import { FourBitOutput } from "./Circuits/FourBitOutput";
import { EightBitOutput } from "./Circuits/EightBitOutput";
import { TwoToOneMUX } from "./Circuits/TwoToOneMUX";
import { FourToOneMUX } from "./Circuits/FourToOneMUX";
import { EightToOneMUX } from "./Circuits/EightToOneMUX";
import { OneToTwoDEMUX } from "./Circuits/OneToTwoDEMUX";
import { OneToFourDEMUX } from "./Circuits/OneToFourDEMUX";
import { OneToEightDEMUX } from "./Circuits/OneToEightDEMUX";
import { ComponentType } from "./Component";
import { stateManager } from "../../State/StateManager";
import { getRandomNumberId } from "../../utils";


export class ComponentManager {
    constructor(camera, nodeManager) {
        this.camera = camera;
        this.nodeManager = nodeManager;

        this.components = [];
        this.resistorCount = 0;
        this.groundCount = 0;
        this.transistorCount = 0;

        this.manualInteraction = false;
    }

    createTextField(x, y, mouseX, mouseY) {
        const width = 35;
        const height = 15;
        let component;
        if(this.manualInteraction) {
            component = new TextField(this.camera, ComponentType.TEXT_FIELD, getRandomNumberId(), x - width / 2, y - height / 2, width, height);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new TextField(this.camera, ComponentType.TEXT_FIELD, getRandomNumberId(), x, y, width, height);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createTransistor(x, y, mouseX, mouseY) {
        const width = 100;
        const height = 100;
        let component;
        if(this.manualInteraction) {
            component = new Transistor(this.camera, ComponentType.TRANSISTOR, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new Transistor(this.camera, ComponentType.TRANSISTOR, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        this.transistorCount++;
        stateManager.transistorPresent.set(true);

        return component;
    }

    createResistor(x, y, mouseX, mouseY) {
        const width = 20;
        const height = 100;
        let component;
        if(this.manualInteraction) {
            component = new Resistor(this.camera, ComponentType.RESISTOR, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new Resistor(this.camera, ComponentType.RESISTOR, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        this.resistorCount++;
        stateManager.resistorPresent.set(true);

        return component;
    }

    createGround(x, y, mouseX, mouseY) {
        const width = 60;
        const height = 40;
        let component;
        if(this.manualInteraction) {
            component = new Ground(this.camera, ComponentType.GROUND, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new Ground(this.camera, ComponentType.GROUND, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        this.groundCount++;
        stateManager.groundPresent.set(true);

        return component;
    }

    createBuffer(x, y, mouseX, mouseY) {
        const width = 100;
        const height = 60;
        let component;
        if(this.manualInteraction) {
            component = new BufferGate(this.camera, ComponentType.BUFFER_GATE, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new BufferGate(this.camera, ComponentType.BUFFER_GATE, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createNOT(x, y, mouseX, mouseY) {
        const width = 100;
        const height = 60;
        let component;
        if(this.manualInteraction) {
            component = new NOTgate(this.camera, ComponentType.NOT_GATE, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new NOTgate(this.camera, ComponentType.NOT_GATE, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createAND(x, y, mouseX, mouseY) {
        const width = 100;
        const height = 60;
        let component;
        if(this.manualInteraction) {
            component = new ANDgate(this.camera, ComponentType.AND_GATE, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new ANDgate(this.camera, ComponentType.AND_GATE, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createNAND(x, y, mouseX, mouseY) {
        const width = 100;
        const height = 60;
        let component;
        if(this.manualInteraction) {
            component = new NANDgate(this.camera, ComponentType.NAND_GATE, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new NANDgate(this.camera, ComponentType.NAND_GATE, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createOR(x, y, mouseX, mouseY) {
        const width = 100;
        const height = 60;
        let component;
        if(this.manualInteraction) {
            component = new ORgate(this.camera, ComponentType.OR_GATE, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new ORgate(this.camera, ComponentType.OR_GATE, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createNOR(x, y, mouseX, mouseY) {
        const width = 100;
        const height = 60;
        let component;
        if(this.manualInteraction) {
            component = new NORgate(this.camera, ComponentType.NOR_GATE, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new NORgate(this.camera, ComponentType.NOR_GATE, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createXOR(x, y, mouseX, mouseY) {
        const width = 100;
        const height = 60;
        let component;
        if(this.manualInteraction) {
            component = new XORgate(this.camera, ComponentType.XOR_GATE, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new XORgate(this.camera, ComponentType.XOR_GATE, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createNXOR(x, y, mouseX, mouseY) {
        const width = 100;
        const height = 60;
        let component;
        if(this.manualInteraction) {
            component = new NXORgate(this.camera, ComponentType.NXOR_GATE, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new NXORgate(this.camera, ComponentType.NXOR_GATE, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createHalfAdder(x, y, mouseX, mouseY) {
        const width = 140;
        const height = 80;
        let component;
        if(this.manualInteraction) {
            component = new HalfAdder(this.camera, ComponentType.HALF_ADDER_CIRCUIT, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new HalfAdder(this.camera, ComponentType.HALF_ADDER_CIRCUIT, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createFullAdder(x, y, mouseX, mouseY) {
        const width = 140;
        const height = 120;
        let component;
        if(this.manualInteraction) {
            component = new FullAdder(this.camera, ComponentType.FULL_ADDER_CIRCUIT, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new FullAdder(this.camera, ComponentType.FULL_ADDER_CIRCUIT, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createTwoBitInput(x, y, mouseX, mouseY) {
        const width = 70;
        const height = 77.5;
        let component;
        if(this.manualInteraction) {
            component = new TwoBitInput(this.camera, ComponentType.TWO_BIT_INPUT, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new TwoBitInput(this.camera, ComponentType.TWO_BIT_INPUT, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createThreeBitInput(x, y, mouseX, mouseY) {
        const width = 70;
        const height = 77.5;
        let component;
        if(this.manualInteraction) {
            component = new ThreeBitInput(this.camera, ComponentType.THREE_BIT_INPUT, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new ThreeBitInput(this.camera, ComponentType.THREE_BIT_INPUT, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createFourBitInput(x, y, mouseX, mouseY) {
        const width = 70;
        const height = 77.5;
        let component;
        if(this.manualInteraction) {
            component = new FourBitInput(this.camera, ComponentType.FOUR_BIT_INPUT, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new FourBitInput(this.camera, ComponentType.FOUR_BIT_INPUT, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createEightBitInput(x, y, mouseX, mouseY) {
        const width = 70;
        const height = 153.5;
        let component;
        if(this.manualInteraction) {
            component = new EightBitInput(this.camera, ComponentType.EIGHT_BIT_INPUT, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new EightBitInput(this.camera, ComponentType.EIGHT_BIT_INPUT, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createTwoBitOutput(x, y, mouseX, mouseY) {
        const width = 70;
        const height = 77.5;
        let component;
        if(this.manualInteraction) {
            component = new TwoBitOutput(this.camera, ComponentType.TWO_BIT_OUTPUT, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";

            component.rotate();
            component.rotate();
        } else {
            component = new TwoBitOutput(this.camera, ComponentType.TWO_BIT_OUTPUT, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createThreeBitOutput(x, y, mouseX, mouseY) {
        const width = 70;
        const height = 77.5;
        let component;
        if(this.manualInteraction) {
            component = new ThreeBitOutput(this.camera, ComponentType.THREE_BIT_OUTPUT, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";

            //component.rotate();
            //component.rotate();
        } else {
            component = new ThreeBitOutput(this.camera, ComponentType.THREE_BIT_OUTPUT, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createFourBitOutput(x, y, mouseX, mouseY) {
        const width = 70;
        const height = 77.5;
        let component;
        if(this.manualInteraction) {
            component = new FourBitOutput(this.camera, ComponentType.FOUR_BIT_OUTPUT, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";

            component.rotate();
            component.rotate();
        } else {
            component = new FourBitOutput(this.camera, ComponentType.FOUR_BIT_OUTPUT, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createEightBitOutput(x, y, mouseX, mouseY) {
        const width = 70;
        const height = 153.5;
        let component;
        if(this.manualInteraction) {
            component = new EightBitOutput(this.camera, ComponentType.EIGHT_BIT_OUTPUT, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";

            component.rotate();
            component.rotate();
        } else {
            component = new EightBitOutput(this.camera, ComponentType.EIGHT_BIT_OUTPUT, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createTwoToOneMUX(x, y, mouseX, mouseY) {
        const width = 87;
        const height = 87;
        let component;
        if(this.manualInteraction) {
            component = new TwoToOneMUX(this.camera, ComponentType.TWO_TO_ONE_MUX, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new TwoToOneMUX(this.camera, ComponentType.TWO_TO_ONE_MUX, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createFourToOneMUX(x, y, mouseX, mouseY) {
        const width = 97;
        const height = 125;
        let component;
        if(this.manualInteraction) {
            component = new FourToOneMUX(this.camera, ComponentType.FOUR_TO_ONE_MUX, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new FourToOneMUX(this.camera, ComponentType.FOUR_TO_ONE_MUX, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createEightToOneMUX(x, y, mouseX, mouseY) {
        const width = 97;
        const height = 200;
        let component;
        if(this.manualInteraction) {
            component = new EightToOneMUX(this.camera, ComponentType.EIGHT_TO_ONE_MUX, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new EightToOneMUX(this.camera, ComponentType.EIGHT_TO_ONE_MUX, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createOneToTwoDEMUX(x, y, mouseX, mouseY) {
        const width = 87;
        const height = 87;
        let component;
        if(this.manualInteraction) {
            component = new OneToTwoDEMUX(this.camera, ComponentType.ONE_TO_TWO_DEMUX, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new OneToTwoDEMUX(this.camera, ComponentType.ONE_TO_TWO_DEMUX, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createOneToFourDEMUX(x, y, mouseX, mouseY) {
        const width = 97;
        const height = 125;
        let component;
        if(this.manualInteraction) {
            component = new OneToFourDEMUX(this.camera, ComponentType.ONE_TO_FOUR_DEMUX, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new OneToFourDEMUX(this.camera, ComponentType.ONE_TO_FOUR_DEMUX, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    createOneToEightDEMUX(x, y, mouseX, mouseY) {
        const width = 97;
        const height = 200;
        let component;
        if(this.manualInteraction) {
            component = new OneToEightDEMUX(this.camera, ComponentType.ONE_TO_EIGHT_DEMUX, getRandomNumberId(), x - width / 2, y - height / 2, width, height, this.nodeManager);
            component.isDragging = true;
            component.element.style.visibility = "hidden";
        } else {
            component = new OneToEightDEMUX(this.camera, ComponentType.ONE_TO_EIGHT_DEMUX, getRandomNumberId(), x, y, width, height, this.nodeManager);
        }
        component.lastMousePosition = { x: mouseX, y: mouseY };
        this.components.push(component);

        return component;
    }

    getComponentById(componentId) {
        let desirredComponent;
        this.components.forEach((component) => {
            if(component.id === componentId) {
                desirredComponent = component;
                return;
            }
        });
        return desirredComponent;
    }

    lockComponentControls(value) {
        this.components.forEach((component) => component.lockControls(value));
    }

    deleteComponent(component) {
        if(!component) return;

        // TODO: Find a more elegant solution:
        if(component.editable) return;

        component.nodes.forEach((node) => {
            this.nodeManager.deleteGeneralNode(node);
        });
        component.nodes = [];
        component.element.remove();

        if(component.componentType === ComponentType.RESISTOR) {
            this.resistorCount--;
            if(this.resistorCount === 0) 
                stateManager.resistorPresent.set(false);
        } else if(component.componentType === ComponentType.GROUND) {
            this.groundCount--;
            if(this.groundCount === 0) 
                stateManager.groundPresent.set(false);
        } else if(component.componentType === ComponentType.TRANSISTOR) {
            this.transistorCount--;
            if(this.transistorCount === 0) 
                stateManager.transistorPresent.set(false);
        }
        this.components.splice(this.components.indexOf(component), 1);
    }

    deleteComponentById(componentId) {
        const component = this.getComponentById(componentId);
        this.deleteComponent(component);
    }

    clearAllComponents() {
        const components = [...this.components];
        components.forEach((component) => {
            if(component.componentType === ComponentType.TEXT_FIELD) component.editable = false;
            this.deleteComponent(component);
        });
    }
}
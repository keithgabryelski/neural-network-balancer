const { Engine, Render, Runner, Composites, Common, MouseConstraint, Mouse, Composite, Bodies } =
  Matter;

class Scene {
  constructor() {
    this.title = 'Gravity';
    this.for = '>0.16.1';
    this.engine = null;
    this.world = null;
    this.render = null;
    this.runner = null;
    this.mouse = null;
    this.mouseConstraint = null;
  }

  createWorld() {
    // create engine
    this.engine = Engine.create();
    this.engine.gravity.y = 1;

    this.world = this.engine.world;

    // create renderer
    this.render = Render.create({
      element: document.body,
      engine: this.engine,
      options: {
        width: 800,
        height: 600,
        showVelocity: true,
        showAngleIndicator: true,
      },
    });
    Render.run(this.render);
    // create runner
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
  }

  createSceneFrame() {
    Composite.add(this.world, [
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ]);
  }

  createSealBody() {
    return Bodies.polygon(200, 600 - 50, 3, 50);
  }
  createStick() {
    return Bodies.rectangle(220, 600 - 150, 20, 50);
  }

  addBodies() {
    Composite.add(this.world, [this.createSealBody(), this.createStick()]);
  }

  addControls() {
    // add mouse control
    this.mouse = Mouse.create(this.render.canvas);
    this.mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: this.mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(this.world, this.mouseConstraint);

    // keep the mouse in sync with rendering
    this.render.mouse = this.mouse;
  }

  pointCamera() {
    // fit the render viewport to the scene
    Render.lookAt(this.render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 },
    });
  }

  stop() {
    Matter.Render.stop(this.render);
    Matter.Runner.stop(this.runner);
  }
}

class Neuron {
  constructor() {
    this.weight = Math.random();
  }

  perceptron(input1, input2, output) {
    let outputP = input1 * this.weights[0] + input2 * this.weights[1] + this.bias * this.weights[2];
    if (outputP > 0) {
      // #activation function (here Heaviside)
      outputP = 1;
    } else {
      outputP = 0;
    }
    const error = output - outputP;
    this.weights[0] += error * input1 * this.lr;
    this.weights[1] += error * input2 * this.lr;
    this.weights[2] += error * this.bias * this.lr;
  }
}

class Brain {
  constructor(neurons, learningRate, bias) {
    // #learning rate
    this.learningRate = learningRate;
    // #value of bias
    this.bias = bias;
    // weights generated in a list (3 weights in total for 2 neurons and the bias)
    this.neurons = neurons;
  }

  perceptron(input1, input2, output) {
    let outputP = input1 * this.weights[0] + input2 * this.weights[1] + this.bias * this.weights[2];
    if (outputP > 0) {
      // #activation function (here Heaviside)
      outputP = 1;
    } else {
      outputP = 0;
    }
    const error = output - outputP;
    this.weights[0] += error * input1 * this.lr;
    this.weights[1] += error * input2 * this.lr;
    this.weights[2] += error * this.bias * this.lr;
  }
}

// neurons
//  move -- left, right with speed (float)
//  neck extension -- up, down -- noextension/nocompression = 0 (float)
//  nose angle -- 45 to 135 - number
//

class SealBrain extends Brain {
  constructor(learningRate, bias) {
    super([new MovementNeuron(), new NeckNeuron(), new NoseNeuron()], learningRate, bias);
  }
}

class NeuralNetwork {
  constructor() {
    // #learning rate
    this.lr = 1;
    // #value of bias
    this.bias = 1;
    // weights generated in a list (3 weights in total for 2 neurons and the bias)

    this.weights = [Math.random(), Math.random(), Math.random()];
  }

  perceptron(input1, input2, output) {
    let outputP = input1 * this.weights[0] + input2 * this.weights[1] + this.bias * this.weights[2];
    if (outputP > 0) {
      // #activation function (here Heaviside)
      outputP = 1;
    } else {
      outputP = 0;
    }
    const error = output - outputP;
    this.weights[0] += error * input1 * this.lr;
    this.weights[1] += error * input2 * this.lr;
    this.weights[2] += error * this.bias * this.lr;
  }
}

class SealBrain {
  constructor() {
    // #learning rate
    this.lr = 1;
    // #value of bias
    this.bias = 1;
    // weights generated in a list (3 weights in total for 2 neurons and the bias)
    this.weights = [Math.random(), Math.random(), Math.random()];
  }

  perceptron(input1, input2, output) {
    let outputP = input1 * this.weights[0] + input2 * this.weights[1] + this.bias * this.weights[2];
    if (outputP > 0) {
      // #activation function (here Heaviside)
      outputP = 1;
    } else {
      outputP = 0;
    }
    const error = output - outputP;
    this.weights[0] += error * input1 * this.lr;
    this.weights[1] += error * input2 * this.lr;
    this.weights[2] += error * this.bias * this.lr;
  }
}

class Seal {
  constructor() {
    this.brain = new NeuralNetwork();
  }
}

function initScene() {
  const scene = new Scene();
  scene.createWorld();
  scene.createSceneFrame();
  scene.addBodies();
  scene.addControls();
  scene.pointCamera();
  return scene;
}

function initSeal() {
  const seal = new NeuralNetwork();
  for (let i = 0; i < 50; ++i) {
    seal.perceptron(1, 1, 1); // #True or true
    seal.perceptron(1, 0, 1); // #True or false
    seal.perceptron(0, 1, 1); // #False or true
    seal.perceptron(0, 0, 0); // #False or false
  }
  return seal;
}

function checkSealOnce(seal, x, y) {
  let outputP = x * seal.weights[0] + y * seal.weights[1] + seal.bias * seal.weights[2];
  if (outputP > 0) {
    //: #activation function
    outputP = 1;
  } else {
    outputP = 0;
  }
  console.info(x, 'or', y, 'is : ', outputP);
}

function checkSeal(seal) {
  for (let i = 0; i < 10; ++i) {
    checkSealOnce(seal, Math.random(), Math.random());
  }
}

function init() {
  initScene();
  const seal = initSeal();
  checkSeal(seal);
}

init();

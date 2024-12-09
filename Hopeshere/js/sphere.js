import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee); // Add a light background for contrast

// Create a Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 50;

// Mouse Position for Raycaster
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

// Track the loaded model and its status
let object;
let isModelLoaded = false;

// Animation lock to prevent spamming
let isAnimating = false;

// Mouse position for rotation
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// OrbitControls
let controls;

//using Tracery API to MadLibs phrases
function makePhrase(){
  let phrases = {
    "origin": ["#phrase#"], //lets it get a random phrase
    "phrase":[
      "#open#, #action# #elaborate#.", 
      "#open#, #advice#. #optimism#!", 
      "#open#, #advice# #elaborate#.", 
      "#compare#, #advice#.", 
      "#compare#, #action#!", 
      "#action#, #optimism#! #open#. "

    ], 

    //all snippets should be in lowercase. That gets adjusted later
    //structure
    "open": [
      "everything happens for a reason",
      "the universe has a plan for you",
      "you're exactly where you're supposed to be",
      "this is all part of your journey", 
      "your fate was sealed upon creation", 
    ], 
    "elaborate": [//adds onto preceding statement
      "because success is just around the corner", 
      "and you will find amazing things", 
    ], 

    //flavor
    "action": [
      "embrace the struggle", 
      "don't stop moving", 
      "smile through the pain", 
      "keep your head held high", 
    ], 
    "advice": [
      "ignore those who differ from you", 
      "believe harder", 
      "rise to the occasion", 
    ], 
    "optimism": [
      "never give up", 
      "hope will come your way", 
      "your future self will thank you", 
      ", and that's more than enough", 
    ], 
    "compare": [
      "life is like #object#", 
      "sometimes you feel like #object#", 
    ], 
    "object": [ //include nescessary articles
      "a box of chocolates", 
      "a rose", 
      "an oppossum", 
      "a candle", 
      "a boomerang", 
    ]
  };

  //sets up the grammar structure
  const traceryGrammar = tracery.createGrammar(phrases);

  //gets a complete sentence, then fixes capitalization
  let sentence = traceryGrammar.flatten("#origin#").split("");
  // console.log(sentence)

  //capitalizes first letter
  sentence[0] = sentence[0].toUpperCase();
  //runs through each character
  for(let i=0; i<sentence.length; i++){
      // console.log(i + ": " + sentence[i])
      // console.log(sentence.length)

      //capitalizes the first letter after a period
      if ((sentence[i] == "." || sentence[i] == "!" || sentence[i] == "?") && i+2 < sentence.length){ 
          sentence[i+2] = sentence[i+2].toUpperCase();
      }
  }

  //turns the sentence back into a string and outputs it
  console.log(sentence.join(""));
  return sentence.join("");
}

/*// Predefined phrases. Whoever made these, Michael borrowed snippets from them. 
//Be sure to give yourself credit
const phrases = [
  "You're doing your best, and that's more than enough",
  "Click me again!",
  "You light up every room",
  "Peace is your natural state",
  "You don't need anything, you are everything",
  "Surrender to the infinte moment",
  "What a click!",
  "Haoppiness is your greatest strength",
  "Shit happens, it's ok!",
  "Everyone starts with baby steps",
  ":)",
  "<3",
  "You don't have to be great to start, but you have to start to be great!",
  "You are capable of more than you know",
  "Look how far you've come!",
  "Your mind is your only limit",
  "You matter",
  "I'm proud of you!",
  "Keep going! Don't stop!"
];*/

// GLTFLoader for 3D Model
const loader = new GLTFLoader();
loader.load(
  `models/cyber_orb/scene.gltf`,
  function (gltf) {
    object = gltf.scene;
    object.scale.set(7, 7, 7);
    scene.add(object);
    isModelLoaded = true;

    console.log("Model added to the scene:", object);
    renderer.render(scene, camera); // Render immediately after adding the model
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error(error);
  }
);

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);
renderer.render(scene, camera); // Initial render

// Lighting
const topLight = new THREE.DirectionalLight(0xffffff, 1.5);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 2);
scene.add(ambientLight);

// OrbitControls
controls = new OrbitControls(camera, renderer.domElement);

// Animation Function
function animate() {
  if (!isModelLoaded) {
    requestAnimationFrame(animate); // Wait for the model to load
    return;
  }

  requestAnimationFrame(animate);

  if (controls) {
    controls.update();
  }

  // Rotate object with mouse movement
  if (object) {
    object.rotation.y = -3 + (mouseX / window.innerWidth) * 3;
    object.rotation.x = -1.2 + (mouseY * 2.5) / window.innerHeight;
  }

  renderer.render(scene, camera);
}

// Handle Window Resize
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Detect Mouse Clicks
window.addEventListener("click", (event) => {
  if (!isModelLoaded || isAnimating) return;

  // Update mouse position for raycasting
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(object, true);

  if (intersects.length > 0) {
    // Play scale animation on the root object only
    playScaleAnimation(object);
    displayPhrase(object.position);
  }
});

// Scale Animation
function playScaleAnimation(target) {
  if (isAnimating) return;
  isAnimating = true; // Lock further clicks during animation

  const initialScale = target.scale.clone();

  // Faster animation speed
  const duration = 150; // Animation in milliseconds
  const scaleUp = new THREE.Vector3(initialScale.x * 1.5, initialScale.y * 1.5, initialScale.z * 1.5);

  // Scale up
  const scaleUpTween = {
    elapsedTime: 0,
    animate() {
      if (this.elapsedTime < duration) {
        this.elapsedTime += 16; // Simulating ~60FPS (16ms per frame)
        const factor = this.elapsedTime / duration;
        target.scale.lerpVectors(initialScale, scaleUp, factor);
        requestAnimationFrame(this.animate.bind(this));
      } else {
        playScaleDownAnimation(target, scaleUp);
      }
    },
  };

  scaleUpTween.animate();
}

// Scale Down Animation
function playScaleDownAnimation(target, scaleUp) {
  const initialScale = scaleUp;
  const scaleDown = new THREE.Vector3(initialScale.x / 1.5, initialScale.y / 1.5, initialScale.z / 1.5);

  const duration = 150; // Animation in milliseconds

  // Scale down
  const scaleDownTween = {
    elapsedTime: 0,
    animate() {
      if (this.elapsedTime < duration) {
        this.elapsedTime += 16; // Simulating ~60FPS (16ms per frame)
        const factor = this.elapsedTime / duration;
        target.scale.lerpVectors(initialScale, scaleDown, factor);
        requestAnimationFrame(this.animate.bind(this));
      } else {
        target.scale.copy(scaleDown); // Ensure final scale
        isAnimating = false; // Unlock animation
      }
    },
  };

  scaleDownTween.animate();
}

// Display a random phrase with motion and fade-out effect
function displayPhrase(position) {
  // const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  const randomPhrase = makePhrase()

  // Create a DOM element for the phrase
  const phraseElement = document.createElement("div");
  phraseElement.style.position = "absolute";
  phraseElement.style.color = "black";
  phraseElement.style.background = "rgba(255, 255, 255, 0.8)";
  phraseElement.style.padding = "5px 10px";
  phraseElement.style.borderRadius = "5px";
  phraseElement.style.fontSize = "16px";
  phraseElement.style.transition = "transform 2s ease-out, opacity 3s ease-out";
  phraseElement.innerText = randomPhrase;

  document.body.appendChild(phraseElement);

  // Position it relative to the object
  const vector = position.clone().project(camera);
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;

  phraseElement.style.left = `${x}px`;
  phraseElement.style.top = `${y}px`;

  // Random angle for movement
  const angle = Math.random() * 2 * Math.PI;
  const moveX = Math.cos(angle) * 150; // Move 50px in random direction
  const moveY = Math.sin(angle) * 150;

  // Animate phrase
  setTimeout(() => {
    phraseElement.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.5)`;
    phraseElement.style.opacity = "0";
  }, 0);

  // Remove the phrase after 1 second
  setTimeout(() => {
    document.body.removeChild(phraseElement);
  }, 1000);
}

// Mouse Movement for Rotation
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

// Start the Animation Loop
animate();

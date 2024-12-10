import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const container3D = document.getElementById('container3D');
container3D.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 5);
controls.update();

// Load 3D model
const loader = new GLTFLoader();
let clickableObject;

loader.load(
  'models/cyber_orb/scene.gltf',
  (gltf) => {
    console.log('Model loaded:', gltf);
    clickableObject = gltf.scene;
    scene.add(gltf.scene);
  },
  undefined,
  (error) => console.error('Error loading model:', error)
);

// Raycaster for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event listener for mouse clicks
function onClick(event) {
  // Convert mouse position to normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update raycaster and check intersections
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(clickableObject, true);

  if (intersects.length > 0) {
    // Display a message when the object is clicked
    const messageDiv = document.getElementById('message');
    messageDiv.innerText = 'You clicked the orb!';
    messageDiv.style.color = 'white';
    messageDiv.style.background = 'black';
    messageDiv.style.padding = '10px';
  }
}

window.addEventListener('click', onClick);
if (!clickableObject) return; 
// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
// Reference the audio element
const audioElement = document.getElementById('background-audio');

// Function to toggle play/pause
function toggleAudio() {
  if (audioElement.paused) {
    audioElement.play(); // Play the audio if paused
  } else {
    audioElement.pause(); // Pause the audio if playing
  }
}

// Optionally, you can add more advanced audio controls here
// Example: Adjust volume
function setVolume(volume) {
  audioElement.volume = volume; // Volume ranges from 0.0 to 1.0
}

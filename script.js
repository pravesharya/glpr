import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader";
import { OrbitControls } from "OrbitControls";

let width = window.innerWidth;
let height = window.innerHeight;

const canvas = document.querySelector("#canvas");
const btnM1 = document.querySelector("#m1");
const btnM2 = document.querySelector("#m2");

const gltfLoader = new GLTFLoader();

let renderer, camera, scene;
let model, size, controls;

async function loadModel(modelPath = "./assets/m1.glb") {
  const gltf = await new Promise((resolve) => {
    gltfLoader.load(modelPath, (gltf) => {
      resolve(gltf); // Resolve with entire gltf object, not just scene
    });
  });
  model = gltf.scene;
  console.log(model);

  size = 0.25;
  model.scale.set(size, size, size);
  model.rotateY(-Math.PI/2);
  scene.add(model);
}

async function setupScene() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  
  camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
  camera.position.z = 3;
  
  scene = new THREE.Scene();
 

  const lightH = new THREE.HemisphereLight(0xffffff, 10);
  scene.add(lightH);

  // const lightD = new THREE.DirectionalLight(0xffffff, 1);
  // lightD.position.set(0, 1, 0);
  // lightD.target.position.set(0, 0, 0);
  // scene.add(lightD);

  const lightA = new THREE.AmbientLight(0x404040,10);
  scene.add(lightA);

  const floorG = new THREE.PlaneGeometry(3,3);
  const floorM = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const floor = new THREE.Mesh(floorG,floorM);
  scene.add(floor);
  floorM.side = THREE.DoubleSide;
  floor.rotateX(-Math.PI/2);
  floor.position.set(0,-0.29,0);
  floor.scale.set(0.8,1.2);

  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;

  loadModel();
  animate();
}
setupScene();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

btnM1.addEventListener("click", () => {
  scene.remove(model);
  loadModel("./assets/m1.glb");
});
btnM2.addEventListener("click", () => {
  scene.remove(model);
  loadModel("./assets/m2.glb");
});


window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
});

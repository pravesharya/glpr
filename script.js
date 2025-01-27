import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader";
import { OrbitControls } from "OrbitControls";

let width = window.innerWidth;
let height = window.innerHeight;

const canvas = document.querySelector("#canvas");
const btnM1 = document.querySelector("#m1");
const btnM2 = document.querySelector("#m2");
// const btnSI = document.querySelector("#sI");
// const btnSO = document.querySelector("#sO");

// const modelPath = "./assets/m1.glb";
const gltfLoader = new GLTFLoader();

let renderer, camera, scene, lightH, lightD, lightA;
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
  model.rotation.set(0, -90, 0);
  // model.position.set(0, -0.75, 0);
  // model.castShadow = true;
  scene.add(model);
}

async function setupScene() {
  camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
  camera.position.z = 3;
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.shadowMap.enabled = true;

  lightH = new THREE.HemisphereLight(0xffffff, 1);
  scene.add(lightH);

  // lightD = new THREE.DirectionalLight(0xffffff, 1);
  // lightD.position.set(0, 1, 0);
  // lightD.target.position.set(0, 0, 0);
  // scene.add(lightD);

  lightA = new THREE.AmbientLight(0x404040);
  scene.add(lightA);

  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;

  // const gltf = await new Promise((resolve) => {
  //   gltfLoader.load(modelPath, (gltf) => {
  //     resolve(gltf); // Resolve with entire gltf object, not just scene
  //   });
  // });
  // model = gltf.scene;
  // console.log(model);

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
// btnSI.addEventListener("click", () => {
//   model.scale.x += 0.1;
//   model.scale.y += 0.1;
//   model.scale.z += 0.1;
// });
// btnSO.addEventListener("click", () => {
//   model.scale.x -= 0.1;
//   model.scale.y -= 0.1;
//   model.scale.z -= 0.1;
// });

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

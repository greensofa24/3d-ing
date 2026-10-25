import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

const slots = [-4, -2, 0, 2, 4];

// tetrahedron
const tetrahedronGeometry = new THREE.TetrahedronGeometry(1, 0);

const tetrahedronMaterials = [];
for (let i = 0; i < 4; i++) {
  const color = new THREE.Color();
  
  const hue = i / 4;
  color.setHSL(hue, 1.0, 0.5);

  tetrahedronMaterials.push(new THREE.MeshBasicMaterial({ color: color }));
  tetrahedronGeometry.addGroup(i * 3, 3, i);
}

const tetrahedron = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterials);
scene.add(tetrahedron);

tetrahedron.scale.set(0.8, 0.8, 0.8);

// cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

const cubeMaterials = [];
for (let i = 0; i < 6; i++) {
  const color = new THREE.Color();
  
  const hue = i / 6;
  color.setHSL(hue, 1.0, 0.5);

  cubeMaterials.push(new THREE.MeshBasicMaterial({ color: color }));
}

const cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
scene.add(cube);

// octahedron
let octahedronGeometry = new THREE.OctahedronGeometry(1, 0);

const octahedronMaterials = [];
for (let i = 0; i < 8; i++) {
  const color = new THREE.Color();
  
  const hue = i / 8;
  color.setHSL(hue, 1.0, 0.5);

  octahedronMaterials.push(new THREE.MeshBasicMaterial({ color: color }));
  octahedronGeometry.addGroup(i * 3, 3, i);
}

const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterials);
scene.add(octahedron);

octahedron.scale.set(0.85, 0.85, 0.85);

// dodecahedron
const dodecahedronGeometry = new THREE.DodecahedronGeometry(1, 0);

const dodecahedronMaterials = [];
for (let i = 0; i < 12; i++) {
  const color = new THREE.Color();
  
  const hue = i / 12;
  color.setHSL(hue, 1.0, 0.5);

  dodecahedronMaterials.push(new THREE.MeshBasicMaterial({ color: color }));
  dodecahedronGeometry.addGroup(i * 9, 9, i);
}

const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterials);
scene.add(dodecahedron);

dodecahedron.scale.set(0.8, 0.8, 0.8);

// icosahedron
const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0);

const icosahedronMaterials = [];
for (let i = 0; i < 20; i++) {
  const color = new THREE.Color();
  
  const hue = i / 20;
  color.setHSL(hue, 1.0, 0.5);

  icosahedronMaterials.push(new THREE.MeshBasicMaterial({ color: color }));
  icosahedronGeometry.addGroup(i * 3, 3, i);
}

const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterials);
scene.add(icosahedron);

icosahedron.scale.set(0.8, 0.8, 0.8);

// movement config
const objects = [tetrahedron, cube, octahedron, dodecahedron, icosahedron];

objects.forEach((obj, idx) => {
  obj.position.x = slots[idx];
  obj.userData = {
    currentSlot: idx,
    targetSlot: idx,
    startSlot: idx,
    progress: 1.0,
    arcDirection: 1
  };
});

// swapping
setInterval(() => {
  let idxA = Math.floor(Math.random() * objects.length);
  let idxB = Math.floor(Math.random() * objects.length);
  while (idxA === idxB) {
    idxB = Math.floor(Math.random() * objects.length);
  }

  const objA = objects[idxA];
  const objB = objects[idxB];

  objA.userData.startSlot = objA.userData.currentSlot;
  objA.userData.targetSlot = objB.userData.currentSlot;
  objA.userData.progress = 0;

  objA.userData.arcDirection = objA.userData.targetSlot > objA.userData.startSlot ? 1 : -1;

  objB.userData.startSlot = objB.userData.currentSlot;
  objB.userData.targetSlot = objA.userData.currentSlot;
  objB.userData.progress = 0;
  objB.userData.arcDirection = objB.userData.targetSlot > objB.userData.startSlot ? 1 : -1;

  objA.userData.currentSlot = objA.userData.targetSlot;
  objB.userData.currentSlot = objB.userData.targetSlot;
}, 500);

// animation
function animate() {
  requestAnimationFrame(animate);

  const hueShift = 0.003;
  const transitionSpeed = 0.04;
  const arcHeight = 1.5;

  [cube, tetrahedron, octahedron, dodecahedron, icosahedron].forEach((object) => {
    object.rotation.x += 0.01;
    object.rotation.y += 0.013;
    object.rotation.z += 0.007;

    object.material.forEach((material) => {
      const hsl = {};
      material.color.getHSL(hsl);

      let newHue = (hsl.h + hueShift) % 1.0;
      material.color.setHSL(newHue, hsl.s, hsl.l);
    });

    if (object.userData.progress < 1.0) {
      object.userData.progress += transitionSpeed;
      if (object.userData.progress > 1.0) object.userData.progress = 1.0;

      const p = object.userData.progress;
      const startX = slots[object.userData.startSlot];
      const targetX = slots[object.userData.targetSlot];

      object.position.x = startX + (targetX - startX) * p;

      object.position.y = Math.sin(p * Math.PI) * arcHeight * object.userData.arcDirection;
    }
  });

  renderer.render(scene, camera);
}

animate();

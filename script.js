import * as THREE from 'three';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

// cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // 0: Right (+X)
    new THREE.MeshBasicMaterial({ color: 0x00ffff }), // 1: Left (-X)
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // 2: Top (+Y)
    new THREE.MeshBasicMaterial({ color: 0xff00ff }), // 3: Bottom (-Y)
    new THREE.MeshBasicMaterial({ color: 0x0000ff }), // 4: Front (+Z)
    new THREE.MeshBasicMaterial({ color: 0xffff00 })  // 5: Back (-Z)
];
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

const cubeEdgesGeometry = new THREE.EdgesGeometry(cube.geometry); 
const cubeLineGeometry = new LineSegmentsGeometry().fromEdgesGeometry(cubeEdgesGeometry); 

const lineMaterial = new LineMaterial({
  color: 0xffffff,
  linewidth: 5
});
lineMaterial.resolution.set(window.innerWidth, window.innerHeight);

const outline = new LineSegments2(cubeLineGeometry, lineMaterial);
cube.add(outline);

// animation
const radius = 2;
const speed = 0.0015;

function animate(timestamp) {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.013;
  cube.rotation.z += 0.007;

  const time = timestamp * speed; 

  cube.position.x = Math.cos(time) * radius;
  cube.position.y = Math.cos(time * 3 / 2) * radius * 1 / 2;
  cube.position.z = Math.sin(time) * radius;

  const hueShift = 0.003;

  cube.material.forEach((material) => {
    const hsl = {};
    material.color.getHSL(hsl);

    let newHue = (hsl.h + hueShift) % 1.0;
    material.color.setHSL(newHue, hsl.s, hsl.l);
  });

  renderer.render(scene, camera);
}

animate();

/*const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", clickHandler);

function clickHandler(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([cube]);

  if (intersects.length > 0) {
    const materialIndex = intersects[0].face.materialIndex;
    const material = cube.material[materialIndex];

    const hueShift = 1/6;
  
    const hsl = {};
    material.color.getHSL(hsl);

    let newHue = (hsl.h + hueShift) % 1.0;
    material.color.setHSL(newHue, hsl.s, hsl.l);
  }
}*/

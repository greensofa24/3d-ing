import * as THREE from 'three';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const initialDistance = 5;
const baseLineWidth = 5;

camera.position.z = initialDistance;

// cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // 0: Right (+X)
    new THREE.MeshBasicMaterial({ color: 0xff8000 }), // 1: Left (-X)
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // 2: Top (+Y)
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // 3: Bottom (-Y)
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // 4: Front (+Z)
    new THREE.MeshBasicMaterial({ color: 0x0000ff })  // 5: Back (-Z)
];
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

const cubeEdgesGeometry = new THREE.EdgesGeometry(cube.geometry); 
const cubeLineGeometry = new LineSegmentsGeometry().fromEdgesGeometry(cubeEdgesGeometry); 

const lineMaterial = new LineMaterial({
  color: 0x000000,
  linewidth: baseLineWidth
});
lineMaterial.resolution.set(window.innerWidth, window.innerHeight);

const outline = new LineSegments2(cubeLineGeometry, lineMaterial);
cube.add(outline);

// animation
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  const currentDistance = camera.position.distanceTo(cube.position);
  lineMaterial.linewidth = baseLineWidth * (initialDistance / currentDistance);

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

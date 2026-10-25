import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

// sphere
const geometry = new THREE.SphereGeometry(1, 32, 32); 

const vertexCount = geometry.attributes.position.count;

const colors = [];
const tempPosition = new THREE.Vector3();
const color = new THREE.Color();

for (let i = 0; i < vertexCount; i++) {
  tempPosition.fromBufferAttribute(geometry.attributes.position, i);

  const r = (tempPosition.x + 1.0) / 2.0;
  const g = (tempPosition.y + 1.0) / 2.0;
  const b = (tempPosition.z + 1.0) / 2.0;

  colors.push(r, g, b);
}

geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

const material = new THREE.MeshBasicMaterial({
  vertexColors: true
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// sphere 2
const geometry2 = new THREE.SphereGeometry(1, 32, 32); 

const material2 = new THREE.MeshBasicMaterial();

const sphere2 = new THREE.Mesh(geometry2, material2);
scene.add(sphere2);

// animation
function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.013;
  sphere.rotation.z += 0.007;

  renderer.render(scene, camera);
}

animate();
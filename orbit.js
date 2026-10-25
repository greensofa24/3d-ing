import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 10;

// sphere
const geometry = new THREE.SphereGeometry(1, 32, 32); 

const vertexCount = geometry.attributes.position.count;

const colors = [];
const tempPosition = new THREE.Vector3();

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
const geometry2 = new THREE.SphereGeometry(0.4, 32, 32); 

const vertexCount2 = geometry2.attributes.position.count;

const colors2 = [];
const tempPosition2 = new THREE.Vector3();

for (let i = 0; i < vertexCount2; i++) {
  tempPosition2.fromBufferAttribute(geometry2.attributes.position, i);

  const r = (tempPosition2.x + 1.0) / 2.0;
  const g = (tempPosition2.y + 1.0) / 2.0;
  const b = (tempPosition2.z + 1.0) / 2.0;

  colors2.push(r, g, b);
}

geometry2.setAttribute('color', new THREE.Float32BufferAttribute(colors2, 3))

const material2 = new THREE.MeshBasicMaterial({
  vertexColors: true
});

const sphere2 = new THREE.Mesh(geometry2, material2);
scene.add(sphere2);

let angle = 0;
const orbitRadius = 3;
const orbitSpeed = 0.01;

const tiltAngle = THREE.MathUtils.degToRad(35); 
sphere2.rotation.z = THREE.MathUtils.degToRad(25);

// animation
function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.013;
  sphere.rotation.z += 0.007;

  angle += orbitSpeed;

  const flatX = Math.cos(angle) * orbitRadius;
  const flatZ = Math.sin(angle) * orbitRadius;

  const tiltedX = flatX; 
  const tiltedY = flatZ * Math.sin(tiltAngle);
  const tiltedZ = flatZ * Math.cos(tiltAngle);

  sphere2.position.x = sphere.position.x + tiltedX;
  sphere2.position.y = sphere.position.y + tiltedY;
  sphere2.position.z = sphere.position.z + tiltedZ;

  sphere2.rotateY(0.03);

  renderer.render(scene, camera);
}

animate();

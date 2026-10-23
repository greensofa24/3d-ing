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

// cube outline
const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 5 });
const outline = new THREE.LineSegments(edges, lineMaterial);

cube.add(outline);

// tetrahedron
const tetrahedronGeometry = new THREE.TetrahedronGeometry(1, 0);

tetrahedronGeometry.addGroup(0, 3, 0);
tetrahedronGeometry.addGroup(3, 3, 1);
tetrahedronGeometry.addGroup(6, 3, 2);
tetrahedronGeometry.addGroup(9, 3, 3);

const tetrahedronMaterials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    new THREE.MeshBasicMaterial({ color: 0x80ff00 }),
    new THREE.MeshBasicMaterial({ color: 0x00ffff }),
    new THREE.MeshBasicMaterial({ color: 0x8000ff })
];

const tetrahedron = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterials);
scene.add(tetrahedron);

tetrahedron.scale.set(0.8, 0.8, 0.8);

// tetrahedron outline
const tetrahedronEdges = new THREE.EdgesGeometry(tetrahedronGeometry);
const tetrahedronLineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 5 });
const tetrahedronOutline = new THREE.LineSegments(tetrahedronEdges, tetrahedronLineMaterial);

tetrahedron.add(tetrahedronOutline);

// animation
function animate(timestamp) {
  requestAnimationFrame(animate);

  const radius = 2;
  const speed = 0.001;
  
  const time = timestamp * speed; 

  tetrahedron.position.x = Math.cos(time) * radius;
  tetrahedron.position.y = Math.sin(time) * radius;

  const hueShift = 0.003;

  [cube, tetrahedron].forEach((object) => {
    object.rotation.x += 0.01;
    object.rotation.y += 0.013;
    object.rotation.z += 0.007;

    object.material.forEach((material) => {
      const hsl = {};
      material.color.getHSL(hsl);

      let newHue = (hsl.h + hueShift) % 1.0;
      material.color.setHSL(newHue, hsl.s, hsl.l);
    });
  });

  renderer.render(scene, camera);
}

animate();

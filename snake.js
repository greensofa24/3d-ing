import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const greenMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00
});
const yellowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00
});
const orangeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffa500
});
const redMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000
});

let width = 15;
let height = 15;
let depth = 15;

const wireGeometry = new THREE.BoxGeometry(width, height, depth);
const wireMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffffff, 
    wireframe: true 
});
const box = new THREE.Mesh(wireGeometry, wireMaterial);
scene.add(box);

const solidMaterial = new THREE.MeshBasicMaterial({
    color: 0x222233,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.6
});
const solidBox = new THREE.Mesh(wireGeometry, solidMaterial);
scene.add(solidBox);

let snake = [{
    x: 0,
    y: 0,
    z: 0
}];

let distance = 20;
let targetRotation = new THREE.Quaternion();
let currentRotation = new THREE.Quaternion();

const baselinePosition = new THREE.Vector3(0, 0, distance);
camera.position.copy(baselinePosition);
camera.lookAt(0, 0, 0);

let apple = {};
newApple();

let queue = [];
let direction = {
    x: 0,
    y: 0,
    z: 0
};

let alive = true;
let lastTime = 0;
let accumulator = 0;
const delay = 200;

function gameLoop(timestamp) {
    if (!alive) return;

    if (!lastTime) {
        lastTime = timestamp;
    }

    accumulator += timestamp - lastTime;
    lastTime = timestamp;

    while (accumulator >= delay) {
        move();
        accumulator -= delay;
    }

    currentRotation.slerp(targetRotation, 0.1);

    const animatedPos = baselinePosition.clone().applyQuaternion(currentRotation);
    camera.position.copy(animatedPos);

    const dynamicUp = new THREE.Vector3(0, 1, 0).applyQuaternion(currentRotation);
    camera.up.copy(dynamicUp);

    camera.lookAt(0, 0, 0);

    if (!alive) return;
    draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

function move() {
    if (direction.x == 0 && direction.y == 0 && direction.z == 0) {
        return;
    }

    if (snake.length >= 2) {
        snake.pop();
        snake.unshift({ ...snake[0] });
    }

    snake[0].x += direction.x;
    snake[0].y += direction.y;
    snake[0].z += direction.z;

    update();
}

function die() {
    alive = false;
}

function processNextInput() {
    if (!queue.length) return;
    
    const input = queue.shift();
    let targetVec;

    const origQuat = camera.quaternion.clone();
    const origPos = camera.position.clone();
    const origUp = camera.up.clone();

    camera.position.copy(baselinePosition.clone().applyQuaternion(input.savedRotation));
    camera.up.copy(new THREE.Vector3(0, 1, 0).applyQuaternion(input.savedRotation));
    camera.lookAt(0, 0, 0);

    if (input.key === "arrowup")    targetVec = getScreenRelativeDirection(0, 1, 0);
    if (input.key === "arrowdown")  targetVec = getScreenRelativeDirection(0, -1, 0);
    if (input.key === "arrowleft")  targetVec = getScreenRelativeDirection(-1, 0, 0);
    if (input.key === "arrowright") targetVec = getScreenRelativeDirection(1, 0, 0);

    camera.quaternion.copy(origQuat);
    camera.position.copy(origPos);
    camera.up.copy(origUp);

    let lastDirection = queue.length ? queue[queue.length - 1] : direction;
    if (lastDirection.x !== -targetVec.x || lastDirection.y !== -targetVec.y || lastDirection.z !== -targetVec.z) {
        direction = targetVec;
    }
}

function update() {
    processNextInput();

    if (collisionCheck(snake[0], apple)) {
        snake.push({});
        newApple();
    }

    for (let i = 1; i < snake.length; i++) {
        if (collisionCheck(snake[0], snake[i])) {
            return die();
        }
    }

    if (Math.abs(snake[0].x) == (width + 1) / 2 || Math.abs(snake[0].y) == (height + 1) / 2 || Math.abs(snake[0].z) == (depth + 1) / 2) {
        return die();
    }
}

function collisionCheck(tile1, tile2) {
    return tile1.y == tile2.y && tile1.x == tile2.x && tile1.z == tile2.z;
}

function newApple() {
    function getPos() {
        return {
            x: Math.floor(Math.random() * width) - (width - 1) / 2,
            y: Math.floor(Math.random() * height) - (height - 1) / 2,
            z: Math.floor(Math.random() * depth) - (depth - 1) / 2
        };
    }

    let pos;

    do {
        pos = getPos();
    } while (snake.some(segment => collisionCheck(segment, pos)));

    apple = pos;
}

function draw() {
    const cubes = [];

    const halfW = (width - 1) / 2;
    const halfH = (height - 1) / 2;
    const halfD = (depth - 1) / 2;

    for (const segment of snake) {
        const distToX = halfW - Math.abs(segment.x);
        const distToY = halfH - Math.abs(segment.y);
        const distToZ = halfD - Math.abs(segment.z);
        
        const minDistance = Math.min(distToX, distToY, distToZ);

        let material = greenMaterial;

        if (minDistance <= 0.1) {
            material = orangeMaterial;
        } else if (minDistance <= 1.1) {
            material = yellowMaterial;
        }

        const cube = new THREE.Mesh(geometry, material);

        cube.position.set(segment.x, segment.y, segment.z);

        scene.add(cube);
        cubes.push(cube);
    }

    const cube = new THREE.Mesh(geometry, redMaterial);

    cube.position.set(apple.x, apple.y, apple.z);

    scene.add(cube);
    cubes.push(cube);

    renderer.render(scene, camera);

    for (const cube of cubes) {
        scene.remove(cube);
    }
}

update();

function getScreenRelativeDirection(screenX, screenY, screenZ) {
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const cameraUp = camera.up.clone().normalize();
    
    const cameraRight = new THREE.Vector3();
    cameraRight.crossVectors(cameraDirection, cameraUp).normalize();

    const worldMoveVector = new THREE.Vector3();
    worldMoveVector.addScaledVector(cameraRight, screenX);
    worldMoveVector.addScaledVector(cameraUp, screenY);
    worldMoveVector.addScaledVector(cameraDirection, screenZ);

    let dominantAxis = 'x';
    let maxVal = Math.abs(worldMoveVector.x);

    if (Math.abs(worldMoveVector.y) > maxVal) {
        dominantAxis = 'y';
        maxVal = Math.abs(worldMoveVector.y);
    }
    if (Math.abs(worldMoveVector.z) > maxVal) {
        dominantAxis = 'z';
    }

    const output = { x: 0, y: 0, z: 0 };
    output[dominantAxis] = Math.sign(worldMoveVector[dominantAxis]);
    return output;
}

function relativeRotateCamera(axisX, axisY, angle) {
    const targetAxis = new THREE.Vector3(axisX, axisY, 0).applyQuaternion(targetRotation);
    const step = new THREE.Quaternion().setFromAxisAngle(targetAxis, angle);
    targetRotation.premultiply(step);
}

addEventListener("keydown", (event) => {
    let lastDirection = queue.length ? queue[queue.length - 1] : direction;

    switch (event.key.toLowerCase()) {
        case "w":
            relativeRotateCamera(1, 0, -Math.PI / 2);
            break;

        case "s":
            relativeRotateCamera(1, 0, Math.PI / 2);
            break;

        case "a":
            relativeRotateCamera(0, 1, -Math.PI / 2);
            break;

        case "d":
            relativeRotateCamera(0, 1, Math.PI / 2);
            break;

        case "arrowup": {
            queue.push({ key: "arrowup", savedRotation: targetRotation.clone() });
            break;
        }
        case "arrowdown": {
            queue.push({ key: "arrowdown", savedRotation: targetRotation.clone() });
            break;
        }
        case "arrowleft": {
            queue.push({ key: "arrowleft", savedRotation: targetRotation.clone() });
            break;
        }
        case "arrowright": {
            queue.push({ key: "arrowright", savedRotation: targetRotation.clone() });
            break;
        }
    }

    if (direction.x == 0 && direction.y == 0 && direction.z == 0 && queue.length) {
        processNextInput();
    }
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

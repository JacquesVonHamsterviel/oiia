const scene = new THREE.Scene();
scene.background = new THREE.Color('#00b140');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enableRotate = false;

const loader = new THREE.GLTFLoader();
let catModel, rotationModel;
let currentModel;

const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

loader.load('/models/cat.glb', (gltf) => {
    catModel = gltf.scene;
    catModel.position.set(0, 0, 0);
    catModel.scale.set(2, 2, 2);
    scene.add(catModel);
    currentModel = catModel;
    animate();
});

loader.load('/models/rotation.glb', (gltf) => {
    rotationModel = gltf.scene;
    rotationModel.position.set(0, 0, 0);
    rotationModel.scale.set(0.3, 0.3, 0.3);

    setInterval(() => {
        const speed = speeds[Math.floor(Math.random() * speeds.length)];
        const audio = new Audio('/sounds/sound.mp3');
        audio.playbackRate = speed;
        audio.play();

        const rotationSpeed = 0.05 * speed;

        if (currentModel) scene.remove(currentModel);
        scene.add(rotationModel);
        currentModel = rotationModel;

        let rotationStartTime = Date.now();
        const rotateDuration = 2100 / speed;

        const rotationInterval = setInterval(() => {
            const elapsed = Date.now() - rotationStartTime;
            if (elapsed < rotateDuration) {
                rotationModel.rotation.y += rotationSpeed;
            } else {
                clearInterval(rotationInterval);
                scene.remove(rotationModel);
                scene.add(catModel);
                currentModel = catModel;
            }
        }, 16);
    }, 2000);
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

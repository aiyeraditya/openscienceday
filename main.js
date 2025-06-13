const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Camera position
camera.position.z = 500;

// Lighting
const light = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(light);

// Create joints and bones
const jointGeometry = new THREE.SphereGeometry(5, 16, 16);
const jointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const joints = Array.from({ length: 33 }, () => {
  const sphere = new THREE.Mesh(jointGeometry, jointMaterial);
  scene.add(sphere);
  return sphere;
});

// Define key bone connections
const bones = [];
const boneMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

const CONNECTED_JOINTS = [
  [11, 13], [13, 15], // Left arm
  [12, 14], [14, 16], // Right arm
  [11, 12],           // Shoulders
  [23, 24],           // Hips
  [11, 23], [12, 24], // Torso
  [23, 25], [25, 27], // Left leg
  [24, 26], [26, 28]  // Right leg
];

CONNECTED_JOINTS.forEach(() => {
  const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const line = new THREE.Line(geometry, boneMaterial);
  scene.add(line);
  bones.push(line);
});

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Webcam setup
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
});

// Pose detection with MediaPipe
const pose = new Pose({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  selfieMode: true
});

pose.onResults(results => {
  if (!results.poseLandmarks) return;

  // Scale landmarks to 3D space
  results.poseLandmarks.forEach((lm, i) => {
    const x = (lm.x - 0.5) * window.innerWidth;
    const y = -(lm.y - 0.5) * window.innerHeight;
    const z = -lm.z * 100;
    joints[i].position.set(x, y, z);
  });

  // Update bones
  CONNECTED_JOINTS.forEach(([a, b], i) => {
    const start = joints[a].position;
    const end = joints[b].position;
    bones[i].geometry.setFromPoints([start, end]);
  });

  renderer.render(scene, camera);
});

// Process frames
async function processFrame() {
  await pose.send({ image: video });
  requestAnimationFrame(processFrame);
}

// Start
video.onloadeddata = () => processFrame();

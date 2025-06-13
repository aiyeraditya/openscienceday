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

// Define key bone connections for MoveNet (17 keypoints)
const bones = [];
const boneMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

const CONNECTED_JOINTS = [
  [0, 1], [1, 3], [0, 2], [2, 4], // Head to shoulders to elbows to wrists
  [0, 5], [5, 7], [7, 9],         // Left arm
  [0, 6], [6, 8], [8, 10],        // Right arm
  [5, 6],                         // Shoulders
  [5, 11], [6, 12],               // Torso sides
  [11, 12],                       // Hips
  [11, 13], [13, 15],             // Left leg
  [12, 14], [14, 16]              // Right leg
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

// --- TensorFlow.js and MoveNet MultiPose integration ---
let model;

async function loadModel() {
  model = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    {
      modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING
    }
  );
}

// Helper to create joints and bones for each person
function createPersonObjects() {
  const people = [];
  for (let i = 0; i < 6; i++) { // Up to 6 people
    const personJoints = Array.from({ length: 17 }, () => {
      const sphere = new THREE.Mesh(jointGeometry, jointMaterial);
      sphere.visible = false;
      scene.add(sphere);
      return sphere;
    });
    const personBones = CONNECTED_JOINTS.map(() => {
      const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const line = new THREE.Line(geometry, boneMaterial);
      line.visible = false;
      scene.add(line);
      return line;
    });
    people.push({ joints: personJoints, bones: personBones });
  }
  return people;
}

const people = createPersonObjects();

// Process frames
async function processFrame() {
  if (!model) return requestAnimationFrame(processFrame);
  const input = tf.browser.fromPixels(video);
  const predictions = await model.estimatePoses(input, { maxPoses: 6, flipHorizontal: false });
  input.dispose();

  // Hide all joints/bones by default
  people.forEach(person => {
    person.joints.forEach(j => j.visible = false);
    person.bones.forEach(b => b.visible = false);
  });

  predictions.forEach((pose, pIdx) => {
    if (pose.keypoints == null) return;
    const person = people[pIdx];
    pose.keypoints.forEach((kp, i) => {
      if (kp.score > 0.3) {
        const x = (kp.x - video.width/2);
        const y = -(kp.y - video.height/2);
        const z = 0;
        person.joints[i].position.set(x, y, z);
        person.joints[i].visible = true;
      } else {
        person.joints[i].visible = false;
      }
    });
    CONNECTED_JOINTS.forEach(([a, b], i) => {
      if (person.joints[a].visible && person.joints[b].visible) {
        person.bones[i].geometry.setFromPoints([
          person.joints[a].position,
          person.joints[b].position
        ]);
        person.bones[i].visible = true;
      } else {
        person.bones[i].visible = false;
      }
    });
  });

  renderer.render(scene, camera);
  requestAnimationFrame(processFrame);
}

// Start everything
video.onloadeddata = async () => {
  await loadModel();
  processFrame();
};

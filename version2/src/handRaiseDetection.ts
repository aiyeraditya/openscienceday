// handRaiseDetection.ts
// Module to detect if a person is raising both hands using pose landmarks

export interface PoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export function isBothHandsRaised(landmarks: PoseLandmark[]): boolean {
  // Indices for key landmarks (using BlazePose or similar):
  // 11: left shoulder, 12: right shoulder, 15: left wrist, 16: right wrist
  const leftShoulder = landmarks[1];
  const rightShoulder = landmarks[2];
  const leftWrist = landmarks[9];
  const rightWrist = landmarks[10];

  if (!leftShoulder || !rightShoulder || !leftWrist || !rightWrist) return false;

  // Check if both wrists are above their respective shoulders (y is smaller when higher)
  const leftHandRaised = leftWrist.y < leftShoulder.y;
  const rightHandRaised = rightWrist.y < rightShoulder.y;

  return leftHandRaised && rightHandRaised;
}

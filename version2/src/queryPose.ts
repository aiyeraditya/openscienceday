// handRaiseDetection.ts
// Module to detect if a person is raising both hands using pose landmarks

export interface PoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export function isBothHandsRaised(landmarks: PoseLandmark[]): boolean {

  const nose = landmarks[0];
  const leftElbow = landmarks[7];
  const rightElbow = landmarks[8];

  if (!nose || !leftElbow || !rightElbow) return false;

  // Check if both wrists are above their respective shoulders (y is smaller when higher)
  const leftHandRaised = nose.y > leftElbow.y;
  const rightHandRaised = nose.y > rightElbow.y;

  return leftHandRaised && rightHandRaised;
}

  // Calculate the angle at the right elbow
export function getAngle(a: PoseLandmark, b: PoseLandmark, c: PoseLandmark): number {
    const ab = { x: a.x - b.x, y: a.y - b.y };
    const cb = { x: c.x - b.x, y: c.y - b.y };
    const dot = ab.x * cb.x + ab.y * cb.y;
    const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
    const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);
    const angle = Math.acos(dot / (magAB * magCB));
    return angle * (180 / Math.PI);
  }

export function isTPose(landmarks: PoseLandmark[]): boolean {
    const ls = landmarks[5], le = landmarks[7], lw = landmarks[9];
    const rs = landmarks[6], re = landmarks[8], rw = landmarks[10];
    const reye = landmarks[1], leye = landmarks[2];
    const buffer = (reye.x - leye.x); // Allow some buffer for arm position

    if (![ls, le, lw, rs, re, rw, reye, leye].every(Boolean)) return false;

    const rightElbowAngle = getAngle(rs, re, rw);
    const leftElbowAngle = getAngle(ls, le, lw);

    const elbowsStraight = rightElbowAngle > 160 && rightElbowAngle < 200
      && leftElbowAngle > 160 && leftElbowAngle < 200;

    const rightArm = rw.y < (rs.y - buffer) && rw.y > reye.y;
    const leftArm = lw.y < (ls.y - buffer) && lw.y > leye.y;

    return elbowsStraight && rightArm && leftArm;
  }

export function isSupermanPose(landmarks: PoseLandmark[]): boolean {
    const ls = landmarks[5], le = landmarks[7], lw = landmarks[9];
    const rs = landmarks[6], re = landmarks[8], rw = landmarks[10];
    const buffer = (rs.x - ls.x) * 0.3; // Allow some buffer for arm position
    if (![ls, le, lw, rs, re, rw].every(Boolean)) return false;
    const rightElbowAngle = getAngle(rs, re, rw);
    const leftElbowAngle = getAngle(ls, le, lw);
    const rightElbowBent = rightElbowAngle > 80 && rightElbowAngle < 100;
    const leftElbowBent = leftElbowAngle > 80 && leftElbowAngle < 100;

    return rightElbowBent && leftElbowBent;
}
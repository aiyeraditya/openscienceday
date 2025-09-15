import React, { useRef, useEffect } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { isBothHandsRaised } from "./handRaiseDetection";
import "./App.css";

type Props = {
  poses: poseDetection.Pose[];
  videoRef: React.RefObject<HTMLVideoElement>;
};

const keypointConnections = [
[0, 1], [1, 3], [0, 2], [2, 4], // Head to shoulders to elbows to wrists
  [0, 5], [5, 7], [7, 9],         // Left arm
  [0, 6], [6, 8], [8, 10],        // Right arm
  [5, 6],                         // Shoulders
  [5, 11], [6, 12],               // Torso sides
  [11, 12],                       // Hips
  [11, 13], [13, 15],             // Left leg
  [12, 14], [14, 16]              // Right leg
];

export const SkeletonOverlay: React.FC<Props> = ({ poses, videoRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Ensure canvas matches video size and position
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.style.width = video.style.width;
    canvas.style.height = video.style.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    poses.forEach(pose => {
      // Draw keypoints
      pose.keypoints.forEach(kp => {
        if (kp.score && kp.score > 0.3) {
          ctx.beginPath();
          ctx.arc(kp.x, kp.y, 3, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }
      });
      // Draw skeleton
      keypointConnections.forEach(([a, b]) => {
        const kpA = pose.keypoints[a];
        const kpB = pose.keypoints[b];
  if (kpA.score !== undefined && kpA.score > 0.3 && kpB.score !== undefined && kpB.score > 0.3) {
          ctx.beginPath();
          ctx.moveTo(kpA.x, kpA.y);
          ctx.lineTo(kpB.x, kpB.y);
          ctx.strokeStyle = "lime";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw a medal image over the head if both hands are raised
      // Use MoveNet/BlazePose: 0 = nose, 11 = left shoulder, 12 = right shoulder, 15 = left wrist, 16 = right wrist
      if (isBothHandsRaised(pose.keypoints as any)) {
        const nose = pose.keypoints[0];
        const leftEye = pose.keypoints[1];
        const rightEye = pose.keypoints[2];
        if (nose && nose.score && nose.score > 0.3) {
          var offsetY = 2 * (leftEye.x - rightEye.x); // Double the distance from nose to left eye
          const img = new window.Image();
          img.src = "/medal.png";
          // Draw image when loaded
          img.onload = () => {
            ctx.save();
            ctx.shadowColor = "#FFD700";
            ctx.shadowBlur = 10;
            ctx.drawImage(img, nose.x - 20, nose.y + offsetY - 20, 40, 40);
            ctx.restore();
          };
        }
      }
    });

  // No longer drawing a star; replaced with medal image
  }, [poses, videoRef]);

return (
    <canvas
        ref={canvasRef}
        className="overlay video-overlay"
    />
);
};
import React, { useRef, useEffect } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { isBothHandsRaised, isSupermanPose, isTPose } from "./queryPose";
import "./App.css";

type Props = {
  poses: poseDetection.Pose[];
  videoRef: React.RefObject<HTMLVideoElement>;
};

// Preload award images once
const awardImages: Record<string, HTMLImageElement> = {
  medal: new window.Image(),
  wow: new window.Image(),
  superman: new window.Image(),
};
awardImages.medal.src = "/medal.png";
awardImages.wow.src = "/wow.png";
awardImages.superman.src = "/superman.png";

const drawAwardImage = (ctx: CanvasRenderingContext2D, pose: poseDetection.Pose, image: HTMLImageElement) => {
  const nose = pose.keypoints[0];
  const leftEye = pose.keypoints[1];
  const rightEye = pose.keypoints[2];
  if (nose && nose.score && nose.score > 0.3) {
    // Use absolute value for offset, fallback to -30 if eyes are not detected
    let offsetY = -30;
    if (
      leftEye && rightEye &&
      leftEye.score !== undefined && leftEye.score > 0.3 &&
      rightEye.score !== undefined && rightEye.score > 0.3
    ) {
      offsetY = 2 * Math.abs(leftEye.x - rightEye.x);
    }
    ctx.save();
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 10;
    ctx.drawImage(image, nose.x - 20, nose.y + offsetY - 20, 40, 40);
    ctx.restore();
  }
};

export const AwardOverlay: React.FC<Props> = ({ poses, videoRef }) => {
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
      // Draw a medal image over the head if both hands are raised
      if (isBothHandsRaised(pose.keypoints)) {
        drawAwardImage(ctx, pose, awardImages.medal);
      }
      if (isTPose(pose.keypoints)) {
        drawAwardImage(ctx, pose, awardImages.wow);
      }
      if (isSupermanPose(pose.keypoints)) {
        drawAwardImage(ctx, pose, awardImages.superman);
      }
    });
  }, [poses, videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="overlay award-overlay"
      aria-hidden="true"
    />
  );
};
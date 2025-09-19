import React from "react";
import { useWebcamPose } from "./WebcamPoseContext";
import { SkeletonOverlayBase } from "./skeletonOverlayBase";
import "./App.css";
import { AwardOverlay } from "./awardOverlay";
import { isBothHandsRaised, isToesTouched, isTPose } from "./queryPose";

const tasks = [
  { task: "Raise both hands", awardFunction: isBothHandsRaised },
  { task: "Touch your toes", awardFunction: isToesTouched },
  { task: "T Pose", awardFunction: isTPose }
]

// Preload award images once
const awardImages: Record<string, HTMLImageElement> = {
  medal: new window.Image(),
};
awardImages.medal.src = "/medal.png";


const SimonSays: React.FC = () => {
  const { videoRef, poses } = useWebcamPose();
  const [taskIndex, setTaskIndex] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTaskIndex((prev) => (prev + 1) % tasks.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  const { task, awardFunction } = tasks[taskIndex];
  return (
    <div className="app-root">
      <div className="header">
        <h1> Simon says ... {task}</h1>
      </div>
      <div
        className="video-container"
        style={{
          width: videoRef.current?.videoWidth || 1280,
          height: videoRef.current?.videoHeight || 720,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="webcam-video"
        />
        <SkeletonOverlayBase poses={poses} videoRef={videoRef} />
        <AwardOverlay poses={poses} videoRef={videoRef} awardFunction={awardFunction} awardImage={awardImages.medal} />
      </div>
    </div>
  );
};

export default SimonSays;
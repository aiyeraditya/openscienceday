import React, { useRef } from "react";
import { useWebcam } from "./useWebcam";
import { usePoseDetection } from "./usePoseDetection";
import { SkeletonOverlayBase } from "./skeletonOverlayBase";
import "./App.css";
import { AwardOverlay } from "./awardOverlay";
import { isTouchingObject } from "./queryPose";




function checkIfTouchingObject(pose: any): boolean {
  return isTouchingObject(pose, x, y);
}


const x = 400; // Replace with actual x coordinate
const y = 400; // Replace with actual y coordinate

// Draw Triangle at (x, y)
// Draw Other Object at (m,n)


// Preload award images once
const awardImages: Record<string, HTMLImageElement> = {
  medal: new window.Image(),
};
awardImages.medal.src = "/medal.png";

const LearnObject: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useWebcam(videoRef);
  const poses = usePoseDetection(videoRef);
  
  return (
    <div className="app-root">
      <div className="header">
        <h1> Learn the Object</h1>
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
          style = {{opacity: 0}}
        />
        <SkeletonOverlayBase poses={poses} videoRef={videoRef} />
        <AwardOverlay poses={poses} videoRef={videoRef} awardFunction={checkIfTouchingObject} awardImage={awardImages.medal} />
      </div>
    </div>
  );
};

export default LearnObject;
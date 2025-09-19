import React from "react";
import { useWebcamPose } from "./WebcamPoseContext";
import { SkeletonOverlayBase } from "./skeletonOverlayBase";
import { isTouchingObject } from "./queryPose";
import { AwardOverlay } from "./awardOverlay";

import "./App.css";


const x = 1500;
const y = 575;
function checkIfTouchingObject(pose: any): boolean {

  return isTouchingObject(pose, x, y, 150);
}

const awardImages: Record<string, HTMLImageElement> = {
  medal: new window.Image(),
};
awardImages.medal.src = "/medal.png";


const Memory: React.FC = () => {
  const { videoRef, videoReady, poses } = useWebcamPose();

  return (
    <div className="app-root">
      <div className="header">
        <h1> Disco Dance Party!</h1>
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
          className="webcam-video-disco"
          style={{opacity: 0}}
        />

        <video
          src="/memory.mp4"
          autoPlay
          muted
          playsInline
          className="disco-bg"
          />
        <SkeletonOverlayBase poses={poses} videoRef={videoRef} />
        <AwardOverlay poses={poses} videoRef={videoRef} awardFunction={checkIfTouchingObject} awardImage={awardImages.medal} />
      </div>
    </div>
  );
};




export default Memory;
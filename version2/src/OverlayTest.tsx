import React, { useRef } from "react";
import { useWebcam } from "./useWebcam";
import { usePoseDetection } from "./usePoseDetection";
import { SkeletonOverlay } from "./SkeletonOverlay";
import "./App.css";


const OverlayTest: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useWebcam(videoRef);
  const poses = usePoseDetection(videoRef);

  return (
    <div className="app-root">
      <div
        className="video-container"
        style={{
          width: videoRef.current?.videoWidth || 640,
          height: videoRef.current?.videoHeight || 480,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="webcam-video"
        />



        <SkeletonOverlay poses={poses} videoRef={videoRef} />
      </div>
    </div>
  );
};

export default OverlayTest;
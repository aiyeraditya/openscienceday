import React, { useRef } from "react";
import { useWebcam } from "./useWebcam";
import { usePoseDetection } from "./usePoseDetection";
import { SkeletonOverlayBase } from "./skeletonOverlayBase";
import "./App.css";


const Disco: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useWebcam(videoRef);
  const poses = usePoseDetection(videoRef);

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
        />

        <video
          src="/disco_bg2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="disco-bg"
          />
        <SkeletonOverlayBase poses={poses} videoRef={videoRef} />
      </div>
    </div>
  );
};

export default Disco;
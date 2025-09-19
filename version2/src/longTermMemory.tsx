import React, { useRef } from "react";
import { useWebcam } from "./useWebcam";
import { usePoseDetection } from "./usePoseDetection";
import { SkeletonOverlayBase } from "./skeletonOverlayBase";
import { isTouchingObject } from "./queryPose";
import { AwardOverlay } from "./awardOverlay";

import "./App.css";

const x = 520;
const y = 530;
function checkIfTouchingObject(pose: any): boolean {

  return isTouchingObject(pose, x, y, 170);
}

const awardImages: Record<string, HTMLImageElement> = {
  medal: new window.Image(),
};
awardImages.medal.src = "/medal.png";

const Memory: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = React.useState(false);
  useWebcam(videoRef);
  const poses = usePoseDetection(videoReady ? videoRef : { current: null } as any);
      React.useEffect(() => {
          const video = videoRef.current;
          if (!video) return;
          const onReady = () => setVideoReady(true);
          video.addEventListener('loadedmetadata', onReady);
          if (video.readyState >= 1) setVideoReady(true);
          return () => video.removeEventListener('loadedmetadata', onReady);
      }, []);

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
        <canvas
          width={videoRef.current?.videoWidth || 1280}
          height={videoRef.current?.videoHeight || 720}
          style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
          ref={el => {
            if (!el) return;
            const ctx = el.getContext("2d");
            if (!ctx) return;
            ctx.clearRect(0, 0, el.width, el.height);
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
          }}
        />
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="webcam-video-disco"
          style={{opacity: 0}}
        />

        <video
          src="/memory2.mp4"
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
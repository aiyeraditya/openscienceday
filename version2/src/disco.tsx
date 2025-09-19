import React, { useRef } from "react";
import { useWebcam } from "./useWebcam";
import { usePoseDetection } from "./usePoseDetection";
import { SkeletonOverlayBase } from "./skeletonOverlayBase";
import "./App.css";


const Disco: React.FC = () => {
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
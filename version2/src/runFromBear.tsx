import React, { useRef,useEffect, useState  } from "react";
import { useWebcam } from "./useWebcam";
import { usePoseDetection } from "./usePoseDetection";
import { SkeletonOverlayBase } from "./skeletonOverlayBase";
import "./App.css";
import "./Bear.css";
import { AwardOverlay } from "./awardOverlay";
import { isRightSide } from "./queryPose";

interface Keyframe {
  time: number; // in seconds
  webcamVideo: number;
  bearVideo: number;
  videoOverlay: number;
  awardOverlay: number;
}

const timeline: Keyframe[] = [
  { time: 0, webcamVideo: 1, bearVideo: 0, videoOverlay: 0, awardOverlay: 0, bearAnimation: 0 },
  { time: 5, webcamVideo: 1, bearVideo: 0, videoOverlay: 1, awardOverlay: 0, bearAnimation: 0 },
  { time: 10, webcamVideo: 0, bearVideo: 0, videoOverlay: 1, awardOverlay: 0, bearAnimation: 0 },
  { time: 15, webcamVideo: 0, bearVideo: 1, videoOverlay: 1, awardOverlay: 0, bearAnimation: 0 },
  { time: 30, webcamVideo: 0, bearVideo: 1, videoOverlay: 1, awardOverlay: 1, bearAnimation: 1 },
  { time: 35, webcamVideo: 1, bearVideo: 0, videoOverlay: 0, awardOverlay: 1, bearAnimation: 0 },
  // { time: 60, webcamVideo: 0, bearVideo: 0, videoOverlay: 0, awardOverlay: 0 },
];



function useTimeline(timeline: Keyframe[]) {
  const [time, setTime] = useState(0);
  const [opacity, setOpacity] = useState<Keyframe>(timeline[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        const nextTime = prev + 0.1; // 0.1s step
        // Find current keyframe
        const kf = timeline.reduce((a, b) => (b.time <= nextTime ? b : a));
        setOpacity(kf);
        return nextTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [timeline]);

  return opacity;
}

// Preload award images once
const awardImages: Record<string, HTMLImageElement> = {
  alive: new window.Image(),
  dead: new window.Image(),
};
awardImages.alive.src = "/happy.png";
awardImages.dead.src = "/death.png";

const RunFromBear: React.FC = () => {
  // Play bear sound at 30 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      const audio = new Audio('/bearSound.mp3');
      audio.play();
    }, 35000);
    return () => clearTimeout(timeout);
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);
  useWebcam(videoRef);
  const poses = usePoseDetection(videoRef);

  const opacity = useTimeline(timeline);
  return (
    <div className="app-root">
      <div className="header">
        <h1> Run away from the Bear</h1>
      </div>
      <div className="vertical-bar"></div>
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
          style={{ opacity: opacity.webcamVideo }}
        />

        <img
          src="/crossroads.jpg"
          className="bear-video"
          style={{ opacity: opacity.bearVideo }}
          />

        <img
          src="/bear.png"
          className="bear-animation"
          style={{
            opacity: opacity.bearVideo,
            animation: opacity.bearAnimation === 1 ? "moveRight 2s forwards" : "none",
          }}
        />
        <SkeletonOverlayBase poses={poses} videoRef={videoRef} alpha={opacity.videoOverlay} />
        <AwardOverlay poses={poses} videoRef={videoRef} awardFunction={isRightSide} awardImage={awardImages.alive} punishImage={awardImages.dead} alpha={opacity.awardOverlay} />
      </div>
    </div>
  );
};

export default RunFromBear;
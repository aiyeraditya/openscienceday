import React, { useEffect, useState  } from "react";
import { useWebcamPose } from "./WebcamPoseContext";
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
  { time: 0, webcamVideo: 1, bearVideo: 0, videoOverlay: 0, awardOverlay: 0,},
  { time: 5, webcamVideo: 1, bearVideo: 0, videoOverlay: 1, awardOverlay: 0,},
  { time: 10, webcamVideo: 0, bearVideo: 0, videoOverlay: 1, awardOverlay: 0},
  { time: 15, webcamVideo: 0, bearVideo: 1, videoOverlay: 1, awardOverlay: 0},
  { time: 30, webcamVideo: 0, bearVideo: 1, videoOverlay: 1, awardOverlay: 1},
  { time: 35, webcamVideo: 1, bearVideo: 0, videoOverlay: 0, awardOverlay: 1 },
  // { time: 60, webcamVideo: 0, bearVideo: 0, videoOverlay: 0, awardOverlay: 0 },
];


function useTimeline(timeline: Keyframe[]) {
  const [opacity, setOpacity] = useState<Keyframe>(timeline[0]);
  const [bearAnimation, setBearAnimation] = useState(0);

  useEffect(() => {
    let localTime = 0;
    const interval = setInterval(() => {
      localTime += 0.1;
      // Find current keyframe
      const kf = timeline.reduce((a, b) => (b.time <= localTime ? b : a));
      setOpacity(kf);
      // Bear animation triggers at time >= 30 and < 35
      setBearAnimation(localTime >= 30 && localTime < 35 ? 1 : 0);
    }, 100);

    return () => clearInterval(interval);
  }, [timeline]);

  return { ...opacity, bearAnimation };
}

// Preload award images once
const awardImages: Record<string, HTMLImageElement> = {
  alive: new window.Image(),
  dead: new window.Image(),
};
awardImages.alive.src = "/happy.png";
awardImages.dead.src = "/death.png";

const RunFromBear: React.FC = () => {
  const { videoRef, poses } = useWebcamPose();
  // Play bear sound at 30 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      const audio = new Audio('/bearSound.mp3');
      audio.play();
    }, 35000);
    return () => clearTimeout(timeout);
  }, []);
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
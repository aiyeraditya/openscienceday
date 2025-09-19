
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import "./App.css";
import { WebcamPoseProvider, useWebcamPose } from "./WebcamPoseContext";
import { SkeletonOverlayBase } from "./skeletonOverlayBase";
import { AwardOverlay } from "./awardOverlay";
import { isBothHandsRaised, isTouchingObject, isTPose, isRightSide } from "./queryPose";

const awardImages: Record<string, HTMLImageElement> = {
    medal: new window.Image(),
    dead: new window.Image(),
    alive: new window.Image(),
  };
awardImages.medal.src = "/medal.png";
awardImages.dead.src = "/death.png";
awardImages.alive.src = "/happy.png";


function checkIfTouchingObject01(pose: any): boolean {
  return isTouchingObject(pose, 1500, 575, 150);
}
function checkIfTouchingObject02(pose: any): boolean {
  return isTouchingObject(pose, 520, 530, 150);
}

type AnswerProps = { option1: string; option2: string };
const Answer: React.FC<AnswerProps> = ({ option1, option2 }) => {
  return (
    <div style={{ gap: 128, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <img src="/handsUp.png" alt="6" style={{ height: 80 }} />
        <span style={{ fontSize: 60 }}>{option1}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <img src="/handsOut.png" alt="2" style={{ height: 80 }} />
        <span style={{ fontSize: 60 }}>{option2}</span>
      </div>
    </div>
  );
};

const scenes = [
    { heading: 'Open Day at MPINB!', subheading: 'Tracking with AI!', webcamAlpha: 1, skeletonAlpha: 1, videoSrc: '/disco_bg2.mp4', videoAlpha: 0, awardAlpha: 0, awardFunction: isBothHandsRaised, imgAward: null, imgPunish: null, duration: 15 },
    { heading: 'Disco Dance Party!', subheading: 'Move that stick!', webcamAlpha: 0.1, skeletonAlpha: 1, videoSrc: '/disco_bg2.mp4', videoAlpha: 1, awardAlpha: 0, awardFunction: isBothHandsRaised, imgAward: null, imgPunish: null, duration: 30 },
    { heading: 'Simon Says', subheading: 'Raise Your Hands', webcamAlpha: 1, skeletonAlpha: 1, videoSrc: '/disco_bg2.mp4', videoAlpha: 0, awardAlpha: 1, awardFunction: isBothHandsRaised, imgAward: awardImages.medal, imgPunish: null, duration: 15 },
    { heading: 'Can you remember these?', subheading: '', webcamAlpha: 0, skeletonAlpha: 1, videoSrc: './memoryA.mp4', videoAlpha: 1, awardAlpha: 0, awardFunction: checkIfTouchingObject01, imgAward: awardImages.medal, imgPunish: null, duration: 26 },
    { heading: 'Can you remember these?', subheading: '', webcamAlpha: 0, skeletonAlpha: 1, videoSrc: './memoryB.mp4', videoAlpha: 1, awardAlpha: 1, awardFunction: checkIfTouchingObject01, imgAward: awardImages.medal, imgPunish: null, duration: 15 },
    { heading: 'Avoid the Bear!', subheading: 'Can you hear the bear?', webcamAlpha: 0, skeletonAlpha: 1, videoSrc: './BearA.mp4', videoAlpha: 1, awardAlpha: 0, awardFunction: isBothHandsRaised, imgAward: null, imgPunish: null, duration: 25 },
    { heading: 'Avoid the Bear!', subheading: 'Move Away from the bear!', webcamAlpha: 0, skeletonAlpha: 1, videoSrc: './BearB.mp4', videoAlpha: 1, awardAlpha: 1, awardFunction: isRightSide, imgAward: awardImages.alive, imgPunish: awardImages.dead, duration: 10 },
    { heading: 'Avoid the Bear!', subheading: 'Could you avoid the bear?', webcamAlpha: 1, skeletonAlpha: 1, videoSrc: './BearB.mp4', videoAlpha: 0, awardAlpha: 1, awardFunction: isRightSide, imgAward: awardImages.alive, imgPunish: awardImages.dead, duration: 5 },
    { heading: 'How many legs does a Drosophila fly have?', subheading: <Answer option1="4" option2="6" />, webcamAlpha: 1, skeletonAlpha: 0.2, videoSrc: './BearB.mp4', videoAlpha: 0, awardAlpha: 1, awardFunction: isTPose, imgAward: awardImages.medal, imgPunish: null, duration: 30 },
    { heading: 'Quiz Question 02', subheading: <Answer option1="Answer 1" option2="Answer 2" />, webcamAlpha: 1, skeletonAlpha: 0.2, videoSrc: './BearB.mp4', videoAlpha: 0, awardAlpha: 1, awardFunction: isTPose, imgAward: awardImages.medal, imgPunish: null, duration: 30 },
    { heading: 'Quiz Question 03', subheading: <Answer option1="Answer 1" option2="Answer 2" />, webcamAlpha: 1, skeletonAlpha: 0.2, videoSrc: './BearB.mp4', videoAlpha: 0, awardAlpha: 1, awardFunction: isTPose, imgAward: awardImages.medal, imgPunish: null, duration: 30 },
    { heading: 'Quiz Question 04', subheading: <Answer option1="Answer 1" option2="Answer 2" />, webcamAlpha: 1, skeletonAlpha: 0.2, videoSrc: './BearB.mp4', videoAlpha: 0, awardAlpha: 1, awardFunction: isTPose, imgAward: awardImages.medal, imgPunish: null, duration: 30 },
    { heading: 'Avoid the Owl!', subheading: 'Move Away from the bear!', webcamAlpha: 0, skeletonAlpha: 1, videoSrc: './owl.mp4', videoAlpha: 1, awardAlpha: 0, awardFunction: isBothHandsRaised, imgAward: null, imgPunish: null, duration: 20 },
    { heading: 'Avoid the Owl!', subheading: 'Move Away from the bear!', webcamAlpha: 0, skeletonAlpha: 1, videoSrc: './owl2.mp4', videoAlpha: 1, awardAlpha: 1, awardFunction: isRightSide, imgAward: awardImages.dead, imgPunish: awardImages.alive, duration: 10 },
    { heading: 'Avoid the Owl!', subheading: 'Could you avoid the bear?', webcamAlpha: 1, skeletonAlpha: 1, videoSrc: './owl.mp4', videoAlpha: 0, awardAlpha: 1, awardFunction: isRightSide, imgAward: awardImages.dead, imgPunish: awardImages.alive, duration: 5 },
    { heading: 'Can you remember these?', subheading: '', webcamAlpha: 0, skeletonAlpha: 1, videoSrc: './memory2.mp4', videoAlpha: 1, awardAlpha: 1, awardFunction: checkIfTouchingObject02, imgAward: awardImages.medal, imgPunish: null, duration: 30 }
];



function HomePage() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const currentScene = scenes[sceneIndex];

  // This effect hook manages the timer to switch between scenes
  useEffect(() => {
    // Don't set a timer if we are at the last scene
    if (sceneIndex >= scenes.length - 1) {
      return;
    }

    const timer = setTimeout(() => {
      setSceneIndex(prevIndex => prevIndex + 1);
    }, currentScene.duration * 1000); // Duration is in seconds, so convert to ms

    // Cleanup function: This will clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [sceneIndex, currentScene.duration]); // Rerun the effect when the scene changes

  const { videoRef, videoReady, poses } = useWebcamPose();
  return (
    <div className="app-root">
      <h1 className="app-title">{currentScene.heading}</h1>
      <h2 className="app-subtitle">{currentScene.subheading}</h2>
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
          style={{ opacity: currentScene.webcamAlpha }}
        />

        <video
          key={currentScene.videoSrc}
          src={currentScene.videoSrc}
          autoPlay
          playsInline
          loop
          className="second-video"
          style={{ opacity: currentScene.videoAlpha }}
        />
        <SkeletonOverlayBase poses={poses} videoRef={videoRef} alpha={currentScene.skeletonAlpha} />

        <AwardOverlay poses={poses} videoRef={videoRef} 
          awardFunction={currentScene.awardFunction} 
          awardImage={currentScene.imgAward}
          punishImage={currentScene.imgPunish}
          alpha={currentScene.awardAlpha}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <WebcamPoseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </WebcamPoseProvider>
  );
}

export default App;
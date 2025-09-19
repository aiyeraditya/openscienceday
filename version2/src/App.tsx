
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Disco from "./disco";
import OverlayTest from "./OverlayTest";
import SimonSays from "./simonSays";
import RunFromBear from "./runFromBear";
import LearnObject from "./learnObject";
import QuizComponent from "./quiz";
import Memory from "./memory";
import LongTermMemory from "./longTermMemory";
import "./App.css";
import React from "react";
import { WebcamPoseProvider, useWebcamPose } from "./WebcamPoseContext";
import { SkeletonOverlayBase } from "./skeletonOverlayBase";

function HomePage() {
  const { videoRef, videoReady, poses } = useWebcamPose();
  return (
    <div className="app-root">
      <h1 className="app-title">Open Day at MPINB!</h1>
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
        />
        <SkeletonOverlayBase poses={poses} videoRef={videoRef} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/disco"><button>Disco</button></Link>
          <Link to="/overlay-test"><button>Overlay Test</button></Link>
          <Link to="/simon-says"><button>Simon Says</button></Link>
          <Link to="/run-from-bear"><button>Run From Bear</button></Link>
          <Link to="/learn-object"><button>Learn Object</button></Link>
          <Link to="/quiz"><button>Quiz</button></Link>
          <Link to="/memory"><button>Memory</button></Link>
          <Link to="/longtermmemory"><button>Long Term Memory</button></Link>
        </div>
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
          <Route path="/disco" element={<Disco />} />
          <Route path="/overlay-test" element={<OverlayTest />} />
          <Route path="/simon-says" element={<SimonSays />} />
          <Route path="/run-from-bear" element={<RunFromBear />} />
          <Route path="/learn-object" element={<LearnObject />} />
          <Route path="/quiz" element={<QuizComponent />} />
          <Route path="/memory" element={<Memory />} />
          <Route path="/longtermmemory" element={<LongTermMemory />} />
        </Routes>
      </BrowserRouter>
    </WebcamPoseProvider>
  );
}

export default App;
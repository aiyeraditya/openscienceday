import { AwardOverlay } from "./awardOverlay";
import QuizQuestion from "./quizComponent";
import React, { useRef } from "react";
import { useWebcam } from "./useWebcam";
import { usePoseDetection } from "./usePoseDetection";
import { isTPose, isBothHandsRaised } from "./queryPose";



const questions = [
    {
        question: "What is 2 + 2?",
        options: ["3", "4"],
        correctAnswer: isTPose,
    },

    {
        question: "How many legs does a fly have?",
        options: ["6", "4"],
        correctAnswer: isBothHandsRaised,
    }];


const awardImages: Record<string, HTMLImageElement> = {
  medal: new window.Image(),
};
awardImages.medal.src = "/medal.png";

const QuizComponent: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoReady, setVideoReady] = React.useState(false);
    useWebcam(videoRef);
    // Only start pose detection after video is ready
    const poses = usePoseDetection(videoReady ? videoRef : { current: null } as any);
    React.useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const onReady = () => setVideoReady(true);
        video.addEventListener('loadedmetadata', onReady);
        if (video.readyState >= 1) setVideoReady(true);
        return () => video.removeEventListener('loadedmetadata', onReady);
    }, []);
    const [questionIndex, setQuestionIndex] = React.useState(0);
    React.useEffect(() => {
        const interval = setInterval(() => {
        setQuestionIndex((prev) => (prev + 1) % questions.length);
        }, 20000);
        return () => clearInterval(interval);
        }, []);
    const { question, options, correctAnswer } = questions[questionIndex];
    return (
        <div className="app-root">
            <div className="header">
                <h1>Quiz Time!</h1>
            </div>
            <QuizQuestion question={question} options={options} />

            <div
                className="video-container"
                style={{
                width: videoRef.current?.videoWidth || 1280,
                height: videoRef.current?.videoHeight || 720,
                }}>

                <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="webcam-video"
                style = {{opacity: 1}} />
                <AwardOverlay poses={poses} 
                    videoRef={videoRef} 
                    awardFunction={correctAnswer} 
                    awardImage={awardImages.medal} />

            </div>
        </div>

    );
}

export default QuizComponent;
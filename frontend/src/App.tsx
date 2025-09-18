import React, { useRef, useEffect, useState } from "react";
import { useWebcam } from "./useWebcam";
import { sendFrameToBackend } from "./sendToBackend";

type BackendPose = {
	keypoints: number[][][][]; // [batch, person, keypoint, values]
};

const DOWNSCALED = 192;

export default function App() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [poses, setPoses] = useState<any[]>([]);
	useWebcam(videoRef);

	// Capture and send frame every 200ms
	useEffect(() => {
		let interval: NodeJS.Timeout;
		function sendFrame() {
			const video = videoRef.current;
			if (!video || video.videoWidth === 0) return;
			// Draw to hidden canvas at 192x192
			const canvas = document.createElement('canvas');
			canvas.width = DOWNSCALED;
			canvas.height = DOWNSCALED;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.drawImage(video, 0, 0, DOWNSCALED, DOWNSCALED);
			canvas.toBlob(async (blob) => {
				if (!blob) return;
				try {
					const result: BackendPose = await sendFrameToBackend(blob);
					setPoses(result.keypoints?.[0] || []);
				} catch (e) {
					// Optionally handle error
				}
			}, 'image/jpeg', 0.8);
		}
		interval = setInterval(sendFrame, 200);
		return () => clearInterval(interval);
	}, []);

	// Draw overlay
	useEffect(() => {
		const video = videoRef.current;
		const canvas = canvasRef.current;
		if (!video || !canvas) return;
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// Draw skeleton for each detected person
		poses.forEach((person: any) => {
			person.forEach((kp: any, i: number) => {
				const [y, x, score] = kp;
				if (score > 0.2) {
					ctx.beginPath();
					ctx.arc(x * canvas.width, y * canvas.height, 4, 0, 2 * Math.PI);
					ctx.fillStyle = 'red';
					ctx.fill();
				}
			});
		});
	}, [poses]);

	return (
		<div style={{ position: 'relative', width: 640, height: 480 }}>
			<video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', transform: 'scaleX(-1)' }} />
			<canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }} />
		</div>
	);
}

import { useEffect, useRef } from "react";

export function useWebcam(videoRef: React.RefObject<HTMLVideoElement>) {
  useEffect(() => {
    let stream: MediaStream | null = null;
    const getWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Webcam error:", err);
      }
    };
    getWebcam();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoRef]);
}
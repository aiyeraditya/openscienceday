
import { useEffect, useState, useRef } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

export function usePoseDetection(videoRef: React.RefObject<HTMLVideoElement>) {
  const [poses, setPoses] = useState<poseDetection.Pose[]>([]);
  const prevKeypointsRef = useRef<poseDetection.Pose[] | null>(null);

  useEffect(() => {
    let detector: poseDetection.PoseDetector | null = null;
    let isMounted = true;


    const runPose = async () => {
      await tf.setBackend("webgl");
      await tf.ready();
      detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
        modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
      });
      detect();

      async function detect() {
        if (!detector || !videoRef.current) return;
        const poseList = await detector.estimatePoses(videoRef.current);

        // Smoothing: blend current and previous keypoints
        const SMOOTHING = 1.0; // 0.0 = no smoothing, 1.0 = all previous
        let smoothed: poseDetection.Pose[] = poseList;
        if (prevKeypointsRef.current && poseList.length > 0) {
          smoothed = poseList.map((pose, i) => {
            const prevPose = prevKeypointsRef.current![i];
            if (!prevPose) return pose;
            return {
              ...pose,
              keypoints: pose.keypoints.map((kp, j) => {
                const prevKp = prevPose.keypoints[j];
                if (!prevKp) return kp;
                return {
                  ...kp,
                  x: kp.x * SMOOTHING + prevKp.x * (1 - SMOOTHING),
                  y: kp.y * SMOOTHING + prevKp.y * (1 - SMOOTHING),
                  score: kp.score !== undefined && prevKp.score !== undefined
                    ? kp.score * SMOOTHING + prevKp.score * (1 - SMOOTHING)
                    : kp.score,
                };
              })
            };
          });
        }
        prevKeypointsRef.current = smoothed;
        if (isMounted) setPoses(smoothed);
        requestAnimationFrame(detect);
      }
    };

    runPose();

    return () => {
      isMounted = false;
      detector?.dispose();
    };
  }, [videoRef]);

  return poses;
}
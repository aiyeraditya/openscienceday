# MoveNet Pose Estimation FastAPI Backend

## Setup

1. Download the MoveNet SinglePose Lightning TFLite model from:
   https://tfhub.dev/google/lite-model/movenet/singlepose/lightning/tflite/float16/4
   and place it as `movenet_singlepose_lightning.tflite` in the project directory.

2. Install dependencies:

    pip install -r requirements.txt

3. Run the server:

    uvicorn main:app --reload

## API

- POST `/pose` with an image file (form-data, key: `file`).
  - Returns: JSON with pose keypoints.

- GET `/` returns a welcome message.

---

For webcam integration, capture frames on the client and send as images to `/pose`.

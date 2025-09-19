import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
from PIL import Image
import io
import math

# Load MoveNet MultiPose Lightning model from TensorFlow Hub
MODEL_URL = "https://tfhub.dev/google/movenet/multipose/lightning/1"
movenet = hub.load(MODEL_URL)


def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image.save("debug_input_image.jpg")  # Save input image for debugging
    img = np.array(image, dtype=np.int32)
    img = img[np.newaxis, ...]
    return img

def run_movenet(img):
    outputs = movenet.signatures["serving_default"](tf.constant(img))
    keypoints = outputs["output_0"].numpy()
    keypoints = np.array(keypoints)
    keypoints = keypoints[:, :, :51]
    keypoints = keypoints.reshape(-1, 17, 3)
    keypoints[:, :, :2] *= img.shape[2]
    keypoints = keypoints.tolist()
    print("Keypoints:", keypoints)
    return keypoints

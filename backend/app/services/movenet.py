import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
from PIL import Image
import io

# Load MoveNet MultiPose Lightning model from TensorFlow Hub
MODEL_URL = "https://tfhub.dev/google/movenet/multipose/lightning/1"
movenet = hub.load(MODEL_URL)

INPUT_SIZE = 192

def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((INPUT_SIZE, INPUT_SIZE))
    img = np.array(image, dtype=np.int32)
    img = img[np.newaxis, ...]
    return img

def run_movenet(img):
    outputs = movenet.signatures["serving_default"](tf.constant(img))
    keypoints = outputs["output_0"].numpy()
    return keypoints.tolist()

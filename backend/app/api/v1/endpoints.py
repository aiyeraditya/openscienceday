from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from app.services.movenet import preprocess_image, run_movenet

router = APIRouter()

@router.post("/pose")
async def detect_pose(file: UploadFile = File(...)):
    image_bytes = await file.read()
    img = preprocess_image(image_bytes)
    keypoints = run_movenet(img)
    return JSONResponse({"keypoints": keypoints})

@router.get("/")
def root():
    return {"message": "MoveNet Pose Estimation API"}

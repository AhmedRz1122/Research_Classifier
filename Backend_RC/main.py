import traceback
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import io
from classifier import AnimalClassifier

# Initialize FastAPI
app = FastAPI()
classifier = AnimalClassifier()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok", "message": "Animal Classifier API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is connected"}

@app.post("/predict/")
async def predict_animal(file: UploadFile = File(...)):
    try:
        # Read image bytes
        image_bytes = await file.read()

        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Predict
        results = classifier.predict(image)

        return JSONResponse(content=results)

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
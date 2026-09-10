from pathlib import Path 
import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title = "API de Predicción de Precios de Viviendas", description = "Predicción de precios de viviendas según la superficie en metros cuadrados (m²) utilizando un modelo de regresión lineal entrenado.", version = "1.0")

BASE_DIR = Path (__file__).resolve().parent
MODEL_PATH = BASE_DIR /"models/linear_model.joblib"

try :
    #cargar el modelo entrenado desde el archivo
    model = joblib.load(MODEL_PATH)
except Exception:
    model = None 

class housem2(BaseModel):
    area_m2: float = Field(..., example=82.5, description="Superficie de la vivienda en metros cuadrados (m²)")

@app.get("/")
def health_check():
    return{
        "mensaje": "API de Predicción de precios de viviendas esta en funcionamineto.",
                "status": "OK",
                "model_loaded": model is not None
    }

@app.post("/predict")
def predict_price(data:housem2):
    if not model:
        raise HTTPException (status_code =503, detail ="Modelo no disponible. Intente más tarde.")
    prediction =model.predict ([[data.area_m2]])

    return{
        "area_m2": data.area_m2,
        "predicted_price": round(prediction, 2)
    }
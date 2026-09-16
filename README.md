# Taller-3_pythonML
# Sistema de Machine Learning - Random Forest (Predicción de Enfermedades)

Este proyecto implementa un flujo de trabajo de Machine Learning utilizando el algoritmo **Random Forest** en Python. El proceso está dividido en etapas secuenciales: generación de datos, entrenamiento del modelo y realización de predicciones.


## 🛠️ Estructura del Proyecto

RandomForest/
│
├── data/                       # Carpeta donde se almacena el dataset
├── models/                     # Carpeta donde se guardan los modelos entrenados (.pkl o similar)
├── 1.Crear_dataset.py          # Script para generar o preparar el conjunto de datos
├── 2.Entrenar_modelo.py        # Script para entrenar el modelo Random Forest
├── 3.Predecir_enfermedad.py    # Script para realizar nuevas predicciones
└── requirements.txt            # Dependencias del proyecto (pandas, scikit-learn, etc.)

# Desployment : link https://randomf.streamlit.app/

# Pasos para ejecutar el sistema de Regresion lineal:

# Este proyecto es un sistema de Machine Learning basado en Regresión Lineal, estructurado en una arquitectura desacoplada con un **Backend** en Python y un **Frontend** en Django, ambos desplegados en **Railway** utilizando contenedores Docker.

## 🚀 Enlaces de Producción (Railway)

# Puedes acceder a la aplicación en vivo a través de los siguientes enlaces:
* **Frontend (Interfaz Web):** [https://taller3ml-production-7bf5.up.railway.app](https://taller3ml-production-7bf5.up.railway.app)
* **Backend (API / Documentación):** [https://taller3ml-production.up.railway.app/docs](https://taller3ml-production.up.railway.app/docs)

## 🛠️ Estructura del Proyecto

RegresionLineal/
│
├── back/               # Servidor Backend (API y Modelo ML)
│   ├── models/
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
│   └── train.py        # Script de entrenamiento del modelo
│
└── front/              # Interfaz Frontend (Django)
    ├── config/
    ├── prediccion/
    ├── db.sqlite3
    ├── Dockerfile
    ├── manage.py
    └── requirements.txt


# Sistema de Visión Artificial - Detección de Rostros

Este proyecto implementa algoritmos de Visión Artificial para detección de rostros utilizando clasificadores Haar Cascade, OpenCV, entornos de Jupyter Notebook y una estructura adaptada para funciones serverless en Vercel.

---

## 🌐 Enlaces de Producción (Vercel)
El sistema se encuentra desplegado y accesible en línea a través de Vercel:
* **Enlace de Producción:** [https://tu-proyecto.vercel.app](https://tu-proyecto.vercel.app) *(Reemplaza con tu URL real de Vercel si aplica)*

---

## 🛠️ Estructura del Proyecto

```text
Visionartificial/
│
├── haarcascade_frontalface_default.xml   # Modelo de detección de rostros
├── img.jpg                               # Imagen de prueba
├── index.ipynb                           # Notebook con el código de prueba/entrenamiento
│
└── py_img/                               # Módulo principal para producción (Vercel)
    ├── api/                              # Endpoints de la API
    ├── public/                           # Archivos estáticos o públicos
    ├── haarcascade_frontalface_default.xml
    ├── requirements.txt                  # Dependencias de Python
    └── vercel.json                       # Configuración de despliegue en Vercel
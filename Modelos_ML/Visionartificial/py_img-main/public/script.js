// ============================================================
// VISIÓN ARTIFICIAL
// Detección de rostros
// ============================================================


// ============================================================
// 1. ELEMENTOS COMUNES
// ============================================================

const loader = document.getElementById("loader");
const imgResult = document.getElementById("imgResult");
const metricsZone = document.getElementById("metricsZone");
const faceCount = document.getElementById("faceCount");


// ============================================================
// 2. ELEMENTOS DEL MODO ARCHIVO
// ============================================================

const sectionUpload = document.getElementById("sectionUpload");
const btnModeUpload = document.getElementById("btnModeUpload");
const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const btnProcess = document.getElementById("btnProcess");
const imgOriginal = document.getElementById("imgOriginal");
const boxOriginal = document.getElementById("boxOriginal");


// ============================================================
// 3. ELEMENTOS DEL MODO CÁMARA
// ============================================================

const sectionCamera = document.getElementById("sectionCamera");
const btnModeCamera = document.getElementById("btnModeCamera");

const video = document.getElementById("webcam");
const canvas = document.getElementById("canvasFrame");

const btnStartCamera = document.getElementById("btnStartCamera");
const btnStopCamera = document.getElementById("btnStopCamera");
const btnToggleCamera = document.getElementById("btnToggleCamera");


// ============================================================
// 4. ESTADO DE LA APLICACIÓN
// ============================================================

let selectedFile = null;

let streamInstance = null;

let streamInterval = null;

let isStreaming = false;

// user = cámara frontal
// environment = cámara trasera

let currentFacingMode = "user";


// ============================================================
// 5. CAMBIO ENTRE MODOS
// ============================================================

btnModeUpload.addEventListener("click", () => {

    switchMode("upload");

});


btnModeCamera.addEventListener("click", () => {

    switchMode("camera");

});


function switchMode(mode) {

    if (mode === "upload") {

        // ------------------------------------------
        // BOTONES
        // ------------------------------------------

        btnModeUpload.classList.add("active");

        btnModeCamera.classList.remove("active");


        // ------------------------------------------
        // MOSTRAR UPLOAD
        // ------------------------------------------

        sectionUpload.classList.remove("d-none");

        sectionCamera.classList.add("d-none");

        boxOriginal.classList.remove("d-none");


        // ------------------------------------------
        // DETENER CÁMARA
        // ------------------------------------------

        stopCameraFlow();

    } else {

        // ------------------------------------------
        // BOTONES
        // ------------------------------------------

        btnModeCamera.classList.add("active");

        btnModeUpload.classList.remove("active");


        // ------------------------------------------
        // MOSTRAR CÁMARA
        // ------------------------------------------

        sectionCamera.classList.remove("d-none");

        sectionUpload.classList.add("d-none");

        boxOriginal.classList.add("d-none");


        // ------------------------------------------
        // LIMPIAR RESULTADOS ANTERIORES
        // ------------------------------------------

        imgResult.classList.add("d-none");

        metricsZone.classList.add("d-none");

    }

}


// ============================================================
// 6. DRAG & DROP
// ============================================================

["dragenter", "dragover"].forEach((eventName) => {

    dropZone.addEventListener(eventName, (event) => {

        event.preventDefault();

        event.stopPropagation();

        dropZone.classList.add("drag-active");

    });

});


["dragleave", "drop"].forEach((eventName) => {

    dropZone.addEventListener(eventName, (event) => {

        event.preventDefault();

        event.stopPropagation();

        dropZone.classList.remove("drag-active");

    });

});


dropZone.addEventListener("drop", (event) => {

    const file = event.dataTransfer.files[0];

    handleFile(file);

});


fileInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    handleFile(file);

});


// ============================================================
// 7. PROCESAMIENTO DEL ARCHIVO
// ============================================================

function handleFile(file) {

    if (!file) {
        return;
    }


    if (!file.type.startsWith("image/")) {

        alert("Por favor selecciona un archivo de imagen.");

        return;

    }


    // ------------------------------------------
    // GUARDAR ARCHIVO
    // ------------------------------------------

    selectedFile = file;


    // ------------------------------------------
    // ACTIVAR BOTÓN
    // ------------------------------------------

    btnProcess.disabled = false;


    // ------------------------------------------
    // LEER IMAGEN
    // ------------------------------------------

    const reader = new FileReader();


    reader.onload = (event) => {

        imgOriginal.src = event.target.result;

        imgOriginal.classList.remove("d-none");

        imgResult.classList.add("d-none");

        metricsZone.classList.add("d-none");

    };


    reader.readAsDataURL(file);

}


// ============================================================
// 8. PROCESAR IMAGEN
// ============================================================

btnProcess.addEventListener("click", async () => {

    if (!selectedFile) {
        return;
    }


    const formData = new FormData();

    formData.append("image", selectedFile);


    // ------------------------------------------
    // MOSTRAR LOADER
    // ------------------------------------------

    loader.classList.remove("d-none");

    imgResult.classList.add("d-none");


    // ------------------------------------------
    // ENVIAR AL BACKEND
    // ------------------------------------------

    await sendFrameToBackend(formData);


    // ------------------------------------------
    // OCULTAR LOADER
    // ------------------------------------------

    loader.classList.add("d-none");

});


// ============================================================
// 9. INICIAR CÁMARA
// ============================================================

btnStartCamera.addEventListener("click", async () => {

    await initCamera();

    if (isStreaming) {

        btnStartCamera.disabled = true;

        btnStopCamera.disabled = false;

        btnToggleCamera.style.display = "inline-block";

    }

});


// ============================================================
// 10. CAMBIAR CÁMARA
// ============================================================

btnToggleCamera.addEventListener("click", async () => {

    currentFacingMode =
        currentFacingMode === "user"
            ? "environment"
            : "user";


    if (isStreaming) {

        clearInterval(streamInterval);


        if (streamInstance) {

            streamInstance
                .getTracks()
                .forEach((track) => track.stop());

        }


        await initCamera();

    }

});


// ============================================================
// 11. INICIALIZAR CÁMARA
// ============================================================

async function initCamera() {

    try {

        streamInstance =
            await navigator.mediaDevices.getUserMedia({

                video: {

                    width: {
                        ideal: 400
                    },

                    height: {
                        ideal: 300
                    },

                    facingMode: currentFacingMode

                },

                audio: false

            });


        video.srcObject = streamInstance;

        isStreaming = true;


        // ------------------------------------------
        // MOSTRAR RESULTADO
        // ------------------------------------------

        imgResult.classList.remove("d-none");


        // ------------------------------------------
        // PROCESAR CADA 600 MS
        // ------------------------------------------

        streamInterval =
            setInterval(
                processCameraFrame,
                600
            );


    } catch (error) {

        console.error(
            "Error al acceder a la cámara:",
            error
        );


        alert(
            "No se pudo acceder a la cámara seleccionada."
        );


        currentFacingMode =
            currentFacingMode === "user"
                ? "environment"
                : "user";

    }

}


// ============================================================
// 12. APAGAR CÁMARA
// ============================================================

btnStopCamera.addEventListener(
    "click",
    stopCameraFlow
);


function stopCameraFlow() {

    clearInterval(streamInterval);

    streamInterval = null;

    isStreaming = false;


    // ------------------------------------------
    // DETENER STREAM
    // ------------------------------------------

    if (streamInstance) {

        streamInstance
            .getTracks()
            .forEach((track) => track.stop());

        streamInstance = null;

    }


    // ------------------------------------------
    // LIMPIAR VIDEO
    // ------------------------------------------

    video.srcObject = null;


    // ------------------------------------------
    // RESTAURAR BOTONES
    // ------------------------------------------

    btnStartCamera.disabled = false;

    btnStopCamera.disabled = true;

    btnToggleCamera.style.display = "none";


    // ------------------------------------------
    // OCULTAR LOADER
    // ------------------------------------------

    loader.classList.add("d-none");

}


// ============================================================
// 13. CAPTURAR FRAME DE LA CÁMARA
// ============================================================

async function processCameraFrame() {

    if (!isStreaming) {
        return;
    }


    const ctx = canvas.getContext("2d");


    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    canvas.toBlob(

        async (blob) => {

            if (!blob) {
                return;
            }


            const formData = new FormData();


            formData.append(
                "image",
                blob,
                "frame.jpg"
            );


            await sendFrameToBackend(formData);

        },

        "image/jpeg",

        0.7

    );

}


// ============================================================
// 14. COMUNICACIÓN CON LA API
// ============================================================

async function sendFrameToBackend(formData) {

    try {

        const response =
            await fetch(
                "/api/detect",
                {
                    method: "POST",
                    body: formData
                }
            );


        // ------------------------------------------
        // VALIDAR RESPUESTA
        // ------------------------------------------

        if (!response.ok) {

            console.error(
                "El servidor respondió con error:",
                response.status
            );

            return;

        }


        const data =
            await response.json();


        // ------------------------------------------
        // RESULTADO EXITOSO
        // ------------------------------------------

        if (data.success) {

            // Imagen procesada

            imgResult.src = data.image;

            imgResult.classList.remove("d-none");


            // Mostrar estadísticas

            metricsZone.classList.remove("d-none");


            // Número de rostros

            faceCount.textContent =
                data.faces_detected;

        }

    } catch (error) {

        console.error(
            "Error en la transmisión de datos:",
            error
        );

    }

}


// ============================================================
// 15. LIMPIEZA AL CERRAR/RECARGAR
// ============================================================

window.addEventListener("beforeunload", () => {

    stopCameraFlow();

});
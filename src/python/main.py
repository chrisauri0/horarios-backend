# main.py
"""
Microservicio FastAPI para generación de horarios.
Recibe SUBJECTS vía POST, ejecuta el pipeline y devuelve el horario ajustado.
"""
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn
import tempfile
import os
import json
import subprocess

app = FastAPI()

@app.post("/generar-horario")
async def generar_horario(request: Request):
    data = await request.json()
    # Guardar SUBJECTS en archivo temporal
    with tempfile.TemporaryDirectory() as tmpdir:
        subjects_path = os.path.join(tmpdir, "subjects.json")
        with open(subjects_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        # Ejecutar pipeline (puedes adaptar los scripts para que lean este archivo)
        # 1. Ejecutar horario_greedy.py con SUBJECTS
        # 2. Ejecutar analizar_huecos_y_sugerencias_mejorado.py
        # 3. Ejecutar swap_sugerencias_horario.py
        # 4. Ejecutar aplicar_sugerencias_horario.py
        # NOTA: Aquí se asume que los scripts pueden recibir la ruta del archivo subjects.json como argumento o variable de entorno
        # Si no, deberás adaptar los scripts para que lean de este archivo
        # Por simplicidad, aquí solo se muestra el flujo general
        #
        subprocess.run(["python", "horario_greedy.py", subjects_path], check=True)
       
        subprocess.run(["python", "swap_sugerencias_horario.py", subjects_path], check=True)
        subprocess.run(["python", "aplicar_sugerencias_horario.py", subjects_path], check=True)
        #
        # Para este ejemplo, asumimos que el resultado final es horario_greedy_aplicado.json
        #
        # Leer el resultado final
        result_path = "horario_greedy_aplicado.json"
        if not os.path.exists(result_path):
            return JSONResponse({"error": "No se generó el horario final"}, status_code=500)
        with open(result_path, encoding="utf-8") as f:
            horario = json.load(f)
        return {"horario": horario}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

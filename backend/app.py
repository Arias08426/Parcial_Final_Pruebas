from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

pacientes = []
citas = []
doctores = [
    {"id": 1, "nombre": "Dr. García"},
    {"id": 2, "nombre": "Dra. Martínez"},
    {"id": 3, "nombre": "Dr. López"}
]

def validar_email(email):
    patron = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(patron, email) is not None

def validar_telefono(telefono):
    return len(telefono) == 10 and telefono.isdigit()

def verificar_horario_disponible(doctor_id, fecha, hora):
    for cita in citas:
        if cita['doctor_id'] == doctor_id and cita['fecha'] == fecha and cita['hora'] == hora and cita['estado'] != 'cancelada':
            return False
    return True

@app.route('/api/pacientes', methods=['POST'])
def registrar_paciente():
    data = request.get_json()
    
    if not data.get('nombre') or not data.get('email') or not data.get('telefono'):
        return jsonify({"error": "Todos los campos son obligatorios"}), 400
    
    if not validar_email(data['email']):
        return jsonify({"error": "Email inválido"}), 400
    
    if not validar_telefono(data['telefono']):
        return jsonify({"error": "Teléfono debe tener 10 dígitos"}), 400
    
    for p in pacientes:
        if p['email'] == data['email']:
            return jsonify({"error": "El email ya está registrado"}), 400
    
    paciente = {
        "id": len(pacientes) + 1,
        "nombre": data['nombre'],
        "email": data['email'],
        "telefono": data['telefono']
    }
    pacientes.append(paciente)
    return jsonify(paciente), 201

@app.route('/api/doctores', methods=['GET'])
def listar_doctores():
    return jsonify(doctores), 200

@app.route('/api/citas', methods=['POST'])
def crear_cita():
    data = request.get_json()
    
    if not all(key in data for key in ['paciente_id', 'doctor_id', 'fecha', 'hora']):
        return jsonify({"error": "Todos los campos son obligatorios"}), 400
    
    paciente = next((p for p in pacientes if p['id'] == data['paciente_id']), None)
    if not paciente:
        return jsonify({"error": "Paciente no encontrado"}), 404
    
    doctor = next((d for d in doctores if d['id'] == data['doctor_id']), None)
    if not doctor:
        return jsonify({"error": "Doctor no encontrado"}), 404
    
    if not verificar_horario_disponible(data['doctor_id'], data['fecha'], data['hora']):
        return jsonify({"error": "El horario ya está ocupado"}), 409
    
    cita = {
        "id": len(citas) + 1,
        "paciente_id": data['paciente_id'],
        "doctor_id": data['doctor_id'],
        "fecha": data['fecha'],
        "hora": data['hora'],
        "estado": "agendada"
    }
    citas.append(cita)
    return jsonify(cita), 201

@app.route('/api/citas', methods=['GET'])
def listar_citas():
    citas_activas = [c for c in citas if c['estado'] != 'cancelada']
    return jsonify(citas_activas), 200

@app.route('/api/citas/<int:cita_id>', methods=['DELETE'])
def cancelar_cita(cita_id):
    cita = next((c for c in citas if c['id'] == cita_id), None)
    if not cita:
        return jsonify({"error": "Cita no encontrada"}), 404
    
    if cita['estado'] == 'cancelada':
        return jsonify({"error": "La cita ya está cancelada"}), 400
    
    cita['estado'] = 'cancelada'
    return jsonify({"mensaje": "Cita cancelada exitosamente"}), 200

@app.route('/api/reset', methods=['POST'])
def reset_data():
    global pacientes, citas
    pacientes = []
    citas = []
    return jsonify({"mensaje": "Datos reseteados"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)

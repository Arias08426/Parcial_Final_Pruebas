const { useState, useEffect } = React;
const API_URL = 'http://localhost:5000/api';

function App() {
    const [pacienteId, setPacienteId] = useState(null);
    const [doctores, setDoctores] = useState([]);
    const [citas, setCitas] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const [nombrePaciente, setNombrePaciente] = useState('');
    const [emailPaciente, setEmailPaciente] = useState('');
    const [telefonoPaciente, setTelefonoPaciente] = useState('');

    const [doctorId, setDoctorId] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');

    useEffect(() => {
        cargarDoctores();
        cargarCitas();
    }, []);

    const cargarDoctores = async () => {
        try {
            const response = await fetch(`${API_URL}/doctores`);
            const data = await response.json();
            setDoctores(data);
        } catch (err) {
            console.error(err);
        }
    };

    const cargarCitas = async () => {
        try {
            const response = await fetch(`${API_URL}/citas`);
            const data = await response.json();
            setCitas(data);
        } catch (err) {
            console.error(err);
        }
    };

    const registrarPaciente = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        try {
            const response = await fetch(`${API_URL}/pacientes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: nombrePaciente,
                    email: emailPaciente,
                    telefono: telefonoPaciente,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setPacienteId(data.id);
                setMensaje(`Paciente registrado exitosamente con ID: ${data.id}`);
                setNombrePaciente('');
                setEmailPaciente('');
                setTelefonoPaciente('');
            } else {
                setError(data.error || 'Error al registrar paciente');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        }
    };

    const agendarCita = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        try {
            const response = await fetch(`${API_URL}/citas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paciente_id: pacienteId,
                    doctor_id: parseInt(doctorId),
                    fecha: fecha,
                    hora: hora,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje('Cita agendada exitosamente');
                setDoctorId('');
                setFecha('');
                setHora('');
                cargarCitas();
            } else {
                setError(data.error || 'Error al agendar cita');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        }
    };

    const cancelarCita = async (citaId) => {
        try {
            const response = await fetch(`${API_URL}/citas/${citaId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMensaje('Cita cancelada exitosamente');
                cargarCitas();
            } else {
                const data = await response.json();
                setError(data.error || 'Error al cancelar cita');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        }
    };

    return (
        <div className="container">
            <h1>Sistema de Citas Médicas</h1>

            {mensaje && <div className="success" id="mensaje-exito">{mensaje}</div>}
            {error && <div className="error" id="mensaje-error">{error}</div>}

            <div className="section">
                <h2>Registro de Paciente</h2>
                <form onSubmit={registrarPaciente}>
                    <div className="form-group">
                        <label>Nombre Completo:</label>
                        <input
                            type="text"
                            id="nombre-paciente"
                            value={nombrePaciente}
                            onChange={(e) => setNombrePaciente(e.target.value)}
                            placeholder="Ej: Juan Pérez"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="text"
                            id="email-paciente"
                            value={emailPaciente}
                            onChange={(e) => setEmailPaciente(e.target.value)}
                            placeholder="Ej: juan@ejemplo.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Teléfono (10 dígitos):</label>
                        <input
                            type="text"
                            id="telefono-paciente"
                            value={telefonoPaciente}
                            onChange={(e) => setTelefonoPaciente(e.target.value)}
                            placeholder="Ej: 1234567890"
                        />
                    </div>
                    <button type="submit" id="btn-registrar-paciente">Registrar Paciente</button>
                </form>
                {pacienteId && (
                    <div className="success" style={{ marginTop: '10px' }}>
                        Tu ID de paciente es: <strong>{pacienteId}</strong>
                    </div>
                )}
            </div>

            <div className="section">
                <h2>Agendar Cita</h2>
                <form onSubmit={agendarCita}>
                    <div className="form-group">
                        <label>Seleccionar Doctor:</label>
                        <select
                            id="doctor-select"
                            value={doctorId}
                            onChange={(e) => setDoctorId(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un doctor</option>
                            {doctores.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Fecha:</label>
                        <input
                            type="date"
                            id="fecha-cita"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Hora:</label>
                        <input
                            type="time"
                            id="hora-cita"
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" id="btn-agendar-cita" disabled={!pacienteId}>
                        Agendar Cita
                    </button>
                </form>
            </div>

            <div className="section">
                <h2>Citas Agendadas</h2>
                <div className="citas-list" id="lista-citas">
                    {citas.length === 0 ? (
                        <div className="empty-message">No hay citas agendadas</div>
                    ) : (
                        citas.map((cita) => {
                            const doctor = doctores.find((d) => d.id === cita.doctor_id);
                            return (
                                <div key={cita.id} className="cita-item" data-cita-id={cita.id}>
                                    <div className="cita-info">
                                        <p><strong>Doctor:</strong> {doctor?.nombre || 'N/A'}</p>
                                        <p><strong>Fecha:</strong> {cita.fecha}</p>
                                        <p><strong>Hora:</strong> {cita.hora}</p>
                                        <p><strong>Estado:</strong> {cita.estado}</p>
                                    </div>
                                    <button
                                        className="btn-cancelar"
                                        onClick={() => cancelarCita(cita.id)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

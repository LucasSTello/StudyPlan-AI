import React, { useState } from 'react';
import { Plus, Trash2, Calendar, BookOpen, Clock, Target, AlertCircle } from 'lucide-react';

const DAYS_OF_WEEK = [
  { id: 'Lunes', label: 'Lun' },
  { id: 'Martes', label: 'Mar' },
  { id: 'Miércoles', label: 'Mié' },
  { id: 'Jueves', label: 'Jue' },
  { id: 'Viernes', label: 'Vie' },
  { id: 'Sábado', label: 'Sáb' },
  { id: 'Domingo', label: 'Dom' }
];

export default function StudentForm({ onSubmit, loading }) {
  // Materias agregadas
  const [materias, setMaterias] = useState([]);
  const [currentMateriaInput, setCurrentMateriaInput] = useState('');
  
  // Datos específicos por materia
  const [fechasExamen, setFechasExamen] = useState({});
  const [dificultades, setDificultades] = useState({});
  const [temasPendientes, setTemasPendientes] = useState({});
  
  // Disponibilidad y objetivos
  const [horasDisponibles, setHorasDisponibles] = useState(2);
  const [diasDisponibles, setDiasDisponibles] = useState(['Lunes', 'Miércoles', 'Viernes']);
  const [objetivo, setObjetivo] = useState('');

  // Errores de validación
  const [validationError, setValidationError] = useState('');

  // Agregar materia
  const handleAddMateria = () => {
    const value = currentMateriaInput.trim();
    if (!value) return;
    if (materias.includes(value)) {
      setValidationError('La materia ya ha sido agregada.');
      return;
    }
    
    setMaterias([...materias, value]);
    setFechasExamen({ ...fechasExamen, [value]: '' });
    setDificultades({ ...dificultades, [value]: 'Medio' });
    setTemasPendientes({ ...temasPendientes, [value]: '' });
    setCurrentMateriaInput('');
    setValidationError('');
  };

  // Manejar tecla Enter en input de materias
  const handleKeyDownMateria = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddMateria();
    }
  };

  // Remover materia
  const handleRemoveMateria = (materia) => {
    setMaterias(materias.filter((m) => m !== materia));
    
    // Limpiar sus valores
    const updatedFechas = { ...fechasExamen };
    delete updatedFechas[materia];
    setFechasExamen(updatedFechas);

    const updatedDificultades = { ...dificultades };
    delete updatedDificultades[materia];
    setDificultades(updatedDificultades);

    const updatedTemas = { ...temasPendientes };
    delete updatedTemas[materia];
    setTemasPendientes(updatedTemas);
  };

  // Alternar selección de días de la semana
  const handleToggleDay = (dayId) => {
    if (diasDisponibles.includes(dayId)) {
      setDiasDisponibles(diasDisponibles.filter((d) => d !== dayId));
    } else {
      setDiasDisponibles([...diasDisponibles, dayId]);
    }
  };

  // Modificar propiedades de materia
  const handleChangeFecha = (materia, val) => {
    setFechasExamen({ ...fechasExamen, [materia]: val });
  };

  const handleChangeDificultad = (materia, val) => {
    setDificultades({ ...dificultades, [materia]: val });
  };

  const handleChangeTemas = (materia, val) => {
    setTemasPendientes({ ...temasPendientes, [materia]: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (materias.length === 0) {
      setValidationError('Por favor, ingresa al menos una materia para planificar.');
      return;
    }

    // Validar que todas las materias tengan cargados algunos temas o dificultad
    for (let mat of materias) {
      if (!fechasExamen[mat]) {
        setValidationError(`Por favor, indica la fecha de examen para la materia: ${mat}`);
        return;
      }
    }

    if (diasDisponibles.length === 0) {
      setValidationError('Por favor, selecciona al menos un día disponible para estudiar.');
      return;
    }

    setValidationError('');
    
    // Armar el payload
    onSubmit({
      materias,
      fechas_examen: fechasExamen,
      horas_disponibles: horasDisponibles,
      dias_disponibles: diasDisponibles,
      dificultades,
      temas_pendientes: temasPendientes,
      objetivo
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel form-container no-print" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 className="app-title-container" style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px' }}>
        <BookOpen style={{ color: 'var(--primary)' }} />
        <span>Datos del Estudiante</span>
      </h2>

      {/* Ingreso de Materias */}
      <div className="form-group">
        <label className="form-label">Materias a Estudiar</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Ej. Análisis Matemático, Física I..."
            value={currentMateriaInput}
            onChange={(e) => setCurrentMateriaInput(e.target.value)}
            onKeyDown={handleKeyDownMateria}
            disabled={loading}
          />
          <button
            type="button"
            className="btn btn-primary btn-icon"
            onClick={handleAddMateria}
            disabled={loading}
            style={{ flexShrink: 0 }}
          >
            <Plus size={20} />
          </button>
        </div>
        
        {/* Renderizado de las Materias como Chips */}
        <div className="chips-container">
          {materias.length === 0 ? (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', paddingLeft: '4px' }}>
              Agrega las materias que debes estudiar...
            </span>
          ) : (
            materias.map((materia) => (
              <span className="chip" key={materia}>
                {materia}
                <button
                  type="button"
                  className="chip-remove"
                  onClick={() => handleRemoveMateria(materia)}
                  disabled={loading}
                >
                  &times;
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Campos dinámicos por Materia */}
      {materias.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0, 0, 0, 0.1)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--panel-border)' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} style={{ color: 'var(--secondary)' }} />
            <span>Configuración de Exámenes y Dificultad</span>
          </h3>

          {materias.map((materia) => (
            <div key={materia} style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: 'var(--secondary)', fontSize: '0.9rem' }}>{materia}</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-icon"
                  style={{ width: '28px', height: '28px', color: 'var(--error)' }}
                  onClick={() => handleRemoveMateria(materia)}
                  disabled={loading}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Fecha de Examen</label>
                  <input
                    type="date"
                    className="form-input"
                    value={fechasExamen[materia] || ''}
                    onChange={(e) => handleChangeFecha(materia, e.target.value)}
                    required
                    disabled={loading}
                    style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Dificultad</label>
                  <select
                    className="form-input form-select"
                    value={dificultades[materia] || 'Medio'}
                    onChange={(e) => handleChangeDificultad(materia, e.target.value)}
                    disabled={loading}
                    style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                  >
                    <option value="Bajo">Bajo (Fácil de entender)</option>
                    <option value="Medio">Medio (Requiere práctica)</option>
                    <option value="Alto">Alto (Complejo / Crítico)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Temas Pendientes (Separados por coma)</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Ej. Límites, Derivadas, Integrales..."
                  value={temasPendientes[materia] || ''}
                  onChange={(e) => handleChangeTemas(materia, e.target.value)}
                  disabled={loading}
                  style={{ fontSize: '0.85rem', resize: 'vertical', padding: '8px' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Horas disponibles diarias */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>Horas Disponibles por Día</label>
          <span style={{ fontWeight: '700', color: 'var(--primary)', fontFamily: 'var(--font-title)' }}>
            {horasDisponibles} {horasDisponibles === 1 ? 'hora' : 'horas'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={16} style={{ color: 'var(--text-secondary)' }} />
          <input
            type="range"
            min="1"
            max="12"
            step="0.5"
            value={horasDisponibles}
            onChange={(e) => setHorasDisponibles(parseFloat(e.target.value))}
            className="form-input"
            style={{ padding: 0, cursor: 'pointer', height: '6px', background: 'rgba(255, 255, 255, 0.1)' }}
            disabled={loading}
          />
        </div>
      </div>

      {/* Días disponibles de la semana */}
      <div className="form-group">
        <label className="form-label">Días Disponibles de Estudio</label>
        <div className="day-selector-grid">
          {DAYS_OF_WEEK.map((day) => {
            const isActive = diasDisponibles.includes(day.id);
            return (
              <button
                key={day.id}
                type="button"
                className={`day-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleToggleDay(day.id)}
                disabled={loading}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Objetivo del estudiante */}
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Target size={15} style={{ color: 'var(--accent)' }} />
          <span>Objetivo General</span>
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="Ej. Promocionar las materias, Organizarme mejor antes del final..."
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Errores de validación */}
      {validationError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)', fontSize: '0.85rem', background: 'rgba(239, 44, 44, 0.1)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 44, 44, 0.2)' }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Botón de Enviar */}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        style={{ marginTop: '10px', width: '100%', height: '46px' }}
      >
        {loading ? <div className="loader"></div> : 'Generar Plan de Estudio'}
      </button>
    </form>
  );
}

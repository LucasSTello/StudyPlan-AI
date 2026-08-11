import React, { useState, useEffect } from 'react';
import { Calendar, ListTodo, GraduationCap, Copy, Printer, Check, RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import { convertPlanToMarkdown } from '../utils/planParser';

export default function PlanViewer({ plan }) {
  const [activeTab, setActiveTab] = useState('semana'); // 'semana' | 'prioridades' | 'repaso' | 'markdown'
  const [completedObjectives, setCompletedObjectives] = useState({});
  const [copied, setCopied] = useState(false);

  // Cargar checklist de objetivos desde localStorage
  useEffect(() => {
    if (plan) {
      // Creamos un hash simple basado en el plan para persistir el progreso de este plan específico
      const planHash = btoa(encodeURIComponent(JSON.stringify(plan.objetivos || ''))).slice(0, 32);
      const savedProgress = localStorage.getItem(`studyplan_progress_${planHash}`);
      if (savedProgress) {
        setCompletedObjectives(JSON.parse(savedProgress));
      } else {
        setCompletedObjectives({});
      }
    }
  }, [plan]);

  if (!plan) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <GraduationCap size={48} style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
        <h3>Aún no has generado ningún plan</h3>
        <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>
          Completa el formulario de la izquierda con tus materias, fechas de examen y disponibilidad horaria, y haz clic en "Generar Plan de Estudio".
        </p>
      </div>
    );
  }

  // Alternar el estado completado de un objetivo
  const handleToggleObjective = (index) => {
    const planHash = btoa(encodeURIComponent(JSON.stringify(plan.objetivos || ''))).slice(0, 32);
    const updated = {
      ...completedObjectives,
      [index]: !completedObjectives[index]
    };
    setCompletedObjectives(updated);
    localStorage.setItem(`studyplan_progress_${planHash}`, JSON.stringify(updated));
  };

  // Restablecer el progreso
  const handleResetProgress = () => {
    const planHash = btoa(encodeURIComponent(JSON.stringify(plan.objetivos || ''))).slice(0, 32);
    setCompletedObjectives({});
    localStorage.removeItem(`studyplan_progress_${planHash}`);
  };

  // Copiar el Markdown al portapapeles
  const handleCopyMarkdown = () => {
    const markdown = convertPlanToMarkdown(plan);
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Activar la impresión del navegador
  const handlePrint = () => {
    window.print();
  };

  const getDificultadBadge = (diff) => {
    if (!diff) return null;
    const cleanDiff = diff.toLowerCase();
    if (cleanDiff.includes('bajo') || cleanDiff.includes('fácil')) return <span className="badge badge-low">Dificultad Baja</span>;
    if (cleanDiff.includes('alto') || cleanDiff.includes('complejo') || cleanDiff.includes('difícil')) return <span className="badge badge-high">Dificultad Alta</span>;
    return <span className="badge badge-medium">Dificultad Media</span>;
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Cabecera del visualizador */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: '16px', marginBottom: '1.5rem' }}>
        <h2 className="app-title-container" style={{ fontSize: '1.4rem' }}>
          <Sparkles style={{ color: 'var(--secondary)' }} />
          <span>Su Plan de Estudio Personalizado</span>
        </h2>
        
        {/* Botones de Acción */}
        <div className="no-print" style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-icon" onClick={handlePrint} title="Imprimir o Guardar en PDF">
            <Printer size={16} />
          </button>
          <button className="btn btn-secondary" onClick={handleCopyMarkdown} style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
            {copied ? (
              <>
                <Check size={14} style={{ color: 'var(--success)' }} />
                <span style={{ color: 'var(--success)' }}>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copiar Markdown</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs de Navegación (no se imprimen) */}
      <div className="tab-container no-print">
        <button
          className={`tab-btn ${activeTab === 'semana' ? 'active' : ''}`}
          onClick={() => setActiveTab('semana')}
        >
          <Calendar size={15} style={{ marginRight: '6px', display: 'inline' }} />
          Cronograma Semanal
        </button>
        <button
          className={`tab-btn ${activeTab === 'prioridades' ? 'active' : ''}`}
          onClick={() => setActiveTab('prioridades')}
        >
          <ListTodo size={15} style={{ marginRight: '6px', display: 'inline' }} />
          Prioridades y Metas
        </button>
        <button
          className={`tab-btn ${activeTab === 'repaso' ? 'active' : ''}`}
          onClick={() => setActiveTab('repaso')}
        >
          <GraduationCap size={15} style={{ marginRight: '6px', display: 'inline' }} />
          Repaso y Consejos
        </button>
        <button
          className={`tab-btn ${activeTab === 'markdown' ? 'active' : ''}`}
          onClick={() => setActiveTab('markdown')}
        >
          <BookOpen size={15} style={{ marginRight: '6px', display: 'inline' }} />
          Texto de la Entrega (Markdown)
        </button>
      </div>

      {/* RENDERIZADO DE CONTENIDO SEGÚN LA PESTAÑA */}

      {/* Pestaña: Cronograma Semanal */}
      {(activeTab === 'semana' || window.matchMedia('print').matches) && (
        <div style={{ display: activeTab === 'semana' ? 'block' : 'none' }}>
          <div className="table-wrapper">
            <table className="study-table">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Horario</th>
                  <th>Materia</th>
                  <th>Tema</th>
                  <th>Actividad</th>
                  <th>Duración</th>
                  <th>Descanso</th>
                </tr>
              </thead>
              <tbody>
                {plan.plan_semanal && plan.plan_semanal.length > 0 ? (
                  plan.plan_semanal.map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.dia}</td>
                      <td>{row.horario}</td>
                      <td style={{ color: 'var(--secondary)', fontWeight: '500' }}>{row.materia}</td>
                      <td>{row.tema}</td>
                      <td>{row.actividad}</td>
                      <td>{row.duracion}</td>
                      <td>{row.descanso}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No hay bloques asignados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pestaña: Prioridades y Metas */}
      {activeTab === 'prioridades' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Prioridades */}
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '12px' }}>Orden de Prioridades</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {plan.prioridades && plan.prioridades.map((pri, i) => (
                <div key={i} className="glass-panel" style={{ padding: '14px', background: 'rgba(255,255,255,0.01)', borderLeft: `4px solid ${i === 0 ? 'var(--accent)' : 'var(--primary)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      Prioridad #{i + 1}: {pri.materia}
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{pri.motivo}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist de Objetivos de Jornada */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>Checklist de Objetivos Diarios</h3>
              {Object.keys(completedObjectives).length > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResetProgress}
                  style={{ fontSize: '0.75rem', padding: '4px 8px', display: 'flex', gap: '4px', height: '24px' }}
                >
                  <RefreshCw size={10} />
                  <span>Restablecer</span>
                </button>
              )}
            </div>
            
            <div className="checklist-container">
              {plan.objetivos && plan.objetivos.map((obj, i) => {
                const isCompleted = !!completedObjectives[i];
                return (
                  <div
                    key={i}
                    className={`checklist-item ${isCompleted ? 'completed' : ''}`}
                    onClick={() => handleToggleObjective(i)}
                  >
                    <div className="checklist-checkbox">
                      {isCompleted && <Check size={12} style={{ color: 'white' }} />}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {obj.dia}
                      </span>
                      <span className="checklist-text">{obj.descripcion}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pestaña: Repaso y Consejos */}
      {activeTab === 'repaso' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GraduationCap style={{ color: 'var(--primary)' }} size={18} />
              <span>Estrategia de Repasos</span>
            </h3>
            {plan.repaso ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <p><strong>Cuándo repasar:</strong> {plan.repaso.cuando}</p>
                <p><strong>Cómo estudiar:</strong> {plan.repaso.como}</p>
              </div>
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No se detallaron pautas específicas de repaso.</p>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '10px' }}>Recomendaciones de StudyPlan AI</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {plan.recomendaciones && plan.recomendaciones.map((rec, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Pestaña: Texto Markdown */}
      {activeTab === 'markdown' && (
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>
            Este es el plan estructurado exactamente en el formato requerido por la entrega del proyecto final. 
            Puedes copiarlo directamente y pegarlo en tu reporte.
          </p>
          <pre style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--panel-border)',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            overflowX: 'auto',
            color: 'var(--text-secondary)',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            maxHeight: '400px'
          }}>
            {convertPlanToMarkdown(plan)}
          </pre>
        </div>
      )}
    </div>
  );
}

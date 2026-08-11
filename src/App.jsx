import React, { useState, useEffect } from 'react';
import { Key, GraduationCap, AlertCircle, Sparkles } from 'lucide-react';
import StudentForm from './components/StudentForm';
import PlanViewer from './components/PlanViewer';
import ChatAdjuster from './components/ChatAdjuster';
import ApiKeyModal from './components/ApiKeyModal';
import { generateStudyPlan } from './services/openaiService';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plan, setPlan] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar clave de API guardada
  useEffect(() => {
    const savedKey = localStorage.getItem('studyplan_openai_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setIsModalOpen(true);
    }
  }, []);

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    if (!apiKey) {
      setIsModalOpen(true);
      setError('Se requiere configurar su OpenAI API Key para generar planes.');
      return;
    }

    setLoading(true);
    setError('');
    setPlan(null);
    setStudentData(formData);

    try {
      const generatedPlan = await generateStudyPlan(apiKey, formData);
      setPlan(generatedPlan);
    } catch (err) {
      console.error(err);
      setError(
        'Ocurrió un error al generar su plan de estudio. Asegúrese de que su clave de OpenAI API sea válida, tenga fondos disponibles en su cuenta de plataforma de desarrolladores y que su conexión a internet sea estable.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePlanUpdate = (updatedPlan) => {
    setPlan(updatedPlan);
  };

  return (
    <div className="app-container">
      {/* Header de la Aplicación */}
      <header className="app-header">
        <div className="app-title-container">
          <span className="app-logo">📚</span>
          <div>
            <h1 className="app-title">StudyPlan AI</h1>
            <p className="app-subtitle">Tu asistente de planificación y organización del estudio inteligente</p>
          </div>
        </div>
        
        {/* Botón para Configurar API Key */}
        <div className="no-print">
          <button 
            className="btn btn-secondary" 
            onClick={() => setIsModalOpen(true)}
            style={{ fontSize: '0.85rem' }}
          >
            <Key size={14} style={{ color: apiKey ? 'var(--success)' : 'var(--warning)' }} />
            <span>{apiKey ? 'API Key Configurada' : 'Configurar API Key'}</span>
          </button>
        </div>
      </header>

      {/* Alerta de Error */}
      {error && (
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--error)', background: 'rgba(239, 44, 44, 0.08)', border: '1px solid rgba(239, 44, 44, 0.2)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '2px' }}>Error de Comunicación</strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{error}</span>
          </div>
        </div>
      )}

      {/* Grid Principal */}
      <main className="main-grid">
        {/* Panel Izquierdo: Formulario del Estudiante */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <StudentForm onSubmit={handleFormSubmit} loading={loading} />
        </div>

        {/* Panel Derecho: Plan de Estudio y Chat de Ajustes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {loading ? (
            <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div className="loader" style={{ width: '40px', height: '40px', borderTopColor: 'var(--primary)' }}></div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-title)', fontWeight: 600 }}>Generando plan óptimo...</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  StudyPlan AI está analizando las materias, prioridades y tiempos para evitar sobrecargas. Esto puede tomar unos segundos.
                </p>
              </div>
            </div>
          ) : (
            <>
              <PlanViewer plan={plan} />
              
              {plan && (
                <ChatAdjuster 
                  plan={plan} 
                  studentData={studentData} 
                  onPlanUpdate={handlePlanUpdate}
                  apiKey={apiKey}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal para ingresar API Key */}
      <ApiKeyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveApiKey} 
      />
    </div>
  );
}

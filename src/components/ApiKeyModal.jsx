import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { validateApiKey } from '../services/openaiService';

export default function ApiKeyModal({ isOpen, onClose, onSave }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('studyplan_openai_key');
    if (savedKey) {
      setApiKey(savedKey);
      setStatus('success');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setStatus('error');
      setErrorMessage('Por favor, ingresa una clave de API.');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    const isValid = await validateApiKey(apiKey.trim());
    setLoading(false);

    if (isValid) {
      localStorage.setItem('studyplan_openai_key', apiKey.trim());
      setStatus('success');
      onSave(apiKey.trim());
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setStatus('error');
      setErrorMessage('La clave API ingresada es inválida o no tiene créditos. Por favor, verifica y vuelve a intentar.');
    }
  };

  return (
    <div className="modal-overlay no-print">
      <div className="modal-content glass-panel">
        <div className="config-header">
          <h2 className="app-title-container" style={{ fontSize: '1.4rem' }}>
            <Key className="text-primary" size={24} style={{ color: 'var(--primary)' }} />
            <span>Configurar OpenAI API Key</span>
          </h2>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Para generar los planes de estudio interactivos mediante inteligencia artificial, se requiere una clave de API de OpenAI. 
          <strong style={{ color: 'var(--text-primary)' }}> Nota de seguridad:</strong> Su clave se guarda localmente en su navegador y nunca se envía a ningún servidor que no sea la API oficial de OpenAI.
        </p>

        <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          💡 <strong style={{ color: 'var(--primary)' }}>¿No tienes una API Key de OpenAI?</strong> Puedes ingresar la palabra <strong style={{ color: 'white', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>demo</strong> para activar el **Modo de Prueba Local (Offline)** y testear la aplicación de forma completa e instantánea.
        </div>

        <form onSubmit={handleSubmit} className="config-body">
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Clave API de OpenAI</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type={showKey ? 'text' : 'password'}
                className="form-input"
                placeholder="sk-proj-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={loading || status === 'success'}
                style={{ fontFamily: 'monospace' }}
              />
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => setShowKey(!showKey)}
                style={{ flexShrink: 0 }}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {status === 'success' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <CheckCircle size={16} />
              <span>Clave verificada con éxito. Redireccionando...</span>
            </div>
          )}

          {status === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <AlertTriangle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
            {localStorage.getItem('studyplan_openai_key') && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || status === 'success'}
              style={{ minWidth: '120px' }}
            >
              {loading ? <div className="loader"></div> : 'Guardar y Validar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

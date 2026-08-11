import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { adjustStudyPlan } from '../services/openaiService';

export default function ChatAdjuster({ plan, studentData, onPlanUpdate, apiKey }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu planificador virtual StudyPlan AI. ¿Quieres hacer algún ajuste a tu plan de estudio? Puedes pedirme cosas como: "Mueve el estudio de Física al sábado", "Reduce las horas del martes", o "Añade un descanso más largo".'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);

  // Auto-scroll al fondo al recibir mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || loading) return;

    if (!apiKey) {
      setError('Por favor, ingresa tu OpenAI API Key antes de enviar mensajes.');
      return;
    }

    if (!plan) {
      setError('Primero debes generar tu plan de estudio en el formulario.');
      return;
    }

    // Agregar mensaje del usuario
    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    setError('');

    try {
      // Llamar al servicio para ajustar el plan
      const result = await adjustStudyPlan(apiKey, plan, studentData, text);
      
      // Agregar mensaje de la IA
      const assistantMessage = { role: 'assistant', content: result.responseText };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Actualizar el plan principal en la aplicación
      onPlanUpdate(result.plan);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al procesar el ajuste. Asegúrate de tener una conexión a Internet estable y que tu clave de API sea válida.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          content: 'No se pudo procesar tu solicitud debido a un problema de comunicación con la API de OpenAI.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel chat-container no-print" style={{ marginTop: '20px' }}>
      {/* Header del Chat */}
      <div className="chat-header">
        <MessageSquare size={18} style={{ color: 'var(--accent)' }} />
        <span className="chat-header-title">Modificar Plan con StudyPlan AI Coach</span>
        <span className="badge badge-medium" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
          Interactivo
        </span>
      </div>

      {/* Mensajes del Chat */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${
              msg.role === 'user'
                ? 'chat-bubble-user'
                : msg.role === 'system'
                ? 'chat-bubble-system'
                : 'chat-bubble-assistant'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble chat-bubble-assistant" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="loader" style={{ width: '12px', height: '12px', borderTopColor: 'var(--primary)' }}></div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ajustando el plan de estudio...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Errores */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error)', fontSize: '0.8rem', padding: '8px 20px', background: 'rgba(239, 44, 44, 0.08)', borderTop: '1px solid rgba(239, 44, 44, 0.15)' }}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* Entrada del Chat */}
      <form onSubmit={handleSendMessage} className="chat-input-wrapper">
        <input
          type="text"
          className="chat-input"
          placeholder={plan ? "Ej. Pasa Matemáticas al sábado o reduce las horas del lunes..." : "Primero genera un plan..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={loading || !plan}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '40px', height: '40px', padding: 0, borderRadius: 'var(--radius-sm)' }}
          disabled={loading || !inputValue.trim() || !plan}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

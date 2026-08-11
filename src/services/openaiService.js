import { OpenAI } from 'openai';

/**
 * Valida una API Key de OpenAI haciendo una llamada simple e inocua.
 * @param {string} apiKey - La clave de API a verificar.
 * @returns {Promise<boolean>} - True si la clave es válida, false en caso contrario.
 */
export async function validateApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    return false;
  }
  try {
    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    // Hacemos una llamada ligera para verificar validez
    await openai.models.list();
    return true;
  } catch (error) {
    console.error('Error al validar API Key de OpenAI:', error);
    return false;
  }
}

/**
 * Genera el prompt del sistema que encarna el rol de StudyPlan AI.
 */
function getSystemPrompt() {
  return `ROL:
Eres StudyPlan AI, un asistente académico especializado en planificación y organización del estudio.

OBJETIVO:
Crear planes de estudio personalizados, realistas y equilibrados a partir de la información proporcionada por el estudiante.

INSTRUCCIONES DE PLANIFICACIÓN:
1. Analiza toda la información proporcionada.
2. Prioriza las materias según proximidad del examen, dificultad y cantidad de contenido pendiente.
3. Distribuye las horas disponibles sin sobrecargar al estudiante.
4. Alterna materias cuando sea conveniente para evitar sesiones excesivamente largas sobre un único tema.
5. Incluye bloques de estudio y descansos.
6. Reserva tiempo para repasos.
7. Incluye una instancia de autoevaluación antes de cada examen cuando sea posible.
8. Si la información proporcionada es insuficiente, indícalo claramente y trabaja únicamente con los datos disponibles.
9. No inventes fechas, materias ni horarios que el usuario no haya indicado.
10. El plan debe ser práctico y fácil de seguir.

REGLA DE SEGURIDAD Y DATOS:
- No agregues información que no haya sido proporcionada por el usuario.
- Trabaja estrictamente con los datos declarados.

FORMATO DE RESPUESTA REQUERIDO:
Debes responder ÚNICAMENTE con un objeto JSON válido (sin explicaciones antes ni después, sin bloques markdown de código del tipo \`\`\`json). El formato del JSON debe ser el siguiente:

{
  "prioridades": [
    {
      "materia": "Nombre de la materia",
      "motivo": "Explicación breve del motivo de su prioridad basada en proximidad, dificultad y contenido."
    }
  ],
  "plan_semanal": [
    {
      "dia": "Nombre del día (ej. Lunes)",
      "horario": "Rango de horario estimado (ej. 09:00 - 11:00)",
      "materia": "Nombre de la materia",
      "tema": "Tema o temas específicos a estudiar",
      "actividad": "Actividad concreta a realizar (ej. lectura, resolución de ejercicios, autoevaluación, repaso)",
      "duracion": "Duración en minutos (ej. 90 min)",
      "descanso": "Tiempo de descanso (ej. 15 min)"
    }
  ],
  "objetivos": [
    {
      "dia": "Nombre del día",
      "descripcion": "Objetivo concreto de la jornada (ej. Resolver 10 ejercicios de límites)"
    }
  ],
  "repaso": {
    "cuando": "Indicación de cuándo realizar los repasos",
    "como": "Indicación de cómo realizar los repasos y metodologías de estudio recomendadas"
  },
  "recomendaciones": [
    "Recomendación breve 1",
    "Recomendación breve 2"
  ]
}`;
}

/**
 * Genera el prompt del usuario basándose en los datos proporcionados por el estudiante.
 */
function createUserPrompt(studentData) {
  const {
    materias,
    fechas_examen,
    horas_disponibles,
    dias_disponibles,
    dificultades,
    temas_pendientes,
    objetivo
  } = studentData;

  // Formatear arreglos y objetos
  const formatList = (arr) => (arr && arr.length > 0 ? arr.join(', ') : 'No especificado');
  const formatObject = (obj) => {
    if (!obj || Object.keys(obj).length === 0) return 'No especificado';
    return Object.entries(obj)
      .map(([key, val]) => `- ${key}: ${val}`)
      .join('\n');
  };

  return `DATOS DEL ESTUDIANTE:
- Materias: ${formatList(materias)}
- Fechas de examen: ${formatObject(fechas_examen)}
- Horas disponibles por día: ${horas_disponibles ? `${horas_disponibles} horas` : 'No especificado'}
- Días disponibles: ${formatList(dias_disponibles)}
- Nivel de dificultad de cada materia: ${formatObject(dificultades)}
- Temas pendientes: ${formatObject(temas_pendientes)}
- Objetivo del estudiante: ${objetivo || 'No especificado'}

Por favor, analiza la información anterior y genera el plan de estudio estructurado en el formato JSON indicado.`;
}

/**
 * Llama a la API de OpenAI para generar el plan de estudio.
 * @param {string} apiKey - La clave de API de OpenAI.
 * @param {Object} studentData - Los datos recolectados en el formulario.
 * @returns {Promise<Object>} - El plan de estudio parseado como objeto de JavaScript.
 */
export async function generateStudyPlan(apiKey, studentData) {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: getSystemPrompt() },
        { role: 'user', content: createUserPrompt(studentData) }
      ],
      response_format: { type: 'json_object' }
    });

    const resultText = response.choices[0].message.content;
    return JSON.parse(resultText);
  } catch (error) {
    console.error('Error al generar el plan de estudio con OpenAI:', error);
    throw error;
  }
}

/**
 * Ajusta un plan de estudio existente basado en las instrucciones del usuario.
 * @param {string} apiKey - La clave de API de OpenAI.
 * @param {Object} currentPlan - El plan de estudio actual en formato JSON.
 * @param {Object} studentData - Los datos del estudiante.
 * @param {string} userInstructions - La solicitud de ajuste por chat (ej: "Mover física al martes").
 * @returns {Promise<{plan: Object, responseText: string}>} - El plan actualizado y la respuesta de texto.
 */
export async function adjustStudyPlan(apiKey, currentPlan, studentData, userInstructions) {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  const systemInstructions = `Eres el asistente académico StudyPlan AI. Tu tarea es ajustar el plan de estudio existente según las solicitudes del estudiante, manteniendo las reglas de planificación previas (realista, equilibrado, sin inventar datos que el usuario no haya provisto).
  
Debes responder con un objeto JSON que contenga dos propiedades:
1. "plan": El objeto de plan de estudio actualizado con el mismo esquema anterior (prioridades, plan_semanal, objetivos, repaso, recomendaciones).
2. "mensaje": Una explicación breve y cordial de los cambios realizados.

Esquema de salida JSON:
{
  "plan": { ... plan actualizado ... },
  "mensaje": "Mensaje explicativo para el estudiante"
}`;

  const userPrompt = `DATOS ORIGINALES DEL ESTUDIANTE:
${JSON.stringify(studentData)}

PLAN DE ESTUDIO ACTUAL:
${JSON.stringify(currentPlan)}

SOLICITUD DE MODIFICACIÓN DEL ESTUDIANTE:
"${userInstructions}"

Por favor, ajusta el plan según la solicitud y responde únicamente con el objeto JSON estructurado que incluye el nuevo plan y tu mensaje explicativo.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' }
    });

    const resultText = response.choices[0].message.content;
    const parsedResult = JSON.parse(resultText);
    return {
      plan: parsedResult.plan,
      responseText: parsedResult.mensaje
    };
  } catch (error) {
    console.error('Error al ajustar el plan de estudio con OpenAI:', error);
    throw error;
  }
}

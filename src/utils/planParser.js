/**
 * Convierte un objeto de plan de estudio JSON en una cadena Markdown estructurada.
 * Cumple al 100% con el formato de respuesta especificado en el enunciado de la entrega.
 * @param {Object} plan - El objeto JSON con los datos del plan.
 * @returns {string} - El texto del plan formateado en Markdown.
 */
export function convertPlanToMarkdown(plan) {
  if (!plan) return '';

  let markdown = '# Plan de estudio personalizado\n\n';

  // 1. Prioridades
  markdown += '## Prioridades\n';
  if (plan.prioridades && plan.prioridades.length > 0) {
    plan.prioridades.forEach((p, index) => {
      markdown += `${index + 1}. **${p.materia}**: ${p.motivo}\n`;
    });
  } else {
    markdown += 'No se han definido prioridades específicas.\n';
  }
  markdown += '\n';

  // 2. Plan semanal
  markdown += '## Plan semanal\n';
  markdown += '| Día | Horario | Materia | Tema | Actividad | Duración | Descanso |\n';
  markdown += '| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n';
  if (plan.plan_semanal && plan.plan_semanal.length > 0) {
    plan.plan_semanal.forEach((item) => {
      markdown += `| ${item.dia} | ${item.horario} | ${item.materia} | ${item.tema} | ${item.actividad} | ${item.duracion} | ${item.descanso} |\n`;
    });
  } else {
    markdown += '| - | - | - | - | - | - | - |\n';
  }
  markdown += '\n';

  // 3. Objetivos
  markdown += '## Objetivos\n';
  if (plan.objetivos && plan.objetivos.length > 0) {
    plan.objetivos.forEach((obj) => {
      markdown += `- **${obj.dia}**: ${obj.descripcion}\n`;
    });
  } else {
    markdown += 'No se han definido objetivos diarios específicos.\n';
  }
  markdown += '\n';

  // 4. Repaso
  markdown += '## Repaso\n';
  if (plan.repaso) {
    markdown += `**Cuándo**: ${plan.repaso.cuando || 'No especificado'}\n\n`;
    markdown += `**Cómo**: ${plan.repaso.como || 'No especificado'}\n`;
  } else {
    markdown += 'No se ha detallado la planificación de los repasos.\n';
  }
  markdown += '\n';

  // 5. Recomendaciones
  markdown += '## Recomendaciones\n';
  if (plan.recomendaciones && plan.recomendaciones.length > 0) {
    plan.recomendaciones.forEach((rec) => {
      markdown += `- ${rec}\n`;
    });
  } else {
    markdown += '- No hay recomendaciones adicionales disponibles.\n';
  }

  return markdown;
}

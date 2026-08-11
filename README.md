# 📚 StudyPlan AI - Planificación y Organización del Estudio Inteligente

**StudyPlan AI** es una aplicación web interactiva de grado premium diseñada para ayudar a los estudiantes a organizar sus materias, fechas de examen, contenidos pendientes y disponibilidad horaria en un plan de estudio realista, equilibrado y fácil de seguir.

Esta aplicación fue desarrollada como el **Proyecto Final de la Diplomatura en IA Prompt Engineering para Developers**, aplicando las mejores prácticas de estructuración de prompts, interacción segura con LLMs y desarrollo de interfaces interactivas centradas en el usuario.

---

## ✨ Características Principales

1. **Gestor Seguro de API Key**: Implementa la buena práctica de seguridad requerida: la clave de OpenAI API Key es ingresada por el usuario directamente en el cliente, se valida mediante una petición inocua en tiempo real y se almacena únicamente de forma local en el navegador (`localStorage`). **Nunca se expone en repositorios públicos ni se almacena en bases de datos externas**.
2. **Formulario del Estudiante**: Interfaz dinámica para agregar múltiples asignaturas, configurar fechas de examen, asignar el nivel de dificultad, detallar los temas pendientes, definir las horas diarias y seleccionar interactivamente los días disponibles.
3. **Generación con IA (OpenAI GPT)**: Envía un prompt optimizado (con asignación de rol, restricciones lógicas estrictas para no inventar información y un esquema estricto de salida) para generar un plan de estudio 100% personalizado.
4. **Visualizador Interactivo y Premium (Glassmorphic Dark Mode)**:
   - **Cronograma Semanal**: Una tabla estructurada y estilizada que desglosa las actividades del día, horarios y tiempos de descanso.
   - **Checklist de Metas Diarias**: Convierte los objetivos diarios en tareas interactivas que el estudiante puede marcar como completadas. Su progreso se guarda localmente en el navegador.
   - **Repaso y Consejos**: Consejos específicos y estrategias de estudio recomendadas por la IA para consolidar el conocimiento.
   - **Formato de la Entrega (Markdown)**: Genera el texto del plan formateado exactamente como lo solicita la cátedra, listo para ser copiado con un solo clic.
5. **Ajustes en Caliente (Chat Integrado)**: Un chat interactivo integrado ("StudyPlan AI Coach") que le permite al estudiante pedir cambios puntuales en el plan de estudio ("Pasa matemáticas al sábado", "Dame más tiempo el miércoles", etc.) y ver la actualización en tiempo real en todo el visualizador.
6. **Exportación Flexible**: Botón para copiar el plan en formato Markdown para la entrega, o imprimir y guardar el plan completo como un reporte PDF con estilos CSS optimizados para impresión.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React (v18+) e inicialización con Vite (para un bundle ligero y HMR instantáneo).
- **Estilos**: Vanilla CSS con variables CSS personalizadas, diseño responsive adaptable (Grid y Flexbox) y temática **Glassmorphic Dark Mode**.
- **Iconografía**: `lucide-react` para iconos dinámicos vectoriales.
- **Servicios de IA**: Integración directa con la API oficial de OpenAI (`gpt-4o-mini`) a través de la librería oficial de OpenAI para JavaScript en modo seguro de navegador.

---

## 🚀 Instalación y Ejecución Local

### Requisitos Previos
- **Node.js** (v18 o superior recomendado)
- **NPM** (v9 o superior)

### Paso 1: Clonar e ingresar a la carpeta del proyecto
```bash
cd "StudyPlan AI"
```

### Paso 2: Instalar las dependencias
```bash
npm install
```

### Paso 3: Lanzar el servidor de desarrollo
```bash
npm run dev
```

Abra su navegador web y acceda a la dirección local que indique la consola (típicamente `http://localhost:5173`).

---

## 🌐 Despliegue (Deployment)

Debido a que la aplicación es una SPA (Single Page Application) estática y segura que procesa la lógica de la API en el cliente, se puede deployar gratis en menos de un minuto en cualquiera de las siguientes plataformas:

### Opción A: Vercel (Recomendada)
1. Instale la CLI de Vercel si no la tiene: `npm install -g vercel`
2. Ejecute el comando `vercel` en la raíz de este directorio y siga las instrucciones del asistente.

### Opción B: Netlify
1. Construya el bundle de producción: `npm run build`
2. Arrastre y suelte la carpeta `/dist` generada directamente en la consola de Netlify Drop.

---

## 📝 Ejemplo de Formato de Salida

Cuando se genera el plan de estudio, el visor de **Texto de la Entrega** generará automáticamente la siguiente estructura que cumple con la consigna:

```markdown
# Plan de estudio personalizado

## Prioridades
1. **Física I**: Examen muy próximo (15 de Agosto), dificultad alta.
2. **Análisis Matemático**: Examen el 20 de Agosto, requiere mucha práctica.

## Plan semanal
| Día | Horario | Materia | Tema | Actividad | Duración | Descanso |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Lunes | 09:00 - 11:00 | Física I | Cinemática | Resolución de guías prácticas | 120 min | 15 min |
| Miércoles | 10:00 - 12:00 | Análisis Matemático | Límites | Ejercicios prácticos | 120 min | 15 min |

## Objetivos
- **Lunes**: Resolver los 10 ejercicios de la guía de Cinemática.
- **Miércoles**: Comprender e identificar indeterminaciones en límites algebraicos.

## Repaso
**Cuándo**: Los viernes por la tarde o al inicio de cada jornada.
**Cómo**: Auto-explicación de fórmulas y tarjetas de repaso rápido.

## Recomendaciones
- Utilizar la técnica Pomodoro (estudiar en bloques y respetar los descansos).
- Realizar simulacros de examen 3 días antes de la fecha límite.
```

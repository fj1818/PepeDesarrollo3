/**
 * Plantillas de Email
 * Archivo para mantener las plantillas de mensajes de correo electrónico
 */

// Plantillas de mensajes de email
const emailTemplates = [
    {
        id: 'e1',
        title: 'Presentación de servicios',
        content: '[nombre],\n\nEspero que este correo te encuentre bien. Me pongo en contacto contigo para presentarte mis servicios como entrenador personal.\n\nPuedo ayudarte con:\n\nRutinas de ejercicio personalizadas según tus objetivos\n\nAsesoramiento nutricional complementario\n\nSeguimiento continuo de tu progreso\n\nApoyo motivacional durante todo el proceso\n\nMe especializo en ayudar a personas como tú a alcanzar sus metas físicas, ya sea perder peso, aumentar masa muscular, mejorar resistencia o simplemente adoptar un estilo de vida más saludable.\n\n¿Te gustaría agendar una sesión de evaluación inicial gratuita? Responde a este correo y coordinaremos una fecha conveniente para ti.\n\nSaludos cordiales,\nPepe Urueta\nEntrenador Personal'
    },
    {
        id: 'e2',
        title: 'Recordatorio de cita',
        content: `{{nombre}},

Te escribo para recordarte nuestra sesión de entrenamiento programada para el {{fecha}} a las {{hora}}.

Recuerda traer:

Ropa cómoda para hacer ejercicio

Tenis cómodos

Botella de agua

Toalla pequeña

Por favor, confirma tu asistencia respondiendo a este correo o avísame con anticipación si necesitas reprogramar.

¡Nos vemos pronto para una excelente sesión!

Saludos cordiales,
Pepe Urueta
Entrenador Personal`
    },
    {
        id: 'e3',
        title: 'Plan de entrenamiento',
        content: 'Estimado/a [nombre],\n\nAdjunto encontrarás tu plan de entrenamiento personalizado basado en la evaluación que realizamos y tus objetivos de [objetivo_cliente].\n\nEl plan incluye:\n- Rutinas de ejercicios detalladas con ilustraciones\n- Calendario de entrenamiento semanal\n- Recomendaciones de intensidad y descanso\n- Sugerencias nutricionales complementarias\n\nRecuerda que este plan está diseñado específicamente para ti y tus necesidades. Es importante que sigas las indicaciones de forma progresiva para maximizar resultados y evitar lesiones.\n\nEstaré disponible para resolver cualquier duda y realizaremos ajustes periódicos según tu progreso.\n\nSaludos cordiales,\n\n[remitente]\nEntrenador Personal',
        requiresAttachment: true,
        attachmentType: 'pdf'
    },
    {
        id: 'e4',
        title: 'Reporte de seguimiento',
        content: 'Estimado/a [nombre],\n\nAdjunto a este correo encontrarás un reporte detallado de tu avance de entrenamiento con fecha [fecha_evaluacion].\n\nEn este reporte podrás revisar:\n\n- Tus medidas corporales actuales y comparativas\n- Gráficos de progreso en peso, masa muscular y porcentaje de grasa\n- Análisis de rendimiento en ejercicios clave\n- Recomendaciones personalizadas para la siguiente fase\n\nEstoy muy satisfecho con tu progreso, especialmente en [área_destacada]. Has mostrado gran compromiso y disciplina que están dando resultados visibles.\n\nTe animo a continuar con la misma dedicación y te recuerdo la importancia de mantener también los hábitos alimenticios recomendados para optimizar los resultados del entrenamiento.\n\nSi tienes alguna duda sobre los resultados o deseas programar una sesión para revisar el reporte en detalle, no dudes en contactarme.\n\nSaludos cordiales,\n\n[remitente]\nEntrenador Personal',
        requiresAttachment: true,
        attachmentType: 'pdf'
    },
    {
        id: 'e5',
        title: 'Recomendaciones nutricionales',
        content: 'Estimado/a [nombre],\n\nComo complemento a tu programa de entrenamiento, te envío algunas recomendaciones nutricionales que te ayudarán a optimizar tus resultados.\n\nRecomendaciones generales:\n\n1. Distribución de macronutrientes:\n   - Proteínas: 25-30% de tu ingesta calórica diaria\n   - Carbohidratos: 40-50% (priorizando carbohidratos complejos)\n   - Grasas saludables: 20-30%\n\n2. Hidratación:\n   - Mínimo 2 litros de agua diarios\n   - Aumentar 500ml por cada hora de ejercicio intenso\n\n3. Timing nutricional:\n   - Comida pre-entrenamiento: 1-2 horas antes, rica en carbohidratos complejos\n   - Comida post-entrenamiento: dentro de los 30-60 minutos después, combinar proteínas y carbohidratos\n\n4. Alimentos recomendados:\n   - Proteínas: pollo, pavo, pescado, huevos, legumbres, tofu\n   - Carbohidratos: avena, arroz integral, patata, batata, frutas\n   - Grasas saludables: aguacate, frutos secos, aceite de oliva\n\nRecuerda que estas son recomendaciones generales. Para un plan nutricional más detallado y personalizado, te recomendaría consultar con un nutricionista especializado.\n\nSaludos cordiales,\n\n[remitente]\nEntrenador Personal'
    }
];

// Exportar las plantillas
window.templates = window.templates || {};
window.templates.email = emailTemplates; 
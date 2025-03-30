/**
 * Plantillas de WhatsApp
 * Archivo para mantener las plantillas de mensajes de WhatsApp
 */

// Plantillas de mensajes de WhatsApp
const whatsappTemplates = [
    {
        id: 'w1',
        title: 'Saludo inicial',
        content: 'Hola [nombre], soy [remitente], entrenador personal. Me gustaría ofrecerte mis servicios de entrenamiento personalizado para ayudarte a alcanzar tus metas físicas. ¿Tienes unos minutos para conocer más sobre cómo puedo ayudarte a mejorar tu condición física?'
    },
    {
        id: 'w2',
        title: 'Seguimiento',
        content: 'Hola [nombre], espero que estés bien. Soy [remitente], tu entrenador personal. Te escribo para hacer seguimiento de tu plan de entrenamiento. ¿Cómo te has sentido con los ejercicios? ¿Has notado alguna mejora o tienes alguna dificultad que podamos resolver?'
    },
    {
        id: 'w3',
        title: 'Invitación a cita',
        content: 'Hola [nombre], me gustaría invitarte a una sesión de evaluación física para diseñar un plan de entrenamiento personalizado que se adapte a tus objetivos y condición actual. ¿Te parece bien el [fecha] a las [hora]? Respóndeme para confirmar o sugerir otro horario que te resulte más conveniente.'
    },
    {
        id: 'w4',
        title: 'Reporte de seguimiento',
        content: 'Hola [nombre], te envío un resumen de tu avance de entrenamiento hasta la fecha. He preparado un reporte detallado con tus progresos y gráficas de evolución.\n\nTus resultados son excelentes, has logrado [progreso_destacado]. Continuemos trabajando para alcanzar tu meta de [objetivo_cliente].\n\n¿Tienes alguna pregunta sobre los resultados o necesitas ajustes en tu rutina?',
        requiresAttachment: true,
        attachmentType: 'pdf'
    },
    {
        id: 'w5',
        title: 'Tips nutricionales',
        content: 'Hola [nombre], como parte de tu programa de entrenamiento, quiero compartirte algunos consejos nutricionales que complementarán tu rutina de ejercicios:\n\n• Asegúrate de consumir proteínas después de cada entrenamiento\n• Mantente hidratado durante todo el día (mínimo 2 litros de agua)\n• Evita alimentos procesados y azúcares refinados\n• Incluye verduras en cada comida\n\n¿Necesitas recomendaciones más específicas para tu plan alimenticio?'
    },
    {
        id: 'w6',
        title: 'Recordatorio de rutina',
        content: 'Hola [nombre], te recuerdo tu rutina de entrenamiento para esta semana:\n\n• Lunes: Entrenamiento de fuerza - piernas\n• Martes: Cardio - 30 minutos de intensidad moderada\n• Miércoles: Descanso activo\n• Jueves: Entrenamiento de fuerza - parte superior\n• Viernes: HIIT - 20 minutos\n• Fin de semana: Actividad recreativa y recuperación\n\nRecuerda mantener buena hidratación y seguir las técnicas correctas. ¿Necesitas alguna aclaración sobre los ejercicios?'
    }
];

// Exportar las plantillas
window.templates = window.templates || {};
window.templates.whatsapp = whatsappTemplates; 
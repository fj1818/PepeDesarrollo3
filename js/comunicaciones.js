/**
 * Comunicaciones Module
 * Módulo para gestionar la comunicación con clientes y prospectos
 */

// Variables globales
let selectedContact = null;
let messageTemplates = {
    whatsapp: [
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
    ],
    email: [
        {
            id: 'e1',
            title: 'Presentación de servicios',
            content: 'Estimado/a [nombre],\n\nEspero que este correo te encuentre bien. Me pongo en contacto contigo para presentarte mis servicios como entrenador personal.\n\nPuedo ayudarte con:\n- Rutinas de ejercicio personalizadas según tus objetivos\n- Asesoramiento nutricional complementario\n- Seguimiento continuo de tu progreso\n- Apoyo motivacional durante todo el proceso\n\nMe especializo en ayudar a personas como tú a alcanzar sus metas físicas, ya sea perder peso, aumentar masa muscular, mejorar resistencia o simplemente adoptar un estilo de vida más saludable.\n\n¿Te gustaría agendar una sesión de evaluación inicial gratuita? Responde a este correo y coordinaremos una fecha conveniente para ti.\n\nSaludos cordiales,\n\n[remitente]\nEntrenador Personal'
        },
        {
            id: 'e2',
            title: 'Recordatorio de cita',
            content: 'Estimado/a [nombre],\n\nTe escribo para confirmar nuestra sesión de entrenamiento programada para el [fecha] a las [hora].\n\nRecuerda traer:\n- Ropa cómoda para hacer ejercicio\n- Zapatillas deportivas adecuadas\n- Botella de agua\n- Toalla pequeña\n\nPor favor, confirma tu asistencia respondiendo a este correo o avísame con anticipación si necesitas reprogramar.\n\n¡Nos vemos pronto para una excelente sesión!\n\nSaludos cordiales,\n\n[remitente]\nEntrenador Personal'
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
    ]
};

// Inicializar módulo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded: Inicializando módulo de comunicaciones');
    try {
        // Cargar biblioteca de calendario si no está disponible
        if (typeof flatpickr === 'undefined') {
            // Cargar CSS de flatpickr
            const linkElem = document.createElement('link');
            linkElem.rel = 'stylesheet';
            linkElem.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
            document.head.appendChild(linkElem);
            
            // Cargar CSS del tema
            const linkTheme = document.createElement('link');
            linkTheme.rel = 'stylesheet';
            linkTheme.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/material_blue.css';
            document.head.appendChild(linkTheme);
            
            // Cargar JavaScript de flatpickr
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
            script.onload = function() {
                console.log('Flatpickr cargado correctamente');
                initComunicaciones();
            };
            script.onerror = function(error) {
                console.error('Error al cargar Flatpickr:', error);
                // Intentar inicializar de todos modos
                initComunicaciones();
            };
            document.head.appendChild(script);
        } else {
            initComunicaciones();
        }

        // Verificar si hay errores de JavaScript
        window.addEventListener('error', function(event) {
            console.error('Error de JavaScript detectado:', event.error);
            const errorMsg = event.error ? event.error.toString() : 'Error desconocido';
            
            // Mostrar un mensaje de error al usuario
            const contentElement = document.getElementById('content') || document.querySelector('.content-section');
            if (contentElement) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger mt-3';
                errorDiv.innerHTML = `
                    <h4><i class="fas fa-exclamation-triangle"></i> Error de JavaScript</h4>
                    <p>Se ha producido un error en la carga de la página. Por favor, recargue la página.</p>
                    <p><small>Detalles técnicos: ${errorMsg}</small></p>
                    <button class="btn btn-sm btn-primary mt-2" onclick="location.reload()">Recargar página</button>
                `;
                contentElement.prepend(errorDiv);
            }
        });
    } catch (error) {
        console.error('Error en inicialización de comunicaciones:', error);
        alert('Error al cargar el módulo de comunicaciones. Por favor, recargue la página.');
    }
});

// Reiniciar si el script ya estaba cargado
document.addEventListener('script-reloaded', function(e) {
    if (e.detail.script === 'js/comunicaciones.js') {
        console.log('Script de comunicaciones recargado, reinicializando...');
        try {
            initComunicaciones();
        } catch (error) {
            console.error('Error al reinicializar comunicaciones:', error);
        }
    }
});

/**
 * Inicializar el módulo de comunicaciones
 */
function initComunicaciones() {
    try {
        console.log('Inicializando módulo de comunicaciones');
        
        // Cargar directamente la UI en vez de esperar al evento load-content
        loadComunicacionesUI();
        
        // También mantener el evento por compatibilidad
        document.addEventListener('load-content', function(e) {
            if (e.detail && e.detail.section === 'comunicaciones') {
                console.log('Evento load-content detectado para comunicaciones');
                loadComunicacionesUI();
            }
        });
        
        console.log('Módulo de comunicaciones inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar el módulo de comunicaciones:', error);
        // Mostrar mensaje de error al usuario
        const contentElement = document.getElementById('content') || document.querySelector('.content-section');
        if (contentElement) {
            contentElement.innerHTML = `
                <div class="alert alert-danger">
                    <h4><i class="fas fa-exclamation-triangle"></i> Error al cargar el módulo de comunicaciones</h4>
                    <p>Se ha producido un error al cargar la sección de comunicaciones. Por favor, recargue la página o contacte al administrador.</p>
                    <p>Detalles técnicos: ${error.message}</p>
                    <button class="btn btn-primary mt-3" onclick="location.reload()">Recargar página</button>
                </div>
            `;
        }
    }
}

/**
 * Cargar la interfaz de usuario para comunicaciones
 */
function loadComunicacionesUI() {
    console.log('Cargando UI de comunicaciones');
    
    // Obtener el contenedor de contenido
    const contentSection = document.querySelector('.content-section');
    const contentElement = document.getElementById('content');
    const sectionElement = document.getElementById('content-comunicaciones');
    
    // Usar el elemento específico de la sección, el contenedor general, o crear uno nuevo
    const targetElement = contentSection || sectionElement || contentElement;
    
    if (!targetElement) {
        console.error('No se encontró un contenedor válido para la UI de comunicaciones');
        return;
    }
    
    // Verificar que tenemos datos de contactos
    if (!window.apiData || !window.apiData.clientes) {
        console.log('Cargando datos para comunicaciones...');
        // Cargar datos si no están disponibles
        window.apiService.obtenerTodosLosDatos().then(function() {
            loadComunicacionesContent();
        }).catch(function(error) {
            console.error('Error al cargar datos de API:', error);
            targetElement.innerHTML = '<div class="alert alert-danger">Error al cargar datos. Por favor, recargue la página.</div>';
        });
    } else {
        console.log('Usando datos ya cargados para comunicaciones');
        loadComunicacionesContent();
    }
}

/**
 * Cargar el contenido principal de comunicaciones
 */
function loadComunicacionesContent() {
    console.log('Cargando contenido de comunicaciones');
    
    // Obtener el contenedor adecuado
    const contentSection = document.querySelector('.content-section');
    const contentElement = document.getElementById('content');
    const sectionElement = document.getElementById('content-comunicaciones');
    
    // Usar el elemento específico de la sección, el contenedor general, o crear uno nuevo
    const targetElement = contentSection || sectionElement || contentElement;
    
    if (!targetElement) {
        console.error('No se encontró un contenedor válido para el contenido de comunicaciones');
        return;
    }
    
    console.log('Contenedor encontrado para comunicaciones:', targetElement);
    
    // Obtener clientes para los selectores
    const clientes = window.apiData && window.apiData.clientes ? window.apiData.clientes : {};
    const expedientes = window.apiData && window.apiData.expedientes ? window.apiData.expedientes : {};
    
    console.log('Clientes cargados:', Object.keys(clientes).length);
    
    // Crear la estructura básica
    targetElement.innerHTML = `
        <style>
            /* Estilos para la sección de comunicaciones */
            .comunicaciones-container {
                display: flex;
                gap: 20px;
                margin-top: 20px;
                flex-wrap: wrap;
            }
            
            @media (min-width: 992px) {
                .comunicaciones-container {
                    flex-wrap: nowrap;
                }
            }
            
            .contacts-list {
                flex: 1;
                min-width: 300px;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: column;
                max-height: 600px;
            }
            
            .message-composer {
                flex: 2;
                min-width: 300px;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: column;
            }
            
            .list-header {
                padding: 15px;
                border-bottom: 1px solid #e1e1e1;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .list-search {
                padding: 10px 15px;
                border-bottom: 1px solid #e1e1e1;
            }
            
            .list-search input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            
            .contacts-items {
                overflow-y: auto;
                flex: 1;
                padding: 10px;
            }
            
            .contact-item {
                display: flex;
                padding: 10px;
                border-radius: 6px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: background-color 0.2s;
                align-items: center;
            }
            
            .contact-item:hover {
                background-color: #f5f5f5;
            }
            
            .contact-item.active {
                background-color: #e6f2ff;
                border-left: 3px solid #4a6cf7;
            }
            
            .contact-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: #4a6cf7;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin-right: 12px;
                flex-shrink: 0;
            }
            
            .contact-info {
                flex: 1;
                min-width: 0;
            }
            
            .contact-name {
                margin: 0;
                font-size: 15px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .contact-meta {
                display: flex;
                align-items: center;
                margin-top: 4px;
                gap: 8px;
                font-size: 12px;
                color: #777;
            }
            
            .contact-actions {
                display: flex;
                gap: 8px;
            }
            
            .contact-actions button {
                border: none;
                background: none;
                color: #555;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
            }
            
            .contact-actions button:hover {
                background-color: #eee;
            }
            
            .action-whatsapp {
                color: #25D366 !important;
            }
            
            .action-email {
                color: #4a6cf7 !important;
            }
            
            .composer-header {
                padding: 15px;
                border-bottom: 1px solid #e1e1e1;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .composer-title {
                margin: 0;
                font-size: 18px;
            }
            
            .composer-body {
                padding: 15px;
                flex: 1;
                overflow-y: auto;
                max-height: 480px;
            }
            
            .composer-field {
                margin-bottom: 15px;
            }
            
            .composer-field label {
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
            }
            
            .composer-field input, .composer-field textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
            }
            
            .composer-field textarea {
                min-height: 150px;
                resize: vertical;
            }
            
            .template-selector {
                margin-bottom: 15px;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .template-option {
                padding: 8px 12px;
                background-color: #f5f5f5;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
            }
            
            .template-option:hover {
                background-color: #e5e5e5;
            }
            
            .template-option.active {
                background-color: #4a6cf7;
                color: white;
            }
            
            .preview-section {
                margin-top: 20px;
                padding: 15px;
                background-color: #f9f9f9;
                border-radius: 6px;
            }
            
            .preview-section h3 {
                font-size: 16px;
                margin-bottom: 10px;
            }
            
            .message-preview {
                background-color: white;
                padding: 15px;
                border-radius: 6px;
                border: 1px solid #ddd;
                min-height: 100px;
            }
            
            .composer-actions {
                padding: 15px;
                border-top: 1px solid #e1e1e1;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            
            .contact-detail-card {
                background-color: #f8f9fa;
                border-radius: 6px;
                padding: 15px;
                margin-bottom: 15px;
            }
            
            .contact-detail-row {
                display: flex;
                margin-bottom: 8px;
            }
            
            .contact-detail-label {
                font-weight: 500;
                width: 120px;
                color: #555;
            }
            
            .contact-detail-value {
                flex: 1;
                font-weight: bold;
            }
        </style>
    
        <div class="row mb-4">
            <div class="col-12">
                <div class="crm-card">
                    <div class="card-header">
                        <h5 class="card-title">
                            <i class="fas fa-comments me-2"></i> Comunicaciones
                        </h5>
                    </div>
                    <div class="card-body">
                        <p>Gestiona tus comunicaciones con prospectos y clientes de manera eficiente.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="comunicaciones-container">
            <div class="contacts-list">
                <div class="list-header">
                    <h3>Contactos</h3>
                    <div>
                        <button class="btn btn-sm btn-primary" id="btn-filter-todos">Todos</button>
                        <button class="btn btn-sm btn-light" id="btn-filter-prospectos">Prospectos</button>
                        <button class="btn btn-sm btn-light" id="btn-filter-clientes">Clientes</button>
                    </div>
                </div>
                <div class="list-search">
                    <input type="text" placeholder="Buscar contacto..." id="contact-search">
                </div>
                <div class="contacts-items" id="contacts-container">
                    <!-- Contactos se cargarán aquí -->
                    <div class="text-center py-4">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                        <p class="mt-2">Cargando contactos...</p>
                    </div>
                </div>
            </div>
            
            <div class="message-composer">
                <div class="composer-header">
                    <h2 class="composer-title">Componer mensaje</h2>
                    <div class="composer-options">
                        <button class="btn btn-sm btn-outline-primary" id="btn-type-whatsapp">
                            <i class="fab fa-whatsapp me-1"></i> WhatsApp
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" id="btn-type-email">
                            <i class="fas fa-envelope me-1"></i> Email
                        </button>
                    </div>
                </div>
                
                <div class="composer-body">
                    <!-- Detalles de contacto -->
                    <div class="contact-detail-card" id="contact-details">
                        <div class="contact-detail-row">
                            <div class="contact-detail-label">Nombre:</div>
                            <div class="contact-detail-value" id="contact-name">Selecciona un contacto</div>
                        </div>
                        <div class="contact-detail-row">
                            <div class="contact-detail-label">Contacto:</div>
                            <div class="contact-detail-value" id="contact-info">-</div>
                        </div>
                        <div class="contact-detail-row">
                            <div class="contact-detail-label">Tipo:</div>
                            <div class="contact-detail-value" id="contact-type">-</div>
                        </div>
                    </div>
                    
                    <div class="template-selector" id="template-selector">
                        <!-- Templates options will be loaded here -->
                    </div>
                    
                    <div class="composer-field">
                        <label>Mensaje:</label>
                        <textarea id="message-content" placeholder="Escribe tu mensaje o selecciona una plantilla..."></textarea>
                    </div>
                    
                    <div class="preview-section">
                        <h3>Vista previa</h3>
                        <div class="message-preview" id="message-preview">
                            <!-- Message preview will appear here -->
                        </div>
                    </div>
                </div>
                
                <div class="composer-actions">
                    <button class="btn btn-secondary" id="btn-clear">Limpiar</button>
                    <button class="btn btn-primary" id="btn-send">Enviar mensaje</button>
                </div>
            </div>
        </div>
    `;
    
    console.log('Contenido HTML inyectado para comunicaciones');
    
    // Verificar que los elementos existen después de insertar el HTML
    const contactsContainer = document.getElementById('contacts-container');
    const contactName = document.getElementById('contact-name');
    const contactInfo = document.getElementById('contact-info');
    const contactType = document.getElementById('contact-type');
    
    console.log('Elementos críticos encontrados:',
        'contacts-container:', !!contactsContainer,
        'contact-name:', !!contactName,
        'contact-info:', !!contactInfo,
        'contact-type:', !!contactType
    );
    
    // Cargar contactos
    loadContacts();
    
    // Inicializar eventos de comunicación
    setupCommunicationEvents();
    
    // Por defecto, seleccionar WhatsApp como tipo de mensaje
    const whatsappBtn = document.getElementById('btn-type-whatsapp');
    if (whatsappBtn) {
        console.log('Seleccionando WhatsApp como tipo de mensaje predeterminado');
        whatsappBtn.click();
    } else {
        console.warn('No se encontró el botón de WhatsApp');
    }
}

/**
 * Cargar la lista de contactos (prospectos y clientes)
 */
function loadContacts() {
    console.log('Cargando contactos...');
    const contactsContainer = document.getElementById('contacts-container');
    if (!contactsContainer) {
        console.error('No se encontró el contenedor de contactos');
        // Intentar nuevamente en 500ms
        setTimeout(loadContacts, 500);
        return;
    }
    
    // Mostrar indicador de carga
    contactsContainer.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando contactos...</p>
        </div>
    `;
    
    // Verificar que apiData está disponible
    if (!window.apiData) {
        console.error('window.apiData no está disponible');
        contactsContainer.innerHTML = `
            <div class="alert alert-danger">
                Error al cargar datos. La API no está disponible.
                <button class="btn btn-sm btn-danger mt-2" onclick="location.reload()">Recargar página</button>
            </div>
        `;
        return;
    }
    
    // Combinar prospectos y clientes
    let contacts = [];
    
    // Agregar prospectos
    if (window.apiData.prospectos) {
        const prospectos = Object.values(window.apiData.prospectos);
        console.log(`Prospectos encontrados: ${prospectos.length}`);
        contacts = contacts.concat(
            prospectos.map(p => ({
                id: p.id,
                nombre: p.nombre || 'Sin nombre',
                email: p.email || '',
                telefono: p.telefono || '',
                tipo: 'prospecto',
                fecha: p.fecha
            }))
        );
    } else {
        console.warn('No hay prospectos disponibles en apiData');
    }
    
    // Agregar clientes
    if (window.apiData.clientes) {
        const clientes = Object.values(window.apiData.clientes);
        console.log(`Clientes encontrados: ${clientes.length}`);
        contacts = contacts.concat(
            clientes.map(c => ({
                id: c.id,
                nombre: c.nombre || c.contacto || 'Cliente sin nombre',
                email: c.email || '',
                telefono: c.telefono || '',
                tipo: 'cliente',
                fecha: c.fechaInicio
            }))
        );
    } else {
        console.warn('No hay clientes disponibles en apiData');
    }
    
    console.log(`Total de contactos cargados: ${contacts.length}`);
    
    // Ordenar por nombre
    contacts.sort((a, b) => a.nombre.localeCompare(b.nombre));
    
    // Generar HTML
    let html = '';
    
    if (contacts.length === 0) {
        html = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                No hay contactos disponibles
            </div>
        `;
    } else {
        contacts.forEach(contact => {
            const initials = getInitials(contact.nombre);
            
            html += `
                <div class="contact-item" data-id="${contact.id}" data-type="${contact.tipo}">
                    <div class="contact-avatar">${initials}</div>
                    <div class="contact-info">
                        <h4 class="contact-name">${contact.nombre}</h4>
                        <div class="contact-meta">
                            <span class="badge ${contact.tipo === 'prospecto' ? 'bg-secondary' : 'bg-primary'}">${contact.tipo}</span>
                            <span>${contact.email || 'Sin email'}</span>
                        </div>
                    </div>
                    <div class="contact-actions">
                        ${contact.telefono ? `
                        <button class="action-whatsapp" title="WhatsApp" data-phone="${contact.telefono}" data-contact-id="${contact.id}" data-contact-type="${contact.tipo}">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                        ` : ''}
                        ${contact.email ? `
                        <button class="action-email" title="Email" data-email="${contact.email}" data-contact-id="${contact.id}" data-contact-type="${contact.tipo}">
                            <i class="fas fa-envelope"></i>
                        </button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
    }
    
    contactsContainer.innerHTML = html;
    console.log('HTML de contactos generado');
    
    // Verificar que los elementos contact-item existen
    const contactItems = document.querySelectorAll('.contact-item');
    console.log(`Número de elementos contact-item encontrados: ${contactItems.length}`);
    
    if (contactItems.length === 0 && contacts.length > 0) {
        console.error('No se encontraron elementos contact-item aunque hay contactos cargados');
        return;
    }
    
    // Agregar eventos a los contactos
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const contactId = this.getAttribute('data-id');
            const contactType = this.getAttribute('data-type');
            console.log(`Contacto seleccionado: ${contactId} (${contactType})`);
            selectContact(contactId, contactType);
        });
    });
    
    // Agregar eventos a los botones de WhatsApp
    const whatsappButtons = document.querySelectorAll('.action-whatsapp');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que se propague al clic del contacto
            const phone = this.getAttribute('data-phone');
            // Usar los atributos data-contact-id y data-contact-type en lugar de buscar en el padre
            const contactId = this.getAttribute('data-contact-id');
            const contactType = this.getAttribute('data-contact-type');
            
            console.log(`Botón WhatsApp: ${contactId} (${contactType}) - ${phone}`);
            
            // Establecer WhatsApp como tipo de mensaje
            setMessageType('whatsapp');
            
            // Seleccionar el contacto, pasando también el teléfono para búsqueda alternativa
            selectContact(contactId, contactType, null, phone);
        });
    });
    
    // Agregar eventos a los botones de Email
    const emailButtons = document.querySelectorAll('.action-email');
    emailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que se propague al clic del contacto
            const email = this.getAttribute('data-email');
            // Usar los atributos data-contact-id y data-contact-type en lugar de buscar en el padre
            const contactId = this.getAttribute('data-contact-id');
            const contactType = this.getAttribute('data-contact-type');
            
            console.log(`Botón Email: ${contactId} (${contactType}) - ${email}`);
            
            // Establecer Email como tipo de mensaje
            setMessageType('email');
            
            // Seleccionar el contacto, pasando también el email para búsqueda alternativa
            selectContact(contactId, contactType, email);
        });
    });
    
    console.log('Eventos de contactos configurados');
    
    // Si hay al menos un contacto, seleccionarlo por defecto para mostrar la interfaz
    if (contactItems.length > 0) {
        console.log('Seleccionando el primer contacto por defecto');
        const firstItem = contactItems[0];
        const contactId = firstItem.getAttribute('data-id');
        const contactType = firstItem.getAttribute('data-type');
        selectContact(contactId, contactType);
    }
}

/**
 * Configurar eventos para la funcionalidad de comunicaciones
 */
function setupCommunicationEvents() {
    console.log('Configurando eventos de comunicación');
    
    // Botones de tipo de mensaje (WhatsApp / Email)
    const whatsappBtn = document.getElementById('btn-type-whatsapp');
    const emailBtn = document.getElementById('btn-type-email');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            console.log('Tipo de mensaje seleccionado: WhatsApp');
            setMessageType('whatsapp');
        });
    } else {
        console.error('No se encontró el botón de WhatsApp');
    }
    
    if (emailBtn) {
        emailBtn.addEventListener('click', function() {
            console.log('Tipo de mensaje seleccionado: Email');
            setMessageType('email');
        });
    } else {
        console.error('No se encontró el botón de Email');
    }
    
    // Botón de enviar mensaje
    const sendBtn = document.getElementById('btn-send');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    } else {
        console.error('No se encontró el botón de enviar mensaje');
    }
    
    // Botón de limpiar mensaje
    const clearBtn = document.getElementById('btn-clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearMessage);
    } else {
        console.error('No se encontró el botón de limpiar mensaje');
    }
    
    // Campo de mensaje para actualizar la vista previa
    const messageContent = document.getElementById('message-content');
    if (messageContent) {
        messageContent.addEventListener('input', updateMessagePreview);
    } else {
        console.error('No se encontró el campo de contenido del mensaje');
    }
    
    // Campo de búsqueda
    const searchInput = document.getElementById('contact-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterContacts(this.value);
        });
    } else {
        console.error('No se encontró el campo de búsqueda');
    }
    
    // Botones de filtro
    const btnFilterTodos = document.getElementById('btn-filter-todos');
    const btnFilterProspectos = document.getElementById('btn-filter-prospectos');
    const btnFilterClientes = document.getElementById('btn-filter-clientes');
    
    if (btnFilterTodos) {
        btnFilterTodos.addEventListener('click', function() {
            filterContactsByType('todos');
            this.classList.add('btn-primary');
            this.classList.remove('btn-light');
            
            if (btnFilterProspectos) {
                btnFilterProspectos.classList.remove('btn-primary');
                btnFilterProspectos.classList.add('btn-light');
            }
            
            if (btnFilterClientes) {
                btnFilterClientes.classList.remove('btn-primary');
                btnFilterClientes.classList.add('btn-light');
            }
        });
    }
    
    if (btnFilterProspectos) {
        btnFilterProspectos.addEventListener('click', function() {
            filterContactsByType('prospecto');
            this.classList.add('btn-primary');
            this.classList.remove('btn-light');
            
            if (btnFilterTodos) {
                btnFilterTodos.classList.remove('btn-primary');
                btnFilterTodos.classList.add('btn-light');
            }
            
            if (btnFilterClientes) {
                btnFilterClientes.classList.remove('btn-primary');
                btnFilterClientes.classList.add('btn-light');
            }
        });
    }
    
    if (btnFilterClientes) {
        btnFilterClientes.addEventListener('click', function() {
            filterContactsByType('cliente');
            this.classList.add('btn-primary');
            this.classList.remove('btn-light');
            
            if (btnFilterTodos) {
                btnFilterTodos.classList.remove('btn-primary');
                btnFilterTodos.classList.add('btn-light');
            }
            
            if (btnFilterProspectos) {
                btnFilterProspectos.classList.remove('btn-primary');
                btnFilterProspectos.classList.add('btn-light');
            }
        });
    }
    
    // Inicializar tipo de mensaje por defecto
    window.currentMessageType = 'whatsapp';
    
    console.log('Eventos de comunicación configurados');
}

/**
 * Filtrar contactos por texto
 */
function filterContacts(searchText) {
    const contactItems = document.querySelectorAll('.contact-item');
    const searchLower = searchText.toLowerCase();
    
    contactItems.forEach(item => {
        const name = item.querySelector('.contact-name').textContent.toLowerCase();
        const metadata = item.querySelector('.contact-meta').textContent.toLowerCase();
        
        // Mostrar el contacto si el nombre o los metadatos contienen el texto de búsqueda
        if (name.includes(searchLower) || metadata.includes(searchLower)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Filtrar contactos por tipo
 */
function filterContactsByType(type) {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const itemType = item.getAttribute('data-type');
        
        if (type === 'todos' || itemType === type) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Actualizar manualmente la interfaz con los datos del contacto seleccionado
 */
function updateContactInterface() {
    console.log('Actualizando interfaz con datos del contacto seleccionado');
    
    if (!selectedContact) {
        console.log('No hay contacto seleccionado, no se actualiza la interfaz');
        return;
    }
    
    // Obtener elementos de la interfaz
    const nombreElement = document.getElementById('contact-name');
    const infoElement = document.getElementById('contact-info');
    const typeElement = document.getElementById('contact-type');
    
    if (!nombreElement || !infoElement || !typeElement) {
        console.error('Elementos de la interfaz no encontrados:',
            'contact-name:', !!nombreElement,
            'contact-info:', !!infoElement,
            'contact-type:', !!typeElement
        );
        
        // Intentar nuevamente después de un tiempo
        setTimeout(updateContactInterface, 500);
        return;
    }
    
    // Actualizar nombre
    nombreElement.textContent = selectedContact.nombre;
    console.log('Nombre actualizado:', selectedContact.nombre);
    
    // Actualizar información de contacto
    const currentMessageType = window.currentMessageType || 'whatsapp';
    if (currentMessageType === 'whatsapp') {
        infoElement.textContent = selectedContact.telefono || 'Sin teléfono';
        console.log('Teléfono actualizado:', selectedContact.telefono || 'Sin teléfono');
    } else {
        infoElement.textContent = selectedContact.email || 'Sin email';
        console.log('Email actualizado:', selectedContact.email || 'Sin email');
    }
    
    // Actualizar tipo
    typeElement.textContent = selectedContact.tipo === 'prospecto' ? 'Prospecto' : 'Cliente';
    console.log('Tipo actualizado:', selectedContact.tipo);
    
    // Destacar elementos con algún estilo para asegurar que se ven los cambios
    nombreElement.style.transition = 'background-color 0.3s';
    infoElement.style.transition = 'background-color 0.3s';
    typeElement.style.transition = 'background-color 0.3s';
    
    nombreElement.style.backgroundColor = '#e6f7ff';
    infoElement.style.backgroundColor = '#e6f7ff';
    typeElement.style.backgroundColor = '#e6f7ff';
    
    setTimeout(() => {
        nombreElement.style.backgroundColor = '';
        infoElement.style.backgroundColor = '';
        typeElement.style.backgroundColor = '';
    }, 1000);
}

/**
 * Seleccionar un contacto para enviar mensaje
 */
function selectContact(contactId, contactType, contactEmail, contactPhone) {
    console.log(`Seleccionando contacto: ID=${contactId}, Tipo=${contactType}, Email=${contactEmail}, Teléfono=${contactPhone}`);
    
    // Actualizar estado visual si tenemos el ID
    if (contactId) {
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => item.classList.remove('active'));
        
        const selectedItem = document.querySelector(`.contact-item[data-id="${contactId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
            console.log('Contacto resaltado en la interfaz');
        } else {
            console.warn('No se encontró el elemento del contacto en la interfaz');
        }
    }
    
    // Verificar si los elementos de la interfaz existen
    const nombreElement = document.getElementById('contact-name');
    const infoElement = document.getElementById('contact-info');
    const typeElement = document.getElementById('contact-type');
    
    if (!nombreElement) console.error('Elemento contact-name no encontrado en el DOM');
    if (!infoElement) console.error('Elemento contact-info no encontrado en el DOM');
    if (!typeElement) console.error('Elemento contact-type no encontrado en el DOM');
    
    // Buscar datos del contacto
    let contact = null;
    
    // Buscar por ID si está disponible
    if (contactId && contactType) {
        if (contactType === 'prospecto' && window.apiData && window.apiData.prospectos) {
            contact = window.apiData.prospectos[contactId];
            console.log('Buscando prospecto con ID:', contactId);
        } else if (contactType === 'cliente' && window.apiData && window.apiData.clientes) {
            contact = window.apiData.clientes[contactId];
            console.log('Buscando cliente con ID:', contactId);
        }
    }
    
    // Si no encontramos por ID, buscar por email o teléfono
    if (!contact && (contactEmail || contactPhone)) {
        console.log('No se encontró por ID, buscando por email o teléfono');
        
        // Normalizar teléfono para búsqueda (quitar caracteres no numéricos)
        let phoneNormalized = null;
        if (contactPhone) {
            phoneNormalized = String(contactPhone).replace(/[^0-9]/g, '');
            console.log('Teléfono normalizado para búsqueda:', phoneNormalized);
        }
        
        // Buscar en prospectos
        if (window.apiData && window.apiData.prospectos) {
            const prospectos = Object.values(window.apiData.prospectos);
            console.log('Buscando en', prospectos.length, 'prospectos');
            
            if (contactEmail) {
                contact = prospectos.find(p => p.email === contactEmail);
                if (contact) {
                    contactType = 'prospecto';
                    contactId = contact.id;
                    console.log('Encontrado prospecto por email:', contactEmail);
                }
            }
            
            if (!contact && phoneNormalized) {
                // Buscar teléfono comparando versiones normalizadas (sin caracteres especiales)
                contact = prospectos.find(p => {
                    if (!p.telefono) return false;
                    // Asegurarse de que telefono sea string antes de usar replace
                    const normalizedPhone = String(p.telefono).replace(/[^0-9]/g, '');
                    return normalizedPhone === phoneNormalized;
                });
                
                if (contact) {
                    contactType = 'prospecto';
                    contactId = contact.id;
                    console.log('Encontrado prospecto por teléfono:', contactPhone);
                }
            }
        }
        
        // Si aún no encontramos, buscar en clientes
        if (!contact && window.apiData && window.apiData.clientes) {
            const clientes = Object.values(window.apiData.clientes);
            console.log('Buscando en', clientes.length, 'clientes');
            
            if (contactEmail) {
                contact = clientes.find(c => c.email === contactEmail);
                if (contact) {
                    contactType = 'cliente';
                    contactId = contact.id;
                    console.log('Encontrado cliente por email:', contactEmail);
                }
            }
            
            if (!contact && phoneNormalized) {
                // Buscar teléfono comparando versiones normalizadas (sin caracteres especiales)
                contact = clientes.find(c => {
                    if (!c.telefono) return false;
                    // Asegurarse de que telefono sea string antes de usar replace
                    const normalizedPhone = String(c.telefono).replace(/[^0-9]/g, '');
                    return normalizedPhone === phoneNormalized;
                });
                
                if (contact) {
                    contactType = 'cliente';
                    contactId = contact.id;
                    console.log('Encontrado cliente por teléfono:', contactPhone);
                }
            }
        }
    }
    
    console.log('Datos del contacto encontrado:', contact);
    
    if (contact) {
        // Guardar contacto seleccionado
        selectedContact = {
            id: contactId,
            nombre: contact.nombre || contact.contacto || 'Sin nombre',
            email: contact.email || '',
            telefono: contact.telefono || '',
            tipo: contactType
        };
        
        console.log('Contacto seleccionado:', selectedContact);
        
        // Actualizar campos de detalles del contacto
        if (nombreElement) {
            nombreElement.textContent = selectedContact.nombre;
            console.log('Nombre actualizado:', selectedContact.nombre);
        }
        
        if (infoElement) {
            const currentMessageType = window.currentMessageType || 'whatsapp';
            if (currentMessageType === 'whatsapp') {
                infoElement.textContent = selectedContact.telefono || 'Sin teléfono';
            } else {
                infoElement.textContent = selectedContact.email || 'Sin email';
            }
        }
        
        if (typeElement) {
            typeElement.textContent = selectedContact.tipo === 'prospecto' ? 'Prospecto' : 'Cliente';
            console.log('Tipo actualizado:', selectedContact.tipo);
        }
        
        // Intentar actualizar la interfaz nuevamente después de un tiempo por si hay problemas
        setTimeout(updateContactInterface, 300);
        
        // Actualizar preview
        updateMessagePreview();
    } else {
        // Si no encontramos el contacto pero tenemos un teléfono/email, creamos un contacto temporal
        if (contactPhone || contactEmail) {
            console.log('Creando contacto temporal con los datos disponibles');
            
            let tipo = contactType || 'prospecto';
            let nombre = 'Contacto';
            
            selectedContact = {
                id: 'temp',
                nombre: nombre,
                email: contactEmail || '',
                telefono: contactPhone || '',
                tipo: tipo
            };
            
            console.log('Contacto temporal creado:', selectedContact);
            
            // Actualizar campos de detalles del contacto
            if (nombreElement) {
                nombreElement.textContent = selectedContact.nombre;
                console.log('Nombre actualizado (temporal):', selectedContact.nombre);
            }
            
            if (infoElement) {
                const currentMessageType = window.currentMessageType || 'whatsapp';
                if (currentMessageType === 'whatsapp' && contactPhone) {
                    infoElement.textContent = contactPhone;
                    console.log('Información de contacto (teléfono temporal):', contactPhone);
                } else if (contactEmail) {
                    infoElement.textContent = contactEmail;
                    console.log('Información de contacto (email temporal):', contactEmail);
                }
            }
            
            if (typeElement) {
                typeElement.textContent = tipo === 'prospecto' ? 'Prospecto' : 'Cliente';
                console.log('Tipo actualizado (temporal):', tipo);
            }
            
            setTimeout(updateContactInterface, 300);
            updateMessagePreview();
        } else {
            console.error(`No se encontró el contacto con ID ${contactId} de tipo ${contactType}`);
        }
    }
}

/**
 * Establecer el tipo de mensaje (WhatsApp o Email)
 */
function setMessageType(type) {
    const whatsappBtn = document.getElementById('btn-type-whatsapp');
    const emailBtn = document.getElementById('btn-type-email');
    const templateSelector = document.getElementById('template-selector');
    
    // Actualizar estilo de los botones
    if (type === 'whatsapp') {
        whatsappBtn.classList.remove('btn-outline-primary');
        whatsappBtn.classList.add('btn-primary');
        emailBtn.classList.remove('btn-primary');
        emailBtn.classList.add('btn-outline-secondary');
    } else {
        whatsappBtn.classList.remove('btn-primary');
        whatsappBtn.classList.add('btn-outline-primary');
        emailBtn.classList.remove('btn-outline-secondary');
        emailBtn.classList.add('btn-primary');
    }
    
    // Guardar tipo actual
    window.currentMessageType = type;
    
    // Actualizar selector de plantillas
    let templatesHtml = '';
    
    const templates = messageTemplates[type];
    templates.forEach(template => {
        templatesHtml += `
            <div class="template-option" data-id="${template.id}">
                ${template.title}
            </div>
        `;
    });
    
    templateSelector.innerHTML = templatesHtml;
    
    // Agregar eventos a las plantillas
    const templateOptions = document.querySelectorAll('.template-option');
    templateOptions.forEach(option => {
        option.addEventListener('click', function() {
            const templateId = this.getAttribute('data-id');
            applyTemplate(templateId);
            
            // Actualizar estado visual
            templateOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Si hay un contacto seleccionado, actualizar el campo de información
    if (selectedContact) {
        const infoElement = document.getElementById('contact-info');
        if (infoElement) {
            if (type === 'whatsapp') {
                infoElement.textContent = selectedContact.telefono || 'Sin teléfono';
            } else {
                infoElement.textContent = selectedContact.email || 'Sin email';
            }
        }
    }
    
    // Actualizar vista previa
    updateMessagePreview();
}

/**
 * Aplicar una plantilla de mensaje
 */
function applyTemplate(templateId) {
    const messageContent = document.getElementById('message-content');
    const previewSection = document.getElementById('message-preview').parentElement;
    const type = window.currentMessageType;
    
    const templates = messageTemplates[type];
    const template = templates.find(t => t.id === templateId);
    
    if (template && messageContent) {
        let content = template.content;
        
        // Reemplazar variables si hay un contacto seleccionado
        if (selectedContact) {
            content = content.replace(/\[nombre\]/g, selectedContact.nombre);
            
            // Si hay objetivo de cliente, intentar usarlo
            if (selectedContact.objetivo) {
                content = content.replace(/\[objetivo_cliente\]/g, selectedContact.objetivo);
            } else {
                content = content.replace(/\[objetivo_cliente\]/g, "mejorar tu condición física");
            }
            
            // Si hay progreso destacado, intentar usarlo
            if (selectedContact.progreso) {
                content = content.replace(/\[progreso_destacado\]/g, selectedContact.progreso);
            } else {
                content = content.replace(/\[progreso_destacado\]/g, "avances significativos");
            }
            
            // Si hay área destacada, intentar usarla
            if (selectedContact.area_destacada) {
                content = content.replace(/\[área_destacada\]/g, selectedContact.area_destacada);
            } else {
                content = content.replace(/\[área_destacada\]/g, "tus ejercicios de fuerza");
            }
        }
        
        // Reemplazar remitente por defecto
        content = content.replace(/\[remitente\]/g, 'Pepe Urueta');
        
        // Reemplazar fecha actual en formato DD/MM/YYYY
        const fechaActual = new Date();
        const fechaFormateada = `${fechaActual.getDate().toString().padStart(2, '0')}/${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}/${fechaActual.getFullYear()}`;
        content = content.replace(/\[fecha_evaluacion\]/g, fechaFormateada);
        
        // Si es una plantilla de citas, añadir selector de fecha y hora
        if (templateId === 'w3' || templateId === 'e2') {
            // Verificar si ya existe el selector de fecha/hora
            if (!document.getElementById('date-time-selector')) {
                // Crear selector de fecha y hora con interfaz simplificada
                const dateTimeSelector = document.createElement('div');
                dateTimeSelector.id = 'date-time-selector';
                dateTimeSelector.className = 'date-time-selector mt-3 p-3 border rounded bg-light';
                dateTimeSelector.innerHTML = `
                    <h5 class="mb-3"><i class="far fa-calendar-alt me-2"></i> Programar cita</h5>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="cita-fecha" class="form-label">Fecha</label>
                            <input type="date" class="form-control" id="cita-fecha" min="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="col-md-6">
                            <label for="cita-hora" class="form-label">Hora</label>
                            <select class="form-control" id="cita-hora">
                                <option value="">Seleccionar hora</option>
                                <option value="08:00">8:00 AM</option>
                                <option value="09:00">9:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="13:00">1:00 PM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="16:00">4:00 PM</option>
                                <option value="17:00">5:00 PM</option>
                                <option value="18:00">6:00 PM</option>
                                <option value="19:00">7:00 PM</option>
                                <option value="20:00">8:00 PM</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <button class="btn btn-primary w-100" id="btn-aplicar-fecha-hora">
                                <i class="fas fa-check me-2"></i> Aplicar al mensaje
                            </button>
                        </div>
                    </div>
                `;
                
                // Insertar antes del área de vista previa
                previewSection.before(dateTimeSelector);
                
                // Inicializar flatpickr para selección de fecha y hora
                if (typeof flatpickr !== 'undefined') {
                    const fechaHoraInput = document.getElementById('cita-fecha-hora');
                    if (fechaHoraInput) {
                        // Configurar hora mínima (8:00 AM) y máxima (8:00 PM)
                        const horaMin = '08:00';
                        const horaMax = '20:00';
                        
                        // Inicializar el selector con flatpickr
                        const datePicker = flatpickr(fechaHoraInput, {
                            enableTime: true,
                            dateFormat: "d/m/Y H:i",
                            minDate: "today",
                            maxDate: new Date().fp_incr(60), // Próximos 60 días
                            minTime: horaMin,
                            maxTime: horaMax,
                            disableMobile: "true",
                            locale: {
                                firstDayOfWeek: 1,
                                weekdays: {
                                    shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                                    longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
                                },
                                months: {
                                    shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                                    longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
                                }
                            },
                            time_24hr: false
                        });
                    }
                }
                
                // Añadir evento para aplicar fecha y hora seleccionadas
                document.getElementById('btn-aplicar-fecha-hora').addEventListener('click', function() {
                    const fechaInput = document.getElementById('cita-fecha');
                    const horaInput = document.getElementById('cita-hora');
                    
                    if (fechaInput.value && horaInput.value) {
                        // Formatear fecha seleccionada a DD/MM/YYYY
                        const fechaObj = new Date(fechaInput.value);
                        const dia = String(fechaObj.getDate()).padStart(2, '0');
                        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
                        const anio = fechaObj.getFullYear();
                        const fechaFormat = `${dia}/${mes}/${anio}`;
                        
                        // Convertir hora de formato 24h a 12h con AM/PM
                        let horaFormat = '';
                        const [hora] = horaInput.value.split(':');
                        const horaNum = parseInt(hora, 10);
                        const ampm = horaNum >= 12 ? 'PM' : 'AM';
                        const hora12 = horaNum % 12 || 12;
                        horaFormat = `${hora12}:00 ${ampm}`;
                        
                        // Aplicar al contenido actual
                        let nuevoContenido = messageContent.value;
                        nuevoContenido = nuevoContenido.replace(/\[fecha\]/g, fechaFormat);
                        nuevoContenido = nuevoContenido.replace(/\[hora\]/g, horaFormat);
                        
                        // Actualizar el contenido y vista previa
                        messageContent.value = nuevoContenido;
                        updateMessagePreview();
                    } else {
                        // Mostrar alerta si faltan datos
                        Swal.fire({
                            title: 'Datos incompletos',
                            text: 'Por favor, selecciona fecha y hora para la cita.',
                            icon: 'warning',
                            confirmButtonColor: '#E63946'
                        });
                    }
                });
            }
        } else {
            // Eliminar selector si existe y no es una plantilla de citas
            const existingSelector = document.getElementById('date-time-selector');
            if (existingSelector) {
                existingSelector.remove();
            }
        }
        
        // Si es una plantilla de avance, generar link temporal o placeholder
        if (template.requiresAttachment && template.attachmentType === 'pdf') {
            content = content.replace(/\[link_informe\]/g, '#informe-generado-al-enviar');
        }
        
        // Establecer contenido y actualizar vista previa
        messageContent.value = content;
        
        // Guardar la referencia a la plantilla seleccionada para saber si requiere adjunto
        messageContent.dataset.templateId = templateId;
        messageContent.dataset.requiresAttachment = template.requiresAttachment ? 'true' : 'false';
        
        updateMessagePreview();
    }
}

/**
 * Actualizar la vista previa del mensaje
 */
function updateMessagePreview() {
    const messageContent = document.getElementById('message-content');
    const messagePreview = document.getElementById('message-preview');
    
    if (messageContent && messagePreview) {
        let content = messageContent.value;
        
        // Si está vacío, mostrar un mensaje predeterminado
        if (!content) {
            content = 'La vista previa del mensaje aparecerá aquí. Escribe un mensaje o selecciona una plantilla.';
        }
        
        // Formatear contenido para HTML (mantener saltos de línea)
        content = content.replace(/\n/g, '<br>');
        
        messagePreview.innerHTML = content;
    }
}

/**
 * Limpiar el formulario de mensaje
 */
function clearMessage() {
    document.getElementById('message-content').value = '';
    updateMessagePreview();
    
    // Limpiar selección de plantilla
    const templateOptions = document.querySelectorAll('.template-option');
    templateOptions.forEach(opt => opt.classList.remove('active'));
}

/**
 * Enviar el mensaje
 */
async function sendMessage() {
    const messageContent = document.getElementById('message-content');
    if (!messageContent) {
        console.error('No se encontró el elemento message-content');
        return;
    }
    
    const mensaje = messageContent.value;
    const type = window.currentMessageType;
    const templateId = messageContent.dataset.templateId;
    const requiresAttachment = messageContent.dataset.requiresAttachment === 'true';
    
    // Verificar que haya contenido
    if (!mensaje) {
        Swal.fire({
            title: 'Mensaje vacío',
            text: 'Debes escribir un mensaje antes de enviarlo.',
            icon: 'warning',
            confirmButtonColor: '#E63946'
        });
        return;
    }
    
    // Verificar que haya un contacto seleccionado
    if (!selectedContact) {
        Swal.fire({
            title: 'Sin destinatario',
            text: 'Debes seleccionar un contacto para enviar el mensaje.',
            icon: 'warning',
            confirmButtonColor: '#E63946'
        });
        return;
    }
    
    // Si la plantilla requiere adjunto PDF, generarlo
    let pdfInfo = null;
    if (requiresAttachment) {
        // Mostrar loader mientras se genera el PDF
        Swal.fire({
            title: 'Generando informe',
            text: 'Estamos preparando el informe personalizado...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        try {
            pdfInfo = await generarPDFAvance(selectedContact);
            Swal.close();
            
            if (!pdfInfo) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo generar el informe PDF. Verifica que el cliente tenga datos de seguimiento.',
                    icon: 'error',
                    confirmButtonColor: '#E63946'
                });
                return;
            }
        } catch (error) {
            console.error('Error al generar PDF:', error);
            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al generar el informe PDF.',
                icon: 'error',
                confirmButtonColor: '#E63946'
            });
            return;
        }
    }
    
    if (type === 'whatsapp') {
        // Obtener el número de teléfono
        let telefono = selectedContact.telefono || '';
        console.log('Teléfono antes de procesar:', telefono, typeof telefono);
        
        // Verificar que haya un teléfono válido
        if (!telefono) {
            Swal.fire({
                title: 'Sin teléfono',
                text: 'El contacto seleccionado no tiene un número de teléfono.',
                icon: 'warning',
                confirmButtonColor: '#E63946'
            });
            return;
        }
        
        // Asegurarse de que telefono sea una cadena de texto
        if (typeof telefono !== 'string') {
            telefono = String(telefono);
        }
        
        // Limpiar el número de teléfono (quitar caracteres no numéricos)
        telefono = telefono.replace(/[^0-9+]/g, '');
        console.log('Teléfono después de procesar:', telefono);
        
        // Si tenemos un PDF y es plantilla de avance, crear botón de descarga
        if (pdfInfo) {
            // Extraer URL y nombre del archivo del PDF
            const pdfUrl = pdfInfo.url;
            const fileName = pdfInfo.fileName;
            
            // Mostrar dialog para descargar primero el reporte y luego abrir WhatsApp
            Swal.fire({
                title: 'Reporte de Seguimiento',
                html: `
                    <p>Para enviar correctamente el reporte por WhatsApp:</p>
                    <p>1. Primero descarga el reporte usando el botón de abajo</p>
                    <p>2. Después, envía el mensaje por WhatsApp</p>
                    <p>3. En WhatsApp, adjunta el archivo descargado usando el icono de clip</p>
                    <div class="d-grid gap-2 col-12 mx-auto mt-4">
                        <a href="${pdfUrl}" download="${fileName}" class="btn btn-primary" id="descargar-reporte-btn">
                            <i class="fas fa-download me-2"></i> Descargar Reporte
                        </a>
                    </div>
                `,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Continuar a WhatsApp',
                confirmButtonColor: '#25D366',
                cancelButtonText: 'Cancelar',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
                preConfirm: () => {
                    // Verificar si el usuario ha hecho clic en el botón de descarga
                    const descargarBtn = document.getElementById('descargar-reporte-btn');
                    if (descargarBtn && !descargarBtn.classList.contains('btn-success')) {
                        Swal.showValidationMessage('Por favor, descarga el reporte primero');
                        return false;
                    }
                    return true;
                },
                didOpen: () => {
                    // Agregar evento para marcar cuando el usuario ha descargado el reporte
                    const descargarBtn = document.getElementById('descargar-reporte-btn');
                    if (descargarBtn) {
                        descargarBtn.addEventListener('click', function() {
                            setTimeout(() => {
                                this.classList.remove('btn-primary');
                                this.classList.add('btn-success');
                                this.innerHTML = '<i class="fas fa-check me-2"></i> Reporte Descargado';
                            }, 1000);
                        });
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // Abrir WhatsApp con el mensaje
                    const whatsappURL = `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;
                    console.log('URL de WhatsApp:', whatsappURL);
                    window.open(whatsappURL, '_blank');
                    
                    // Mostrar mensaje de confirmación
                    Swal.fire({
                        title: 'Mensaje enviado',
                        text: 'Recuerda adjuntar el reporte descargado en WhatsApp',
                        icon: 'success',
                        confirmButtonColor: '#25D366'
                    });
                }
            });
            
            return true; // Indicar que se ha gestionado el adjunto
        } else {
            // Enviar mensaje normal por WhatsApp
            const whatsappURL = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
            console.log('URL de WhatsApp:', whatsappURL);
            window.open(whatsappURL, '_blank');
            
            // Mostrar confirmación
            Swal.fire({
                title: 'Mensaje preparado',
                text: 'Se ha abierto WhatsApp con tu mensaje. Haz clic para enviarlo.',
                icon: 'success',
                confirmButtonColor: '#25D366'
            });
        }
    } else {
        // Obtener el email
        let email = selectedContact.email || '';
        console.log('Email antes de procesar:', email, typeof email);
        
        // Verificar que haya un email válido
        if (!email) {
            Swal.fire({
                title: 'Sin email',
                text: 'El contacto seleccionado no tiene una dirección de correo electrónico.',
                icon: 'warning',
                confirmButtonColor: '#E63946'
            });
            return;
        }
        
        // Asegurarse de que email sea una cadena de texto
        if (typeof email !== 'string') {
            email = String(email);
        }
        
        // Si tenemos un PDF generado, ofrecer descargarlo
        if (pdfInfo) {
            const { blob, fileName } = pdfInfo;
            
            // Crear URL para descargar el PDF
            const pdfUrl = URL.createObjectURL(blob);
            
            Swal.fire({
                title: 'Informe generado',
                html: `
                    <p>El informe de avance se ha generado correctamente.</p>
                    <p>Para enviarlo por correo electrónico:</p>
                    <ol class="text-start">
                        <li>Primero descarga el PDF usando el botón de abajo</li>
                        <li>Luego, al hacer clic en "Enviar correo", se abrirá tu cliente de correo</li>
                        <li>Adjunta manualmente el PDF descargado a tu correo</li>
                    </ol>
                    <a href="${pdfUrl}" download="${fileName}" class="btn btn-primary mt-3">
                        <i class="fas fa-download me-2"></i> Descargar PDF
                    </a>
                `,
                showCancelButton: true,
                confirmButtonText: 'Enviar correo',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#4a6cf7',
                cancelButtonColor: '#6c757d',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Abrir cliente de correo con el mensaje
                    const subject = 'Informe de Avance de Entrenamiento - URUETA CRM';
                    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mensaje)}`;
                    console.log('URL de correo:', mailtoURL);
                    window.location.href = mailtoURL;
                }
            });
        } else {
            // Enviar correo normal
            const subject = 'Mensaje importante - URUETA CRM';
            const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mensaje)}`;
            console.log('URL de correo:', mailtoURL);
            window.location.href = mailtoURL;
            
            // Mostrar confirmación
            Swal.fire({
                title: 'Email preparado',
                text: 'Se ha abierto tu cliente de correo electrónico con el mensaje.',
                icon: 'success',
                confirmButtonColor: '#4a6cf7'
            });
        }
    }
    
    // Limpiar mensaje después de enviar
    clearMessage();
}

/**
 * Obtener iniciales de un nombre
 */
function getInitials(name) {
    if (!name) return '?';
    
    const parts = name.split(' ');
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Configurar eventos para los filtros de comunicación
 */
function setupComunicacionesEventos() {
    // Obtener los elementos de filtro
    const filtroNombre = document.getElementById('filtro-nombre');
    const filtroNumeroCliente = document.getElementById('filtro-numero-cliente');
    const filtroNumeroExpediente = document.getElementById('filtro-numero-expediente');
    const btnLimpiarFiltros = document.getElementById('limpiar-filtros-btn');
    const clienteContactoContainer = document.getElementById('cliente-contacto-container');
    
    // Función para actualizar los filtros basados en la selección
    function actualizarFiltros(campoSeleccionado, valorSeleccionado) {
        // Obtener clientes
        const clientes = window.apiData.clientes || {};
        
        // Si no hay selección, no filtramos
        if (!valorSeleccionado) {
            mostrarMensajeSeleccion();
            return;
        }
        
        console.log(`Actualizando filtros - Campo: ${campoSeleccionado}, Valor: ${valorSeleccionado}`);
        
        // Cliente seleccionado
        let clienteSeleccionado = null;
        
        // Buscar cliente según el campo seleccionado
        if (campoSeleccionado === 'nombre') {
            clienteSeleccionado = Object.values(clientes).find(cliente => cliente['id-contacto'] === valorSeleccionado);
        } else if (campoSeleccionado === 'numero-cliente') {
            clienteSeleccionado = Object.values(clientes).find(cliente => cliente['numero-cliente'] === valorSeleccionado);
        } else if (campoSeleccionado === 'numero-expediente') {
            // Buscar cliente por número de expediente
            clienteSeleccionado = Object.values(clientes).find(cliente => cliente['numero-expediente'] === valorSeleccionado);
        }
        
        // Actualizar los selectores utilizando Select2 si está disponible
        const useSelect2 = typeof jQuery !== 'undefined' && typeof jQuery.fn.select2 !== 'undefined';
        
        // Actualizar los otros selectores sin disparar sus eventos
        if (clienteSeleccionado) {
            console.log('Cliente seleccionado:', clienteSeleccionado.nombre);
            
            // Si es un campo diferente al nombre, actualizar el selector de nombre
            if (campoSeleccionado !== 'nombre' && filtroNombre) {
                if (useSelect2) {
                    jQuery(filtroNombre).val(clienteSeleccionado['id-contacto'] || '').trigger('change.select2');
                } else {
                    filtroNombre.value = clienteSeleccionado['id-contacto'] || '';
                }
            }
            
            // Si es un campo diferente al número de cliente, actualizar el selector de número de cliente
            if (campoSeleccionado !== 'numero-cliente' && filtroNumeroCliente) {
                if (useSelect2) {
                    jQuery(filtroNumeroCliente).val(clienteSeleccionado['numero-cliente'] || '').trigger('change.select2');
                } else {
                    filtroNumeroCliente.value = clienteSeleccionado['numero-cliente'] || '';
                }
            }
            
            // Si es un campo diferente al número de expediente, actualizar el selector de número de expediente
            if (campoSeleccionado !== 'numero-expediente' && filtroNumeroExpediente && clienteSeleccionado['numero-expediente']) {
                if (useSelect2) {
                    jQuery(filtroNumeroExpediente).val(clienteSeleccionado['numero-expediente'] || '').trigger('change.select2');
                } else {
                    filtroNumeroExpediente.value = clienteSeleccionado['numero-expediente'] || '';
                }
            }

            // Mostrar datos de contacto del cliente
            mostrarDatosContactoCliente(clienteSeleccionado);
        } else {
            // No encontramos datos relacionados
            mostrarMensajeNoEncontrado();
        }
    }
    
    // Función para mostrar datos de contacto del cliente
    function mostrarDatosContactoCliente(cliente) {
        if (!clienteContactoContainer) return;
        
        if (!cliente) {
            mostrarMensajeNoEncontrado();
            return;
        }
        
        const email = cliente.email || 'No disponible';
        const telefono = cliente.telefono || 'No disponible';
        const nombreCliente = cliente.nombre || 'Cliente';
        const numeroExpediente = cliente['numero-expediente'] || 'Sin expediente';
        
        // Crear contenido HTML con la información de contacto y botones
        let htmlContent = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title mb-4">${nombreCliente} - ${numeroExpediente}</h5>
                    
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <div class="d-flex align-items-center">
                                <div class="me-3">
                                    <i class="fas fa-envelope fs-4 text-primary"></i>
                                </div>
                                <div>
                                    <div class="text-muted small">Correo electrónico</div>
                                    <div class="fw-bold">${email}</div>
                                </div>
                                ${email !== 'No disponible' ? `
                                <div class="ms-auto">
                                    <a href="mailto:${email}" class="btn btn-sm btn-outline-primary">
                                        <i class="fas fa-envelope me-1"></i> Enviar correo
                                    </a>
                                </div>` : ''}
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex align-items-center">
                                <div class="me-3">
                                    <i class="fas fa-phone-alt fs-4 text-success"></i>
                                </div>
                                <div>
                                    <div class="text-muted small">Teléfono</div>
                                    <div class="fw-bold">${telefono}</div>
                                </div>
                                ${telefono !== 'No disponible' ? `
                                <div class="ms-auto">
                                    <a href="https://wa.me/${telefono.replace(/[^0-9]/g, '')}" target="_blank" class="btn btn-sm btn-outline-success">
                                        <i class="fab fa-whatsapp me-1"></i> WhatsApp
                                    </a>
                                </div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        clienteContactoContainer.innerHTML = htmlContent;
    }
    
    // Función para mostrar mensaje de selección
    function mostrarMensajeSeleccion() {
        if (!clienteContactoContainer) return;
        clienteContactoContainer.innerHTML = `
            <div class="alert alert-info">
                Seleccione un filtro para ver los datos de contacto del cliente.
            </div>
        `;
    }
    
    // Función para mostrar mensaje de no encontrado
    function mostrarMensajeNoEncontrado() {
        if (!clienteContactoContainer) return;
        clienteContactoContainer.innerHTML = `
            <div class="alert alert-warning">
                No se encontraron datos para los criterios seleccionados.
            </div>
        `;
    }
    
    // Función para limpiar todos los filtros
    function limpiarFiltros() {
        const useSelect2 = typeof jQuery !== 'undefined' && typeof jQuery.fn.select2 !== 'undefined';
        
        if (filtroNombre) {
            if (useSelect2) {
                jQuery(filtroNombre).val('').trigger('change.select2');
            } else {
                filtroNombre.value = '';
            }
        }
        
        if (filtroNumeroCliente) {
            if (useSelect2) {
                jQuery(filtroNumeroCliente).val('').trigger('change.select2');
            } else {
                filtroNumeroCliente.value = '';
            }
        }
        
        if (filtroNumeroExpediente) {
            if (useSelect2) {
                jQuery(filtroNumeroExpediente).val('').trigger('change.select2');
            } else {
                filtroNumeroExpediente.value = '';
            }
        }
        
        mostrarMensajeSeleccion();
    }
    
    // Asignar eventos a los selectores
    if (filtroNombre) {
        filtroNombre.addEventListener('change', function() {
            actualizarFiltros('nombre', this.value);
        });
    }
    
    if (filtroNumeroCliente) {
        filtroNumeroCliente.addEventListener('change', function() {
            actualizarFiltros('numero-cliente', this.value);
        });
    }
    
    if (filtroNumeroExpediente) {
        filtroNumeroExpediente.addEventListener('change', function() {
            actualizarFiltros('numero-expediente', this.value);
        });
    }
    
    // Asignar evento al botón de limpiar filtros
    if (btnLimpiarFiltros) {
        btnLimpiarFiltros.addEventListener('click', limpiarFiltros);
    }
    
    // Inicialmente mostrar mensaje de selección
    mostrarMensajeSeleccion();
}

/**
 * Generar PDF con avance del cliente
 */
async function generarPDFAvance(cliente) {
    try {
        // Comprobar si la biblioteca jsPDF está disponible
        if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') {
            // Cargar dinámicamente jsPDF si no está disponible
            await cargarLibreriaPDF();
        }
        
        console.log('Generando PDF para el cliente:', cliente);
        
        // Crear un nuevo documento PDF
        const { jsPDF } = jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Configurar fuentes
        doc.setFont('helvetica', 'normal');
        
        // Obtener todos los registros de expediente del cliente para mostrar evolución
        let expedientesCliente = [];
        let ultimoRegistro = null;
        if (window.apiData && window.apiData.expedientes) {
            // Buscar registros asociados al cliente
            expedientesCliente = Object.values(window.apiData.expedientes).filter(
                exp => exp.clienteId === cliente.id || exp.id === cliente.expedienteId
            );
            
            if (expedientesCliente.length > 0) {
                // Ordenar por fecha
                expedientesCliente.sort((a, b) => {
                    const fechaA = a['fecha-registro'] ? new Date(a['fecha-registro'].split('/').reverse().join('-')) : new Date(0);
                    const fechaB = b['fecha-registro'] ? new Date(b['fecha-registro'].split('/').reverse().join('-')) : new Date(0);
                    return fechaA - fechaB; // Orden cronológico para las gráficas
                });
                
                // El último registro es el más reciente
                ultimoRegistro = expedientesCliente[expedientesCliente.length - 1];
                console.log('Último registro encontrado:', ultimoRegistro);
                console.log('Total registros para gráficas:', expedientesCliente.length);
            }
        }

        // Intentar capturar las gráficas disponibles de la sección de Avance
        let chartImages = {};
        
        // Función para capturar cualquier gráfico visible en la página como imagen base64
        const captureCharts = async () => {
            try {
                // Buscar todos los canvas de Chart.js en la página
                const chartCanvases = document.querySelectorAll('canvas.chartjs-render-monitor');
                if (chartCanvases.length > 0) {
                    console.log(`Se encontraron ${chartCanvases.length} gráficas en la página`);
                    
                    // Identificar gráficas por su contenedor o ID
                    for (let canvas of chartCanvases) {
                        const parentId = canvas.parentElement.id || '';
                        const chartId = canvas.id || '';
                        
                        if (parentId.includes('peso') || chartId.includes('peso')) {
                            chartImages.peso = canvas.toDataURL('image/png');
                            console.log('Capturada gráfica de peso');
                        } else if (parentId.includes('grasa') || chartId.includes('grasa')) {
                            chartImages.grasa = canvas.toDataURL('image/png');
                            console.log('Capturada gráfica de grasa corporal');
                        } else if (parentId.includes('entrenamiento') || chartId.includes('entrenamiento')) {
                            chartImages.entrenamiento = canvas.toDataURL('image/png');
                            console.log('Capturada gráfica de entrenamiento');
                        } else {
                            // Si no se puede identificar, guardar como otra gráfica
                            const genericKey = `other_${Object.keys(chartImages).length}`;
                            chartImages[genericKey] = canvas.toDataURL('image/png');
                            console.log(`Capturada gráfica genérica: ${genericKey}`);
                        }
                    }
                } else {
                    console.warn('No se encontraron gráficas en la página');
                }
            } catch (e) {
                console.error('Error al capturar gráficas:', e);
            }
            
            return chartImages;
        };
        
        // Intentar capturar gráficas si no tenemos las imágenes desde window
        if (!window.chartImageBase64 || Object.keys(window.chartImageBase64).length === 0) {
            console.log('Intentando capturar gráficas de la página actual');
            chartImages = await captureCharts();
            // Almacenar para uso futuro
            window.chartImageBase64 = chartImages;
        } else {
            console.log('Usando gráficas previamente capturadas');
            chartImages = window.chartImageBase64;
        }
        
        // --- Portada ---
        // Logo y encabezado
        doc.setFillColor(41, 128, 185); // Azul corporativo
        doc.rect(0, 0, 210, 40, 'F');
        
        // Título del documento
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('REPORTE DE SEGUIMIENTO', 105, 20, { align: 'center' });
        
        // Datos del cliente
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text(`Cliente: ${cliente.nombre || 'Sin nombre'}`, 20, 60);
        
        // Fecha del informe
        const fechaActual = new Date();
        const fechaFormateada = `${fechaActual.getDate().toString().padStart(2, '0')}/${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}/${fechaActual.getFullYear()}`;
        doc.text(`Fecha del informe: ${fechaFormateada}`, 20, 70);
        
        // Si tenemos el último registro, mostrar su fecha
        if (ultimoRegistro && ultimoRegistro['fecha-registro']) {
            doc.text(`Fecha de última evaluación: ${ultimoRegistro['fecha-registro']}`, 20, 80);
        }
        
        // Línea divisoria
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 90, 190, 90);
        
        // Verificar si tenemos imagen de gráfica para la portada
        if (chartImages && (chartImages.peso || chartImages.grasa)) {
            // Usar la imagen de la gráfica de peso para la portada si está disponible
            if (chartImages.peso) {
                doc.addImage(chartImages.peso, 'PNG', 55, 100, 100, 60);
                console.log('Agregada gráfica de peso a la portada');
            } else if (chartImages.grasa) {
                doc.addImage(chartImages.grasa, 'PNG', 55, 100, 100, 60);
                console.log('Agregada gráfica de grasa a la portada');
            }
        } else {
            // Rectángulo de ejemplo si no hay gráfica
            doc.setFillColor(240, 240, 240);
            doc.roundedRect(55, 100, 100, 60, 3, 3, 'F');
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text('Gráfica de Progreso', 105, 130, { align: 'center' });
        }
        
        // Intro del documento
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text([
            'Este informe presenta un análisis detallado de su progreso en el programa de entrenamiento.',
            'A continuación encontrará sus datos actuales, análisis comparativo y recomendaciones',
            'personalizadas para optimizar sus resultados.'
        ], 20, 180);
        
        // --- Segunda página: Datos del registro ---
        doc.addPage();
        
        // Encabezado
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, 210, 20, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text('DATOS DE SEGUIMIENTO', 105, 13, { align: 'center' });
        
        // Si tenemos registro, mostrar sus datos
        if (ultimoRegistro) {
            // Datos actuales
            doc.setFontSize(14);
            doc.setTextColor(41, 128, 185);
            doc.text('Mediciones Actuales', 20, 30);
            
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            
            // Tabla de datos principales - ASEGURARSE DE QUE TODO SEA STRING
            const datosCliente = [
                { label: 'Peso Actual', valor: ultimoRegistro['peso-actual'] ? `${ultimoRegistro['peso-actual']} kg` : 'No disponible' },
                { label: 'Grasa Corporal', valor: ultimoRegistro['grasa-actual'] ? `${ultimoRegistro['grasa-actual']}%` : 'No disponible' },
                { label: 'IMC', valor: ultimoRegistro['imc'] ? String(ultimoRegistro['imc']) : 'No calculado' },
                { label: 'Días entrenados/semana', valor: ultimoRegistro['dias-entrenamiento'] ? String(ultimoRegistro['dias-entrenamiento']) : 'No registrado' },
                { label: 'Horas totales', valor: ultimoRegistro['horas-entrenamiento'] ? String(ultimoRegistro['horas-entrenamiento']) : 'No registrado' }
            ];
            
            let yPos = 40;
            datosCliente.forEach(dato => {
                doc.setFont('helvetica', 'bold');
                doc.text(`${dato.label}:`, 20, yPos);
                doc.setFont('helvetica', 'normal');
                doc.text(String(dato.valor), 100, yPos);
                yPos += 10;
            });
            
            // Objetivos
            yPos += 10;
            doc.setFontSize(14);
            doc.setTextColor(41, 128, 185);
            doc.text('Objetivos Planteados', 20, yPos);
            yPos += 10;
            
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            
            const objetivos = [
                { label: 'Peso Objetivo', valor: ultimoRegistro['peso-deseado'] ? `${ultimoRegistro['peso-deseado']} kg` : 'No establecido' },
                { label: 'Grasa Objetivo', valor: ultimoRegistro['grasa-deseada'] ? `${ultimoRegistro['grasa-deseada']}%` : 'No establecido' },
                { label: 'Objetivo General', valor: ultimoRegistro['objetivo'] ? String(ultimoRegistro['objetivo']) : 'No especificado' }
            ];
            
            objetivos.forEach(dato => {
                doc.setFont('helvetica', 'bold');
                doc.text(`${dato.label}:`, 20, yPos);
                doc.setFont('helvetica', 'normal');
                doc.text(String(dato.valor), 100, yPos);
                yPos += 10;
            });
            
            // Información adicional
            yPos += 10;
            doc.setFontSize(14);
            doc.setTextColor(41, 128, 185);
            doc.text('Información Adicional', 20, yPos);
            yPos += 10;
            
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            
            // Disciplina y datos médicos
            const infoAdicional = [
                { label: 'Disciplina', valor: ultimoRegistro['disciplina'] ? String(ultimoRegistro['disciplina']) : 'No especificada' },
                { label: 'Condiciones Médicas', valor: ultimoRegistro['condiciones-medicas'] ? String(ultimoRegistro['condiciones-medicas']) : 'Ninguna registrada' },
                { label: 'Medicamentos', valor: ultimoRegistro['medicamentos'] ? String(ultimoRegistro['medicamentos']) : 'Ninguno registrado' }
            ];
            
            infoAdicional.forEach(dato => {
                doc.setFont('helvetica', 'bold');
                doc.text(`${dato.label}:`, 20, yPos);
                doc.setFont('helvetica', 'normal');
                
                // Manejar textos largos - ASEGURARSE DE QUE EL VALOR SEA STRING
                const valorTexto = String(dato.valor);
                if (valorTexto.length > 40) {
                    const lineas = doc.splitTextToSize(valorTexto, 110);
                    doc.text(lineas, 100, yPos);
                    yPos += (lineas.length - 1) * 7; // Ajustar posición Y basado en número de líneas
                } else {
                    doc.text(valorTexto, 100, yPos);
                }
                
                yPos += 10;
            });
        } else {
            // Mensaje si no hay registros
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('No se encontraron registros de seguimiento para este cliente.', 20, 40);
            doc.text('Por favor, complete una evaluación para generar informes detallados.', 20, 50);
        }
        
        // --- Tercera página: Gráficos y Análisis ---
        doc.addPage();
        
        // Encabezado
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, 210, 20, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text('ANÁLISIS VISUAL DE PROGRESO', 105, 13, { align: 'center' });
        
        // Verificar si hay suficientes datos para las gráficas
        if (expedientesCliente && expedientesCliente.length > 0) {
            // Verificar si tenemos gráficas capturadas
            if (chartImages && Object.keys(chartImages).length > 0) {
                // Agregar gráficas reales al PDF
                let yPosition = 30;
                const chartWidth = 170;
                const chartHeight = 80;
                const margin = 10;
                
                // Si tenemos gráfica de peso, agregarla
                if (chartImages.peso) {
                    doc.setFontSize(14);
                    doc.setTextColor(41, 128, 185);
                    doc.text('Evolución del Peso', 20, yPosition);
                    yPosition += 5;
                    
                    doc.addImage(chartImages.peso, 'PNG', 20, yPosition, chartWidth, chartHeight);
                    yPosition += chartHeight + margin;
                }
                
                // Si tenemos gráfica de grasa, agregarla
                if (chartImages.grasa) {
                    doc.setFontSize(14);
                    doc.setTextColor(41, 128, 185);
                    doc.text('Evolución del Porcentaje de Grasa', 20, yPosition);
                    yPosition += 5;
                    
                    doc.addImage(chartImages.grasa, 'PNG', 20, yPosition, chartWidth, chartHeight);
                    yPosition += chartHeight + margin;
                }
                
                // Si tenemos otras gráficas, agregarlas
                for (const key in chartImages) {
                    if (key !== 'peso' && key !== 'grasa' && !key.startsWith('other_')) {
                        doc.setFontSize(14);
                        doc.setTextColor(41, 128, 185);
                        doc.text(`Evolución de ${key.charAt(0).toUpperCase() + key.slice(1)}`, 20, yPosition);
                        yPosition += 5;
                        
                        doc.addImage(chartImages[key], 'PNG', 20, yPosition, chartWidth, chartHeight);
                        yPosition += chartHeight + margin;
                    }
                }
            } else {
                // Si no hay imágenes disponibles, mostrar texto explicativo
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text('Las gráficas de evolución están disponibles en la sección "Avance" de la aplicación.', 20, 50);
                doc.text('Para incluir gráficas en el PDF, primero visualice la sección de avance del expediente.', 20, 60);
            }
            
            // Mensaje sobre la tendencia general
            doc.setFontSize(14);
            doc.setTextColor(41, 128, 185);
            doc.text('Interpretación de resultados', 20, 195);
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            
            // Texto explicativo
            const mensaje = "Con base en tu evaluación, continuaremos ajustando el plan de entrenamiento personalizado para optimizar tus resultados. Es importante mantener la constancia en los entrenamientos y seguir las recomendaciones nutricionales para alcanzar tus objetivos de forma efectiva.";
            const lineasMensaje = doc.splitTextToSize(mensaje, 170);
            doc.text(lineasMensaje, 20, 205);
        } else {
            // Mensaje si no hay suficientes datos
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text([
                'No hay suficientes registros históricos para generar gráficos de evolución.',
                'Se recomienda realizar al menos dos evaluaciones para poder visualizar tendencias.'
            ], 20, 50);
        }
        
        // --- Pie de documento ---
        // Número de página en todas las páginas
        const numPages = doc.getNumberOfPages();
        for (let i = 1; i <= numPages; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text(`Página ${i} de ${numPages}`, 105, 285, { align: 'center' });
            
            // Footer en todas las páginas
            doc.text('Pepe Urueta - Entrenador Personal - Reporte de Seguimiento', 105, 292, { align: 'center' });
        }
        
        // Guardar PDF
        const pdfBlob = doc.output('blob');
        const pdfFileName = `Reporte_Seguimiento_${cliente.nombre.replace(/\s+/g, '_')}_${fechaFormateada.replace(/\//g, '-')}.pdf`;
        
        // Crear URL para el blob
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        return {
            url: pdfUrl,
            blob: pdfBlob,
            fileName: pdfFileName
        };
    } catch (error) {
        console.error('Error al generar PDF:', error);
        return null;
    }
}

/**
 * Cargar la biblioteca jsPDF si no está disponible
 */
async function cargarLibreriaPDF() {
    return new Promise((resolve, reject) => {
        if (typeof jspdf !== 'undefined') {
            resolve();
            return;
        }
        
        console.log('Cargando biblioteca jsPDF...');
        
        // Crear elemento script para cargar jsPDF
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
            console.log('jsPDF cargado correctamente');
            resolve();
        };
        script.onerror = (error) => {
            console.error('Error al cargar jsPDF:', error);
            reject(error);
        };
        
        document.head.appendChild(script);
    });
} 
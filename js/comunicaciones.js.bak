/**
 * Comunicaciones Module
 * Módulo para gestionar la comunicación con clientes y prospectos
 */

// Variables globales
window.selectedContact = null; // Definimos selectedContact en window para asegurar su alcance global
// Cambiamos la definición de plantillas para usar las externas
let messageTemplates = {
    // Estas variables se inicializarán cuando se carguen los archivos externos
    whatsapp: [],
    email: []
};

// Inicializar módulo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded: Inicializando módulo de comunicaciones');
    try {
        // Cargar bibliotecas necesarias
        const libreriasACargar = [];
        
        // Cargar biblioteca de calendario si no está disponible
        if (typeof flatpickr === 'undefined') {
            libreriasACargar.push(
                // Cargar CSS de flatpickr
                new Promise((resolve) => {
                    const linkElem = document.createElement('link');
                    linkElem.rel = 'stylesheet';
                    linkElem.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
                    document.head.appendChild(linkElem);
                    resolve();
                }),
                
                // Cargar CSS del tema
                new Promise((resolve) => {
                    const linkTheme = document.createElement('link');
                    linkTheme.rel = 'stylesheet';
                    linkTheme.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/material_blue.css';
                    document.head.appendChild(linkTheme);
                    resolve();
                }),
                
                // Cargar JavaScript de flatpickr
                new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
                    script.onload = () => {
                        console.log('Flatpickr cargado correctamente');
                        resolve();
                    };
                    script.onerror = (error) => {
                        console.error('Error al cargar Flatpickr:', error);
                        reject(error);
                    };
                    document.head.appendChild(script);
                })
            );
        }
        
        // Cargar archivo emailPreview.js
        libreriasACargar.push(
            new Promise((resolve, reject) => {
                const emailPreviewScript = document.createElement('script');
                emailPreviewScript.src = 'js/emailPreview.js';
                emailPreviewScript.onload = () => {
                    console.log('emailPreview.js cargado correctamente');
                    resolve();
                };
                emailPreviewScript.onerror = (error) => {
                    console.error('Error al cargar emailPreview.js:', error);
                    reject(error);
                };
                document.head.appendChild(emailPreviewScript);
            })
        );
        
        // Cargar plantillas de WhatsApp
        libreriasACargar.push(
            new Promise((resolve, reject) => {
                const whatsappTemplatesScript = document.createElement('script');
                whatsappTemplatesScript.src = 'js/templates/whatsappTemplates.js';
                whatsappTemplatesScript.onload = () => {
                    console.log('whatsappTemplates.js cargado correctamente');
                    
                    // Asignar plantillas cuando se cargue el archivo
                    if (window.templates && window.templates.whatsapp) {
                        messageTemplates.whatsapp = window.templates.whatsapp;
                    } else {
                        console.error('No se pudieron cargar las plantillas de WhatsApp');
                    }
                    
                    resolve();
                };
                whatsappTemplatesScript.onerror = (error) => {
                    console.error('Error al cargar whatsappTemplates.js:', error);
                    reject(error);
                };
                document.head.appendChild(whatsappTemplatesScript);
            })
        );
        
        // Cargar plantillas de Email
        libreriasACargar.push(
            new Promise((resolve, reject) => {
                const emailTemplatesScript = document.createElement('script');
                emailTemplatesScript.src = 'js/templates/emailTemplates.js';
                emailTemplatesScript.onload = () => {
                    console.log('emailTemplates.js cargado correctamente');
                    
                    // Asignar plantillas cuando se cargue el archivo
                    if (window.templates && window.templates.email) {
                        messageTemplates.email = window.templates.email;
                    } else {
                        console.error('No se pudieron cargar las plantillas de Email');
                    }
                    
                    resolve();
                };
                emailTemplatesScript.onerror = (error) => {
                    console.error('Error al cargar emailTemplates.js:', error);
                    reject(error);
                };
                document.head.appendChild(emailTemplatesScript);
            })
        );
        
        // Inicializar el módulo cuando se carguen todas las bibliotecas
        Promise.all(libreriasACargar)
            .then(() => {
                console.log('Todas las bibliotecas cargadas correctamente');
                initComunicaciones();
            })
            .catch((error) => {
                console.error('Error al cargar bibliotecas:', error);
                // Intentar inicializar de todos modos
                initComunicaciones();
            });

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
    
    // Cargar script de diagnóstico
    console.log('Cargando script de diagnóstico para la selección de contactos...');
    const debugScript = document.createElement('script');
    debugScript.src = 'js/debugContactSelection.js';
    debugScript.onload = () => {
        console.log('Script de diagnóstico cargado correctamente');
    };
    debugScript.onerror = (error) => {
        console.error('Error al cargar script de diagnóstico:', error);
    };
    document.head.appendChild(debugScript);

    // Reemplazar con:

    // Cargar script de corrección
    console.log('Cargando script de corrección para la selección de contactos...');
    const fixScript = document.createElement('script');
    fixScript.src = 'js/comunicaciones-fix.js';
    fixScript.onload = () => {
        console.log('Script de corrección cargado correctamente');
    };
    fixScript.onerror = (error) => {
        console.error('Error al cargar script de corrección:', error);
    };
    document.head.appendChild(fixScript);

    // Reemplazar con:

    // Cargar script de corrección para la selección de contactos
    console.log('Cargando script de corrección silenciosa para selección de contactos...');
    const fixLoaderScript = document.createElement('script');
    fixLoaderScript.src = 'js/comunicaciones-fix-loader.js';
    fixLoaderScript.onload = () => {
        console.log('Script de corrección cargado correctamente');
    };
    fixLoaderScript.onerror = (error) => {
        console.error('Error al cargar script de corrección:', error);
    };
    document.head.appendChild(fixLoaderScript);

    // Reemplazar con:

    // Cargar script de corrección silenciosa para la selección de contactos
    console.log('Cargando script de corrección silenciosa para la selección de contactos...');
    const fixLoaderScript = document.createElement('script');
    fixLoaderScript.src = 'js/comunicaciones-fix-loader.js';
    fixLoaderScript.onload = () => {
        console.log('Script de corrección silenciosa cargado correctamente');
    };
    fixLoaderScript.onerror = (error) => {
        console.error('Error al cargar script de corrección:', error);
    };
    document.head.appendChild(fixLoaderScript);

    // Reemplazar con:

    // Por defecto, seleccionar WhatsApp como tipo de mensaje
    const whatsappBtn = document.getElementById('btn-type-whatsapp');
    if (whatsappBtn) {
        console.log('Seleccionando WhatsApp como tipo de mensaje predeterminado');
        whatsappBtn.click();
    } else {
        console.warn('No se encontró el botón de WhatsApp');
    }
    
    // Cargar script de corrección silenciosa para la selección de contactos
    console.log('Cargando script de corrección silenciosa para la selección de contactos...');
    const fixLoaderScript = document.createElement('script');
    fixLoaderScript.src = 'js/comunicaciones-fix-loader.js';
    fixLoaderScript.onload = () => {
        console.log('Script de corrección silenciosa cargado correctamente');
    };
    fixLoaderScript.onerror = (error) => {
        console.error('Error al cargar script de corrección:', error);
    };
    document.head.appendChild(fixLoaderScript);
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
    
    // Vamos a mantener un mapa para rastrear duplicados por email/teléfono
    let contactMap = new Map(); // Mapa para detectar duplicados
    let contacts = [];
    
    // Primero, agregar los prospectos (tienen menor prioridad)
    if (window.apiData.prospectos) {
        const prospectos = Object.values(window.apiData.prospectos);
        console.log(`Prospectos encontrados: ${prospectos.length}`);
        
        prospectos.forEach(p => {
            const contactInfo = {
                id: p.id,
                nombre: p.nombre || 'Sin nombre',
                email: p.email || '',
                telefono: p.telefono || '',
                tipo: 'prospecto',
                fecha: p.fecha,
                // Guardar el objeto original
                data: p
            };
            
            // Usamos email y teléfono como claves para detectar duplicados
            if (p.email) {
                contactMap.set(`email:${p.email.toLowerCase()}`, contactInfo);
            }
            if (p.telefono) {
                // Normalizamos el teléfono para comparación
                const telefonoNormalizado = String(p.telefono).replace(/[^0-9]/g, '');
                if (telefonoNormalizado) {
                    contactMap.set(`tel:${telefonoNormalizado}`, contactInfo);
                }
            }
            
            contacts.push(contactInfo);
        });
    } else {
        console.warn('No hay prospectos disponibles en apiData');
    }
    
    // Luego, agregar clientes (tienen mayor prioridad y reemplazarán a los prospectos duplicados)
    let clientesAgregados = 0;
    let duplicadosOmitidos = 0;
    
    if (window.apiData.clientes) {
        const clientes = Object.values(window.apiData.clientes);
        console.log(`Clientes encontrados: ${clientes.length}`);
        
        clientes.forEach(c => {
            const contactInfo = {
                id: c.id,
                nombre: c.nombre || c.contacto || 'Cliente sin nombre',
                email: c.email || '',
                telefono: c.telefono || '',
                tipo: 'cliente',
                fecha: c.fechaInicio,
                // Guardar el objeto original
                data: c
            };
            
            // Marcamos los prospectos duplicados para eliminarlos después
            let duplicadoEncontrado = false;
            
            // Verificar duplicados por email
            if (c.email) {
                const emailKey = `email:${c.email.toLowerCase()}`;
                if (contactMap.has(emailKey)) {
                    const existente = contactMap.get(emailKey);
                    if (existente.tipo === 'prospecto') {
                        existente.marcarParaEliminar = true;
                        duplicadoEncontrado = true;
                        duplicadosOmitidos++;
                    }
                }
                contactMap.set(emailKey, contactInfo);
            }
            
            // Verificar duplicados por teléfono
            if (c.telefono) {
                const telefonoNormalizado = String(c.telefono).replace(/[^0-9]/g, '');
                if (telefonoNormalizado) {
                    const telKey = `tel:${telefonoNormalizado}`;
                    if (contactMap.has(telKey)) {
                        const existente = contactMap.get(telKey);
                        if (existente.tipo === 'prospecto' && !existente.marcarParaEliminar) {
                            existente.marcarParaEliminar = true;
                            duplicadoEncontrado = true;
                            duplicadosOmitidos++;
                        }
                    }
                    contactMap.set(telKey, contactInfo);
                }
            }
            
            contacts.push(contactInfo);
            clientesAgregados++;
        });
    } else {
        console.warn('No hay clientes disponibles en apiData');
    }
    
    // Eliminar los prospectos que son duplicados de clientes
    contacts = contacts.filter(c => !c.marcarParaEliminar);
    
    console.log(`Total de contactos cargados: ${contacts.length} (${clientesAgregados} clientes, ${duplicadosOmitidos} duplicados omitidos)`);
    
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
            let contactType = this.getAttribute('data-contact-type');
            
            console.log(`Botón WhatsApp: ${contactId} (${contactType}) - ${phone}`);
            
            // Verificar el tipo de contacto (el elemento padre tiene el tipo correcto)
            const parentItem = this.closest('.contact-item');
            if (parentItem) {
                const parentType = parentItem.getAttribute('data-type');
                if (parentType && parentType !== contactType) {
                    console.warn(`Corrigiendo tipo de contacto: ${contactType} -> ${parentType}`);
                    contactType = parentType;
                }
            }
            
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
            let contactType = this.getAttribute('data-contact-type');
            
            console.log(`Botón Email: ${contactId} (${contactType}) - ${email}`);
            
            // Verificar el tipo de contacto (el elemento padre tiene el tipo correcto)
            const parentItem = this.closest('.contact-item');
            if (parentItem) {
                const parentType = parentItem.getAttribute('data-type');
                if (parentType && parentType !== contactType) {
                    console.warn(`Corrigiendo tipo de contacto: ${contactType} -> ${parentType}`);
                    contactType = parentType;
                }
            }
            
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
    
    // Verificar que las plantillas estén disponibles
    if (!window.templates) {
        console.warn('window.templates no está definido, creando objeto vacío');
        window.templates = { whatsapp: [], email: [] };
    }
    
    // Log de verificación de plantillas
    console.log('Estado de plantillas disponibles:',
        'window.templates.whatsapp:', window.templates && window.templates.whatsapp ? window.templates.whatsapp.length : 0,
        'window.templates.email:', window.templates && window.templates.email ? window.templates.email.length : 0,
        'messageTemplates.whatsapp:', messageTemplates && messageTemplates.whatsapp ? messageTemplates.whatsapp.length : 0,
        'messageTemplates.email:', messageTemplates && messageTemplates.email ? messageTemplates.email.length : 0
    );
    
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
 * Seleccionar un contacto para enviar mensaje
 */
function selectContact(contactId, contactType, contactEmail = null, contactPhone = null) {
    console.log(`Seleccionando contacto: ${contactId} (${contactType})`);
    console.log('Email adicional:', contactEmail);
    console.log('Teléfono adicional:', contactPhone);
    
    // Buscar el contacto en el apiData según el tipo
    let contact = null;
    
    // Si tenemos contactType y contactId, buscar directamente
    if (contactId && contactType) {
        if (contactType === 'cliente' && window.apiData.clientes) {
            contact = window.apiData.clientes[contactId];
            if (!contact) {
                console.warn('No se encontró el cliente por ID, buscando por coincidencia exacta en todos los clientes');
                contact = Object.values(window.apiData.clientes).find(c => c.id === contactId);
            }
        } else if (contactType === 'prospecto' && window.apiData.prospectos) {
            contact = window.apiData.prospectos[contactId];
            if (!contact) {
                console.warn('No se encontró el prospecto por ID, buscando por coincidencia exacta en todos los prospectos');
                contact = Object.values(window.apiData.prospectos).find(p => p.id === contactId);
            }
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
        
        // Arrays para almacenar coincidencias
        let coincidencias = [];
        
        // Buscar en clientes primero (tienen mayor prioridad)
        if (window.apiData && window.apiData.clientes) {
            const clientes = Object.values(window.apiData.clientes);
            console.log('Buscando en', clientes.length, 'clientes');
            
            if (contactEmail) {
                const clienteEncontrado = clientes.find(c => c.email === contactEmail);
                if (clienteEncontrado) {
                    coincidencias.push({
                        contact: clienteEncontrado,
                        contactType: 'cliente',
                        contactId: clienteEncontrado.id,
                        source: 'email',
                        priority: 1 // Mayor prioridad para clientes
                    });
                    console.log('Encontrado cliente por email:', contactEmail);
                }
            }
            
            if (phoneNormalized) {
                // Buscar teléfono comparando versiones normalizadas (sin caracteres especiales)
                const clienteEncontrado = clientes.find(c => {
                    if (!c.telefono) return false;
                    // Asegurarse de que telefono sea string antes de usar replace
                    const normalizedPhone = String(c.telefono).replace(/[^0-9]/g, '');
                    return normalizedPhone === phoneNormalized;
                });
                
                if (clienteEncontrado) {
                    coincidencias.push({
                        contact: clienteEncontrado,
                        contactType: 'cliente',
                        contactId: clienteEncontrado.id,
                        source: 'phone',
                        priority: 1 // Mayor prioridad para clientes
                    });
                    console.log('Encontrado cliente por teléfono:', contactPhone);
                }
            }
        }
        
        // Luego, buscar en prospectos (tienen menor prioridad)
        if (window.apiData && window.apiData.prospectos) {
            const prospectos = Object.values(window.apiData.prospectos);
            console.log('Buscando en', prospectos.length, 'prospectos');
            
            if (contactEmail) {
                const prospectoEncontrado = prospectos.find(p => p.email === contactEmail);
                if (prospectoEncontrado) {
                    coincidencias.push({
                        contact: prospectoEncontrado,
                        contactType: 'prospecto',
                        contactId: prospectoEncontrado.id,
                        source: 'email',
                        priority: 2 // Menor prioridad para prospectos
                    });
                    console.log('Encontrado prospecto por email:', contactEmail);
                }
            }
            
            if (phoneNormalized) {
                // Buscar teléfono comparando versiones normalizadas (sin caracteres especiales)
                const prospectoEncontrado = prospectos.find(p => {
                    if (!p.telefono) return false;
                    // Asegurarse de que telefono sea string antes de usar replace
                    const normalizedPhone = String(p.telefono).replace(/[^0-9]/g, '');
                    return normalizedPhone === phoneNormalized;
                });
                
                if (prospectoEncontrado) {
                    coincidencias.push({
                        contact: prospectoEncontrado,
                        contactType: 'prospecto',
                        contactId: prospectoEncontrado.id,
                        source: 'phone',
                        priority: 2 // Menor prioridad para prospectos
                    });
                    console.log('Encontrado prospecto por teléfono:', contactPhone);
                }
            }
        }
        
        // Ordenar coincidencias por prioridad (cliente antes que prospecto)
        if (coincidencias.length > 0) {
            coincidencias.sort((a, b) => a.priority - b.priority);
            
            // Usar la coincidencia de mayor prioridad (menor número de priority)
            const mejorCoincidencia = coincidencias[0];
            contact = mejorCoincidencia.contact;
            contactType = mejorCoincidencia.contactType;
            contactId = mejorCoincidencia.contactId;
            
            console.log('Usando coincidencia de mayor prioridad:', contactType, contactId);
        }
    }
    
    // Actualizar interfaz
    updateContactInterface(contact, contactType, contactId);
}

// Función separada para actualizar la interfaz del contacto
function updateContactInterface(contact, contactType, contactId) {
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
    
    // Si no se encontró el contacto, mostrar error
    if (!contact) {
        console.error('No se pudo encontrar el contacto por ID, email ni teléfono');
        
        if (nombreElement) nombreElement.textContent = 'Contacto no encontrado';
        if (infoElement) infoElement.textContent = 'Error al cargar información';
        if (typeElement) {
            typeElement.textContent = 'Desconocido';
            typeElement.className = 'badge bg-danger';
        }
        
        // Restaurar la interfaz
        resetMessageInterface();
        return;
    }
    
    // Construir objeto de contacto normalizado según el tipo
    const selectedContact = {
        id: contactId || contact.id,
        tipo: contactType,
        nombre: (contactType === 'cliente') 
            ? (contact.nombre || contact.contacto || 'Sin nombre') 
            : (contact.nombre || 'Sin nombre'),
        email: contact.email || '',
        telefono: contact.telefono || '',
        data: contact  // Guardar el objeto original completo
    };
    
    // Guardar en variable global para uso en envío
    window.selectedContact = selectedContact;
    
    // Actualizar interfaz
    if (nombreElement) nombreElement.textContent = selectedContact.nombre;
    
    if (infoElement) {
        let infoHTML = '';
        
        if (selectedContact.email) {
            infoHTML += `<div><i class="fas fa-envelope me-2"></i>${selectedContact.email}</div>`;
        }
        
        if (selectedContact.telefono) {
            infoHTML += `<div><i class="fas fa-phone me-2"></i>${selectedContact.telefono}</div>`;
        }
        
        infoElement.innerHTML = infoHTML || 'Sin información de contacto';
            }
            
            if (typeElement) {
        // Importante: Asegurar que se muestre el tipo correcto con la primera letra en mayúscula
        const tipoDisplay = selectedContact.tipo === 'cliente' ? 'Cliente' : 'Prospecto';
        typeElement.textContent = tipoDisplay;
        
        // Actualizar clase según el tipo
        typeElement.className = selectedContact.tipo === 'cliente' 
            ? 'badge bg-primary' 
            : 'badge bg-secondary';
    }
    
    // Mostrar interfaz de mensajes
    showMessageInterface();
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
    
    // Obtener plantillas de la fuente más confiable
    let templates = [];
    
    // Primero intentar obtener plantillas desde window.templates (cargado de archivos externos)
    if (window.templates && window.templates[type]) {
        templates = window.templates[type];
        console.log(`Usando plantillas de window.templates.${type}: ${templates.length} plantillas encontradas`);
    } 
    // Como respaldo, usar messageTemplates 
    else if (messageTemplates && messageTemplates[type]) {
        templates = messageTemplates[type];
        console.log(`Usando plantillas de messageTemplates.${type}: ${templates.length} plantillas encontradas`);
    }
    
    // Verificar si tenemos plantillas
    if (templates.length === 0) {
        console.error(`No se encontraron plantillas para el tipo ${type}`);
        templatesHtml = '<div class="alert alert-warning">No hay plantillas disponibles</div>';
    } else {
        templates.forEach(template => {
            templatesHtml += `
                <div class="template-option" data-id="${template.id}">
                    ${template.title}
                </div>
            `;
        });
    }
    
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
    
    // Reemplazar con:

    // Si hay un contacto seleccionado, actualizar el campo de información
    if (window.selectedContact) {
        console.log('Actualizando información de contacto según tipo de mensaje:', type);
        
        const infoElement = document.getElementById('contact-info');
        if (infoElement) {
            if (type === 'whatsapp') {
                infoElement.textContent = window.selectedContact.telefono || 'Sin teléfono';
            } else {
                infoElement.textContent = window.selectedContact.email || 'Sin email';
            }
        }
    } else {
        console.warn('No hay contacto seleccionado al cambiar el tipo de mensaje');
    }
    
    // Actualizar vista previa
    updateMessagePreview();
}

/**
 * Aplicar una plantilla de mensaje
 */
function applyTemplate(templateId) {
    console.log('Aplicando plantilla:', templateId);
    
    const messageContent = document.getElementById('message-content');
    const previewSection = document.getElementById('message-preview').parentElement;
    const type = window.currentMessageType;
    
    // Verificar si hay un contacto seleccionado
    console.log('Estado de contacto seleccionado:', 
        'selectedContact:', typeof selectedContact, selectedContact ? 'definido' : 'no definido', 
        'window.selectedContact:', typeof window.selectedContact, window.selectedContact ? 'definido' : 'no definido'
    );
    
    // Obtener plantillas de la fuente más confiable
    let templates = [];
    
    // Primero intentar obtener plantillas desde window.templates (cargado de archivos externos)
    if (window.templates && window.templates[type]) {
        templates = window.templates[type];
    } 
    // Como respaldo, usar messageTemplates 
    else if (messageTemplates && messageTemplates[type]) {
        templates = messageTemplates[type];
    }
    
    const template = templates.find(t => t.id === templateId);
    
    if (template && messageContent) {
        let content = template.content;
        
        // Reemplazar variables si hay un contacto seleccionado
        // Siempre usar window.selectedContact para asegurar consistencia
        if (window.selectedContact) {
            console.log('Reemplazando variables con contacto:', window.selectedContact.nombre);
            
            content = content.replace(/\[nombre\]/g, window.selectedContact.nombre);
            // También reemplazar formato {{nombre}}
            content = content.replace(/\{\{nombre\}\}/g, window.selectedContact.nombre);
            
            // Si hay objetivo de cliente, intentar usarlo
            if (window.selectedContact.objetivo) {
                content = content.replace(/\[objetivo_cliente\]/g, window.selectedContact.objetivo);
                content = content.replace(/\{\{objetivo_cliente\}\}/g, window.selectedContact.objetivo);
            } else {
                content = content.replace(/\[objetivo_cliente\]/g, "mejorar tu condición física");
                content = content.replace(/\{\{objetivo_cliente\}\}/g, "mejorar tu condición física");
            }
            
            // Si hay progreso destacado, intentar usarlo
            if (window.selectedContact.progreso) {
                content = content.replace(/\[progreso_destacado\]/g, window.selectedContact.progreso);
                content = content.replace(/\{\{progreso_destacado\}\}/g, window.selectedContact.progreso);
            } else {
                content = content.replace(/\[progreso_destacado\]/g, "avances significativos");
                content = content.replace(/\{\{progreso_destacado\}\}/g, "avances significativos");
            }
            
            // Si hay área destacada, intentar usarla
            if (window.selectedContact.area_destacada) {
                content = content.replace(/\[área_destacada\]/g, window.selectedContact.area_destacada);
                content = content.replace(/\{\{área_destacada\}\}/g, window.selectedContact.area_destacada);
            } else {
                content = content.replace(/\[área_destacada\]/g, "tus ejercicios de fuerza");
                content = content.replace(/\{\{área_destacada\}\}/g, "tus ejercicios de fuerza");
            }
        }
        
        // Reemplazar remitente por defecto
        content = content.replace(/\[remitente\]/g, 'Pepe Urueta');
        content = content.replace(/\{\{remitente\}\}/g, 'Pepe Urueta');
        
        // Reemplazar fecha actual en formato DD/MM/YYYY
        const fechaActual = new Date();
        const fechaFormateada = `${fechaActual.getDate().toString().padStart(2, '0')}/${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}/${fechaActual.getFullYear()}`;
        content = content.replace(/\[fecha_evaluacion\]/g, fechaFormateada);
        content = content.replace(/\{\{fecha_evaluacion\}\}/g, fechaFormateada);
        
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
                        // Guardar copia del mensaje original si no existe
                        if (!messageContent.dataset.originalContent) {
                            messageContent.dataset.originalContent = messageContent.value;
                        }
                        
                        // Formatear fecha seleccionada a DD/MM/YYYY
                        // Usar un método que no se vea afectado por la zona horaria
                        const partesFecha = fechaInput.value.split('-');
                        const anio = partesFecha[0];
                        const mes = partesFecha[1];
                        const dia = partesFecha[2];
                        const fechaFormat = `${dia}/${mes}/${anio}`;
                        
                        // Convertir hora de formato 24h a 12h con AM/PM
                        let horaFormat = '';
                        const [hora] = horaInput.value.split(':');
                        const horaNum = parseInt(hora, 10);
                        const ampm = horaNum >= 12 ? 'PM' : 'AM';
                        const hora12 = horaNum % 12 || 12;
                        horaFormat = `${hora12}:00 ${ampm}`;
                        
                        // Aplicar al contenido original (con marcadores)
                        let nuevoContenido = messageContent.dataset.originalContent;
                        nuevoContenido = nuevoContenido.replace(/\[fecha\]/g, fechaFormat);
                        nuevoContenido = nuevoContenido.replace(/\[hora\]/g, horaFormat);
                        // También reemplazar marcadores con {{}} para plantillas usando ese formato
                        nuevoContenido = nuevoContenido.replace(/\{\{fecha\}\}/g, fechaFormat);
                        nuevoContenido = nuevoContenido.replace(/\{\{hora\}\}/g, horaFormat);
                        
                        // Guardar valores actuales en atributos data para usarlos más tarde
                        messageContent.dataset.citaFecha = fechaFormat;
                        messageContent.dataset.citaHora = horaFormat;
                        
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

                // Añadir eventos para actualizar automáticamente cuando cambian fecha u hora
                const fechaInput = document.getElementById('cita-fecha');
                const horaInput = document.getElementById('cita-hora');
                
                if (fechaInput && horaInput) {
                    // Función para actualizar el mensaje cuando cambian los valores
                    const actualizarFechaHora = function() {
                        if (fechaInput.value && horaInput.value) {
                            // Guardar copia del mensaje original si no existe
                            if (!messageContent.dataset.originalContent) {
                                messageContent.dataset.originalContent = messageContent.value;
                            }
                            
                            // Formatear fecha seleccionada a DD/MM/YYYY
                            const partesFecha = fechaInput.value.split('-');
                            const anio = partesFecha[0];
                            const mes = partesFecha[1];
                            const dia = partesFecha[2];
                            const fechaFormat = `${dia}/${mes}/${anio}`;
                            
                            // Convertir hora de formato 24h a 12h con AM/PM
                            let horaFormat = '';
                            const [hora] = horaInput.value.split(':');
                            const horaNum = parseInt(hora, 10);
                            const ampm = horaNum >= 12 ? 'PM' : 'AM';
                            const hora12 = horaNum % 12 || 12;
                            horaFormat = `${hora12}:00 ${ampm}`;
                            
                            // Aplicar al contenido original (con marcadores)
                            let nuevoContenido = messageContent.dataset.originalContent;
                            nuevoContenido = nuevoContenido.replace(/\[fecha\]/g, fechaFormat);
                            nuevoContenido = nuevoContenido.replace(/\[hora\]/g, horaFormat);
                            // También reemplazar marcadores con {{}} para plantillas usando ese formato
                            nuevoContenido = nuevoContenido.replace(/\{\{fecha\}\}/g, fechaFormat);
                            nuevoContenido = nuevoContenido.replace(/\{\{hora\}\}/g, horaFormat);
                            
                            // Guardar valores actuales en atributos data para usarlos más tarde
                            messageContent.dataset.citaFecha = fechaFormat;
                            messageContent.dataset.citaHora = horaFormat;
                            
                            // Actualizar el contenido y vista previa
                            messageContent.value = nuevoContenido;
                            updateMessagePreview();
                        }
                    };
                    
                    // Añadir eventos que escuchan cambios en fecha y hora
                    fechaInput.addEventListener('change', actualizarFechaHora);
                    horaInput.addEventListener('change', actualizarFechaHora);
                }
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
        
        // Limpiar cualquier contenido original almacenado de plantillas anteriores
        delete messageContent.dataset.originalContent;
        delete messageContent.dataset.citaFecha;
        delete messageContent.dataset.citaHora;
        
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
            messagePreview.innerHTML = content;
            return;
        }
        
        // Determinar si es un email o WhatsApp
        const type = window.currentMessageType;
        
        if (type === 'email') {
            // Formatear como HTML para emails utilizando la función del módulo emailPreview
            if (window.emailPreview && typeof window.emailPreview.createEmailHtmlPreview === 'function') {
                const emailHtml = window.emailPreview.createEmailHtmlPreview(content);
                messagePreview.innerHTML = emailHtml;
            } else {
                // Fallback si no se ha cargado el módulo emailPreview
                content = content.replace(/\n/g, '<br>');
                messagePreview.innerHTML = `
                    <div style="padding: 15px; border: 1px solid #eee; border-radius: 5px;">
                        <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                            <strong>Asunto:</strong> Mensaje importante - URUETA CRM
                        </div>
                        ${content}
                    </div>
                `;
            }
        } else {
            // Formatear contenido simple para WhatsApp (mantener saltos de línea)
            content = content.replace(/\n/g, '<br>');
            messagePreview.innerHTML = content;
        }
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
        // Código existente para WhatsApp
        // [... código existente...]
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
                    const whatsappURL = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
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
        // Para Email
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
        
        // Si es la plantilla de presentación de servicios (e1), recordatorio de cita (e2) o reporte de seguimiento (e4), enviar a través de la API de AppScript
        if ((templateId === 'e1' || templateId === 'e2' || templateId === 'e4') && type === 'email') {
            // Crear objeto de comunicación para la API
            const ahora = new Date();
            const fechaFormateada = ahora.toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: '2-digit',
                year: 'numeric'
            }) + ' ' + ahora.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            // Extraer fecha y hora de la cita si está en el mensaje (para e2)
            let fechaCita = '';
            let horaCita = '';
            let plantillaEnviada = '';
            let adjuntoId = ''; // Para enviar el ID del archivo adjunto a la API
            
            if (templateId === 'e1') {
                plantillaEnviada = 'Presentación de servicios';
            } else if (templateId === 'e2') {
                plantillaEnviada = 'Recordatorio de cita';
                
                // Obtener fecha y hora directamente de los inputs del selector
                const fechaInput = document.getElementById('cita-fecha');
                const horaInput = document.getElementById('cita-hora');
                
                if (fechaInput && fechaInput.value && horaInput && horaInput.value) {
                    // Formatear fecha seleccionada a DD/MM/YYYY evitando problemas de zona horaria
                    const partesFecha = fechaInput.value.split('-');
                    const anio = partesFecha[0];
                    const mes = partesFecha[1];
                    const dia = partesFecha[2];
                    fechaCita = `${dia}/${mes}/${anio}`;
                    
                    // Convertir hora de formato 24h a 12h con AM/PM
                    const [hora] = horaInput.value.split(':');
                    const horaNum = parseInt(hora, 10);
                    const ampm = horaNum >= 12 ? 'PM' : 'AM';
                    const hora12 = horaNum % 12 || 12;
                    horaCita = `${hora12}:00 ${ampm}`;
                } else {
                    // Si no están disponibles los inputs, intentar extraer del mensaje como fallback
                    const regexFecha = /programada para el (\d{2}\/\d{2}\/\d{4})/;
                    const regexHora = /a las (\d{1,2}:\d{2} [APM]{2})/;
                    
                    const matchFecha = mensaje.match(regexFecha);
                    const matchHora = mensaje.match(regexHora);
                    
                    fechaCita = matchFecha ? matchFecha[1] : '';
                    horaCita = matchHora ? matchHora[1] : '';
                }
                
                console.log('Fecha cita:', fechaCita);
                console.log('Hora cita:', horaCita);
            } else if (templateId === 'e4') {
                plantillaEnviada = 'reporte de avance'; // En minúsculas como lo espera el servidor
                
                // Mostrar loader mientras se genera el PDF
                Swal.fire({
                    title: 'Generando informe de seguimiento',
                    text: 'Estamos preparando el informe personalizado...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                try {
                    // Generar PDF para adjuntar al correo
                    const pdfResult = await generarPDFAvance(selectedContact);
                    if (!pdfResult) {
                        Swal.fire({
                            title: 'Error',
                            text: 'No se pudo generar el informe PDF. Verifica que el cliente tenga datos de seguimiento.',
                            icon: 'error',
                            confirmButtonColor: '#E63946'
                        });
                        return;
                    }
                    
                    // Convertir el PDF a base64 para enviarlo al servidor
                    const { blob, fileName } = pdfResult;
                    const reader = new FileReader();
                    
                    // Usar una promesa para manejar la lectura del archivo
                    const pdfBase64 = await new Promise((resolve, reject) => {
                        reader.onload = () => {
                            // El resultado es una cadena en base64 con un prefijo que debemos eliminar
                            const base64String = reader.result.split(',')[1];
                            resolve(base64String);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                    
                    // El archivo base64 se enviará directamente en la solicitud
                    adjuntoId = fileName; // Usamos el nombre del archivo como identificador
                    
                    // Agregar el contenido del PDF a variables temporales para incluirlos después
                    // en el objeto comunicacion
                    window.tempPdfContent = pdfBase64;
                    window.tempPdfFileName = fileName;
                    
                    Swal.close();
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
            
            // Crear el objeto comunicacion DESPUÉS de todos los procesamientos
            const comunicacion = {
                nombre: selectedContact.nombre || '',
                email: email,
                telefono: selectedContact.telefono || '',
                fecha: fechaFormateada,
                "fecha-cita": fechaCita,
                "hora-cita": horaCita,
                "tipo-plantilla": plantillaEnviada,
                "adjunto": adjuntoId,
                "tipo-contacto": selectedContact.tipo || 'prospecto',
                "id-contacto": selectedContact.id || ''
            };
            
            // Agregar el ID correcto según el tipo de contacto
            if (selectedContact.tipo === 'cliente') {
                comunicacion["id-contacto"] = selectedContact.id || '';
            } else {
                comunicacion["id-prospecto"] = selectedContact.id || '';
            }
            
            // Agregar contenido del PDF si existe
            if (window.tempPdfContent && window.tempPdfFileName) {
                comunicacion.pdfContent = window.tempPdfContent;
                comunicacion.pdfFileName = window.tempPdfFileName;
                
                // Limpiar variables temporales
                delete window.tempPdfContent;
                delete window.tempPdfFileName;
            }
            
            // Mostrar loader mientras se envía el correo
            Swal.fire({
                title: 'Enviando correo',
                text: 'Estamos enviando tu mensaje...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            try {
                // Enviar datos a la API de AppScript
                const apiUrl = 'https://script.google.com/macros/s/AKfycbx7oiLvwYu8unhXCVCJsL4343orq3u-8tfjQE1FRZli9f2m6f0rujlgauXKGLsub5Hyyg/exec';
                
                // Asegurarnos de que los nombres de los parámetros coinciden exactamente con lo que espera el AppScript
                const comunicacionAPI = {
                    nombre: comunicacion.nombre,
                    email: comunicacion.email,
                    telefono: comunicacion.telefono,
                    fecha: comunicacion.fecha,
                    "fecha-cita": comunicacion["fecha-cita"],
                    "hora-cita": comunicacion["hora-cita"],
                    "tipo-plantilla": comunicacion["tipo-plantilla"],
                    "tipo-contacto": comunicacion["tipo-contacto"]
                };
                
                // Agregar el ID correcto según el tipo de contacto
                if (comunicacion["tipo-contacto"] === 'cliente') {
                    comunicacionAPI["id-contacto"] = comunicacion["id-contacto"];
                } else {
                    comunicacionAPI["id-prospecto"] = comunicacion["id-prospecto"];
                }
                
                // Si tenemos contenido PDF, lo incluimos como adjunto
                if (comunicacion.pdfContent && comunicacion.pdfFileName) {
                    comunicacionAPI.adjunto = comunicacion.pdfContent;
                    comunicacionAPI.pdfFileName = comunicacion.pdfFileName;
                }
                
                // Depurar la información que se está enviando
                console.log('====== DATOS ENVIADOS A LA API ======');
                console.log('URL de la API:', apiUrl);
                console.log('Objeto comunicacionAPI completo:', comunicacionAPI);
                console.log('====================================');
                
                // Crear un iframe oculto para enviar los datos (evita problemas de CORS y no abre nueva pestaña)
                const iframeId = 'hidden-email-sender';
                let iframe = document.getElementById(iframeId);
                
                // Si el iframe ya existe, lo eliminamos
                if (iframe) {
                    document.body.removeChild(iframe);
                }
                
                // Crear un nuevo iframe
                iframe = document.createElement('iframe');
                iframe.id = iframeId;
                iframe.name = iframeId;
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                
                // Crear un formulario para enviar dentro del iframe
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = apiUrl;
                form.target = iframeId; // Apuntar al iframe en lugar de _blank
                
                // Agregar todos los campos al formulario
                for (const key in comunicacionAPI) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = comunicacionAPI[key];
                    form.appendChild(input);
                }
                
                // Agregar el formulario al documento
                document.body.appendChild(form);
                
                // Mostrar mensaje de proceso
                Swal.fire({
                    title: 'Enviando correo',
                    text: 'Estamos procesando tu mensaje...',
                    icon: 'info',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                        // Enviar el formulario
                        form.submit();
                        
                        // Esperar un poco y luego mostrar confirmación
                        setTimeout(() => {
                            Swal.close();
                            Swal.fire({
                                title: 'Correo enviado',
                                text: 'Tu mensaje ha sido enviado y registrado correctamente.',
                                icon: 'success',
                                confirmButtonColor: '#4a6cf7'
                            });
                            
                            // Eliminar el formulario después de enviarlo
                            document.body.removeChild(form);
                        }, 2000);
                    }
                });
            } catch (error) {
                console.error('Error al enviar correo vía API:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error al enviar el correo. Por favor, intenta de nuevo.',
                    icon: 'error',
                    confirmButtonColor: '#E63946'
                });
            }
        } else if (pdfInfo) {
            // Si tenemos un PDF generado, ofrecer descargarlo
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
                    const subject = 'Informe de Avance de Entrenamiento - Pepe Urueta';
                    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mensaje)}`;
                    console.log('URL de correo:', mailtoURL);
                    window.location.href = mailtoURL;
                }
            });
        } else {
            // Enviar correo normal
            const subject = 'Mensaje importante - Pepe Urueta';
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
            await cargarLibreriaPDF();
        }
        
        console.log('Generando PDF para el cliente original:', cliente);
        
        // PASO 1: Buscar el cliente en la base de datos por teléfono o email
        let clienteCompleto = null;
        if (cliente.telefono || cliente.email) {
            const clientesArray = Object.values(window.apiData.clientes || {});
            console.log(`Buscando cliente entre ${clientesArray.length} clientes`);
            
            // Normalizar teléfono para comparación (eliminar espacios, guiones, etc)
            // Convertir a string antes de usar replace
            const telefonoNormalizado = cliente.telefono ? String(cliente.telefono).replace(/\D/g, '') : '';
            
            clienteCompleto = clientesArray.find(c => {
                // Convertir a string antes de usar replace
                const cTelefonoNormalizado = c.telefono ? String(c.telefono).replace(/\D/g, '') : '';
                const matchTelefono = telefonoNormalizado && cTelefonoNormalizado && 
                                      cTelefonoNormalizado.includes(telefonoNormalizado);
                
                const matchEmail = cliente.email && c.email && 
                                  c.email.toLowerCase() === cliente.email.toLowerCase();
                
                return matchTelefono || matchEmail;
            });
            
            if (clienteCompleto) {
                console.log('Cliente encontrado en la base de datos:', clienteCompleto);
                console.log('Número de expediente del cliente:', clienteCompleto['numero-expediente']);
                // Fusionar los datos del cliente
                cliente = {...cliente, ...clienteCompleto};
            } else {
                console.warn('No se encontró el cliente en la base de datos');
            }
        }
        
        // PASO 2: Buscar todos los expedientes relacionados con el cliente
        let expedientesCliente = [];
        let ultimoRegistro = null;
        
        if (window.apiData && window.apiData.expedientes) {
            console.log('Número de expediente a buscar:', cliente['numero-expediente']);
            const expedientesArray = Object.values(window.apiData.expedientes || {});
            console.log(`Total de expedientes disponibles: ${expedientesArray.length}`);
            
            // Buscar por número de expediente, que es la relación principal
            expedientesCliente = expedientesArray.filter(exp => {
                const matchNumeroExpediente = cliente['numero-expediente'] && 
                                            exp['numero-expediente'] === cliente['numero-expediente'];
                
                // También buscar por otros posibles identificadores como respaldo
                const matchClienteId = cliente.id && exp.clienteId === cliente.id;
                const matchExpedienteId = cliente.expedienteId && exp.id === cliente.expedienteId;
                
                const isMatch = matchNumeroExpediente || matchClienteId || matchExpedienteId;
                if (isMatch) {
                    console.log('Expediente coincidente encontrado:', exp);
                }
                return isMatch;
            });
            
            console.log(`Expedientes encontrados para el cliente: ${expedientesCliente.length}`);
            
            if (expedientesCliente.length > 0) {
                // Ordenar por fecha para tener una secuencia cronológica
                expedientesCliente.sort((a, b) => {
                    const fechaA = a['fecha-registro'] ? new Date(a['fecha-registro'].split('/').reverse().join('-')) : new Date(0);
                    const fechaB = b['fecha-registro'] ? new Date(b['fecha-registro'].split('/').reverse().join('-')) : new Date(0);
                    return fechaA - fechaB;
                });
                
                ultimoRegistro = expedientesCliente[expedientesCliente.length - 1];
                console.log('Datos del último registro:', ultimoRegistro);
                console.log('Total registros para gráficas:', expedientesCliente.length);
            } else {
                console.warn('No se encontraron expedientes para el cliente, verificando otras relaciones...');
                
                // Búsqueda alternativa - revisar todos los expedientes buscando cualquier relación
                if (cliente.nombre) {
                    console.log('Intentando búsqueda por nombre del cliente...');
                    const nombreCliente = cliente.nombre.toLowerCase();
                    
                    expedientesCliente = expedientesArray.filter(exp => {
                        // Buscar en campos que podrían contener el nombre
                        const nombreEnNotas = exp.notas && exp.notas.toLowerCase().includes(nombreCliente);
                        const nombreEnObjetivo = exp.objetivo && exp.objetivo.toLowerCase().includes(nombreCliente);
                        
                        return nombreEnNotas || nombreEnObjetivo;
                    });
                    
                    console.log(`Expedientes encontrados por nombre: ${expedientesCliente.length}`);
                }
            }
        }

        // PASO 3: Verificar si tenemos suficientes datos para generar el PDF
        if (expedientesCliente.length === 0) {
            console.warn('No se encontraron expedientes para el cliente, no se puede generar PDF');
            return null;
        }
        
        // PASO 4: Extraer datos para gráficas
        console.log('Extrayendo datos para gráficas...');
        
        // Preparar arrays para los datos
        const fechas = [];
        const fechasCompletas = []; // Para guardar fechas con año
        const pesos = [];
        const grasaCorporal = [];
        const diasEntrenamiento = [];
        const horasEntrenamiento = [];
        
        // Valor inicial y deseado para comparativas
        let pesoInicial = null;
        let pesoDeseado = null;
        let grasaInicial = null;
        let grasaDeseada = null;
        let fechaInicial = null;
        
        // Recorrer los expedientes para extraer datos
        expedientesCliente.forEach((exp, index) => {
            // Extraer fecha formateada
            let fecha = exp['fecha-registro'] || '';
            let fechaCompleta = fecha;
            if (fecha) {
                // Guardar la fecha completa para mostrar en gráficos
                const partesFecha = fecha.split('/');
                if (partesFecha.length >= 3) {
                    // Formato "DD/MM/AA" para eje X
                    const año = partesFecha[2].substring(0, 4);
                    fecha = `${partesFecha[0]}/${partesFecha[1]}/${año.substring(2)}`;
                    
                    // Guardar la fecha inicial para calcular días transcurridos
                    if (index === 0) {
                        fechaInicial = exp['fecha-registro'];
                    }
                }
                fechas.push(fecha);
                fechasCompletas.push(fechaCompleta);
            }
            
            // Extraer métricas principales
            const pesoActual = parseFloat(exp['peso-actual'] || 0);
            pesos.push(pesoActual);
            
            const grasa = parseFloat(exp['grasa-actual'] || 0);
            grasaCorporal.push(grasa);
            
            // Extraer datos de entrenamiento
            const diasTrain = parseInt(exp['dias-entrenamiento'] || 0);
            diasEntrenamiento.push(diasTrain);
            
            const horasTrain = parseFloat(exp['horas-entrenamiento'] || 0);
            horasEntrenamiento.push(horasTrain);
            
            // Capturar valores iniciales y deseados (del primer registro)
            if (index === 0) {
                pesoInicial = parseFloat(exp['peso-inicial'] || exp['peso-actual'] || 0);
                pesoDeseado = parseFloat(exp['peso-deseado'] || 0);
                grasaInicial = parseFloat(exp['grasa-inicial'] || exp['grasa-actual'] || 0);
                grasaDeseada = parseFloat(exp['grasa-deseada'] || 0);
            }
        });
        
        console.log('Datos extraídos para gráficas:', {
            fechas, pesos, grasaCorporal, diasEntrenamiento, horasEntrenamiento,
            pesoInicial, pesoDeseado, grasaInicial, grasaDeseada
        });
        
        // PASO 5: Generar gráficas con Chart.js
        // Primero comprobar si Chart.js está disponible
        if (typeof Chart === 'undefined') {
            await cargarLibreriaChart();
        }
        
        // Crear canvas temporales para las gráficas
        const chartContainer = document.createElement('div');
        chartContainer.style.display = 'none';
        document.body.appendChild(chartContainer);
        
        // Crear canvas para cada gráfica con dimensiones mayores para mejor calidad
        const pesoCanvas = document.createElement('canvas');
        pesoCanvas.width = 600;  // Aumentado para mejor resolución
        pesoCanvas.height = 350; // Proporción mejorada para evitar que se vean aplastados
        pesoCanvas.id = 'pesoChart';
        chartContainer.appendChild(pesoCanvas);
        
        const grasaCanvas = document.createElement('canvas');
        grasaCanvas.width = 600;
        grasaCanvas.height = 350;
        grasaCanvas.id = 'grasaChart';
        chartContainer.appendChild(grasaCanvas);
        
        const diasCanvas = document.createElement('canvas');
        diasCanvas.width = 600;
        diasCanvas.height = 350;
        diasCanvas.id = 'diasChart';
        chartContainer.appendChild(diasCanvas);
        
        const horasCanvas = document.createElement('canvas');
        horasCanvas.width = 600;
        horasCanvas.height = 350;
        horasCanvas.id = 'horasChart';
        chartContainer.appendChild(horasCanvas);
        
        // Configuración común para gráficas
        const commonConfig = {
            type: 'line',
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    title: {
                        display: true,
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: {
                            top: 10,
                            bottom: 15
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            padding: 8,
                            font: {
                                size: 9
                            },
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: {
                            display: true
                        }
                    },
                    y: {
                        beginAtZero: false,
                        ticks: {
                            padding: 8,
                            font: {
                                size: 10
                            },
                            callback: function(value) {
                                return value; // El valor numérico
                            }
                        },
                        grid: {
                            display: true
                        }
                    }
                },
                animation: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 0,
                        bottom: 30 // Mayor padding para acomodar fechas rotadas
                    }
                },
                maintainAspectRatio: false
            }
        };
        
        // Crear gráfica de peso con peso inicial y deseado como líneas de referencia
        const pesoChart = new Chart(pesoCanvas.getContext('2d'), {
            ...commonConfig,
            data: {
                labels: fechas,
                datasets: [
                    {
                        label: 'Peso Actual (kg)',
                        data: pesos,
                        borderColor: '#E63946',
                        backgroundColor: 'rgba(230, 57, 70, 0.1)',
                        tension: 0.1,
                        fill: true
                    },
                    {
                        label: 'Peso Inicial',
                        data: Array(fechas.length).fill(pesoInicial),
                        borderColor: '#FF0000',
                        borderDash: [5, 5],
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: false
                    },
                    {
                        label: 'Peso Objetivo',
                        data: Array(fechas.length).fill(pesoDeseado),
                        borderColor: '#00AA00',
                        borderDash: [3, 3],
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                ...commonConfig.options,
                plugins: {
                    ...commonConfig.options.plugins,
                    title: {
                        ...commonConfig.options.plugins.title,
                        text: 'Evolución del Peso'
                    }
                },
                scales: {
                    x: {
                        ...commonConfig.options.scales.x,
                    },
                    y: {
                        ...commonConfig.options.scales.y,
                        title: {
                            display: true,
                            text: 'kg',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
        
        // Crear gráfica de grasa corporal con objetivos
        const grasaChart = new Chart(grasaCanvas.getContext('2d'), {
            ...commonConfig,
            data: {
                labels: fechas,
                datasets: [
                    {
                        label: 'Grasa Corporal (%)',
                        data: grasaCorporal,
                        borderColor: '#F4A261',
                        backgroundColor: 'rgba(244, 162, 97, 0.1)',
                        tension: 0.1,
                        fill: true
                    },
                    {
                        label: 'Grasa Inicial',
                        data: Array(fechas.length).fill(grasaInicial),
                        borderColor: '#FF0000',
                        borderDash: [5, 5],
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: false
                    },
                    {
                        label: 'Grasa Objetivo',
                        data: Array(fechas.length).fill(grasaDeseada),
                        borderColor: '#00AA00',
                        borderDash: [3, 3],
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                ...commonConfig.options,
                plugins: {
                    ...commonConfig.options.plugins,
                    title: {
                        ...commonConfig.options.plugins.title,
                        text: 'Evolución de Grasa Corporal'
                    }
                },
                scales: {
                    x: {
                        ...commonConfig.options.scales.x,
                    },
                    y: {
                        ...commonConfig.options.scales.y,
                        title: {
                            display: true,
                            text: '%',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
        
        // Crear gráfica de días de entrenamiento (convertida a línea)
        const diasChart = new Chart(diasCanvas.getContext('2d'), {
            ...commonConfig,
            data: {
                labels: fechas,
                datasets: [{
                    label: 'Días de Entrenamiento',
                    data: diasEntrenamiento,
                    borderColor: '#457B9D',
                    backgroundColor: 'rgba(69, 123, 157, 0.1)',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                ...commonConfig.options,
                plugins: {
                    ...commonConfig.options.plugins,
                    title: {
                        ...commonConfig.options.plugins.title,
                        text: 'Días de Entrenamiento por Semana'
                    }
                },
                scales: {
                    x: {
                        ...commonConfig.options.scales.x,
                    },
                    y: {
                        ...commonConfig.options.scales.y,
                        beginAtZero: true,
                        suggestedMax: 7,
                        title: {
                            display: true,
                            text: 'días',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
        
        // Crear gráfica de horas de entrenamiento (convertida a línea)
        const horasChart = new Chart(horasCanvas.getContext('2d'), {
            ...commonConfig,
            data: {
                labels: fechas,
                datasets: [{
                    label: 'Horas de Entrenamiento',
                    data: horasEntrenamiento,
                    borderColor: '#2A9D8F',
                    backgroundColor: 'rgba(42, 157, 143, 0.1)',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                ...commonConfig.options,
                plugins: {
                    ...commonConfig.options.plugins,
                    title: {
                        ...commonConfig.options.plugins.title,
                        text: 'Horas de Entrenamiento por Sesión'
                    }
                },
                scales: {
                    x: {
                        ...commonConfig.options.scales.x,
                    },
                    y: {
                        ...commonConfig.options.scales.y,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'horas',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
        
        // Esperar un momento para que se renderizen las gráficas
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Obtener las URL de datos de las gráficas
        const pesoChartUrl = pesoCanvas.toDataURL('image/png');
        const grasaChartUrl = grasaCanvas.toDataURL('image/png');
        const diasChartUrl = diasCanvas.toDataURL('image/png');
        const horasChartUrl = horasCanvas.toDataURL('image/png');
        
        // PASO 6: Generar PDF
        console.log('Generando documento PDF...');
        
        // Crear instancia de jsPDF
        const doc = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Configuración de página
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;
        
        // Configurar tamaño para las gráficas
        const chartWidth = contentWidth;
        const chartHeight = 80; // Altura ajustada
        
        // Función para añadir encabezado a las páginas
        function addHeader(page) {
            doc.setPage(page);
            doc.setFillColor(69, 123, 157);
            doc.rect(0, 0, pageWidth, 30, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Reporte de Seguimiento', pageWidth / 2, 15, { align: 'center' });
        }
        
        // Función para añadir pie de página con logo
        function addFooter(page) {
            doc.setPage(page);
            
            // Añadir rectángulo de fondo gris claro para el pie de página
            doc.setFillColor(247, 247, 247); // #f7f7f7
            doc.rect(0, pageHeight - 45, pageWidth, 45, 'F');
            
            try {
                // Agregar logo al pie de página (ahora usando Footer.jpg que está en la raíz)
                const logoPath = './Footer.jpg';
                const footerWidth = 140;  // Ancho en mm para el logo
                const footerHeight = 25;  // Alto en mm para el logo
                const footerX = (pageWidth - footerWidth) / 2;  // Centrado horizontalmente
                const footerY = pageHeight - footerHeight - 10;  // Posición desde abajo
                
                doc.addImage(logoPath, 'JPEG', footerX, footerY, footerWidth, footerHeight);
            } catch (e) {
                console.error('Error al agregar logo de pie de página:', e);
                
                // Intentar con ruta alternativa si falla la primera
                try {
                    const alternateLogoPath = 'Footer.jpg';
                    const footerWidth = 140;
                    const footerHeight = 25;
                    const footerX = (pageWidth - footerWidth) / 2;
                    const footerY = pageHeight - footerHeight - 10;
                    
                    doc.addImage(alternateLogoPath, 'JPEG', footerX, footerY, footerWidth, footerHeight);
                } catch (e2) {
                    console.error('No se pudo añadir el logo de pie de página:', e2);
                }
            }
        }
        
        // PÁGINA 1 - Información del cliente y gráficas iniciales
        addHeader(1);
        
        // Calcular la fecha actual en formato DD/MM/YYYY
        const today = new Date();
        const fechaActual = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        
        // Agregar información del cliente
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Reporte de seguimiento - ${fechaActual}`, margin, 40);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Datos del cliente:', margin, 50);
        doc.setFont('helvetica', 'normal');
        doc.text(`Nombre: ${cliente.nombre || 'No disponible'}`, margin, 55);
        doc.text(`Email: ${cliente.email || 'No disponible'}`, margin, 60);
        doc.text(`Teléfono: ${cliente.telefono || 'No disponible'}`, margin, 65);
        
        // Agregar resumen actual
        if (ultimoRegistro) {
            doc.setFont('helvetica', 'bold');
            doc.text('Mediciones actuales:', margin, 75);
            doc.setFont('helvetica', 'normal');
            
            // Formatear fecha para quitar la hora
            let fechaFormateada = ultimoRegistro['fecha-registro'] || 'No disponible';
            if (fechaFormateada.includes(' ')) {
                fechaFormateada = fechaFormateada.split(' ')[0];
            }
            
            doc.text(`Fecha: ${fechaFormateada}`, margin, 80);
            doc.text(`Peso actual: ${ultimoRegistro['peso-actual'] || 'No disponible'} kg`, margin, 85);
            doc.text(`Grasa corporal: ${ultimoRegistro['grasa-actual'] || 'No disponible'} %`, margin, 90);
            doc.text(`Disciplina: ${ultimoRegistro['disciplina'] || 'No disponible'}`, margin, 95);
            doc.text(`Nivel: ${ultimoRegistro['nivel'] || 'No disponible'}`, margin, 100);
            doc.text(`Objetivo: ${ultimoRegistro['objetivo'] || 'No disponible'}`, margin, 105);
            
            // Datos adicionales de entrenamiento
            doc.text(`Días de entrenamiento: ${ultimoRegistro['dias-entrenamiento'] || '0'} días/semana`, margin, 110);
            doc.text(`Horas por sesión: ${ultimoRegistro['horas-entrenamiento'] || '0'} horas`, margin, 115);
            
            // Condiciones médicas si existen
            if (ultimoRegistro['condiciones-medicas']) {
                doc.text(`Condiciones médicas: ${ultimoRegistro['condiciones-medicas']}`, margin, 120);
            }
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text('Evolución de mediciones', margin, 130);
        
        // Agregar gráfica de peso (ajustada para no solapar con el footer y aumentando altura)
        const usableHeight = pageHeight - 160 - 35; // Restar encabezado, logo y márgenes
        doc.addImage(pesoChartUrl, 'PNG', margin, 135, chartWidth, chartHeight);
        
        // Añadir el pie de página a la primera página
        addFooter(1);
        
        // PÁGINA 2 - Continuación de gráficas
        doc.addPage();
        addHeader(2);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Evolución de Grasa Corporal', margin, 40);
        
        // Agregar gráfica de grasa corporal
        doc.addImage(grasaChartUrl, 'PNG', margin, 45, chartWidth, chartHeight);
        
        // Agregar gráficas de entrenamiento
        doc.setFont('helvetica', 'bold');
        doc.text('Registro de entrenamiento', margin, 45 + chartHeight + 15);
        
        // Agregar gráfica de días de entrenamiento
        doc.addImage(diasChartUrl, 'PNG', margin, 45 + chartHeight + 20, chartWidth, chartHeight);
        
        // Añadir pie de página a la segunda página
        addFooter(2);
        
        // PÁGINA 3 - Horas de entrenamiento y resumen de progreso
        doc.addPage();
        addHeader(3);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Horas de Entrenamiento por Sesión', margin, 40);
        
        // Agregar gráfica de horas de entrenamiento
        doc.addImage(horasChartUrl, 'PNG', margin, 45, chartWidth, chartHeight);
        
        // Calcular días transcurridos
        let diasTranscurridos = 0;
        if (fechaInicial && expedientesCliente.length > 0) {
            const fechaIni = new Date(fechaInicial.split('/').reverse().join('-'));
            const fechaFin = new Date(expedientesCliente[expedientesCliente.length - 1]['fecha-registro'].split('/').reverse().join('-'));
            diasTranscurridos = Math.ceil((fechaFin - fechaIni) / (1000 * 60 * 60 * 24));
        }
        
        // Calcular diferencias y progreso
        const pesoPrimerRegistro = pesos[0] || 0;
        const pesoUltimoRegistro = pesos[pesos.length - 1] || 0;
        const diferenciaPeso = pesoUltimoRegistro - pesoPrimerRegistro;
        const progresoHaciaMeta = pesoDeseado ? Math.abs(pesoUltimoRegistro - pesoDeseado) : 0;
        
        const grasaPrimerRegistro = grasaCorporal[0] || 0;
        const grasaUltimoRegistro = grasaCorporal[grasaCorporal.length - 1] || 0;
        const diferenciaGrasa = grasaUltimoRegistro - grasaPrimerRegistro;
        const progresoGrasaHaciaMeta = grasaDeseada ? Math.abs(grasaUltimoRegistro - grasaDeseada) : 0;
        
        // Agregar resumen de progreso con estilo similar a "mediciones actuales"
        doc.setFont('helvetica', 'bold');
        doc.text('Resumen de progreso:', margin, 45 + chartHeight + 20);
        
        // Configuraciones para el texto
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        // Variables para posicionar el texto
        let yPos = 45 + chartHeight + 25;
        const lineHeight = 5; // Mismo espaciado que en "mediciones actuales"
        
        // Usar formato normal para los valores
        doc.setFont('helvetica', 'normal');
        
        // Días transcurridos
        doc.text(`Días desde el inicio del seguimiento: ${diasTranscurridos}`, margin, yPos);
        yPos += lineHeight;
        
        // Plantillas de texto para cambios de peso
        if (Math.abs(diferenciaPeso) < 0.1) {
            // Cuando el peso se mantiene
            doc.text(`El peso se ha mantenido desde el inicio (${pesoPrimerRegistro.toFixed(1)} kg)`, margin, yPos);
        } else if (diferenciaPeso < 0) {
            // Cuando se pierde peso - texto normal
            doc.text(`Se ha perdido ${Math.abs(diferenciaPeso).toFixed(1)} kg desde el inicio (${pesoPrimerRegistro.toFixed(1)} kg - ${pesoUltimoRegistro.toFixed(1)} kg)`, margin, yPos);
        } else {
            // Cuando se gana peso - texto normal
            doc.text(`Se ha ganado ${diferenciaPeso.toFixed(1)} kg desde el inicio (${pesoPrimerRegistro.toFixed(1)} kg - ${pesoUltimoRegistro.toFixed(1)} kg)`, margin, yPos);
        }
        yPos += lineHeight;
        
        // Objetivo de peso
        if (pesoDeseado) {
            const diferenciaObjetivo = pesoDeseado - pesoUltimoRegistro;
            
            if (Math.abs(diferenciaObjetivo) < 0.1) {
                doc.text(`Se ha alcanzado el objetivo de peso de ${pesoDeseado.toFixed(1)} kg`, margin, yPos);
            } else if (diferenciaObjetivo > 0) {
                doc.text(`Faltan ${diferenciaObjetivo.toFixed(1)} kg por ganar para alcanzar el objetivo de ${pesoDeseado.toFixed(1)} kg`, margin, yPos);
            } else {
                doc.text(`Faltan ${Math.abs(diferenciaObjetivo).toFixed(1)} kg por perder para alcanzar el objetivo de ${pesoDeseado.toFixed(1)} kg`, margin, yPos);
            }
            yPos += lineHeight;
        }
        
        // Plantillas de texto para cambios de grasa corporal
        if (Math.abs(diferenciaGrasa) < 0.1) {
            // Cuando la grasa se mantiene
            doc.text(`El porcentaje de grasa corporal se ha mantenido desde el inicio (${grasaPrimerRegistro.toFixed(1)}%)`, margin, yPos);
        } else if (diferenciaGrasa < 0) {
            // Cuando se reduce la grasa - texto normal
            doc.text(`Se ha reducido ${Math.abs(diferenciaGrasa).toFixed(1)}% de grasa corporal desde el inicio (${grasaPrimerRegistro.toFixed(1)}% - ${grasaUltimoRegistro.toFixed(1)}%)`, margin, yPos);
        } else {
            // Cuando aumenta la grasa - texto normal
            doc.text(`Se ha aumentado ${diferenciaGrasa.toFixed(1)}% de grasa corporal desde el inicio (${grasaPrimerRegistro.toFixed(1)}% - ${grasaUltimoRegistro.toFixed(1)}%)`, margin, yPos);
        }
        yPos += lineHeight;
        
        // Objetivo de grasa
        if (grasaDeseada) {
            const diferenciaObjetivoGrasa = grasaDeseada - grasaUltimoRegistro;
            
            if (Math.abs(diferenciaObjetivoGrasa) < 0.1) {
                doc.text(`Se ha alcanzado el objetivo de grasa corporal de ${grasaDeseada.toFixed(1)}%`, margin, yPos);
            } else if (diferenciaObjetivoGrasa > 0) {
                doc.text(`Faltan ${diferenciaObjetivoGrasa.toFixed(1)}% por aumentar para alcanzar el objetivo de ${grasaDeseada.toFixed(1)}%`, margin, yPos);
            } else {
                doc.text(`Faltan ${Math.abs(diferenciaObjetivoGrasa).toFixed(1)}% por reducir para alcanzar el objetivo de ${grasaDeseada.toFixed(1)}%`, margin, yPos);
            }
        }
        
        // Añadir pie de página a la tercera página
        addFooter(3);
        
        // Limpiar recursos temporales
        chartContainer.remove();
        pesoChart.destroy();
        grasaChart.destroy();
        diasChart.destroy();
        horasChart.destroy();
        
        // Generar el PDF como Blob
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const fileName = `Reporte_${cliente.nombre.replace(/\s+/g, '_')}_${fechaActual.replace(/\//g, '-')}.pdf`;
        
        console.log('PDF generado correctamente:', fileName);
        
        // Devolver la información del PDF
        return {
            blob: pdfBlob,
            url: pdfUrl,
            fileName: fileName
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

/**
 * Cargar la biblioteca Chart.js si no está disponible
 */
async function cargarLibreriaChart() {
    return new Promise((resolve, reject) => {
        if (typeof Chart !== 'undefined') {
            resolve();
            return;
        }
        
        console.log('Cargando biblioteca Chart.js...');
        
        // Crear elemento script para cargar Chart.js
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js';
        script.onload = () => {
            console.log('Chart.js cargado correctamente');
            resolve();
        };
        script.onerror = (error) => {
            console.error('Error al cargar Chart.js:', error);
            reject(error);
        };
        
        document.head.appendChild(script);
    });
}

/**
 * Crear vista previa HTML de email
 * @param {string} content - Contenido del correo
 * @returns {string} HTML formateado para la vista previa
 */
function createEmailHtmlPreview(content) {
    // Convertir saltos de línea en <br>
    content = content.replace(/\n/g, '<br>');
    
    // Crear estructura HTML para el email
    return `
    <div style="max-width: 600px; font-family: Arial, sans-serif; border: 1px solid #e1e1e1; border-radius: 5px; overflow: hidden;">
        <div style="background-color: #4a6cf7; padding: 15px; text-align: center;">
            <h2 style="color: white; margin: 0;">URUETA CRM</h2>
        </div>
        <div style="padding: 20px; background-color: white;">
            ${content}
        </div>
        <div style="background-color: #f7f7f7; padding: 15px; text-align: center; border-top: 1px solid #e1e1e1;">
            <img src="Footer.jpg" alt="Pepe Urueta" style="max-width: 150px; height: auto;">
            <p style="color: #666; margin-top: 10px; font-size: 12px;">
                © ${new Date().getFullYear()} Pepe Urueta - Entrenador Personal
            </p>
        </div>
    </div>
    `;
} 

// Mostrar interfaz de mensajes
function showMessageInterface() {
    console.log('Mostrando interfaz de mensajes');
    
    // Mostrar el contenedor de mensajes si está oculto
    const messageContainer = document.querySelector('.message-composer');
    if (messageContainer) {
        messageContainer.style.display = 'flex';
        console.log('Contenedor de mensajes mostrado correctamente');
    } else {
        console.error('No se encontró el contenedor de mensajes (.message-composer)');
        
        // Registrar todos los contenedores disponibles para diagnóstico
        const allContainers = document.querySelectorAll('.composer-body, .composer-header, .message-composer, .composer-actions');
        console.log('Contenedores disponibles:', allContainers.length);
        allContainers.forEach((container, index) => {
            console.log(`Contenedor ${index}:`, container.className);
        });
    }
    
    // Restablecer el área de mensajes
    const messageContent = document.getElementById('message-content');
    if (messageContent) {
        messageContent.value = '';
        delete messageContent.dataset.originalContent;
        delete messageContent.dataset.templateId;
        delete messageContent.dataset.requiresAttachment;
    } else {
        console.error('No se encontró el elemento message-content');
    }
    
    // Restablecer la vista previa
    updateMessagePreview();
    
    // Habilitar controles
    const sendButton = document.getElementById('btn-send');
    if (sendButton) {
        sendButton.disabled = false;
    } else {
        console.error('No se encontró el botón btn-send');
    }
}

// Restablecer interfaz de mensajes
function resetMessageInterface() {
    console.log('Restableciendo interfaz de mensajes');
    
    // Ocultar el contenedor de mensajes
    const messageContainer = document.querySelector('.message-composer');
    if (messageContainer) {
        messageContainer.style.display = 'none';
        console.log('Contenedor de mensajes ocultado correctamente');
    } else {
        console.error('No se encontró el contenedor de mensajes (.message-composer)');
    }
    
    // Limpiar área de mensajes
    const messageContent = document.getElementById('message-content');
    if (messageContent) {
        messageContent.value = '';
        delete messageContent.dataset.originalContent;
        delete messageContent.dataset.templateId;
        delete messageContent.dataset.requiresAttachment;
    } else {
        console.error('No se encontró el elemento message-content');
    }
    
    // Limpiar la vista previa
    const previewElement = document.getElementById('message-preview');
    if (previewElement) {
        previewElement.innerHTML = '<div class="preview-placeholder">Vista previa del mensaje</div>';
    } else {
        console.error('No se encontró el elemento message-preview');
    }
    
    // Desactivar controles
    const sendButton = document.getElementById('btn-send');
    if (sendButton) {
        sendButton.disabled = true;
    } else {
        console.error('No se encontró el botón btn-send');
    }
}
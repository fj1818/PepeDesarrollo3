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
    
    // Aquí va el código para crear la estructura básica de la interfaz
    // ... (código HTML y configuración)
    
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
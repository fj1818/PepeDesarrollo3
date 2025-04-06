/**
 * Comunicaciones-Fix-Init
 * Script para asegurar la carga correcta de la función initComunicaciones desde comunicaciones.js
 */

console.log('Cargando comunicaciones-fix-init.js - Asegurando disponibilidad de initComunicaciones');

// Crear una promesa para indicar cuando la función esté lista
window.initComunicacionesReady = new Promise((resolve) => {
    // Verificar si el script de comunicaciones.js ya está cargado
    const comunicacionesScript = document.querySelector('script[src="js/comunicaciones.js"]');

    if (!comunicacionesScript) {
        console.log('Script comunicaciones.js no detectado, cargándolo...');
        
        // Cargar el script de comunicaciones
        const script = document.createElement('script');
        script.src = 'js/comunicaciones.js';
        script.onload = function() {
            console.log('comunicaciones.js cargado correctamente');
            exportarFuncionGlobal(resolve);
        };
        script.onerror = function(error) {
            console.error('Error al cargar comunicaciones.js:', error);
            
            // Definir una función de respaldo básica
            window.initComunicaciones = function() {
                console.warn('Usando función de respaldo para initComunicaciones');
                const contentElement = document.getElementById('content') || document.querySelector('.content-section');
                if (contentElement) {
                    contentElement.innerHTML = `
                        <div class="p-4">
                            <h2>Centro de Comunicaciones</h2>
                            <p>El módulo de comunicaciones está en modo de compatibilidad.</p>
                            <div class="alert alert-warning">
                                <p>No se pudo cargar correctamente el módulo de comunicaciones. Por favor recargue la página.</p>
                            </div>
                            <button class="btn btn-primary" onclick="location.reload()">Recargar</button>
                        </div>
                    `;
                }
            };
            resolve();
        };
        document.head.appendChild(script);
    } else {
        console.log('Script comunicaciones.js ya está cargado');
        exportarFuncionGlobal(resolve);
    }
});

// Función para exportar initComunicaciones al objeto window
function exportarFuncionGlobal(resolvePromise) {
    // Definir directamente la función si aún no existe
    if (typeof initComunicaciones === 'function') {
        console.log('initComunicaciones ya está definida, asegurando que esté en el objeto window');
        window.initComunicaciones = initComunicaciones;
        
        // También definir una versión alternativa que garantiza que siempre esté disponible
        window._initComunicaciones = function() {
            console.log('Llamando a _initComunicaciones (versión segura)');
            if (typeof initComunicaciones === 'function') {
                return initComunicaciones();
            } else if (typeof window.initComunicaciones === 'function') {
                return window.initComunicaciones();
            } else {
                console.error('No se pudo encontrar la función initComunicaciones');
                const contentElement = document.getElementById('content') || document.querySelector('.content-section');
                if (contentElement) {
                    contentElement.innerHTML = `
                        <div class="alert alert-danger">
                            <h4><i class="fas fa-exclamation-triangle"></i> Error al cargar el módulo de comunicaciones</h4>
                            <p>La función initComunicaciones no está disponible. Por favor, recargue la página.</p>
                            <button class="btn btn-primary mt-3" onclick="location.reload()">Recargar página</button>
                        </div>
                    `;
                }
            }
        };
        
        if (resolvePromise) resolvePromise();
    } else if (window.initComunicaciones) {
        console.log('La función ya está definida en window.initComunicaciones');
        
        // Crear función alternativa
        window._initComunicaciones = function() {
            console.log('Llamando a window.initComunicaciones desde wrapper');
            return window.initComunicaciones();
        };
        
        if (resolvePromise) resolvePromise();
    } else {
        console.error('La función initComunicaciones no está disponible en ningún contexto');
        
        // Definir una función de respaldo
        window.initComunicaciones = function() {
            console.warn('Usando función de respaldo para initComunicaciones');
            const contentElement = document.getElementById('content') || document.querySelector('.content-section');
            if (contentElement) {
                contentElement.innerHTML = `
                    <div class="p-4">
                        <h2>Centro de Comunicaciones</h2>
                        <p>El módulo de comunicaciones está en modo de compatibilidad.</p>
                        <div class="alert alert-warning">
                            <p>No se pudo cargar correctamente el módulo de comunicaciones. Por favor recargue la página.</p>
                        </div>
                        <button class="btn btn-primary" onclick="location.reload()">Recargar</button>
                    </div>
                `;
            }
        };
        
        window._initComunicaciones = window.initComunicaciones;
        
        if (resolvePromise) resolvePromise();
    }
} 
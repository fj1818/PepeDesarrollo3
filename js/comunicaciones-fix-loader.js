/**
 * comunicaciones-fix-loader.js
 * Script para corregir problemas de carga en comunicaciones.js
 */

console.log('Cargando comunicaciones-fix-loader.js');

// Primero, verificar si hay errores en el script original
function ejecutarCorreccion() {
    console.log('Aplicando corrección silenciosa en comunicaciones.js');
    
    // Verificar si ya existe la función en el ámbito global
    if (typeof window.initComunicaciones === 'function') {
        console.log('La función initComunicaciones ya está disponible, no se requiere acción');
        return;
    }
    
    // Si la función no existe, cargarla de forma explícita
    console.log('Definiendo la función initComunicaciones explícitamente');
    
    window.initComunicaciones = function() {
        console.log('Función reconstruida: initComunicaciones ejecutándose');
        
        try {
            // Si loadComunicacionesUI está disponible, llamarla
            if (typeof window.loadComunicacionesUI === 'function') {
                console.log('Llamando a loadComunicacionesUI desde la función reconstruida');
                window.loadComunicacionesUI();
            } else {
                // Cargar la UI básica
                console.warn('loadComunicacionesUI no disponible, generando UI básica');
                const contentElement = document.getElementById('content') || document.querySelector('.content-section');
                if (contentElement) {
                    contentElement.innerHTML = `
                        <div class="p-4">
                            <h2>Centro de Comunicaciones</h2>
                            <p>El módulo de comunicaciones está siendo cargado en modo de compatibilidad.</p>
                            <div class="alert alert-warning">
                                <p>Algunas funciones podrían no estar disponibles. Si encuentra problemas, por favor recargue la página.</p>
                            </div>
                            <button class="btn btn-primary" onclick="location.reload()">Recargar</button>
                        </div>
                    `;
                }
            }
        } catch (error) {
            console.error('Error en initComunicaciones reconstruida:', error);
        }
    };
    
    console.log('Corrección aplicada, initComunicaciones disponible globalmente');
}

// Ejecutar la corrección
ejecutarCorreccion(); 
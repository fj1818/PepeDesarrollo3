// Este bloque de código reemplazará la sección problemática en el archivo comunicaciones.js

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
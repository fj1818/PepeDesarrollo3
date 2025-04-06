/**
 * Script para cargar el fix de selección de contactos (versión sin botones)
 */
(function() {
    console.log('Cargando script de corrección silenciosa para la selección de contactos...');
    
    const fixScript = document.createElement('script');
    fixScript.src = 'js/comunicaciones-fixed.js';
    
    fixScript.onload = () => {
        console.log('Script de corrección silenciosa cargado correctamente');
    };
    
    fixScript.onerror = (error) => {
        console.error('Error al cargar script de corrección:', error);
        
        // En caso de error, intenta reparar manualmente
        const activeContact = document.querySelector('.contact-item.active');
        if (activeContact) {
            console.log('Intentando reparación manual...');
            const contactId = activeContact.getAttribute('data-id');
            const contactType = activeContact.getAttribute('data-type');
            
            // Si existe la función selectContact, llamarla
            if (window.selectContact && typeof window.selectContact === 'function') {
                window.selectContact(contactId, contactType);
            }
        }
    };
    
    document.head.appendChild(fixScript);
})(); 
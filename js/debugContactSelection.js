/**
 * Script de diagnóstico para problemas de selección de contacto
 */

// Monitorear cambios en selectedContact
(function() {
    console.log('==== INSTALANDO MONITOR DE CONTACTOS SELECCIONADOS ====');
    
    // Verificar estado inicial
    console.log('Estado inicial de selectedContact:',
        'window.selectedContact:', typeof window.selectedContact, window.selectedContact ? 'definido' : 'no definido'
    );
    
    // Monitorear cambios en window.selectedContact
    let originalSelectedContact = window.selectedContact;
    Object.defineProperty(window, 'selectedContact', {
        set: function(newValue) {
            console.log('¡CAMBIO DETECTADO! Nuevo valor asignado a window.selectedContact:', newValue);
            originalSelectedContact = newValue;
        },
        get: function() {
            return originalSelectedContact;
        }
    });
    
    // Funciones de ayuda
    window.debugContactSelection = {
        verifyContactSelection: function() {
            console.log('==== VERIFICACIÓN DE CONTACTO SELECCIONADO ====');
            console.log('Estado de selectedContact:', window.selectedContact);
            
            if (window.selectedContact) {
                console.log('Propiedades del contacto:', 
                    'ID:', window.selectedContact.id, 
                    'Tipo:', window.selectedContact.tipo,
                    'Nombre:', window.selectedContact.nombre,
                    'Email:', window.selectedContact.email,
                    'Teléfono:', window.selectedContact.telefono
                );
            } else {
                console.log('Contacto no seleccionado. Buscando elementos activos...');
                const activeContact = document.querySelector('.contact-item.active');
                if (activeContact) {
                    console.log('Elemento de contacto activo encontrado:',
                        'ID:', activeContact.getAttribute('data-id'),
                        'Tipo:', activeContact.getAttribute('data-type')
                    );
                    
                    // Intentar seleccionar este contacto
                    console.log('Intentando seleccionar contacto automáticamente...');
                    const contactId = activeContact.getAttribute('data-id');
                    const contactType = activeContact.getAttribute('data-type');
                    
                    if (window.selectContact && typeof window.selectContact === 'function') {
                        window.selectContact(contactId, contactType);
                        console.log('Función selectContact llamada. Verificando resultado...');
                        setTimeout(() => {
                            console.log('Resultado después de selección:',
                                'window.selectedContact:', window.selectedContact ? 'definido' : 'no definido'
                            );
                        }, 500);
                    }
                } else {
                    console.log('No se encontró ningún contacto activo en la interfaz.');
                }
            }
        },
        
        fixContactSelection: function() {
            console.log('==== CORRECCIÓN DE SELECCIÓN DE CONTACTO ====');
            
            // Buscar un contacto activo
            const activeContact = document.querySelector('.contact-item.active');
            if (activeContact) {
                const contactId = activeContact.getAttribute('data-id');
                const contactType = activeContact.getAttribute('data-type');
                
                // Buscar el contacto en los datos de la API
                let contactData = null;
                
                if (contactType === 'cliente' && window.apiData && window.apiData.clientes) {
                    contactData = window.apiData.clientes[contactId];
                } else if (contactType === 'prospecto' && window.apiData && window.apiData.prospectos) {
                    contactData = window.apiData.prospectos[contactId];
                }
                
                if (contactData) {
                    // Crear objeto de contacto normalizado
                    window.selectedContact = {
                        id: contactId,
                        tipo: contactType,
                        nombre: (contactType === 'cliente') 
                            ? (contactData.nombre || contactData.contacto || 'Sin nombre') 
                            : (contactData.nombre || 'Sin nombre'),
                        email: contactData.email || '',
                        telefono: contactData.telefono || '',
                        data: contactData  // Guardar el objeto original completo
                    };
                    
                    console.log('Contacto reconstruido y asignado a window.selectedContact:', window.selectedContact);
                } else {
                    console.log('No se encontraron datos para el contacto seleccionado:', contactId, contactType);
                }
            } else {
                console.log('No hay ningún contacto seleccionado en la interfaz para reconstruir.');
            }
        }
    };
    
    // Mantener las funciones de diagnóstico disponibles pero sin agregar botones visibles
    console.log('Funciones de diagnóstico disponibles a través de la consola: window.debugContactSelection');
    
    // Verificar contacto actual al inicio
    setTimeout(() => {
        window.debugContactSelection.verifyContactSelection();
    }, 2000);
    
    console.log('==== MONITOR DE CONTACTOS INSTALADO ====');
})(); 
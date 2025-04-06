/**
 * Solución para problemas de selección de contacto (versión sin botones de interfaz)
 */

// Ejecutar cuando el DOM esté listo
(function() {
    console.log('==== INSTALANDO CORRECCIÓN SILENCIOSA DE SELECCIÓN DE CONTACTOS ====');
    
    // Esperar a que la página esté completamente cargada
    const checkAndFix = function() {
        // Verificar si la interfaz está lista
        const contactsContainer = document.getElementById('contacts-container');
        const messageContent = document.getElementById('message-content');
        
        if (!contactsContainer || !messageContent) {
            console.log('Interfaz no lista, reintentando en 1 segundo...');
            setTimeout(checkAndFix, 1000);
            return;
        }
        
        console.log('Interfaz detectada, aplicando correcciones...');
        
        // 1. Corregir variable global selectedContact
        if (typeof window.selectedContact === 'undefined' || window.selectedContact === null) {
            console.log('Variable selectedContact no está definida, estableciendo objeto vacío');
            window.selectedContact = {};
        }
        
        // 2. Buscar un contacto activo si no hay contacto seleccionado
        if (!window.selectedContact.id) {
            console.log('No hay contacto seleccionado actualmente, buscando contacto activo...');
            const activeContact = document.querySelector('.contact-item.active');
            
            if (activeContact) {
                console.log('Contacto activo encontrado, reconstruyendo selección...');
                const contactId = activeContact.getAttribute('data-id');
                const contactType = activeContact.getAttribute('data-type');
                
                // Si tenemos datos de API, buscar el contacto
                if (window.apiData) {
                    let contactData = null;
                    
                    if (contactType === 'cliente' && window.apiData.clientes) {
                        contactData = window.apiData.clientes[contactId];
                    } else if (contactType === 'prospecto' && window.apiData.prospectos) {
                        contactData = window.apiData.prospectos[contactId];
                    }
                    
                    if (contactData) {
                        window.selectedContact = {
                            id: contactId,
                            tipo: contactType,
                            nombre: (contactType === 'cliente') 
                                ? (contactData.nombre || contactData.contacto || 'Sin nombre') 
                                : (contactData.nombre || 'Sin nombre'),
                            email: contactData.email || '',
                            telefono: contactData.telefono || '',
                            data: contactData
                        };
                        
                        console.log('Contacto reconstruido y asignado a window.selectedContact:', window.selectedContact);
                        
                        // Actualizar interfaz con el contacto seleccionado
                        const nombreElement = document.getElementById('contact-name');
                        const infoElement = document.getElementById('contact-info');
                        const typeElement = document.getElementById('contact-type');
                        
                        if (nombreElement) nombreElement.textContent = window.selectedContact.nombre;
                        
                        if (infoElement) {
                            let infoHTML = '';
                            
                            if (window.selectedContact.email) {
                                infoHTML += `<div><i class="fas fa-envelope me-2"></i>${window.selectedContact.email}</div>`;
                            }
                            
                            if (window.selectedContact.telefono) {
                                infoHTML += `<div><i class="fas fa-phone me-2"></i>${window.selectedContact.telefono}</div>`;
                            }
                            
                            infoElement.innerHTML = infoHTML || 'Sin información de contacto';
                        }
                        
                        if (typeElement) {
                            const tipoDisplay = window.selectedContact.tipo === 'cliente' ? 'Cliente' : 'Prospecto';
                            typeElement.textContent = tipoDisplay;
                            typeElement.className = window.selectedContact.tipo === 'cliente' 
                                ? 'badge bg-primary' 
                                : 'badge bg-secondary';
                        }
                    } else {
                        console.error('No se encontraron datos para el contacto activo:', contactId, contactType);
                    }
                } else {
                    console.error('window.apiData no está disponible');
                }
            } else {
                console.log('No hay contacto activo, intentando seleccionar el primer contacto...');
                const firstContact = document.querySelector('.contact-item');
                if (firstContact) {
                    console.log('Primer contacto encontrado, seleccionando...');
                    // Simular clic en el primer contacto
                    firstContact.click();
                } else {
                    console.error('No hay contactos disponibles en la lista');
                }
            }
        } else {
            console.log('Contacto ya seleccionado:', window.selectedContact);
        }
        
        // 3. Monitorear el botón de envío para verificar si hay contacto seleccionado
        const sendButton = document.getElementById('btn-send');
        if (sendButton) {
            console.log('Botón de envío encontrado, reemplazando evento original...');
            
            // Respaldar función original de envío
            if (!window._originalSendMessage && window.sendMessage) {
                window._originalSendMessage = window.sendMessage;
            }
            
            // Reemplazar función de envío
            window.sendMessage = function() {
                console.log('Verificando contacto antes de enviar mensaje...');
                
                // Verificar si tenemos un contacto seleccionado
                if (!window.selectedContact || !window.selectedContact.id) {
                    console.error('No hay contacto seleccionado, intentando reparar...');
                    
                    // Intentar reparar la selección
                    const activeContact = document.querySelector('.contact-item.active');
                    if (activeContact) {
                        const contactId = activeContact.getAttribute('data-id');
                        const contactType = activeContact.getAttribute('data-type');
                        
                        console.log('Encontrado contacto activo, intentando seleccionar:', contactId, contactType);
                        
                        if (window.selectContact && typeof window.selectContact === 'function') {
                            window.selectContact(contactId, contactType);
                            console.log('Reintentando envío en 500ms...');
                            
                            // Reintento después de un breve retraso
                            setTimeout(() => {
                                if (window._originalSendMessage && typeof window._originalSendMessage === 'function') {
                                    window._originalSendMessage();
                                }
                            }, 500);
                            return;
                        }
                    }
                    
                    // Si no podemos reparar, mostrar mensaje de error
                    Swal.fire({
                        title: 'Sin destinatario',
                        html: 'Debes seleccionar un contacto para enviar el mensaje.<br><br>' +
                              '<b>Nota:</b> Si ya seleccionaste un contacto, intenta hacer clic nuevamente en el contacto para solucionar el problema.',
                        icon: 'warning',
                        confirmButtonColor: '#E63946'
                    });
                    return;
                }
                
                // Si hay contacto seleccionado, proceder con la función original
                console.log('Contacto verificado, procediendo con el envío:', window.selectedContact);
                if (window._originalSendMessage && typeof window._originalSendMessage === 'function') {
                    window._originalSendMessage();
                } else {
                    console.error('No se pudo encontrar la función original de envío');
                }
            };
            
            console.log('Función de envío reemplazada con verificación adicional');
        } else {
            console.error('No se encontró el botón de envío');
        }
        
        console.log('==== CORRECCIONES APLICADAS CORRECTAMENTE (MODO SILENCIOSO) ====');
    };
    
    // Iniciar verificación
    checkAndFix();
})(); 
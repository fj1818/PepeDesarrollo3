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
            content: 'Hola [nombre], soy [remitente] de URUETA CRM. Me gustaría hablar sobre nuestros servicios. ¿Tienes unos minutos?'
        },
        {
            id: 'w2',
            title: 'Seguimiento',
            content: 'Hola [nombre], espero que estés bien. Te escribo para hacer seguimiento sobre nuestros servicios. ¿Has tenido tiempo de revisar la información que te envié?'
        },
        {
            id: 'w3',
            title: 'Invitación a cita',
            content: 'Hola [nombre], me gustaría invitarte a una reunión para discutir cómo podemos ayudarte. ¿Te parece bien el [fecha] a las [hora]?'
        }
    ],
    email: [
        {
            id: 'e1',
            title: 'Presentación de servicios',
            content: 'Estimado/a [nombre],\n\nEspero que este correo te encuentre bien. Me pongo en contacto contigo desde URUETA CRM para presentarte nuestros servicios de asesoría legal y contable.\n\nNuestro equipo especializado puede ayudarte con:\n- Asistencia fiscal y contable\n- Asesoramiento legal empresarial\n- Trámites administrativos\n\nQuedo a tu disposición para cualquier consulta.\n\nSaludos cordiales,\n[remitente]\nURUETA CRM'
        },
        {
            id: 'e2',
            title: 'Recordatorio de cita',
            content: 'Estimado/a [nombre],\n\nTe escribo para confirmar nuestra cita programada para el [fecha] a las [hora].\n\nPor favor, confirma tu asistencia respondiendo a este correo.\n\nSaludos cordiales,\n[remitente]\nURUETA CRM'
        },
        {
            id: 'e3',
            title: 'Envío de documentación',
            content: 'Estimado/a [nombre],\n\nAdjunto encontrarás la documentación solicitada relacionada con [tema].\n\nSi necesitas cualquier aclaración o tienes alguna pregunta, no dudes en contactarme.\n\nSaludos cordiales,\n[remitente]\nURUETA CRM'
        }
    ]
};

// Inicializar módulo
document.addEventListener('DOMContentLoaded', initComunicaciones);

// Reiniciar si el script ya estaba cargado
document.addEventListener('script-reloaded', function(e) {
    if (e.detail.script === 'js/comunicaciones.js') {
        initComunicaciones();
    }
});

/**
 * Inicializar el módulo de comunicaciones
 */
function initComunicaciones() {
    // Verificar que estamos en la sección correcta
    document.addEventListener('load-content', function(e) {
        if (e.detail.section === 'comunicaciones') {
            loadComunicacionesUI();
        }
    });
    
    // Cargar la UI si ya estamos en la sección de comunicaciones
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle && headerTitle.textContent === 'Comunicaciones') {
        loadComunicacionesUI();
    }
}

/**
 * Cargar la interfaz de usuario para comunicaciones
 */
function loadComunicacionesUI() {
    const contentSection = document.querySelector('.content-section');
    if (!contentSection) return;
    
    // Verificar que tenemos datos de contactos
    if (!window.apiData.prospectos && !window.apiData.clientes) {
        // Cargar datos si no están disponibles
        window.apiService.obtenerTodosLosDatos().then(loadComunicacionesContent);
    } else {
        loadComunicacionesContent();
    }
}

/**
 * Cargar el contenido principal de comunicaciones
 */
function loadComunicacionesContent() {
    const contentSection = document.querySelector('.content-section');
    if (!contentSection) return;
    
    // Crear la estructura básica
    contentSection.innerHTML = `
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
                        <button class="btn btn-sm btn-light" id="btn-filter-todos">Todos</button>
                        <button class="btn btn-sm btn-light" id="btn-filter-prospectos">Prospectos</button>
                        <button class="btn btn-sm btn-light" id="btn-filter-clientes">Clientes</button>
                    </div>
                </div>
                <div class="list-search">
                    <input type="text" placeholder="Buscar contacto..." id="contact-search">
                </div>
                <div class="contacts-items" id="contacts-container">
                    <!-- Contactos se cargarán aquí -->
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
                    <div class="composer-field">
                        <label>Destinatario:</label>
                        <input type="text" id="message-recipient" placeholder="Selecciona un contacto" readonly>
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
    
    // Cargar contactos
    loadContacts();
    
    // Inicializar eventos
    setupCommunicationEvents();
    
    // Por defecto, seleccionar WhatsApp como tipo de mensaje
    document.getElementById('btn-type-whatsapp').click();
}

/**
 * Cargar la lista de contactos (prospectos y clientes)
 */
function loadContacts() {
    const contactsContainer = document.getElementById('contacts-container');
    if (!contactsContainer) return;
    
    // Combinar prospectos y clientes
    let contacts = [];
    
    // Agregar prospectos
    if (window.apiData.prospectos) {
        const prospectos = Object.values(window.apiData.prospectos);
        contacts = contacts.concat(
            prospectos.map(p => ({
                id: p.id,
                nombre: p.nombre,
                email: p.email,
                telefono: p.telefono,
                tipo: 'prospecto',
                fecha: p.fecha
            }))
        );
    }
    
    // Agregar clientes
    if (window.apiData.clientes) {
        const clientes = Object.values(window.apiData.clientes);
        contacts = contacts.concat(
            clientes.map(c => ({
                id: c.id,
                nombre: c.nombre || c.contacto,
                email: c.email,
                telefono: c.telefono,
                tipo: 'cliente',
                fecha: c.fechaInicio
            }))
        );
    }
    
    // Ordenar por nombre
    contacts.sort((a, b) => a.nombre.localeCompare(b.nombre));
    
    // Generar HTML
    let html = '';
    
    if (contacts.length === 0) {
        html = '<div class="p-3 text-center text-muted">No hay contactos disponibles</div>';
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
                        <button class="action-whatsapp" title="WhatsApp" data-phone="${contact.telefono}">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                        <button class="action-email" title="Email" data-email="${contact.email}">
                            <i class="fas fa-envelope"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }
    
    contactsContainer.innerHTML = html;
    
    // Guardar la lista de contactos para filtrado
    window.allContacts = contacts;
}

/**
 * Configurar eventos para la interfaz de comunicaciones
 */
function setupCommunicationEvents() {
    // Filtros de contactos
    document.getElementById('btn-filter-todos').addEventListener('click', () => filterContacts('todos'));
    document.getElementById('btn-filter-prospectos').addEventListener('click', () => filterContacts('prospecto'));
    document.getElementById('btn-filter-clientes').addEventListener('click', () => filterContacts('cliente'));
    
    // Búsqueda de contactos
    document.getElementById('contact-search').addEventListener('input', handleContactSearch);
    
    // Tipo de mensaje
    document.getElementById('btn-type-whatsapp').addEventListener('click', () => setMessageType('whatsapp'));
    document.getElementById('btn-type-email').addEventListener('click', () => setMessageType('email'));
    
    // Botones de acción
    document.getElementById('btn-clear').addEventListener('click', clearMessage);
    document.getElementById('btn-send').addEventListener('click', sendMessage);
    
    // Texto del mensaje
    document.getElementById('message-content').addEventListener('input', updateMessagePreview);
    
    // Clic en contactos
    setupContactClickEvents();
    
    // Establecer tipo de mensaje por defecto
    setMessageType('whatsapp');
}

/**
 * Configurar eventos de clic para contactos
 */
function setupContactClickEvents() {
    // Clic en un contacto
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const contactId = this.getAttribute('data-id');
            const contactType = this.getAttribute('data-type');
            selectContact(contactId, contactType);
        });
    });
    
    // Botones de WhatsApp directo
    const whatsappButtons = document.querySelectorAll('.action-whatsapp');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const phone = this.getAttribute('data-phone');
            if (phone) {
                const parent = this.closest('.contact-item');
                const contactId = parent.getAttribute('data-id');
                const contactType = parent.getAttribute('data-type');
                
                // Seleccionar contacto y establecer WhatsApp como tipo de mensaje
                selectContact(contactId, contactType);
                setMessageType('whatsapp');
            } else {
                Swal.fire({
                    title: 'Sin teléfono',
                    text: 'Este contacto no tiene un número de teléfono registrado.',
                    icon: 'warning',
                    confirmButtonColor: '#E63946'
                });
            }
        });
    });
    
    // Botones de Email directo
    const emailButtons = document.querySelectorAll('.action-email');
    emailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const email = this.getAttribute('data-email');
            if (email) {
                const parent = this.closest('.contact-item');
                const contactId = parent.getAttribute('data-id');
                const contactType = parent.getAttribute('data-type');
                
                // Seleccionar contacto y establecer Email como tipo de mensaje
                selectContact(contactId, contactType);
                setMessageType('email');
            } else {
                Swal.fire({
                    title: 'Sin email',
                    text: 'Este contacto no tiene una dirección de correo electrónico registrada.',
                    icon: 'warning',
                    confirmButtonColor: '#E63946'
                });
            }
        });
    });
}

/**
 * Seleccionar un contacto para enviar mensaje
 */
function selectContact(contactId, contactType) {
    // Actualizar estado visual
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => item.classList.remove('active'));
    
    const selectedItem = document.querySelector(`.contact-item[data-id="${contactId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
    
    // Buscar datos del contacto
    let contact = null;
    
    if (contactType === 'prospecto' && window.apiData.prospectos) {
        contact = window.apiData.prospectos[contactId];
    } else if (contactType === 'cliente' && window.apiData.clientes) {
        contact = window.apiData.clientes[contactId];
    }
    
    if (contact) {
        // Guardar contacto seleccionado
        selectedContact = {
            id: contact.id,
            nombre: contact.nombre || contact.contacto,
            email: contact.email,
            telefono: contact.telefono,
            tipo: contactType
        };
        
        // Actualizar campo de destinatario
        const recipientField = document.getElementById('message-recipient');
        if (recipientField) {
            recipientField.value = selectedContact.nombre;
        }
        
        // Actualizar preview
        updateMessagePreview();
    }
}

/**
 * Filtrar contactos por tipo
 */
function filterContacts(type) {
    const contactItems = document.querySelectorAll('.contact-item');
    
    // Actualizar estado de los botones
    document.getElementById('btn-filter-todos').classList.remove('btn-primary');
    document.getElementById('btn-filter-todos').classList.add('btn-light');
    document.getElementById('btn-filter-prospectos').classList.remove('btn-primary');
    document.getElementById('btn-filter-prospectos').classList.add('btn-light');
    document.getElementById('btn-filter-clientes').classList.remove('btn-primary');
    document.getElementById('btn-filter-clientes').classList.add('btn-light');
    
    // Marcar botón activo
    if (type === 'todos') {
        document.getElementById('btn-filter-todos').classList.remove('btn-light');
        document.getElementById('btn-filter-todos').classList.add('btn-primary');
    } else if (type === 'prospecto') {
        document.getElementById('btn-filter-prospectos').classList.remove('btn-light');
        document.getElementById('btn-filter-prospectos').classList.add('btn-primary');
    } else if (type === 'cliente') {
        document.getElementById('btn-filter-clientes').classList.remove('btn-light');
        document.getElementById('btn-filter-clientes').classList.add('btn-primary');
    }
    
    // Mostrar los contactos según el filtro
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
 * Manejar la búsqueda de contactos
 */
function handleContactSearch() {
    const searchInput = document.getElementById('contact-search');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const contactName = item.querySelector('.contact-name').textContent.toLowerCase();
        
        if (contactName.includes(searchTerm) || searchTerm === '') {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
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
    
    // Actualizar vista previa
    updateMessagePreview();
}

/**
 * Aplicar una plantilla de mensaje
 */
function applyTemplate(templateId) {
    const messageContent = document.getElementById('message-content');
    const type = window.currentMessageType;
    
    const templates = messageTemplates[type];
    const template = templates.find(t => t.id === templateId);
    
    if (template && messageContent) {
        let content = template.content;
        
        // Reemplazar variables si hay un contacto seleccionado
        if (selectedContact) {
            content = content.replace(/\[nombre\]/g, selectedContact.nombre);
        }
        
        // Reemplazar remitente por defecto
        content = content.replace(/\[remitente\]/g, 'Administrador');
        
        // Establecer contenido y actualizar vista previa
        messageContent.value = content;
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
function sendMessage() {
    // Verificar que haya un contacto seleccionado
    if (!selectedContact) {
        Swal.fire({
            title: 'Selecciona un contacto',
            text: 'Debes seleccionar un contacto antes de enviar un mensaje.',
            icon: 'warning',
            confirmButtonColor: '#E63946'
        });
        return;
    }
    
    const messageContent = document.getElementById('message-content').value;
    
    // Verificar que haya contenido
    if (!messageContent) {
        Swal.fire({
            title: 'Mensaje vacío',
            text: 'Debes escribir un mensaje antes de enviarlo.',
            icon: 'warning',
            confirmButtonColor: '#E63946'
        });
        return;
    }
    
    const type = window.currentMessageType;
    
    if (type === 'whatsapp') {
        if (!selectedContact.telefono) {
            Swal.fire({
                title: 'Sin teléfono',
                text: 'Este contacto no tiene un número de teléfono registrado.',
                icon: 'warning',
                confirmButtonColor: '#E63946'
            });
            return;
        }
        
        // Enviar mensaje por WhatsApp
        window.apiService.sendWhatsAppMessage(selectedContact.telefono, messageContent);
        
        // Mostrar confirmación
        Swal.fire({
            title: 'Mensaje enviado',
            text: `Se ha enviado un mensaje por WhatsApp a ${selectedContact.nombre}.`,
            icon: 'success',
            confirmButtonColor: '#E63946'
        });
    } else {
        if (!selectedContact.email) {
            Swal.fire({
                title: 'Sin email',
                text: 'Este contacto no tiene una dirección de correo electrónico registrada.',
                icon: 'warning',
                confirmButtonColor: '#E63946'
            });
            return;
        }
        
        // Enviar mensaje por email
        window.apiService.sendEmail(
            selectedContact.email,
            'Mensaje importante - URUETA CRM',
            messageContent
        );
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
/**
 * Expedientes - Gestión de expedientes
 */

// Inicializar módulo
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar si estamos en la sección de expedientes
    const currentSection = document.querySelector('.nav-item.active');
    if (currentSection && currentSection.getAttribute('data-section') === 'expedientes') {
        initExpedientes();
    }
});

// Reiniciar si el script ya estaba cargado
document.addEventListener('script-reloaded', function(e) {
    if (e.detail.script === 'js/expedientes.js') {
        initExpedientes();
    }
});

/**
 * Inicializar sección de expedientes
 */
async function initExpedientes() {
    try {
        // Mostrar indicador de carga
        showLoading(true);
        
        // Verificar si tenemos datos
        if (!window.apiData || !window.apiData.expedientes) {
            // Si no hay datos, intentar cargarlos
            await window.apiService.obtenerTodosLosDatos();
        }
        
        // Cargar interfaz de expedientes
        cargarInterfazExpedientes();
        
        // Ocultar indicador de carga
        showLoading(false);
    } catch (error) {
        console.error('Error al inicializar expedientes:', error);
        showLoading(false);
        showMessage('Error al cargar expedientes. Por favor, intente nuevamente.', 'error');
    }
}

/**
 * Cargar la interfaz de expedientes
 */
function cargarInterfazExpedientes() {
    const contentElement = document.getElementById('content');
    if (!contentElement) return;
    
    // Obtener expedientes
    const expedientes = window.apiData.expedientes || {};
    const expedientesArray = Object.values(expedientes);
    
    // Crear el HTML para la sección
    contentElement.innerHTML = `
        <div class="section-header mb-4">
            <h1>Expedientes</h1>
            <p>Gestión de expedientes de clientes</p>
        </div>
        
        <div class="row mb-4">
            <div class="col-12">
                <div class="crm-card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title">
                            <i class="fas fa-folder-open me-2"></i> Lista de Expedientes
                        </h5>
                        <button class="btn btn-sm btn-primary" id="add-expediente-btn">
                            <i class="fas fa-plus me-1"></i> Nuevo Expediente
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Cliente</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="expedientes-table-body">
                                    ${
                                        expedientesArray.length > 0 ?
                                        expedientesArray.map(expediente => {
                                            const cliente = window.apiData.clientes[expediente.cliente] || { nombre: 'No especificado' };
                                            return `
                                                <tr>
                                                    <td>${expediente.titulo}</td>
                                                    <td>${cliente.nombre}</td>
                                                    <td>${expediente.fechaApertura}</td>
                                                    <td>
                                                        <span class="badge ${expediente.estado === 'Cerrado' ? 'bg-secondary' : 'bg-success'}">
                                                            ${expediente.estado}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button class="btn btn-sm btn-outline-primary view-btn" data-id="${expediente.id}">
                                                            <i class="fas fa-eye"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-warning edit-btn" data-id="${expediente.id}">
                                                            <i class="fas fa-edit"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${expediente.id}">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            `;
                                        }).join('') :
                                        '<tr><td colspan="5" class="text-center">No hay expedientes registrados</td></tr>'
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Configurar eventos
    setupExpedientesEventos();
}

/**
 * Configurar eventos de la sección de expedientes
 */
function setupExpedientesEventos() {
    // Botón para agregar nuevo expediente
    const addExpedienteBtn = document.getElementById('add-expediente-btn');
    if (addExpedienteBtn) {
        addExpedienteBtn.addEventListener('click', mostrarFormularioExpediente);
    }
    
    // Botones para ver detalles
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            mostrarDetallesExpediente(id);
        });
    });
    
    // Botones para editar
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            mostrarFormularioExpediente(id);
        });
    });
    
    // Botones para eliminar
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            eliminarExpediente(id);
        });
    });
}

/**
 * Mostrar formulario para agregar/editar expediente
 */
function mostrarFormularioExpediente(expedienteId = null) {
    // Obtener datos del expediente si estamos editando
    let expediente = {
        titulo: '',
        cliente: '',
        fechaApertura: new Date().toISOString().split('T')[0],
        estado: 'Abierto',
        notas: ''
    };
    
    if (expedienteId && window.apiData.expedientes[expedienteId]) {
        expediente = window.apiData.expedientes[expedienteId];
    }
    
    // Obtener lista de clientes para el selector
    const clientes = window.apiData.clientes || {};
    const clientesOptions = Object.values(clientes)
        .map(cliente => `<option value="${cliente.id}" ${expediente.cliente === cliente.id ? 'selected' : ''}>${cliente.nombre}</option>`)
        .join('');
    
    Swal.fire({
        title: expedienteId ? 'Editar Expediente' : 'Nuevo Expediente',
        html: `
            <form id="expediente-form" class="text-start">
                <div class="mb-3">
                    <label for="titulo" class="form-label">Título del expediente</label>
                    <input type="text" class="form-control" id="titulo" value="${expediente.titulo}" required>
                </div>
                <div class="mb-3">
                    <label for="cliente" class="form-label">Cliente</label>
                    <select class="form-select" id="cliente" required>
                        <option value="">-- Seleccionar cliente --</option>
                        ${clientesOptions}
                    </select>
                </div>
                <div class="mb-3">
                    <label for="fechaApertura" class="form-label">Fecha de apertura</label>
                    <input type="date" class="form-control" id="fechaApertura" value="${expediente.fechaApertura}" required>
                </div>
                <div class="mb-3">
                    <label for="estado" class="form-label">Estado</label>
                    <select class="form-select" id="estado">
                        <option value="Abierto" ${expediente.estado === 'Abierto' ? 'selected' : ''}>Abierto</option>
                        <option value="En proceso" ${expediente.estado === 'En proceso' ? 'selected' : ''}>En proceso</option>
                        <option value="Cerrado" ${expediente.estado === 'Cerrado' ? 'selected' : ''}>Cerrado</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="notas" class="form-label">Notas</label>
                    <textarea class="form-control" id="notas" rows="3">${expediente.notas || ''}</textarea>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#E63946',
        cancelButtonColor: '#6c757d',
        preConfirm: () => {
            const form = document.getElementById('expediente-form');
            if (!form.checkValidity()) {
                form.reportValidity();
                return false;
            }
            
            return {
                titulo: document.getElementById('titulo').value,
                cliente: document.getElementById('cliente').value,
                fechaApertura: document.getElementById('fechaApertura').value,
                estado: document.getElementById('estado').value,
                notas: document.getElementById('notas').value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            guardarExpediente(expedienteId, result.value);
        }
    });
}

/**
 * Guardar expediente (nuevo o editado)
 */
function guardarExpediente(id, datos) {
    try {
        // Obtener cliente seleccionado
        const cliente = window.apiData.clientes[datos.cliente];
        if (!cliente && datos.cliente) {
            showMessage('Cliente no encontrado', 'error');
            return;
        }
        
        // Generar número de expediente si es nuevo
        const numeroExpediente = id ? 
            (window.apiData.expedientes[id].numeroExpediente || `EXP-${Date.now().toString().slice(-6)}`) : 
            `EXP-${Date.now().toString().slice(-6)}`;
        
        // Actualizar el cliente con el número de expediente
        if (cliente) {
            window.apiData.clientes[datos.cliente].numeroExpediente = numeroExpediente;
        }
        
        // Actualizar o crear expediente
        if (id) {
            // Actualizar expediente existente
            window.apiData.expedientes[id] = {
                ...window.apiData.expedientes[id],
                ...datos,
                finalizado: datos.estado === 'Cerrado',
                fechaCierre: datos.estado === 'Cerrado' ? new Date().toISOString().split('T')[0] : '',
                numeroExpediente: numeroExpediente
            };
            
            showMessage('Expediente actualizado correctamente', 'success');
        } else {
            // Crear nuevo expediente
            const nuevoId = 'e' + Date.now();
            window.apiData.expedientes[nuevoId] = {
                id: nuevoId,
                ...datos,
                finalizado: datos.estado === 'Cerrado',
                fechaCierre: datos.estado === 'Cerrado' ? new Date().toISOString().split('T')[0] : '',
                numeroExpediente: numeroExpediente,
                responsable: 'Administrador'
            };
            
            showMessage('Expediente creado correctamente', 'success');
        }
        
        // Recargar la interfaz
        cargarInterfazExpedientes();
        
    } catch (error) {
        console.error('Error al guardar expediente:', error);
        showMessage('Error al guardar los datos', 'error');
    }
}

/**
 * Mostrar detalles de un expediente
 */
function mostrarDetallesExpediente(id) {
    const expediente = window.apiData.expedientes[id];
    if (!expediente) return;
    
    // Obtener datos del cliente asociado
    const cliente = window.apiData.clientes[expediente.cliente] || { nombre: 'No especificado' };
    
    Swal.fire({
        title: expediente.titulo,
        html: `
            <div class="text-start">
                <p><strong>Cliente:</strong> ${cliente.nombre}</p>
                <p><strong>Número de expediente:</strong> ${expediente.numeroExpediente || 'No asignado'}</p>
                <p><strong>Fecha de apertura:</strong> ${expediente.fechaApertura}</p>
                <p><strong>Estado:</strong> ${expediente.estado}</p>
                ${expediente.fechaCierre ? `<p><strong>Fecha de cierre:</strong> ${expediente.fechaCierre}</p>` : ''}
                <p><strong>Responsable:</strong> ${expediente.responsable || 'Administrador'}</p>
                <p><strong>Notas:</strong> ${expediente.notas || 'No hay notas'}</p>
            </div>
        `,
        confirmButtonText: 'Editar',
        confirmButtonColor: '#E63946',
        showCancelButton: true,
        cancelButtonText: 'Cerrar'
    }).then((result) => {
        if (result.isConfirmed) {
            mostrarFormularioExpediente(id);
        }
    });
}

/**
 * Eliminar un expediente
 */
function eliminarExpediente(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Eliminar expediente
            const expediente = window.apiData.expedientes[id];
            if (expediente && expediente.cliente) {
                // Si el expediente está asociado a un cliente, eliminar la referencia
                if (window.apiData.clientes[expediente.cliente]) {
                    window.apiData.clientes[expediente.cliente].numeroExpediente = '';
                }
            }
            
            delete window.apiData.expedientes[id];
            
            // Actualizar interfaz
            cargarInterfazExpedientes();
            
            showMessage('Expediente eliminado correctamente', 'success');
        }
    });
}

// Transformar datos del servidor a formato local
function transformarExpedientes(datosServidor) {
    const resultado = {};
    
    // Convertir cada objeto del servidor al formato esperado
    Object.entries(datosServidor).forEach(([id, expediente]) => {
        const finalizado = expediente.finalizado === true || expediente.finalizado === "true";
        
        resultado[id] = {
            id: id,
            numero: expediente.numero || '',
            cliente: expediente.cliente || '',
            tipo: expediente.tipo || 'General',
            fechaApertura: expediente['fecha-apertura'] || '',
            fechaCierre: expediente['fecha-cierre'] || '',
            estado: finalizado ? 'Cerrado' : 'Abierto',
            finalizado: finalizado,
            notas: expediente.notas || ''
        };
    });
    
    return resultado;
} 
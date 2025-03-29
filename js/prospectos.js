/**
 * Prospectos - Gestión de prospectos
 */

// Inicializar array para prospectos filtrados
let prospectosFilteredData = [];

/**
 * Variables para el manejo de la paginación
 */
let prospectosPorPagina = 10;
let paginaActual = 1;
let ordenColumnaCliente = 'original'; // 'clientesPrimero', 'noClientesPrimero', 'original'

/**
 * Inicializar sección de prospectos
 */
async function initProspectos() {
    try {
        // Mostrar indicador de carga
        showLoading(true);
        
        // Verificar si tenemos datos
        if (!window.apiData || !window.apiData.prospectos) {
            // Si no hay datos, intentar cargarlos
            await window.apiService.obtenerTodosLosDatos();
        }
        
        // Cargar interfaz de prospectos
        cargarInterfazProspectos();
        
        // Ocultar indicador de carga
        showLoading(false);
    } catch (error) {
        console.error('Error al inicializar prospectos:', error);
        showLoading(false);
        showMessage('Error al cargar prospectos. Por favor, intente nuevamente.', 'error');
    }
}

// Exportar la función al ámbito global de forma explícita
window.initProspectos = initProspectos;

// Inicializar módulo
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar si estamos en la sección de prospectos
    const currentSection = document.querySelector('.nav-item.active');
    if (currentSection && currentSection.getAttribute('data-section') === 'prospectos') {
        initProspectos();
    }
});

// Reiniciar si el script ya estaba cargado
document.addEventListener('script-reloaded', function(e) {
    if (e.detail.script === 'js/prospectos.js') {
        initProspectos();
    }
});

// Variables para paginación
let prospectosArrayFiltrado = [];
let totalPaginas = 1;

/**
 * Función para cargar la interfaz de los prospectos
 */
function cargarInterfazProspectos() {
    // Crear tabla de prospectos
    const contenido = document.getElementById('content-prospectos');
    if (!contenido) return;
    
    // Limpiar contenido
    contenido.innerHTML = `
        <div class="section-header mb-4">
            <h1>Prospectos</h1>
            <p>Gestión de prospectos y seguimiento de actividades</p>
        </div>
        
        <div class="row mb-4">
            <div class="col-12">
                <div class="crm-card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title">
                            <i class="fas fa-user-plus me-2"></i> Lista de Prospectos
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <div class="input-group">
                                    <input type="text" id="searchProspectos" class="form-control" placeholder="Buscar prospectos...">
                                    <button class="btn btn-primary" type="button" id="btnSearchProspectos">
                                        <i class="fas fa-search fa-sm"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-6 text-right">
                                <div class="d-flex justify-content-end align-items-center">
                                    <label for="registrosPorPagina" class="me-2 mb-0">Mostrar</label>
                                    <select id="registrosPorPagina" class="form-control form-control-sm" style="width: auto;">
                                        <option value="5">5</option>
                                        <option value="10" selected>10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                    <label class="ms-2 mb-0">registros</label>
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th>Contactado</th>
                                        <th>Interesado</th>
                                        <th id="thClienteStatus" style="cursor: pointer;">Cliente <i class="fas fa-sort"></i></th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody-prospectos">
                                    <!-- Aquí se cargarán los prospectos -->
                                </tbody>
                            </table>
                            <div id="paginacion-prospectos" class="d-flex justify-content-between align-items-center">
                                <div class="dataTables_info" id="info-registros">
                                    Mostrando 0 a 0 de 0 registros
                                </div>
                                <div class="dataTables_paginate paging_simple_numbers">
                                    <ul class="pagination" id="controles-paginacion">
                                        <!-- Aquí se cargarán los controles de paginación -->
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Eventos
    setupProspectosEventos();
    
    // Cargar prospectos iniciales
    actualizarTablaProspectos();
}

/**
 * Obtener clase para badge según estado
 */
function getEstadoBadgeClass(estado) {
    switch(estado) {
        case 'Nuevo':
            return 'bg-primary';
        case 'En seguimiento':
            return 'bg-info';
        case 'Interesado':
            return 'bg-warning';
        case 'Calificado':
            return 'bg-success';
        case 'Convertido':
            return 'bg-dark';
        case 'Descartado':
            return 'bg-secondary';
        default:
            return 'bg-light';
    }
}

/**
 * Configurar eventos de la sección de prospectos
 */
function setupProspectosEventos() {
    // Evento de búsqueda de prospectos
    const searchInput = document.getElementById('searchProspectos');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            paginaActual = 1; // Reiniciar a la primera página al buscar
            actualizarTablaProspectos();
        });
    }
    
    // Botón de búsqueda (por si se quiere mantener)
    const btnSearch = document.getElementById('btnSearchProspectos');
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            actualizarTablaProspectos();
        });
    }
    
    // Evento para el cambio de registros por página
    const selectRegistros = document.getElementById('registrosPorPagina');
    if (selectRegistros) {
        selectRegistros.addEventListener('change', () => {
            prospectosPorPagina = parseInt(selectRegistros.value);
            paginaActual = 1; // Reiniciar a la primera página
            actualizarTablaProspectos();
        });
    }
    
    // Eventos para los botones de paginación
    document.addEventListener('click', (e) => {
        if (e.target.closest('#controles-paginacion')) {
            e.preventDefault();
            
            const pageLink = e.target.closest('[data-page]');
            if (!pageLink) return;
            
            const pageValue = pageLink.dataset.page;
            const totalProspectos = Object.keys(window.apiData?.prospectos || {}).length;
            const totalPaginas = Math.ceil(totalProspectos / prospectosPorPagina);
            
            if (pageValue === 'prev') {
                if (paginaActual > 1) {
                    paginaActual--;
                }
            } else if (pageValue === 'next') {
                if (paginaActual < totalPaginas) {
                    paginaActual++;
                }
            } else {
                paginaActual = parseInt(pageValue);
            }
            
            actualizarTablaProspectos();
        }
    });
    
    // Evento para ordenar por la columna de cliente
    const thClienteStatus = document.getElementById('thClienteStatus');
    if (thClienteStatus) {
        thClienteStatus.addEventListener('click', () => {
            // Cambiar el orden en ciclo: original -> clientesPrimero -> noClientesPrimero -> original
            if (ordenColumnaCliente === 'original') {
                ordenColumnaCliente = 'clientesPrimero';
                thClienteStatus.innerHTML = 'Cliente <i class="fas fa-sort-down"></i>';
            } else if (ordenColumnaCliente === 'clientesPrimero') {
                ordenColumnaCliente = 'noClientesPrimero';
                thClienteStatus.innerHTML = 'Cliente <i class="fas fa-sort-up"></i>';
            } else {
                ordenColumnaCliente = 'original';
                thClienteStatus.innerHTML = 'Cliente <i class="fas fa-sort"></i>';
            }
            
            actualizarTablaProspectos();
        });
    }
    
    // Eventos para botones de edición y conversión
    document.addEventListener('click', (e) => {
        // Botón editar
        if (e.target.closest('.btn-edit-prospecto')) {
            const id = e.target.closest('.btn-edit-prospecto').dataset.id;
            mostrarFormularioProspecto(id);
        }
        
        // Botón convertir
        if (e.target.closest('.btn-convert-prospecto')) {
            const id = e.target.closest('.btn-convert-prospecto').dataset.id;
            mostrarFormularioConversion(id);
        }
    });
}

/**
 * Mostrar formulario para editar/crear prospecto
 */
function mostrarFormularioProspecto(prospectoId = null) {
    let prospecto = {};
    let titulo = 'Nuevo Prospecto';
    
    if (prospectoId && window.apiData.prospectos[prospectoId]) {
        prospecto = window.apiData.prospectos[prospectoId];
        titulo = 'Editar Prospecto';
    }

    // Formatear fechas para su visualización
    let fechaFormateada = '';
    if (prospecto['fecha-prospecto']) {
        try {
            const fecha = new Date(prospecto['fecha-prospecto']);
            if (!isNaN(fecha)) {
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1);
                const año = fecha.getFullYear();
                const horas = String(fecha.getHours()).padStart(2, '0');
                const minutos = String(fecha.getMinutes()).padStart(2, '0');
                const segundos = String(fecha.getSeconds()).padStart(2, '0');
                
                fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
            } else if (prospecto['fecha-prospecto'].includes('/')) {
                // Si ya está en formato DD/M/YYYY HH:MM:SS, usarlo directamente
                fechaFormateada = prospecto['fecha-prospecto'];
            }
        } catch (e) {
            console.warn('Error al formatear fecha de prospecto:', e);
            // Si hay error, intentar usar el valor original
            fechaFormateada = prospecto['fecha-prospecto'] || '';
        }
    }
    
    // Crear un ID oculto si es un nuevo prospecto
    const idProspecto = prospectoId || '';
    
    Swal.fire({
        title: titulo,
        width: '700px',
        html: `
            <form id="prospecto-form" class="form-prospecto text-start" style="max-height: 70vh; overflow-y: auto;">
                <input type="hidden" id="id-prospecto" value="${idProspecto}">
                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre completo</label>
                    <input type="text" class="form-control" id="nombre" value="${prospecto.nombre || ''}" required>
                </div>
                <div class="mb-3">
                    <label for="telefono" class="form-label">Teléfono (10 dígitos)</label>
                    <input type="tel" class="form-control" id="telefono" value="${prospecto.telefono || ''}" pattern="[0-9]{10}" title="Ingresa exactamente 10 dígitos numéricos" maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" value="${prospecto.email || ''}" pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" title="Ingresa un correo electrónico válido">
                </div>
                <div class="mb-3">
                    <label for="ubicacion" class="form-label">Ubicación</label>
                    <input type="text" class="form-control" id="ubicacion" value="${prospecto.ubicacion || ''}">
                </div>
                <div class="mb-3">
                    <label for="canal" class="form-label">Canal</label>
                    <select class="form-control" id="canal">
                        <option value="" ${!prospecto.canal ? 'selected' : ''}>Seleccionar</option>
                        <option value="instagram" ${prospecto.canal === 'instagram' ? 'selected' : ''}>Instagram</option>
                        <option value="facebook" ${prospecto.canal === 'facebook' ? 'selected' : ''}>Facebook</option>
                        <option value="tiktok" ${prospecto.canal === 'tiktok' ? 'selected' : ''}>TikTok</option>
                        <option value="youtube" ${prospecto.canal === 'youtube' ? 'selected' : ''}>YouTube</option>
                        <option value="otro" ${prospecto.canal === 'otro' ? 'selected' : ''}>Otro</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="fecha-prospecto" class="form-label">Fecha de Prospecto</label>
                    <input type="text" class="form-control" id="fecha-prospecto" value="${fechaFormateada || ''}" readonly>
                </div>
                <div class="mb-3">
                    <label for="motivo" class="form-label">Motivo</label>
                    <textarea class="form-control" id="motivo" rows="3">${prospecto.motivo || ''}</textarea>
                </div>
                <div class="mb-3 d-flex align-items-center">
                    <label for="contactado" class="form-label me-3">Contactado</label>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="contactado" ${prospecto.contactado === true || prospecto.contactado === 'true' ? 'checked' : ''}>
                    </div>
                </div>
                <div class="mb-3 d-flex align-items-center">
                    <label for="interesado" class="form-label me-3">Interesado</label>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="interesado" ${prospecto.interesado === true || prospecto.interesado === 'true' ? 'checked' : ''}>
                    </div>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: prospectoId ? 'Actualizar' : 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        buttonsStyling: true,
        reverseButtons: true,
        customClass: {
            confirmButton: 'swal2-confirm fw-bold',
        },
        didOpen: () => {
            // Inicializar datepickers utilizando el objeto jQuery de SweetAlert2
            try {
                if (typeof jQuery !== 'undefined') {
                    jQuery('.datepicker').datepicker({
                        format: 'dd/mm/yyyy',
                        autoclose: true,
                        todayHighlight: true,
                        clearBtn: true,
                        language: 'es'
                    });
                } else {
                    // Fallback si jQuery no está disponible
                    const datepickers = document.querySelectorAll('.datepicker');
                    datepickers.forEach(input => {
                        input.type = 'date';
                    });
                    console.warn('jQuery no está disponible, usando input type="date" como fallback');
                }
            } catch (error) {
                console.error('Error al inicializar datepickers:', error);
                // Fallback si hay error
                const datepickers = document.querySelectorAll('.datepicker');
                datepickers.forEach(input => {
                    input.type = 'date';
                });
            }
            
            // Validación adicional para teléfono (solo números y máximo 10 dígitos)
            const telefonoInput = document.getElementById('telefono');
            if (telefonoInput) {
                telefonoInput.addEventListener('keypress', function(e) {
                    // Asegurarse de que solo se ingresen números
                    const key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
                    if (!/^\d$/.test(key)) {
                        e.preventDefault();
                        return false;
                    }
                    
                    // Verificar que no exceda 10 dígitos
                    if (this.value.length >= 10) {
                        e.preventDefault();
                        return false;
                    }
                });
            }
        },
        preConfirm: () => {
            const form = document.getElementById('prospecto-form');
            if (!form.checkValidity()) {
                form.reportValidity();
                return false;
            }
            
            // Validación adicional para el campo de teléfono
            const telefono = document.getElementById('telefono').value;
            if (telefono && telefono.length !== 10) {
                Swal.showValidationMessage('El teléfono debe tener exactamente 10 dígitos');
                return false;
            }
            
            // Validación adicional para correo electrónico
            const email = document.getElementById('email').value;
            if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
                Swal.showValidationMessage('Ingresa un correo electrónico válido');
                return false;
            }
            
            return {
                nombre: document.getElementById('nombre').value,
                telefono: document.getElementById('telefono').value,
                email: document.getElementById('email').value,
                ubicacion: document.getElementById('ubicacion').value,
                canal: document.getElementById('canal').value,
                motivo: document.getElementById('motivo').value,
                contactado: document.getElementById('contactado').checked,
                interesado: document.getElementById('interesado').checked
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            guardarProspecto(prospectoId, result.value);
        }
    });
}

/**
 * Guardar prospecto (nuevo o editado)
 */
async function guardarProspecto(id, datos) {
    try {
        showLoading(true);
        
        if (id) {
            // Actualizar prospecto existente
            const datosParaAPI = {};
            datosParaAPI[id] = datos;
            
            // Llamar a la API para actualizar
            try {
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'updateprospecto',
                        data: {
                            prospecto: datosParaAPI
                        }
                    })
                });
                
                // Actualizar datos localmente ya que no podemos verificar la respuesta con no-cors
                window.apiData.prospectos[id] = {
                    ...window.apiData.prospectos[id],
                    ...datos,
                    fechaModificacion: new Date().toISOString().split('T')[0]
                };
                
                showMessage('Prospecto actualizado correctamente', 'success');
            } catch (error) {
                console.warn('Error al actualizar prospecto en servidor:', error);
                // Actualizar datos localmente de todos modos
                window.apiData.prospectos[id] = {
                    ...window.apiData.prospectos[id],
                    ...datos,
                    fechaModificacion: new Date().toISOString().split('T')[0]
                };
                showMessage('Prospecto actualizado localmente, pero hubo un error al comunicarse con el servidor', 'warning');
            }
        } else {
            // Crear nuevo prospecto
            const nuevoId = 'p' + Date.now();
            const nuevoProspecto = {
                id: nuevoId,
                ...datos,
                'fecha-prospecto': new Date().toISOString(),
                fechaCreacion: new Date().toISOString().split('T')[0],
                fechaModificacion: new Date().toISOString().split('T')[0]
            };
            
            // Preparar datos para la API
            const datosParaAPI = {};
            datosParaAPI[nuevoId] = nuevoProspecto;
            
            // Llamar a la API para crear
            try {
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'insertprospecto',
                        data: {
                            prospecto: datosParaAPI
                        }
                    })
                });
                
                // Actualizar datos localmente ya que no podemos verificar la respuesta con no-cors
                window.apiData.prospectos[nuevoId] = nuevoProspecto;
                
                showMessage('Prospecto creado correctamente', 'success');
            } catch (error) {
                console.warn('Error al crear prospecto en servidor:', error);
                // Actualizar datos localmente de todos modos
                window.apiData.prospectos[nuevoId] = nuevoProspecto;
                showMessage('Prospecto creado localmente, pero hubo un error al comunicarse con el servidor', 'warning');
            }
        }
        
        // Recargar la interfaz
        cargarInterfazProspectos();
        
    } catch (error) {
        console.error('Error al guardar prospecto:', error);
        showMessage('Error al guardar los datos: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Mostrar detalles de un prospecto
 */
function mostrarDetallesProspecto(id) {
    const prospecto = window.apiData.prospectos[id];
    if (!prospecto) {
        showMessage('Prospecto no encontrado', 'error');
        return;
    }
    
    // Formatear fecha en DD/M/YYYY HH:MM:SS
    let fechaFormateada = 'No disponible';
    if (prospecto['fecha-prospecto']) {
        try {
            // Primero verificar si ya está en formato DD/M/YYYY
            if (prospecto['fecha-prospecto'].includes('/')) {
                fechaFormateada = prospecto['fecha-prospecto'];
            } else {
                const fecha = new Date(prospecto['fecha-prospecto']);
                if (!isNaN(fecha)) {
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1); // Sin padStart para el mes
                    const año = fecha.getFullYear();
                    const horas = String(fecha.getHours()).padStart(2, '0');
                    const minutos = String(fecha.getMinutes()).padStart(2, '0');
                    const segundos = String(fecha.getSeconds()).padStart(2, '0');
                    
                    fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
                }
            }
        } catch (e) {
            console.warn('Error al formatear fecha:', e);
            // Si hay error, intentar usar el valor original
            fechaFormateada = prospecto['fecha-prospecto'] || 'No disponible';
        }
    }
    
    // Determinar si es cliente
    const esCliente = prospecto['numero-cliente'] ? true : false;
    
    Swal.fire({
        title: prospecto.nombre || 'Detalles del Prospecto',
        html: `
            <div class="text-start">
                <div class="mb-2"><strong>Email:</strong> ${prospecto.email || 'No disponible'}</div>
                <div class="mb-2"><strong>Teléfono:</strong> ${prospecto.telefono || 'No disponible'}</div>
                <div class="mb-2"><strong>Fecha de registro:</strong> ${fechaFormateada}</div>
                <div class="mb-2"><strong>Canal:</strong> ${prospecto.canal || 'No especificado'}</div>
                <div class="mb-2"><strong>Contactado:</strong> ${prospecto.contactado === true || prospecto.contactado === 'true' ? '<span class="badge bg-success">Sí</span>' : '<span class="badge bg-secondary">No</span>'}</div>
                <div class="mb-2"><strong>Interesado:</strong> ${prospecto.interesado === true || prospecto.interesado === 'true' ? '<span class="badge bg-success">Sí</span>' : '<span class="badge bg-secondary">No</span>'}</div>
                <div class="mb-2"><strong>Cliente:</strong> ${esCliente ? '<span class="badge bg-success">Sí</span>' : '<span class="badge bg-secondary">No</span>'}</div>
                ${esCliente ? `<div class="mb-2"><strong>Número de Cliente:</strong> ${prospecto['numero-cliente'] || 'No disponible'}</div>` : ''}
                <div class="mb-2"><strong>Notas:</strong> ${prospecto.notas || 'No hay notas'}</div>
            </div>
        `,
        confirmButtonText: 'Editar',
        confirmButtonColor: '#28a745',
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-secondary'
        },
        buttonsStyling: true,
        width: '32rem'
    }).then((result) => {
        if (result.isConfirmed) {
            mostrarFormularioProspecto(id);
        }
    });
}

/**
 * Mostrar formulario para conversión de prospecto a cliente
 */
function mostrarFormularioConversion(id) {
    if (!window.apiData.prospectos[id]) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Prospecto no encontrado'
        });
        return;
    }

    // Verificar si el prospecto está interesado
    if (!window.apiData.prospectos[id].interesado) {
        Swal.fire({
            icon: 'warning',
            title: 'No se puede convertir',
            text: 'Este prospecto no está marcado como interesado. Solo los prospectos interesados pueden convertirse a clientes.'
        });
        return;
    }

    // Obtener nuevo número de expediente
    let ultimoNumeroExpediente = 0;
    let ultimoNumeroCliente = 0;

    // Buscar el último número de expediente y cliente
    Object.values(window.apiData.clientes || {}).forEach(cliente => {
        if (cliente['numero-expediente'] && typeof cliente['numero-expediente'] === 'string' && cliente['numero-expediente'].startsWith('EXP')) {
            const numero = parseInt(cliente['numero-expediente'].replace('EXP', ''), 10);
            if (!isNaN(numero) && numero > ultimoNumeroExpediente) {
                ultimoNumeroExpediente = numero;
            }
        }
        
        if (cliente['numero-cliente'] && typeof cliente['numero-cliente'] === 'string' && cliente['numero-cliente'].startsWith('NMC')) {
            const numero = parseInt(cliente['numero-cliente'].replace('NMC', ''), 10);
            if (!isNaN(numero) && numero > ultimoNumeroCliente) {
                ultimoNumeroCliente = numero;
            }
        }
    });

    // Incrementar y formatear los números
    const nuevoNumeroExpediente = ultimoNumeroExpediente + 1;
    const nuevoNumeroCliente = ultimoNumeroCliente + 1;
    
    const numeroExpedienteFormateado = `EXP${String(nuevoNumeroExpediente).padStart(5, '0')}`;
    const numeroClienteFormateado = `NMC${String(nuevoNumeroCliente).padStart(5, '0')}`;
    
    // Generar ID de contacto único
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = fechaActual.toLocaleString('es', { month: 'short' });
    const anio = fechaActual.getFullYear();
    const hora = String(fechaActual.getHours()).padStart(2, '0');
    const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
    const segundos = String(fechaActual.getSeconds()).padStart(2, '0');
    
    const idContacto = `CC${dia}${mes}${anio}${hora}${minutos}${segundos}`;
    
    // Formatear fecha de cliente
    const fechaFormateada = `${dia}/${String(fechaActual.getMonth() + 1).padStart(2, '0')}/${anio} ${hora}:${minutos}:${segundos}`;

    // Obtener los datos del prospecto
    const prospecto = window.apiData.prospectos[id];

    Swal.fire({
        title: 'Convertir a Cliente',
        width: '700px',
        html: `
            <form id="cliente-form" class="text-start">
                <input type="hidden" id="id-contacto" value="${idContacto}">
                <input type="hidden" id="numero-expediente" value="${numeroExpedienteFormateado}">
                <input type="hidden" id="numero-cliente" value="${numeroClienteFormateado}">
                <input type="hidden" id="fecha-cliente" value="${fechaFormateada}">
                
                <div class="mb-3">
                    <label for="fecha-nacimiento" class="form-label">Fecha de Nacimiento</label>
                    <input type="text" class="form-control datepicker" id="fecha-nacimiento" required>
                </div>
                <div class="mb-3">
                    <label for="genero" class="form-label">Género</label>
                    <select class="form-control" id="genero" required>
                        <option value="">Seleccionar</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="peso-inicial" class="form-label">Peso Inicial (kg)</label>
                    <input type="number" step="0.1" class="form-control" id="peso-inicial" required>
                </div>
                <div class="mb-3">
                    <label for="peso-deseado" class="form-label">Peso Deseado (kg)</label>
                    <input type="number" step="0.1" class="form-control" id="peso-deseado" required>
                </div>
                <div class="mb-3">
                    <label for="grasa-inicial" class="form-label">% Grasa Corporal Inicial</label>
                    <input type="number" step="0.1" class="form-control" id="grasa-inicial" required>
                </div>
                <div class="mb-3">
                    <label for="grasa-deseada" class="form-label">% Grasa Corporal Deseada</label>
                    <input type="number" step="0.1" class="form-control" id="grasa-deseada" required>
                </div>
                <div class="mb-3">
                    <label for="plan" class="form-label">Plan</label>
                    <select class="form-control" id="plan" required>
                        <option value="">Seleccionar</option>
                        <option value="Plan 1">Plan 1</option>
                        <option value="Plan 2">Plan 2</option>
                        <option value="Plan 3">Plan 3</option>
                        <option value="Plan 4">Plan 4</option>
                        <option value="Plan 5">Plan 5</option>
                        <option value="Plan 6">Plan 6</option>
                        <option value="Plan 7">Plan 7</option>
                        <option value="Plan 8">Plan 8</option>
                        <option value="Plan 9">Plan 9</option>
                        <option value="Plan 10">Plan 10</option>
                    </select>
                </div>
                <div class="mb-3">
                    <p>Número de Expediente: <strong>${numeroExpedienteFormateado}</strong></p>
                    <p>Número de Cliente: <strong>${numeroClienteFormateado}</strong></p>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Convertir',
        cancelButtonText: 'Cancelar',
        didOpen: () => {
            // Inicializar datepicker en el modal
            $('.datepicker').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true,
                todayHighlight: true,
                language: 'es'
            });
        },
        preConfirm: () => {
            // Validar que todos los campos requeridos estén completos
            const form = document.getElementById('cliente-form');
            const inputs = form.querySelectorAll('[required]');
            
            let isValid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            });
            
            if (!isValid) {
                Swal.showValidationMessage('Por favor complete todos los campos requeridos');
                return false;
            }
            
            // Devolver datos del formulario
            return {
                'id-contacto': document.getElementById('id-contacto').value,
                'fecha-nacimiento': document.getElementById('fecha-nacimiento').value,
                'genero': document.getElementById('genero').value,
                'peso-inicial': document.getElementById('peso-inicial').value,
                'peso-deseado': document.getElementById('peso-deseado').value,
                'grasa-inicial': document.getElementById('grasa-inicial').value,
                'grasa-deseada': document.getElementById('grasa-deseada').value,
                'numero-expediente': document.getElementById('numero-expediente').value,
                'numero-cliente': document.getElementById('numero-cliente').value,
                'plan': document.getElementById('plan').value,
                'fecha-cliente': document.getElementById('fecha-cliente').value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            convertirProspectoACliente(id, result.value);
        }
    });
}

/**
 * Convertir prospecto a cliente
 */
async function convertirProspectoACliente(id, datosExtra) {
    try {
        showLoading(true);
        
        const prospecto = window.apiData.prospectos[id];
        if (!prospecto) throw new Error('Prospecto no encontrado');
        
        // Obtener la fecha de prospecto formateada
        let fechaProspectoFormateada = prospecto['fecha-prospecto'] || '';
        if (fechaProspectoFormateada) {
            // Si ya tiene el formato DD/M/YYYY, usarlo directamente
            if (fechaProspectoFormateada.includes('/')) {
                // Ya está en formato correcto
            } else {
                try {
                    const fecha = new Date(fechaProspectoFormateada);
                    if (!isNaN(fecha)) {
                        const dia = String(fecha.getDate()).padStart(2, '0');
                        const mes = String(fecha.getMonth() + 1); // Sin padStart para el mes
                        const año = fecha.getFullYear();
                        const horas = String(fecha.getHours()).padStart(2, '0');
                        const minutos = String(fecha.getMinutes()).padStart(2, '0');
                        const segundos = String(fecha.getSeconds()).padStart(2, '0');
                        
                        fechaProspectoFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
                    }
                } catch (e) {
                    console.warn('Error al formatear fecha de prospecto:', e);
                }
            }
        }
        
        // 1. Primero, actualizar el prospecto para marcarlo como convertido
        const datosProspectoActualizado = {
            'numero-cliente': datosExtra['numero-cliente'],
            contactado: true,
            interesado: true,
            estado: 'Convertido',
            'fecha-conversion': new Date().toISOString().split('T')[0]
        };
        
        // Preparar datos para la API
        const datosParaAPI = {};
        datosParaAPI[id] = datosProspectoActualizado;
        
        // Llamar a la API para actualizar el prospecto
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'updateprospecto',
                    data: {
                        prospecto: datosParaAPI
                    }
                })
            });
            
            // Como no-cors no permite leer la respuesta, asumimos que hubo un error
            console.warn('Respuesta no legible debido a modo no-cors, actualizando datos localmente');
            // Actualizar datos localmente
            if (window.apiData.prospectos[id]) {
                window.apiData.prospectos[id] = {
                    ...window.apiData.prospectos[id],
                    ...datosProspectoActualizado
                };
            }
        } catch (error) {
            console.warn('Error al actualizar prospecto en servidor:', error);
            // Continuar con el proceso local
            // Actualizar datos localmente
            if (window.apiData.prospectos[id]) {
                window.apiData.prospectos[id] = {
                    ...window.apiData.prospectos[id],
                    ...datosProspectoActualizado
                };
            }
        }
        
        // 2. Crear el cliente
        
        // Crear objeto cliente
        const nuevoCliente = {
            "id-contacto": datosExtra['id-contacto'],
            "nombre": prospecto.nombre,
            "telefono": prospecto.telefono || '',
            "email": prospecto.email || '',
            "fecha-nacimiento": datosExtra['fecha-nacimiento'],
            "genero": datosExtra['genero'],
            "ubicacion": prospecto.ubicacion || '',
            "peso-inicial": datosExtra['peso-inicial'],
            "peso-deseado": datosExtra['peso-deseado'],
            "grasa-inicial": datosExtra['grasa-inicial'],
            "grasa-deseada": datosExtra['grasa-deseada'],
            "fecha-prospecto": fechaProspectoFormateada,
            "fecha-cliente": datosExtra['fecha-cliente'],
            "canal": prospecto.canal || null,
            "numero-expediente": datosExtra['numero-expediente'],
            "numero-cliente": datosExtra['numero-cliente'],
            "plan": datosExtra['plan'],
            "finalizado": false
        };
        
        // Log the client object to verify finalizado is set correctly
        console.log("Enviando datos del nuevo cliente:", nuevoCliente);
        console.log("Estado de finalizado:", nuevoCliente.finalizado);
        
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'insertcliente',
                    data: {
                        action: 'insertcliente',
                        cliente: {
                            "id-contacto": nuevoCliente["id-contacto"],
                            "nombre": nuevoCliente.nombre,
                            "telefono": nuevoCliente.telefono,
                            "email": nuevoCliente.email,
                            "fecha-nacimiento": nuevoCliente["fecha-nacimiento"],
                            "genero": nuevoCliente.genero,
                            "ubicacion": nuevoCliente.ubicacion,
                            "peso-inicial": nuevoCliente["peso-inicial"],
                            "peso-deseado": nuevoCliente["peso-deseado"],
                            "grasa-inicial": nuevoCliente["grasa-inicial"],
                            "grasa-deseada": nuevoCliente["grasa-deseada"],
                            "fecha-prospecto": nuevoCliente["fecha-prospecto"],
                            "fecha-cliente": nuevoCliente["fecha-cliente"],
                            "canal": nuevoCliente.canal,
                            "numero-expediente": nuevoCliente["numero-expediente"],
                            "numero-cliente": nuevoCliente["numero-cliente"],
                            "plan": nuevoCliente.plan,
                            "finalizado": false
                        }
                    }
                })
            });
            
            // Como no-cors no permite leer la respuesta, asumimos que hubo un error
            console.warn('Respuesta no legible debido a modo no-cors, actualizando datos localmente');
            
            // Actualizar datos locales - añadir el nuevo cliente
            if (!window.apiData.clientes) window.apiData.clientes = {};
            window.apiData.clientes[datosExtra['id-contacto']] = nuevoCliente;
            
            // Actualizar UI
            showMessage('Cliente creado con éxito', 'success');
            
            // Refrescar datos desde la API
            await window.apiService.obtenerTodosLosDatos();
            
            // Actualizar las tablas
            actualizarTablaProspectos();
            if (typeof actualizarTablaConClientes === 'function') {
                actualizarTablaConClientes();
            }
            
        } catch (error) {
            console.error('Error al crear cliente en servidor:', error);
            showMessage('Error al crear cliente: ' + error.message, 'error');
        } finally {
            showLoading(false);
        }
        
    } catch (error) {
        console.error('Error en conversión a cliente:', error);
        showMessage('Error en conversión: ' + error.message, 'error');
        showLoading(false);
    }
}

/**
 * Eliminar un prospecto
 */
function eliminarProspecto(id) {
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
            delete window.apiData.prospectos[id];
            
            // Actualizar interfaz
            cargarInterfazProspectos();
            
            showMessage('Prospecto eliminado correctamente', 'success');
        }
    });
}

/**
 * Cargar prospectos recientes para el dashboard
 * Esta función es llamada desde home.js
 */
function cargarProspectos(contenedor, limite = 5) {
    if (!contenedor) return;
    
    try {
        // Obtener prospectos
        const prospectos = window.apiData.prospectos || {};
        
        // Convertir a array y ordenar por fecha de creación (más recientes primero)
        const prospectosArray = Object.values(prospectos)
            .sort((a, b) => {
                const fechaA = a.fechaCreacion ? new Date(a.fechaCreacion) : new Date(0);
                const fechaB = b.fechaCreacion ? new Date(b.fechaCreacion) : new Date(0);
                return fechaB - fechaA;
            })
            .slice(0, limite);
        
        // Crear HTML para los prospectos recientes
        if (prospectosArray.length > 0) {
            const prospectosHTML = prospectosArray.map(prospecto => {
                return `
                    <tr class="clickable-row" data-id="${prospecto.id}">
                        <td>${prospecto.nombre}</td>
                        <td>${prospecto.email || prospecto.telefono || 'No disponible'}</td>
                        <td>
                            <span class="badge ${getEstadoBadgeClass(prospecto.estado)}">
                                ${prospecto.estado}
                            </span>
                        </td>
                        <td>${prospecto.fechaCreacion || 'No disponible'}</td>
                    </tr>
                `;
            }).join('');
            
            contenedor.innerHTML = prospectosHTML;
            
            // Agregar evento de clic a las filas
            const rows = contenedor.querySelectorAll('.clickable-row');
            rows.forEach(row => {
                row.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    // Cargar sección de prospectos y mostrar detalles
                    loadContent('prospectos', () => {
                        setTimeout(() => {
                            mostrarDetallesProspecto(id);
                        }, 500);
                    });
                });
            });
        } else {
            contenedor.innerHTML = '<tr><td colspan="4" class="text-center">No hay prospectos recientes</td></tr>';
        }
    } catch (error) {
        console.error('Error al cargar prospectos recientes:', error);
        contenedor.innerHTML = '<tr><td colspan="4" class="text-center">Error al cargar prospectos</td></tr>';
    }
}

// Transformar datos del servidor a formato local
function transformarProspectos(datosServidor) {
    const resultado = {};
    
    // Convertir cada objeto del servidor al formato esperado
    Object.entries(datosServidor).forEach(([id, prospecto]) => {
        resultado[id] = {
            id: id,
            nombre: prospecto.nombre || '',
            email: prospecto.email || '',
            telefono: prospecto.telefono || '',
            origen: prospecto.origen || 'Sitio web',
            estado: prospecto.estado || 'Nuevo',
            ultimoSeguimiento: prospecto['ultimo-seguimiento'] || '',
            fechaCreacion: prospecto['fecha-creacion'] || '',
            fechaModificacion: prospecto['fecha-modificacion'] || '',
            notas: prospecto.notas || ''
        };
    });
    
    return resultado;
}

/**
 * Filtrar prospectos según el texto de búsqueda
 */
function filtrarProspectos() {
    try {
        if (!window.apiData || !window.apiData.prospectos) {
            console.warn('No hay datos para filtrar');
            return [];
        }
        
        // Convertir objeto a array con ID incluido
        const prospectos = Object.entries(window.apiData.prospectos).map(([id, prospecto]) => ({
            ...prospecto,
            id
        }));
        
        // Obtener el texto de búsqueda
        const searchText = document.getElementById('searchProspectos')?.value?.toLowerCase() || '';
        
        // Si no hay texto de búsqueda, devolver todos los prospectos
        if (!searchText.trim()) {
            return prospectos;
        }
        
        // Filtrar los prospectos que coincidan con el texto de búsqueda
        return prospectos.filter(prospecto => {
            return Object.entries(prospecto).some(([key, value]) => {
                // Ignorar propiedades que son objetos o arrays
                if (value === null || value === undefined || typeof value === 'object') {
                    return false;
                }
                
                // Convertir a string y buscar
                const valueStr = String(value).toLowerCase();
                return valueStr.includes(searchText);
            });
        });
    } catch (error) {
        console.error('Error al filtrar prospectos:', error);
        return [];
    }
}

/**
 * Paginar los resultados
 */
function paginarProspectos(prospectos) {
    totalPaginas = Math.ceil(prospectos.length / prospectosPorPagina);
    
    // Ajustar página actual si es necesario
    if (paginaActual > totalPaginas) {
        paginaActual = totalPaginas || 1;
    }
    
    const inicio = (paginaActual - 1) * prospectosPorPagina;
    const fin = inicio + prospectosPorPagina;
    
    return prospectos.slice(inicio, fin);
}

/**
 * Actualizar la tabla de prospectos
 */
function actualizarTablaProspectos() {
    try {
        if (!window.apiData || !window.apiData.prospectos) {
            console.warn('No hay datos de prospectos disponibles');
            return;
        }
        
        // Convertir objeto a array con ID incluido
        const prospectos = filtrarProspectos();
        
        // Ordenar por la columna de cliente si es necesario
        if (ordenColumnaCliente !== 'original') {
            prospectos.sort((a, b) => {
                const aEsCliente = a['numero-cliente'] ? true : false;
                const bEsCliente = b['numero-cliente'] ? true : false;
                
                if (ordenColumnaCliente === 'clientesPrimero') {
                    return aEsCliente === bEsCliente ? 0 : aEsCliente ? -1 : 1;
                } else { // noClientesPrimero
                    return aEsCliente === bEsCliente ? 0 : aEsCliente ? 1 : -1;
                }
            });
        }
        
        // Paginar los prospectos
        const prospectosPaginados = paginarProspectos(prospectos);
        
        // Actualizar la tabla con los prospectos paginados
        actualizarTablaConProspectos(prospectosPaginados);
        
        // Actualizar información de paginación
        actualizarInfoPaginacion(prospectos.length);
        
        // Generar controles de paginación
        generarControlesPaginacion(prospectos.length);
    } catch (error) {
        console.error('Error al actualizar la tabla de prospectos:', error);
        showMessage('Error al actualizar la tabla de prospectos', 'error');
    }
}

/**
 * Función para actualizar la tabla con prospectos
 */
function actualizarTablaConProspectos(prospectos) {
    const tablaBody = document.getElementById('tbody-prospectos');
    if (!tablaBody) return;
    
    // Limpiar tabla
    tablaBody.innerHTML = '';
    
    if (!prospectos || prospectos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7" class="text-center">No hay prospectos disponibles</td>';
        tablaBody.appendChild(tr);
        return;
    }
    
    // Añadir filas a la tabla
    prospectos.forEach(prospecto => {
        const tr = document.createElement('tr');
        const esCliente = prospecto['numero-cliente'] ? true : false;
        
        tr.innerHTML = `
            <td>${prospecto.nombre || ''}</td>
            <td>${prospecto.email || ''}</td>
            <td>${prospecto.telefono || ''}</td>
            <td>
                ${!esCliente ? `
                <div class="form-check form-switch">
                    <input class="form-check-input toggle-contactado" type="checkbox" role="switch" 
                        data-id="${prospecto.id}" 
                        ${prospecto.contactado === true || prospecto.contactado === 'true' ? 'checked' : ''}>
                </div>
                ` : `<span class="text-muted"><i class="fas fa-check-circle"></i> Contactado</span>`}
            </td>
            <td>
                ${!esCliente ? `
                <div class="form-check form-switch">
                    <input class="form-check-input toggle-interesado" type="checkbox" role="switch" 
                        data-id="${prospecto.id}" 
                        ${prospecto.interesado === true || prospecto.interesado === 'true' ? 'checked' : ''}>
                </div>
                ` : `<span class="text-muted"><i class="fas fa-check-circle"></i> Interesado</span>`}
            </td>
            <td>
                <span class="badge ${esCliente ? 'bg-success' : 'bg-secondary'} text-white">
                    ${esCliente ? 'Sí' : 'No'}
                </span>
            </td>
            <td>
                <div class="d-flex justify-content-end gap-1">
                    <button class="btn btn-outline-warning btn-sm btn-editar-prospecto" data-id="${prospecto.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${!esCliente ? `
                    <button class="btn btn-outline-success btn-sm btn-convertir-cliente" data-id="${prospecto.id}" title="Convertir a Cliente">
                        <i class="fas fa-user-check"></i>
                    </button>
                    ` : ''}
                </div>
            </td>
        `;
        
        tablaBody.appendChild(tr);
    });
    
    // Asignar eventos a los botones y toggles
    asignarEventosProspectos();
}

/**
 * Actualizar la información de paginación
 */
function actualizarInfoPaginacion(totalProspectos) {
    const infoRegistros = document.getElementById('info-registros');
    if (!infoRegistros) return;
    
    const inicio = totalProspectos === 0 ? 0 : (paginaActual - 1) * prospectosPorPagina + 1;
    const fin = Math.min(paginaActual * prospectosPorPagina, totalProspectos);
    
    infoRegistros.textContent = `Mostrando ${inicio} a ${fin} de ${totalProspectos} registros`;
}

/**
 * Generar los controles de paginación
 */
function generarControlesPaginacion(totalProspectos) {
    const controlesPaginacion = document.getElementById('controles-paginacion');
    if (!controlesPaginacion) return;
    
    controlesPaginacion.innerHTML = '';
    
    // Calcular el número total de páginas
    const totalPaginas = Math.ceil(totalProspectos / prospectosPorPagina);
    
    // Si no hay páginas, no mostrar controles
    if (totalPaginas <= 1) {
        controlesPaginacion.innerHTML = '';
        return;
    }
    
    // Botón "Anterior"
    const btnAnterior = document.createElement('li');
    btnAnterior.className = `page-item ${paginaActual === 1 ? 'disabled' : ''}`;
    btnAnterior.innerHTML = `<a class="page-link" href="#" data-page="prev">Anterior</a>`;
    controlesPaginacion.appendChild(btnAnterior);
    
    // Determinar qué páginas mostrar (máximo 5)
    let paginasAMostrar = [];
    if (totalPaginas <= 5) {
        // Mostrar todas las páginas
        paginasAMostrar = Array.from({ length: totalPaginas }, (_, i) => i + 1);
    } else {
        // Mostrar un subconjunto de páginas
        if (paginaActual <= 3) {
            // Estamos cerca del principio
            paginasAMostrar = [1, 2, 3, 4, 5];
        } else if (paginaActual >= totalPaginas - 2) {
            // Estamos cerca del final
            paginasAMostrar = Array.from({ length: 5 }, (_, i) => totalPaginas - 4 + i);
        } else {
            // Estamos en el medio
            paginasAMostrar = Array.from({ length: 5 }, (_, i) => paginaActual - 2 + i);
        }
    }
    
    // Agregar los botones de página
    paginasAMostrar.forEach(pagina => {
        const btnPagina = document.createElement('li');
        btnPagina.className = `page-item ${pagina === paginaActual ? 'active' : ''}`;
        btnPagina.innerHTML = `<a class="page-link" href="#" data-page="${pagina}">${pagina}</a>`;
        controlesPaginacion.appendChild(btnPagina);
    });
    
    // Botón "Siguiente"
    const btnSiguiente = document.createElement('li');
    btnSiguiente.className = `page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`;
    btnSiguiente.innerHTML = `<a class="page-link" href="#" data-page="next">Siguiente</a>`;
    controlesPaginacion.appendChild(btnSiguiente);
}

/**
 * Guardar cambios de un toggle (contactado, interesado)
 */
async function guardarCambiosToggle(id, campo, valor) {
    try {
        showLoading(true);
        
        const prospecto = window.apiData.prospectos[id];
        if (!prospecto) throw new Error('Prospecto no encontrado');
        
        // Crear objeto con los cambios
        const cambios = {
            [campo]: valor
        };
        
        // Preparar datos para la API
        const datosParaAPI = {};
        datosParaAPI[id] = cambios;
        
        // Llamar a la API para actualizar
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'updateprospecto',
                    data: {
                        prospecto: datosParaAPI
                    }
                })
            });
            
            // Actualizar datos localmente ya que no podemos verificar la respuesta con no-cors
            if (window.apiData.prospectos[id]) {
                window.apiData.prospectos[id] = {
                    ...window.apiData.prospectos[id],
                    ...cambios
                };
            }
            
            showMessage(`Campo ${campo} actualizado`, 'success');
        } catch (error) {
            console.warn('Error al actualizar prospecto en servidor:', error);
            // Actualizar datos localmente de todos modos
            if (window.apiData.prospectos[id]) {
                window.apiData.prospectos[id] = {
                    ...window.apiData.prospectos[id],
                    ...cambios
                };
            }
            showMessage(`Campo ${campo} actualizado localmente`, 'warning');
        }
    } catch (error) {
        console.error('Error al guardar cambios del toggle:', error);
        showMessage('Error al guardar cambios: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Asignar eventos a los elementos de la tabla de prospectos
 */
function asignarEventosProspectos() {
    // Asignar eventos a los toggles de contactado
    document.querySelectorAll('.toggle-contactado').forEach(toggle => {
        toggle.addEventListener('change', async (e) => {
            const id = e.target.dataset.id;
            const checked = e.target.checked;
            await guardarCambiosToggle(id, 'contactado', checked);
        });
    });
    
    // Asignar eventos a los toggles de interesado
    document.querySelectorAll('.toggle-interesado').forEach(toggle => {
        toggle.addEventListener('change', async (e) => {
            const id = e.target.dataset.id;
            const checked = e.target.checked;
            await guardarCambiosToggle(id, 'interesado', checked);
        });
    });
    
    // Asignar eventos a los botones de editar
    document.querySelectorAll('.btn-editar-prospecto').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            mostrarFormularioProspecto(id);
        });
    });
    
    // Asignar eventos a los botones de convertir a cliente
    document.querySelectorAll('.btn-convertir-cliente').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            mostrarFormularioConversion(id);
        });
    });
}

// Exportar función cargarProspectos al objeto global window
window.cargarProspectos = cargarProspectos; 
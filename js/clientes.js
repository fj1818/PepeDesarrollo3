/**
 * Clientes - Gestión de clientes
 */

// Variables para el manejo de la paginación
let clientesPorPagina = 10;
let paginaActualClientes = 1;

// Inicializar módulo
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar si estamos en la sección de clientes
    const currentSection = document.querySelector('.nav-item.active');
    if (currentSection && currentSection.getAttribute('data-section') === 'clientes') {
        initClientes();
    }
});

// Reiniciar si el script ya estaba cargado
document.addEventListener('script-reloaded', function(e) {
    if (e.detail.script === 'js/clientes.js') {
        initClientes();
    }
});

/**
 * Inicializar sección de clientes
 */
async function initClientes() {
    try {
        // Mostrar indicador de carga
        showLoading(true);
        
        // Verificar si tenemos datos
        if (!window.apiData || !window.apiData.clientes) {
            // Si no hay datos, intentar cargarlos
            await window.apiService.obtenerTodosLosDatos();
        }
        
        // Cargar interfaz de clientes
        cargarInterfazClientes();
        
        // Ocultar indicador de carga
        showLoading(false);
    } catch (error) {
        console.error('Error al inicializar clientes:', error);
        showLoading(false);
        showMessage('Error al cargar clientes. Por favor, intente nuevamente.', 'error');
    }
}

/**
 * Cargar la interfaz de clientes
 */
function cargarInterfazClientes() {
    const contentElement = document.getElementById('content-clientes');
    if (!contentElement) return;
    
    // Crear el HTML para la sección
    contentElement.innerHTML = `
        <div class="section-header mb-4">
            <h1>Clientes</h1>
            <p>Gestión de clientes y seguimiento de actividades</p>
        </div>
        
        <div class="row mb-4">
            <div class="col-12">
                <div class="crm-card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title">
                            <i class="fas fa-users me-2"></i> Lista de Clientes
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <div class="input-group">
                                    <input type="text" id="searchClientes" class="form-control" placeholder="Buscar clientes...">
                                    <button class="btn btn-primary" type="button" id="btnSearchClientes">
                                        <i class="fas fa-search fa-sm"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-6 text-right">
                                <div class="d-flex justify-content-end align-items-center">
                                    <label for="registrosPorPaginaClientes" class="mr-2 mb-0">Mostrar</label>
                                    <select id="registrosPorPaginaClientes" class="form-control form-control-sm" style="width: auto;">
                                        <option value="5">5</option>
                                        <option value="10" selected>10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                    <label class="ml-2 mb-0">registros</label>
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
                                        <th>Tipo</th>
                                        <th>Finalizado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="clientes-table-body">
                                    <!-- Aquí se cargarán los clientes -->
                                </tbody>
                            </table>
                            <div id="paginacion-clientes" class="d-flex justify-content-between align-items-center">
                                <div class="dataTables_info" id="info-registros-clientes">
                                    Mostrando 0 a 0 de 0 registros
                                </div>
                                <div class="dataTables_paginate paging_simple_numbers">
                                    <ul class="pagination" id="controles-paginacion-clientes">
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
    
    // Cargar clientes en la tabla
    actualizarTablaClientes();
    
    // Configurar eventos
    setupClientesEventos();
}

/**
 * Obtener clase para badge según tipo de cliente
 */
function getTipoBadgeClass(tipo) {
    switch(tipo) {
        case 'Activo':
            return 'bg-success';
        case 'Finalizado':
            return 'bg-secondary';
        default:
            return 'bg-primary';
    }
}

/**
 * Configurar eventos de la sección de clientes
 */
function setupClientesEventos() {
    // Evento de búsqueda de clientes
    const searchInput = document.getElementById('searchClientes');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            paginaActualClientes = 1; // Reiniciar a la primera página al buscar
            actualizarTablaClientes();
        });
    }
    
    // Botón de búsqueda
    const btnSearch = document.getElementById('btnSearchClientes');
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            actualizarTablaClientes();
        });
    }
    
    // Evento para el cambio de registros por página
    const selectRegistros = document.getElementById('registrosPorPaginaClientes');
    if (selectRegistros) {
        selectRegistros.addEventListener('change', () => {
            clientesPorPagina = parseInt(selectRegistros.value);
            paginaActualClientes = 1; // Reiniciar a la primera página
            actualizarTablaClientes();
        });
    }
    
    // Eventos para los botones de paginación
    document.addEventListener('click', (e) => {
        if (e.target.closest('#controles-paginacion-clientes')) {
            e.preventDefault();
            
            const pageLink = e.target.closest('[data-page]');
            if (!pageLink) return;
            
            const pageValue = pageLink.dataset.page;
            const totalClientes = Object.keys(window.apiData?.clientes || {}).length;
            const totalPaginas = Math.ceil(totalClientes / clientesPorPagina);
            
            if (pageValue === 'prev') {
                if (paginaActualClientes > 1) {
                    paginaActualClientes--;
                }
            } else if (pageValue === 'next') {
                if (paginaActualClientes < totalPaginas) {
                    paginaActualClientes++;
                }
            } else {
                paginaActualClientes = parseInt(pageValue);
            }
            
            actualizarTablaClientes();
        }
    });
    
    // Eventos para botones de edición y toggles
    document.addEventListener('click', (e) => {
        // Botón editar
        if (e.target.closest('.btn-edit-cliente')) {
            const id = e.target.closest('.btn-edit-cliente').dataset.id;
            mostrarFormularioCliente(id);
        }
        
        // Botón para agregar expediente
        if (e.target.closest('.btn-add-expediente')) {
            const id = e.target.closest('.btn-add-expediente').dataset.id;
            mostrarConfirmacionNuevoExpediente(id);
        }
    });
}

/**
 * Filtrar clientes según el texto de búsqueda
 */
function filtrarClientes() {
    try {
        if (!window.apiData || !window.apiData.clientes) {
            console.warn('No hay datos para filtrar');
            return [];
        }
        
        // Convertir objeto a array con ID incluido
        const clientes = Object.entries(window.apiData.clientes).map(([id, cliente]) => ({
            ...cliente,
            id
        }));
        
        // Obtener el texto de búsqueda
        const searchText = document.getElementById('searchClientes')?.value?.toLowerCase() || '';
        
        // Si no hay texto de búsqueda, devolver todos los clientes
        if (!searchText.trim()) {
            return clientes;
        }
        
        // Filtrar los clientes que coincidan con el texto de búsqueda
        return clientes.filter(cliente => {
            return Object.entries(cliente).some(([key, value]) => {
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
        console.error('Error al filtrar clientes:', error);
        return [];
    }
}

/**
 * Paginar los clientes
 */
function paginarClientes(clientes) {
    const inicio = (paginaActualClientes - 1) * clientesPorPagina;
    const fin = inicio + clientesPorPagina;
    return clientes.slice(inicio, fin);
}

/**
 * Actualizar la tabla de clientes
 */
function actualizarTablaClientes() {
    try {
        if (!window.apiData || !window.apiData.clientes) {
            console.warn('No hay datos de clientes disponibles');
            return;
        }
        
        // Filtrar clientes según búsqueda
        const clientesFiltrados = filtrarClientes();
        
        // Paginar los clientes
        const clientesPaginados = paginarClientes(clientesFiltrados);
        
        // Actualizar la tabla con los clientes paginados
        actualizarTablaConClientes(clientesPaginados);
        
        // Actualizar información de paginación
        actualizarInfoPaginacionClientes(clientesFiltrados.length);
        
        // Generar controles de paginación
        generarControlesPaginacionClientes(clientesFiltrados.length);
    } catch (error) {
        console.error('Error al actualizar la tabla de clientes:', error);
        showMessage('Error al actualizar la tabla de clientes', 'error');
    }
}

/**
 * Actualizar la tabla con los clientes proporcionados
 */
function actualizarTablaConClientes(clientes) {
    const tbody = document.getElementById('clientes-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (clientes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center">No hay clientes disponibles</td></tr>`;
        return;
    }
    
    clientes.forEach(cliente => {
        const finalizado = cliente.finalizado === true || cliente.finalizado === 'true';
        const tipoCliente = finalizado ? 'Finalizado' : 'Activo';
        
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${cliente.nombre || 'N/A'}</td>
            <td>${cliente.email || 'N/A'}</td>
            <td>${cliente.telefono || 'N/A'}</td>
            <td>
                <span class="badge ${getTipoBadgeClass(tipoCliente)}">
                    ${tipoCliente}
                </span>
            </td>
            <td>
                <div class="form-check form-switch">
                    <input class="form-check-input toggle-finalizado" type="checkbox" 
                        data-id="${cliente.id}" 
                        ${finalizado ? 'checked' : ''}>
                </div>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-warning btn-edit-cliente" data-id="${cliente.id}">
                    <i class="fas fa-edit"></i>
                </button>
                ${finalizado ? 
                `<button class="btn btn-sm btn-outline-primary btn-add-expediente ms-1" data-id="${cliente.id}">
                    <i class="fas fa-folder-plus"></i>
                </button>` : ''}
            </td>
        `;
        tbody.appendChild(fila);
    });
    
    // Asignar eventos a los toggles
    document.querySelectorAll('.toggle-finalizado').forEach(toggle => {
        toggle.addEventListener('change', async (e) => {
            const id = e.target.dataset.id;
            const checked = e.target.checked;
            await guardarCambiosToggleCliente(id, 'finalizado', checked);
        });
    });
}

/**
 * Actualizar la información de paginación
 */
function actualizarInfoPaginacionClientes(totalClientes) {
    const infoRegistros = document.getElementById('info-registros-clientes');
    if (!infoRegistros) return;
    
    const inicio = totalClientes === 0 ? 0 : (paginaActualClientes - 1) * clientesPorPagina + 1;
    const fin = Math.min(paginaActualClientes * clientesPorPagina, totalClientes);
    
    infoRegistros.textContent = `Mostrando ${inicio} a ${fin} de ${totalClientes} registros`;
}

/**
 * Generar los controles de paginación
 */
function generarControlesPaginacionClientes(totalClientes) {
    const controlesPaginacion = document.getElementById('controles-paginacion-clientes');
    if (!controlesPaginacion) return;
    
    controlesPaginacion.innerHTML = '';
    
    // Calcular el número total de páginas
    const totalPaginas = Math.ceil(totalClientes / clientesPorPagina);
    
    // Si no hay páginas, no mostrar controles
    if (totalPaginas <= 1) {
        controlesPaginacion.innerHTML = '';
        return;
    }
    
    // Botón "Anterior"
    const btnAnterior = document.createElement('li');
    btnAnterior.className = `page-item ${paginaActualClientes === 1 ? 'disabled' : ''}`;
    btnAnterior.innerHTML = `<a class="page-link" href="#" data-page="prev">Anterior</a>`;
    controlesPaginacion.appendChild(btnAnterior);
    
    // Determinar qué páginas mostrar (máximo 5)
    let paginasAMostrar = [];
    if (totalPaginas <= 5) {
        // Mostrar todas las páginas
        paginasAMostrar = Array.from({ length: totalPaginas }, (_, i) => i + 1);
    } else {
        // Mostrar un subconjunto de páginas
        if (paginaActualClientes <= 3) {
            // Estamos cerca del principio
            paginasAMostrar = [1, 2, 3, 4, 5];
        } else if (paginaActualClientes >= totalPaginas - 2) {
            // Estamos cerca del final
            paginasAMostrar = Array.from({ length: 5 }, (_, i) => totalPaginas - 4 + i);
        } else {
            // Estamos en el medio
            paginasAMostrar = Array.from({ length: 5 }, (_, i) => paginaActualClientes - 2 + i);
        }
    }
    
    // Agregar los botones de página
    paginasAMostrar.forEach(pagina => {
        const btnPagina = document.createElement('li');
        btnPagina.className = `page-item ${pagina === paginaActualClientes ? 'active' : ''}`;
        btnPagina.innerHTML = `<a class="page-link" href="#" data-page="${pagina}">${pagina}</a>`;
        controlesPaginacion.appendChild(btnPagina);
    });
    
    // Botón "Siguiente"
    const btnSiguiente = document.createElement('li');
    btnSiguiente.className = `page-item ${paginaActualClientes === totalPaginas ? 'disabled' : ''}`;
    btnSiguiente.innerHTML = `<a class="page-link" href="#" data-page="next">Siguiente</a>`;
    controlesPaginacion.appendChild(btnSiguiente);
}

/**
 * Guardar cambios de un toggle (finalizado)
 */
async function guardarCambiosToggleCliente(id, campo, valor) {
    try {
        showLoading(true);
        
        const cliente = window.apiData.clientes[id];
        if (!cliente) throw new Error('Cliente no encontrado');
        
        // Convertir explícitamente el valor booleano a cadena para el API
        const valorString = valor;
        
        console.log(`Actualizando cliente ${id}, campo ${campo} con valor ${valorString}`);
        
        // Estructura de datos específica para la API
        const datosCliente = {
            "id-contacto": cliente["id-contacto"],
            "nombre": cliente.nombre,
            "telefono": cliente.telefono,
            "email": cliente.email,
            "fecha-nacimiento": cliente["fecha-nacimiento"],
            "genero": cliente.genero,
            "ubicacion": cliente.ubicacion,
            "peso-inicial": cliente["peso-inicial"],
            "peso-deseado": cliente["peso-deseado"],
            "grasa-inicial": cliente["grasa-inicial"],
            "grasa-deseada": cliente["grasa-deseada"],
            "fecha-prospecto": cliente["fecha-prospecto"],
            "fecha-cliente": cliente["fecha-cliente"],
            "canal": cliente.canal,
            "numero-expediente": cliente["numero-expediente"],
            "numero-cliente": cliente["numero-cliente"],
            "plan": cliente.plan,
            "finalizado": valorString
        };
        
        console.log('Datos completos para API:', JSON.stringify({
            action: 'updateclientes',
            data: {
                action: 'updateclientes',
                cliente: datosCliente
            }
        }));
        
        // Llamar a la API para actualizar
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'updateclientes',
                    data: {
                        action: 'updateclientes',
                        cliente: datosCliente
                    }
                })
            });
            
            console.log('Solicitud enviada a la API');
            
            // Actualizar datos localmente ya que no podemos verificar la respuesta con no-cors
            if (window.apiData.clientes[id]) {
                window.apiData.clientes[id] = {
                    ...window.apiData.clientes[id],
                    finalizado: valorString
                };
                console.log('Datos locales actualizados:', window.apiData.clientes[id].finalizado);
            }
            
            showMessage(`Estado de cliente actualizado`, 'success');
        } catch (error) {
            console.warn('Error al actualizar cliente en servidor:', error);
            // Actualizar datos localmente de todos modos
            if (window.apiData.clientes[id]) {
                window.apiData.clientes[id] = {
                    ...window.apiData.clientes[id],
                    finalizado: valorString
                };
                console.log('Datos locales actualizados (después de error):', window.apiData.clientes[id].finalizado);
            }
            showMessage(`Estado de cliente actualizado localmente`, 'warning');
        }
        
        // Actualizar la interfaz
        actualizarTablaClientes();
        
    } catch (error) {
        console.error('Error al guardar cambios del toggle:', error);
        showMessage('Error al guardar cambios: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Mostrar formulario para editar cliente
 */
function mostrarFormularioCliente(clienteId = null) {
    // Obtener datos del cliente
    if (!clienteId || !window.apiData.clientes[clienteId]) {
        showMessage('Cliente no encontrado', 'error');
        return;
    }
    
    const cliente = window.apiData.clientes[clienteId];
    const finalizado = cliente.finalizado === true || cliente.finalizado === 'true';
    
    // Formatear fechas para mostrar en el formulario
    let fechaNacFormateada = '';
    if (cliente['fecha-nacimiento']) {
        try {
            const fecha = new Date(cliente['fecha-nacimiento']);
            if (!isNaN(fecha)) {
                fechaNacFormateada = fecha.toISOString().split('T')[0];
            }
        } catch (e) {
            console.warn('Error al formatear fecha de nacimiento:', e);
        }
    }
    
    let fechaProspectoFormateada = '';
    if (cliente['fecha-prospecto']) {
        try {
            const fecha = new Date(cliente['fecha-prospecto']);
            if (!isNaN(fecha)) {
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
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
    
    let fechaClienteFormateada = '';
    if (cliente['fecha-cliente']) {
        try {
            const fecha = new Date(cliente['fecha-cliente']);
            if (!isNaN(fecha)) {
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                const año = fecha.getFullYear();
                const horas = String(fecha.getHours()).padStart(2, '0');
                const minutos = String(fecha.getMinutes()).padStart(2, '0');
                const segundos = String(fecha.getSeconds()).padStart(2, '0');
                
                fechaClienteFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
            }
        } catch (e) {
            console.warn('Error al formatear fecha de cliente:', e);
        }
    }
    
    Swal.fire({
        title: 'Editar Cliente',
        html: `
            <form id="cliente-form" class="text-start" style="max-height: 70vh; overflow-y: auto;">
                <input type="hidden" id="id-contacto" value="${cliente['id-contacto'] || ''}">
                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre completo</label>
                    <input type="text" class="form-control" id="nombre" value="${cliente.nombre || ''}" required>
                </div>
                <div class="mb-3">
                    <label for="telefono" class="form-label">Teléfono</label>
                    <input type="tel" class="form-control" id="telefono" value="${cliente.telefono || ''}">
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" value="${cliente.email || ''}">
                </div>
                <div class="mb-3">
                    <label for="fecha-nacimiento" class="form-label">Fecha de Nacimiento</label>
                    <input type="text" class="form-control datepicker" id="fecha-nacimiento" value="${fechaNacFormateada || ''}">
                </div>
                <div class="mb-3">
                    <label for="genero" class="form-label">Género</label>
                    <select class="form-control" id="genero">
                        <option value="" ${!cliente.genero ? 'selected' : ''}>Seleccionar</option>
                        <option value="Masculino" ${cliente.genero === 'Masculino' || cliente.genero === 'masculino' ? 'selected' : ''}>Masculino</option>
                        <option value="Femenino" ${cliente.genero === 'Femenino' || cliente.genero === 'femenino' ? 'selected' : ''}>Femenino</option>
                        <option value="Otro" ${cliente.genero === 'Otro' || cliente.genero === 'otro' ? 'selected' : ''}>Otro</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="ubicacion" class="form-label">Ubicación</label>
                    <input type="text" class="form-control" id="ubicacion" value="${cliente.ubicacion || ''}">
                </div>
                <div class="mb-3">
                    <label for="peso-inicial" class="form-label">Peso Inicial (kg)</label>
                    <input type="number" step="0.1" class="form-control" id="peso-inicial" value="${cliente['peso-inicial'] || ''}">
                </div>
                <div class="mb-3">
                    <label for="peso-deseado" class="form-label">Peso Deseado (kg)</label>
                    <input type="number" step="0.1" class="form-control" id="peso-deseado" value="${cliente['peso-deseado'] || ''}">
                </div>
                <div class="mb-3">
                    <label for="grasa-inicial" class="form-label">Grasa Inicial (%)</label>
                    <input type="number" step="0.1" class="form-control" id="grasa-inicial" value="${cliente['grasa-inicial'] || ''}">
                </div>
                <div class="mb-3">
                    <label for="grasa-deseada" class="form-label">Grasa Deseada (%)</label>
                    <input type="number" step="0.1" class="form-control" id="grasa-deseada" value="${cliente['grasa-deseada'] || ''}">
                </div>
                <div class="mb-3">
                    <label for="fecha-prospecto" class="form-label">Fecha de Prospecto</label>
                    <input type="text" class="form-control" id="fecha-prospecto" value="${fechaProspectoFormateada || ''}" readonly>
                </div>
                <div class="mb-3">
                    <label for="fecha-cliente" class="form-label">Fecha de Cliente</label>
                    <input type="text" class="form-control" id="fecha-cliente" value="${fechaClienteFormateada || ''}" readonly>
                </div>
                <div class="mb-3">
                    <label for="canal" class="form-label">Canal</label>
                    <input type="text" class="form-control" id="canal" value="${cliente.canal || ''}">
                </div>
                <div class="mb-3">
                    <label for="numero-expediente" class="form-label">Número de Expediente</label>
                    <input type="text" class="form-control" id="numero-expediente" value="${cliente['numero-expediente'] || ''}" ${cliente['numero-expediente'] ? 'readonly' : ''}>
                </div>
                <div class="mb-3">
                    <label for="numero-cliente" class="form-label">Número de Cliente</label>
                    <input type="text" class="form-control" id="numero-cliente" value="${cliente['numero-cliente'] || ''}" ${cliente['numero-cliente'] ? 'readonly' : ''}>
                </div>
                <div class="mb-3">
                    <label for="plan" class="form-label">Plan</label>
                    <select class="form-control" id="plan">
                        <option value="" ${!cliente.plan ? 'selected' : ''}>Seleccionar</option>
                        <option value="Plan 1" ${cliente.plan === 'Plan 1' ? 'selected' : ''}>Plan 1</option>
                        <option value="Plan 2" ${cliente.plan === 'Plan 2' ? 'selected' : ''}>Plan 2</option>
                        <option value="Plan 3" ${cliente.plan === 'Plan 3' ? 'selected' : ''}>Plan 3</option>
                        <option value="Plan 4" ${cliente.plan === 'Plan 4' ? 'selected' : ''}>Plan 4</option>
                        <option value="Plan 5" ${cliente.plan === 'Plan 5' ? 'selected' : ''}>Plan 5</option>
                        <option value="Plan 6" ${cliente.plan === 'Plan 6' ? 'selected' : ''}>Plan 6</option>
                        <option value="Plan 7" ${cliente.plan === 'Plan 7' ? 'selected' : ''}>Plan 7</option>
                        <option value="Plan 8" ${cliente.plan === 'Plan 8' ? 'selected' : ''}>Plan 8</option>
                        <option value="Plan 9" ${cliente.plan === 'Plan 9' ? 'selected' : ''}>Plan 9</option>
                        <option value="Plan 10" ${cliente.plan === 'Plan 10' ? 'selected' : ''}>Plan 10</option>
                    </select>
                </div>
                <div class="mb-3 d-flex align-items-center">
                    <label for="finalizado" class="form-label me-3">Finalizado</label>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="finalizado" ${finalizado ? 'checked' : ''}>
                    </div>
                </div>
            </form>
        `,
        width: '700px',
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        didOpen: () => {
            // Inicializar datepickers utilizando el objeto jQuery de SweetAlert2
            try {
                if (typeof jQuery !== 'undefined') {
                    jQuery('.datepicker').datepicker({
                        format: 'yyyy-mm-dd',
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
        },
        preConfirm: () => {
            const form = document.getElementById('cliente-form');
            if (!form.checkValidity()) {
                form.reportValidity();
                return false;
            }
            
            // Formatear fecha cliente a formato requerido
            let fechaClienteValue = '';
            if (document.getElementById('fecha-cliente').value) {
                const fecha = new Date(document.getElementById('fecha-cliente').value);
                if (!isNaN(fecha)) {
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const año = fecha.getFullYear();
                    const horas = String(fecha.getHours()).padStart(2, '0');
                    const minutos = String(fecha.getMinutes()).padStart(2, '0');
                    const segundos = String(fecha.getSeconds()).padStart(2, '0');
                    
                    fechaClienteValue = `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
                } else {
                    fechaClienteValue = document.getElementById('fecha-cliente').value;
                }
            }
            
            return {
                'id-contacto': document.getElementById('id-contacto').value,
                nombre: document.getElementById('nombre').value,
                telefono: document.getElementById('telefono').value,
                email: document.getElementById('email').value,
                'fecha-nacimiento': document.getElementById('fecha-nacimiento').value,
                genero: document.getElementById('genero').value,
                ubicacion: document.getElementById('ubicacion').value,
                'peso-inicial': document.getElementById('peso-inicial').value,
                'peso-deseado': document.getElementById('peso-deseado').value,
                'grasa-inicial': document.getElementById('grasa-inicial').value,
                'grasa-deseada': document.getElementById('grasa-deseada').value,
                'fecha-prospecto': document.getElementById('fecha-prospecto').value,
                'fecha-cliente': fechaClienteValue,
                canal: document.getElementById('canal').value,
                'numero-expediente': document.getElementById('numero-expediente').value,
                'numero-cliente': document.getElementById('numero-cliente').value,
                plan: document.getElementById('plan').value,
                finalizado: document.getElementById('finalizado').checked,
                fechaModificacion: new Date().toISOString().split('T')[0]
            };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                showLoading(true);
                
                // Preparar datos para la API
                const datosParaAPI = {};
                datosParaAPI[clienteId] = result.value;
                
                // Llamar a la API para actualizar
                try {
                    const response = await fetch(API_ENDPOINT, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            action: 'updateclientes',
                            data: {
                                action: 'updateclientes',
                                cliente: result.value
                            }
                        })
                    });
                    
                    // Actualizar datos localmente
                    window.apiData.clientes[clienteId] = {
                        ...window.apiData.clientes[clienteId],
                        ...result.value
                    };
                    
                    showMessage('Cliente actualizado correctamente', 'success');
                } catch (error) {
                    console.warn('Error al actualizar cliente en servidor:', error);
                    // Actualizar datos localmente de todos modos
                    window.apiData.clientes[clienteId] = {
                        ...window.apiData.clientes[clienteId],
                        ...result.value
                    };
                    showMessage('Cliente actualizado localmente', 'warning');
                }
                
                // Actualizar interfaz
                actualizarTablaClientes();
                
            } catch (error) {
                console.error('Error al actualizar cliente:', error);
                showMessage('Error al actualizar cliente: ' + error.message, 'error');
            } finally {
                showLoading(false);
            }
        }
    });
}

/**
 * Cargar clientes recientes para el dashboard
 * Esta función es llamada desde home.js
 */
function cargarClientes(contenedor, limite = 5) {
    if (!contenedor) return;
    
    try {
        // Obtener clientes
        const clientes = window.apiData.clientes || {};
        
        // Convertir a array y ordenar por fecha de alta (más recientes primero)
        const clientesArray = Object.values(clientes)
            .sort((a, b) => {
                const fechaA = a.fechaAlta ? new Date(a.fechaAlta) : new Date(0);
                const fechaB = b.fechaAlta ? new Date(b.fechaAlta) : new Date(0);
                return fechaB - fechaA;
            })
            .slice(0, limite);
        
        // Crear HTML para los clientes recientes
        if (clientesArray.length > 0) {
            const clientesHTML = clientesArray.map(cliente => {
                const finalizado = cliente.finalizado === true || cliente.finalizado === 'true';
                const tipoCliente = finalizado ? 'Finalizado' : 'Activo';
                
                return `
                    <tr class="clickable-row" data-id="${cliente.id}">
                        <td>${cliente.nombre}</td>
                        <td>${cliente.email || cliente.telefono || 'No disponible'}</td>
                        <td>
                            <span class="badge ${getTipoBadgeClass(tipoCliente)}">
                                ${tipoCliente}
                            </span>
                        </td>
                        <td>${cliente.fechaAlta || 'No disponible'}</td>
                    </tr>
                `;
            }).join('');
            
            contenedor.innerHTML = clientesHTML;
            
            // Agregar evento de clic a las filas
            const rows = contenedor.querySelectorAll('.clickable-row');
            rows.forEach(row => {
                row.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    // Cargar sección de clientes
                    loadContent('clientes', () => {
                        setTimeout(() => {
                            // Mostrar formulario de edición
                            mostrarFormularioCliente(id);
                        }, 500);
                    });
                });
            });
        } else {
            contenedor.innerHTML = '<tr><td colspan="4" class="text-center">No hay clientes recientes</td></tr>';
        }
    } catch (error) {
        console.error('Error al cargar clientes recientes:', error);
        contenedor.innerHTML = '<tr><td colspan="4" class="text-center">Error al cargar clientes</td></tr>';
    }
}

// Exportar función cargarClientes al objeto global window
window.cargarClientes = cargarClientes;

// Transformar datos del servidor a formato local
function transformarClientes(datosServidor) {
    const resultado = {};
    
    // Convertir cada objeto del servidor al formato esperado
    Object.entries(datosServidor).forEach(([id, cliente]) => {
        resultado[id] = {
            id: id,
            nombre: cliente.nombre || '',
            email: cliente.email || '',
            telefono: cliente.telefono || '',
            direccion: cliente.direccion || '',
            tipo: cliente.tipo || 'Nuevo',
            fechaAlta: cliente['fecha-alta'] || '',
            fechaModificacion: cliente['fecha-modificacion'] || '',
            numeroExpediente: cliente['numero-expediente'] || '',
            prospectoId: cliente['prospecto-id'] || '',
            notas: cliente.notas || ''
        };
    });
    
    return resultado;
}

/**
 * Mostrar confirmación para crear un nuevo expediente
 */
function mostrarConfirmacionNuevoExpediente(clienteId) {
    const cliente = window.apiData.clientes[clienteId];
    if (!cliente) {
        showMessage('Cliente no encontrado', 'error');
        return;
    }
    
    Swal.fire({
        title: 'Crear Nuevo Expediente',
        text: `¿Desea crear un nuevo expediente para el cliente ${cliente.nombre}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
    }).then((result) => {
        if (result.isConfirmed) {
            mostrarFormularioNuevoExpediente(cliente);
        }
    });
}

/**
 * Mostrar formulario para crear nuevo expediente
 */
function mostrarFormularioNuevoExpediente(cliente) {
    // Generar nuevo ID de expediente
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const año = fechaActual.getFullYear();
    const hora = String(fechaActual.getHours()).padStart(2, '0');
    const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
    const segundos = String(fechaActual.getSeconds()).padStart(2, '0');
    
    const nuevoExpedienteId = `EXP${dia}${mes}${año}${hora}${minutos}${segundos}`;
    
    // Incrementar número de expediente
    let numeroExpediente = '';
    if (cliente['numero-expediente']) {
        // Buscar el número más alto de expediente existente en clientes
        const clientes = Object.values(window.apiData.clientes || {});
        const maxExpNum = clientes.reduce((max, cli) => {
            const numExp = cli['numero-expediente'] || '';
            if (numExp.startsWith('EXP')) {
                const num = parseInt(numExp.substring(3), 10);
                return isNaN(num) ? max : Math.max(max, num);
            }
            return max;
        }, 0);
        
        numeroExpediente = `EXP${String(maxExpNum + 1).padStart(5, '0')}`;
    } else {
        numeroExpediente = 'EXP00001';
    }
    
    Swal.fire({
        title: 'Nuevo Expediente',
        html: `
            <form id="nuevo-expediente-form" class="text-start">
                <p>Cliente: <strong>${cliente.nombre}</strong></p>
                <p>Número de Cliente: <strong>${cliente['numero-cliente']}</strong></p>
                
                <div class="mb-3">
                    <label for="peso-inicial" class="form-label">Peso Inicial (kg)</label>
                    <input type="number" step="0.1" class="form-control" id="peso-inicial" value="${cliente['peso-inicial'] || ''}" required>
                </div>
                <div class="mb-3">
                    <label for="peso-deseado" class="form-label">Peso Deseado (kg)</label>
                    <input type="number" step="0.1" class="form-control" id="peso-deseado" value="${cliente['peso-deseado'] || ''}" required>
                </div>
                <div class="mb-3">
                    <label for="grasa-inicial" class="form-label">Grasa Inicial (%)</label>
                    <input type="number" step="0.1" class="form-control" id="grasa-inicial" value="${cliente['grasa-inicial'] || ''}" required>
                </div>
                <div class="mb-3">
                    <label for="grasa-deseada" class="form-label">Grasa Deseada (%)</label>
                    <input type="number" step="0.1" class="form-control" id="grasa-deseada" value="${cliente['grasa-deseada'] || ''}" required>
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
                <input type="hidden" id="nuevo-expediente-id" value="${nuevoExpedienteId}">
                <input type="hidden" id="numero-expediente" value="${numeroExpediente}">
            </form>
        `,
        width: '600px',
        showCancelButton: true,
        confirmButtonText: 'Crear Expediente',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        preConfirm: () => {
            const form = document.getElementById('nuevo-expediente-form');
            if (!form.checkValidity()) {
                form.reportValidity();
                return false;
            }
            
            return {
                'peso-inicial': document.getElementById('peso-inicial').value,
                'peso-deseado': document.getElementById('peso-deseado').value,
                'grasa-inicial': document.getElementById('grasa-inicial').value,
                'grasa-deseada': document.getElementById('grasa-deseada').value,
                'plan': document.getElementById('plan').value,
                'id-expediente': document.getElementById('nuevo-expediente-id').value,
                'numero-expediente': document.getElementById('numero-expediente').value
            };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                showLoading(true);
                
                // Crear nuevo cliente con los mismos datos pero nuevo expediente
                const fechaActual = new Date();
                const dia = String(fechaActual.getDate()).padStart(2, '0');
                const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
                const año = fechaActual.getFullYear();
                const hora = String(fechaActual.getHours()).padStart(2, '0');
                const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
                const segundos = String(fechaActual.getSeconds()).padStart(2, '0');
                
                // Formato fecha cliente para mostrar: DD/MM/AAAA HH:MM:SS
                const fechaClienteFormateada = `${dia}/${mes}/${año} ${hora}:${minutos}:${segundos}`;
                
                // Formato fecha para registro (sin hora)
                const fechaRegistroFormateada = `${dia}/${mes}/${año}`;
                
                const nuevoIdCliente = `CC${dia}${mes}${año}${hora}${minutos}${segundos}`;
                
                const nuevoCliente = {
                    "id-contacto": nuevoIdCliente,
                    "nombre": cliente.nombre,
                    "telefono": cliente.telefono,
                    "email": cliente.email,
                    "fecha-nacimiento": formatearFechaDDMMYYYY(cliente["fecha-nacimiento"]),
                    "genero": cliente.genero,
                    "ubicacion": cliente.ubicacion,
                    "peso-inicial": result.value["peso-inicial"],
                    "peso-deseado": result.value["peso-deseado"],
                    "grasa-inicial": result.value["grasa-inicial"],
                    "grasa-deseada": result.value["grasa-deseada"],
                    "fecha-prospecto": cliente["fecha-prospecto"],
                    "fecha-cliente": fechaClienteFormateada,
                    "canal": cliente.canal,
                    "numero-expediente": result.value["numero-expediente"],
                    "numero-cliente": cliente["numero-cliente"],
                    "plan": result.value.plan,
                    "finalizado": "false"
                };
                
                console.log("Nuevo cliente a crear:", nuevoCliente);
                console.log("Estado de finalizado:", nuevoCliente.finalizado);
                
                // Llamar a la API para crear cliente
                try {
                    console.log("Enviando a API:", JSON.stringify({
                        action: 'insertcliente',
                        data: {
                            action: 'insertcliente',
                            cliente: nuevoCliente
                        }
                    }));
                    
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
                                cliente: nuevoCliente
                            }
                        })
                    });
                    
                    // Actualizar datos locales
                    if (!window.apiData.clientes) window.apiData.clientes = {};
                    window.apiData.clientes[nuevoIdCliente] = {
                        ...nuevoCliente,
                        finalizado: "false"
                    };
                    
                    // Crear expediente inicial
                    const nuevoExpediente = {
                        "id-expediente": result.value["id-expediente"],
                        "fecha-registro": fechaRegistroFormateada,
                        "numero-expediente": result.value["numero-expediente"],
                        "peso-inicial": result.value["peso-inicial"],
                        "peso-deseado": result.value["peso-deseado"],
                        "peso-actual": result.value["peso-inicial"],
                        "grasa-inicial": result.value["grasa-inicial"],
                        "grasa-deseada": result.value["grasa-deseada"],
                        "grasa-actual": result.value["grasa-inicial"],
                        "dias-entrenamiento": 0,
                        "horas-entrenamiento": 0,
                        "nivel": "Principiante",
                        "disciplina": "",
                        "objetivo": "",
                        "condiciones-medicas": ""
                    };
                    
                    // Opcional: Llamar API para crear expediente si existe esa funcionalidad
                    // Actualizar datos locales
                    if (!window.apiData.expedientes) window.apiData.expedientes = {};
                    window.apiData.expedientes[result.value["id-expediente"]] = nuevoExpediente;
                    
                    showMessage('Nuevo expediente creado con éxito', 'success');
                    
                    // Actualizar la interfaz
                    actualizarTablaClientes();
                    
                } catch (error) {
                    console.warn('Error al crear nuevo expediente en servidor:', error);
                    showMessage('Error al crear expediente: ' + error.message, 'error');
                }
                
            } catch (error) {
                console.error('Error al crear nuevo expediente:', error);
                showMessage('Error al crear expediente: ' + error.message, 'error');
            } finally {
                showLoading(false);
            }
        }
    });
}

/**
 * Formatea una fecha en formato ISO a DD/MM/AAAA
 */
function formatearFechaDDMMYYYY(fechaISO) {
    if (!fechaISO) return '';
    try {
        const fecha = new Date(fechaISO);
        if (isNaN(fecha)) return fechaISO;
        
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        
        return `${dia}/${mes}/${año}`;
    } catch (e) {
        console.warn('Error al formatear fecha:', e);
        return fechaISO;
    }
} 
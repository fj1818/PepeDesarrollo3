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
    const contentElement = document.getElementById('content-expedientes');
    if (!contentElement) return;
    
    // Crear HTML para la sección
    contentElement.innerHTML = `
        <div class="section-header mb-4">
            <h1>Expedientes</h1>
            <p>Gestión de expedientes de clientes</p>
        </div>
        
        <div class="row mb-4">
            <div class="col-12">
                <div class="alert alert-info mb-3">
                    <i class="fas fa-info-circle me-2"></i> Por favor, seleccione una fecha de registro para continuar.
                </div>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-12">
                <div class="crm-card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title">
                            <i class="fas fa-folder me-2"></i> Filtros de Expedientes
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label for="filtro-nombre" class="form-label">Nombre</label>
                                <select class="form-control" id="filtro-nombre">
                                    <option value="">Seleccionar...</option>
                                    ${Object.values(window.apiData.clientes || {}).map(cliente => 
                                        `<option value="${cliente['id-contacto']}">${cliente.nombre}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label for="filtro-numero-cliente" class="form-label">Número de cliente</label>
                                <select class="form-control" id="filtro-numero-cliente">
                                    <option value="">Seleccionar...</option>
                                    ${Object.values(window.apiData.clientes || {})
                                        .filter(cliente => cliente['numero-cliente'])
                                        .map(cliente => 
                                            `<option value="${cliente['numero-cliente']}">${cliente['numero-cliente']}</option>`
                                        ).join('')}
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label for="filtro-numero-expediente" class="form-label">Número de expediente</label>
                                <select class="form-control" id="filtro-numero-expediente">
                                    <option value="">Seleccionar...</option>
                                    ${Object.values(window.apiData.clientes || {})
                                        .filter(cliente => cliente['numero-expediente'])
                                        .map(cliente => 
                                            `<option value="${cliente['numero-expediente']}">${cliente['numero-expediente']}</option>`
                                        ).join('')}
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label for="filtro-fecha-registro" class="form-label">Fecha de registro</label>
                                <select class="form-control" id="filtro-fecha-registro">
                                    <option value="">Seleccionar fecha</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-12 text-end">
                                <button class="btn btn-secondary" id="limpiar-filtros-btn">
                                    <i class="fas fa-eraser me-1"></i> Limpiar filtros
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-12">
                <div id="expediente-detalle-container">
                    <!-- Aquí se cargará el detalle del expediente -->
                </div>
            </div>
        </div>
    `;
    
    // Inicializar Select2 para búsqueda incremental
    try {
        if (typeof jQuery !== 'undefined' && typeof jQuery.fn.select2 !== 'undefined') {
            jQuery('.select2').select2({
                placeholder: "Buscar...",
                allowClear: true,
                width: '100%'
            });
        } else {
            console.warn('Select2 no está disponible. Los selectores no tendrán búsqueda incremental.');
        }
    } catch (error) {
        console.error('Error al inicializar Select2:', error);
    }
    
    // Configurar eventos
    setupExpedientesEventos();
}

/**
 * Configurar eventos de la sección de expedientes
 */
function setupExpedientesEventos() {
    // Obtener los elementos de filtro
    const filtroNombre = document.getElementById('filtro-nombre');
    const filtroNumeroCliente = document.getElementById('filtro-numero-cliente');
    const filtroNumeroExpediente = document.getElementById('filtro-numero-expediente');
    const filtroFechaRegistro = document.getElementById('filtro-fecha-registro');
    const btnLimpiarFiltros = document.getElementById('limpiar-filtros-btn');
    const expedienteDetalleContainer = document.getElementById('expediente-detalle-container');
    
    // Función para cargar fechas de registro asociadas a un número de expediente
    function cargarFechasDeRegistro(numeroExpediente, campoOrigen = null, autoSeleccionar = true) {
        if (!filtroFechaRegistro) return;
        
        // Obtener expedientes
        const expedientes = window.apiData.expedientes || {};
        const useSelect2 = typeof jQuery !== 'undefined' && typeof jQuery.fn.select2 !== 'undefined';
        
        console.log('Cargando fechas para expediente:', numeroExpediente);
        console.log('Total expedientes disponibles:', Object.keys(expedientes).length);
        console.log('Campo origen:', campoOrigen);
        console.log('Auto seleccionar:', autoSeleccionar);
        
        // Limpiar opciones actuales
        while (filtroFechaRegistro.options.length > 1) {
            filtroFechaRegistro.remove(1);
        }
        
        // Modificar el texto de la primera opción
        filtroFechaRegistro.options[0].text = 'Seleccionar fecha';
        
        // Buscar todos los expedientes con este número
        const expedientesConEsteNumero = Object.values(expedientes).filter(expediente => 
            expediente['numero-expediente'] === numeroExpediente);
        
        console.log('Expedientes encontrados con este número:', expedientesConEsteNumero.length);
        
        if (expedientesConEsteNumero.length === 0) {
            // Si no hay expedientes, mostrar mensaje
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = '';
            nuevaOpcion.text = 'No hay fechas disponibles';
            nuevaOpcion.disabled = true;
            filtroFechaRegistro.appendChild(nuevaOpcion);
            
            if (useSelect2) {
                jQuery(filtroFechaRegistro).val('').trigger('change.select2');
            } else {
                filtroFechaRegistro.value = '';
            }
            return;
        }
        
        // Recopilar y formatear fechas
        const fechasFormateadas = [];
        
        expedientesConEsteNumero.forEach(expediente => {
            console.log('Analizando expediente:', expediente);
            
            // Si no existe la propiedad fecha-registro, intentar con otras propiedades
            let fechaRegistro = expediente['fecha-registro'] || expediente['fechaRegistro'] || 
                                expediente['fecha-apertura'] || expediente['fechaApertura'];
            
            console.log('Fecha de registro encontrada:', fechaRegistro);
            
            if (fechaRegistro) {
                try {
                    // Parsear la fecha manualmente si está en formato DD/MM/YYYY o DD/MM/YYYY HH:MM:SS
                    let fecha;
                    
                    if (typeof fechaRegistro === 'string' && fechaRegistro.includes('/')) {
                        // Formato DD/MM/YYYY o DD/MM/YYYY HH:MM:SS
                        const partesFecha = fechaRegistro.split(' ')[0].split('/');
                        if (partesFecha.length === 3) {
                            const dia = parseInt(partesFecha[0], 10);
                            const mes = parseInt(partesFecha[1], 10) - 1; // Meses en JS van de 0-11
                            const anio = parseInt(partesFecha[2], 10);
                            
                            if (!isNaN(dia) && !isNaN(mes) && !isNaN(anio)) {
                                fecha = new Date(anio, mes, dia);
                                console.log('Fecha parseada manualmente:', fecha);
                            }
                        }
                    }
                    
                    // Si no se pudo parsear manualmente, intentar con el constructor Date
                    if (!fecha || isNaN(fecha)) {
                        fecha = new Date(fechaRegistro);
                        console.log('Fecha convertida con constructor:', fecha);
                    }
                    
                    if (!isNaN(fecha)) {
                        const dia = String(fecha.getDate()).padStart(2, '0');
                        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                        const anio = fecha.getFullYear();
                        const fechaFormateada = `${dia}/${mes}/${anio}`;
                        
                        console.log('Fecha formateada:', fechaFormateada);
                        
                        if (!fechasFormateadas.includes(fechaFormateada)) {
                            fechasFormateadas.push(fechaFormateada);
                            
                            const nuevaOpcion = document.createElement('option');
                            nuevaOpcion.value = fechaFormateada;
                            nuevaOpcion.text = fechaFormateada;
                            filtroFechaRegistro.appendChild(nuevaOpcion);
                            console.log('Opción añadida al selector:', fechaFormateada);
                        }
                    } else {
                        console.warn('La fecha no es válida:', fechaRegistro);
                    }
                } catch (e) {
                    console.warn('Error al formatear fecha:', e);
                }
            } else {
                console.warn('El expediente no tiene fecha de registro');
                
                // Usar la fecha actual como fallback si no hay fecha
                const fechaActual = new Date();
                const dia = String(fechaActual.getDate()).padStart(2, '0');
                const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
                const anio = fechaActual.getFullYear();
                const fechaFormateada = `${dia}/${mes}/${anio}`;
                
                if (!fechasFormateadas.includes(fechaFormateada)) {
                    fechasFormateadas.push(fechaFormateada);
                    
                    const nuevaOpcion = document.createElement('option');
                    nuevaOpcion.value = fechaFormateada;
                    nuevaOpcion.text = fechaFormateada + ' (Estimada)';
                    filtroFechaRegistro.appendChild(nuevaOpcion);
                    console.log('Opción de fecha actual añadida:', fechaFormateada);
                }
            }
        });
        
        console.log('Total fechas encontradas:', fechasFormateadas.length);
        
        // Verificar si debemos autoseleccionar una fecha o dejar para elección manual
        if (fechasFormateadas.length > 0 && autoSeleccionar) {
            if (useSelect2) {
                console.log('Actualizando Select2 con valor:', fechasFormateadas[0]);
                try {
                    // Destruir y reinicializar Select2 para asegurar que muestre las nuevas opciones
                    jQuery(filtroFechaRegistro).select2('destroy');
                    jQuery(filtroFechaRegistro).select2({
                        placeholder: "Buscar...",
                        allowClear: true,
                        width: '100%'
                    });
                    jQuery(filtroFechaRegistro).val(fechasFormateadas[0]).trigger('change');
                } catch (e) {
                    console.warn('Error al reinicializar Select2:', e);
                    jQuery(filtroFechaRegistro).val(fechasFormateadas[0]).trigger('change.select2');
                }
            } else {
                filtroFechaRegistro.value = fechasFormateadas[0];
            }
            
            // Actualizamos los detalles solo si venimos de un campo diferente a fecha-registro
            // y si no estamos en un bucle recursivo
            if (campoOrigen !== 'fecha-registro') {
                console.log('Actualizando filtros con fecha seleccionada:', fechasFormateadas[0]);
                // Llamada con timeout para evitar problemas de recursión
                setTimeout(() => {
                    actualizarFiltros('fecha-registro', fechasFormateadas[0]);
                }, 100);
            }
        } else if (fechasFormateadas.length > 0) {
            // No autoseleccionamos, solo dejamos disponibles las opciones para selección manual
            if (useSelect2) {
                try {
                    // Destruir y reinicializar Select2 para asegurar que muestre las nuevas opciones
                    jQuery(filtroFechaRegistro).select2('destroy');
                    jQuery(filtroFechaRegistro).select2({
                        placeholder: "Seleccionar fecha...",
                        allowClear: true,
                        width: '100%'
                    });
                    // No trigger change para no seleccionar automáticamente
                    jQuery(filtroFechaRegistro).val('');
                } catch (e) {
                    console.warn('Error al reinicializar Select2:', e);
                    jQuery(filtroFechaRegistro).val('');
                }
            } else {
                filtroFechaRegistro.value = '';
            }
        } else {
            // Si no se encontraron fechas a pesar de tener expedientes
            console.log('No se encontraron fechas válidas a pesar de tener expedientes');
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = '';
            nuevaOpcion.text = 'No hay fechas válidas';
            nuevaOpcion.disabled = true;
            filtroFechaRegistro.appendChild(nuevaOpcion);
            
            if (useSelect2) {
                jQuery(filtroFechaRegistro).val('').trigger('change.select2');
            } else {
                filtroFechaRegistro.value = '';
            }
        }
    }
    
    // Función para actualizar los filtros basados en la selección
    function actualizarFiltros(campoSeleccionado, valorSeleccionado) {
        // Obtener clientes y expedientes
        const clientes = window.apiData.clientes || {};
        const expedientes = window.apiData.expedientes || {};
        
        // Si no hay selección, no filtramos
        if (!valorSeleccionado) {
            mostrarMensajeSeleccion();
            return;
        }
        
        console.log(`Actualizando filtros - Campo: ${campoSeleccionado}, Valor: ${valorSeleccionado}`);
        
        // Cliente seleccionado
        let clienteSeleccionado = null;
        
        // Expediente seleccionado
        let expedienteSeleccionado = null;
        
        // Buscar cliente según el campo seleccionado
        if (campoSeleccionado === 'nombre') {
            clienteSeleccionado = Object.values(clientes).find(cliente => cliente['id-contacto'] === valorSeleccionado);
        } else if (campoSeleccionado === 'numero-cliente') {
            clienteSeleccionado = Object.values(clientes).find(cliente => cliente['numero-cliente'] === valorSeleccionado);
        } else if (campoSeleccionado === 'numero-expediente') {
            // Buscar cliente por número de expediente
            clienteSeleccionado = Object.values(clientes).find(cliente => cliente['numero-expediente'] === valorSeleccionado);
            // Buscar expediente por número de expediente del cliente
            if (clienteSeleccionado && clienteSeleccionado['numero-expediente']) {
                expedienteSeleccionado = Object.values(expedientes).find(expediente => 
                    expediente['numero-expediente'] === clienteSeleccionado['numero-expediente']);
            }
        } else if (campoSeleccionado === 'fecha-registro') {
            // Obtener la fecha formateada
            const fechaSeleccionada = valorSeleccionado;
            
            // Obtener numero-expediente actualmente seleccionado para mantener el contexto
            const numeroExpedienteActual = filtroNumeroExpediente ? filtroNumeroExpediente.value : null;
            
            // Buscar expedientes por fecha pero filtrar por el número de expediente actual si está disponible
            const expedientesConEstaFecha = Object.values(expedientes).filter(expediente => {
                // Si tenemos un número de expediente seleccionado, solo considerar expedientes con ese número
                if (numeroExpedienteActual && expediente['numero-expediente'] !== numeroExpedienteActual) {
                    return false;
                }
                
                if (!expediente['fecha-registro']) return false;
                
                try {
                    // Formatear la fecha del expediente para compararla
                    let fecha;
                    const fechaRegistro = expediente['fecha-registro'];
                    
                    // Parsear la fecha manualmente si está en formato DD/MM/YYYY o DD/MM/YYYY HH:MM:SS
                    if (typeof fechaRegistro === 'string' && fechaRegistro.includes('/')) {
                        // Formato DD/MM/YYYY o DD/MM/YYYY HH:MM:SS
                        const partesFecha = fechaRegistro.split(' ')[0].split('/');
                        if (partesFecha.length === 3) {
                            const dia = parseInt(partesFecha[0], 10);
                            const mes = parseInt(partesFecha[1], 10) - 1; // Meses en JS van de 0-11
                            const anio = parseInt(partesFecha[2], 10);
                            
                            if (!isNaN(dia) && !isNaN(mes) && !isNaN(anio)) {
                                fecha = new Date(anio, mes, dia);
                            }
                        }
                    }
                    
                    // Si no se pudo parsear manualmente, intentar con el constructor Date
                    if (!fecha || isNaN(fecha)) {
                        fecha = new Date(fechaRegistro);
                    }
                    
                    if (isNaN(fecha)) return false;
                    
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    const fechaFormateada = `${dia}/${mes}/${anio}`;
                    
                    return fechaFormateada === fechaSeleccionada;
                } catch (e) {
                    console.warn('Error al comparar fechas:', e);
                    return false;
                }
            });
            
            console.log('Expedientes encontrados con esta fecha:', expedientesConEstaFecha.length);
            
            if (expedientesConEstaFecha.length > 0) {
                // Tomamos el primer expediente encontrado
                expedienteSeleccionado = expedientesConEstaFecha[0];
                
                // Buscar cliente relacionado con el expediente
                if (expedienteSeleccionado['numero-expediente']) {
                    clienteSeleccionado = Object.values(clientes).find(cliente => 
                        cliente['numero-expediente'] === expedienteSeleccionado['numero-expediente']);
                }
            }
        }
        
        // Actualizar los selectores utilizando Select2 si está disponible
        const useSelect2 = typeof jQuery !== 'undefined' && typeof jQuery.fn.select2 !== 'undefined';
        
        // Actualizar los otros selectores sin disparar sus eventos
        if (clienteSeleccionado) {
            console.log('Cliente seleccionado:', clienteSeleccionado.nombre);
            
            // Si es un campo diferente al nombre, actualizar el selector de nombre
            if (campoSeleccionado !== 'nombre' && filtroNombre) {
                if (useSelect2) {
                    jQuery(filtroNombre).val(clienteSeleccionado['id-contacto'] || '').trigger('change.select2');
                } else {
                    filtroNombre.value = clienteSeleccionado['id-contacto'] || '';
                }
            }
            
            // Si es un campo diferente al número de cliente, actualizar el selector de número de cliente
            if (campoSeleccionado !== 'numero-cliente' && filtroNumeroCliente) {
                if (useSelect2) {
                    jQuery(filtroNumeroCliente).val(clienteSeleccionado['numero-cliente'] || '').trigger('change.select2');
                } else {
                    filtroNumeroCliente.value = clienteSeleccionado['numero-cliente'] || '';
                }
            }
            
            // Si es un campo diferente al número de expediente y el usuario ha seleccionado un expediente, actualizar el selector de fechas
            if (campoSeleccionado !== 'numero-expediente' && filtroNumeroExpediente && clienteSeleccionado && clienteSeleccionado['numero-expediente']) {
                if (useSelect2) {
                    jQuery(filtroNumeroExpediente).val(clienteSeleccionado['numero-expediente'] || '').trigger('change.select2');
                } else {
                    filtroNumeroExpediente.value = clienteSeleccionado['numero-expediente'] || '';
                }
                
                // Cargar fechas de registro asociadas al expediente
                // Si la selección viene del nombre o número de cliente, no autoseleccionamos fecha
                if (campoSeleccionado === 'nombre' || campoSeleccionado === 'numero-cliente') {
                    cargarFechasDeRegistro(clienteSeleccionado['numero-expediente'], campoSeleccionado, false);
                    
                    // Mostrar tarjeta con el botón para crear registro
                    expedienteDetalleContainer.innerHTML = `
                        <div class="card">
                            <div class="card-body text-center">
                                <h5 class="card-title mb-4">${clienteSeleccionado.nombre} - ${clienteSeleccionado['numero-expediente'] || 'Sin expediente'}</h5>
                                <div class="d-grid gap-2 col-md-6 mx-auto">
                                    <button class="btn btn-success btn-crear-registro" data-numero-expediente="${clienteSeleccionado['numero-expediente'] || ''}">
                                        <i class="fas fa-plus-circle me-2"></i> Crear Registro
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // Asignar evento al botón
                    const btnCrearRegistro = expedienteDetalleContainer.querySelector('.btn-crear-registro');
                    if (btnCrearRegistro) {
                        btnCrearRegistro.addEventListener('click', function() {
                            const numExpediente = this.getAttribute('data-numero-expediente');
                            mostrarFormularioRegistro(numExpediente, false);
                        });
                    }
                    
                    return; // Detenemos la ejecución aquí
                } else if (campoSeleccionado !== 'fecha-registro') {
                    // Si venimos de otro campo que no sea fecha, cargar fechas normalmente
                    cargarFechasDeRegistro(clienteSeleccionado['numero-expediente'], campoSeleccionado);
                }
            }
            
            // Buscar expediente si no lo tenemos ya
            if (!expedienteSeleccionado && clienteSeleccionado['numero-expediente'] && campoSeleccionado === 'fecha-registro') {
                // Cuando seleccionamos una fecha, buscar el expediente específico con esa fecha
                const numeroExpediente = clienteSeleccionado['numero-expediente'];
                const fechaSeleccionada = valorSeleccionado;
                
                const expedientesConEstaFecha = Object.values(expedientes).filter(exp => {
                    if (exp['numero-expediente'] !== numeroExpediente) return false;
                    
                    try {
                        // Formatear la fecha del expediente para compararla
                        let fecha;
                        const fechaRegistro = exp['fecha-registro'];
                        
                        if (typeof fechaRegistro === 'string' && fechaRegistro.includes('/')) {
                            const partesFecha = fechaRegistro.split(' ')[0].split('/');
                            if (partesFecha.length === 3) {
                                const dia = parseInt(partesFecha[0], 10);
                                const mes = parseInt(partesFecha[1], 10) - 1;
                                const anio = parseInt(partesFecha[2], 10);
                                
                                if (!isNaN(dia) && !isNaN(mes) && !isNaN(anio)) {
                                    fecha = new Date(anio, mes, dia);
                                }
                            }
                        }
                        
                        if (!fecha || isNaN(fecha)) {
                            fecha = new Date(fechaRegistro);
                        }
                        
                        if (isNaN(fecha)) return false;
                        
                        const dia = String(fecha.getDate()).padStart(2, '0');
                        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                        const anio = fecha.getFullYear();
                        const fechaFormateada = `${dia}/${mes}/${anio}`;
                        
                        return fechaFormateada === fechaSeleccionada;
                    } catch (e) {
                        console.warn('Error al comparar fechas para expediente específico:', e);
                        return false;
                    }
                });
                
                if (expedientesConEstaFecha.length > 0) {
                    expedienteSeleccionado = expedientesConEstaFecha[0];
                    console.log('Expediente específico encontrado para fecha seleccionada:', expedienteSeleccionado);
                }
            } else if (!expedienteSeleccionado && clienteSeleccionado['numero-expediente']) {
                expedienteSeleccionado = Object.values(expedientes).find(expediente => 
                    expediente['numero-expediente'] === clienteSeleccionado['numero-expediente']);
            }

            // Mostrar detalles del cliente y expediente
            mostrarDetallesClienteExpediente(clienteSeleccionado, expedienteSeleccionado);
        } else if (expedienteSeleccionado) {
            // Ya tenemos el expediente pero no el cliente, buscar de nuevo por si acaso
            clienteSeleccionado = Object.values(clientes).find(cliente => 
                cliente['numero-expediente'] === expedienteSeleccionado['numero-expediente']);
                
            // Actualizar campos si tenemos el cliente
            if (clienteSeleccionado) {
                if (campoSeleccionado !== 'nombre' && filtroNombre) {
                    if (useSelect2) {
                        jQuery(filtroNombre).val(clienteSeleccionado['id-contacto'] || '').trigger('change.select2');
                    } else {
                        filtroNombre.value = clienteSeleccionado['id-contacto'] || '';
                    }
                }
                
                if (campoSeleccionado !== 'numero-cliente' && filtroNumeroCliente) {
                    if (useSelect2) {
                        jQuery(filtroNumeroCliente).val(clienteSeleccionado['numero-cliente'] || '').trigger('change.select2');
                    } else {
                        filtroNumeroCliente.value = clienteSeleccionado['numero-cliente'] || '';
                    }
                }
            }
            
            // Actualizar número de expediente si no fue el campo seleccionado
            if (campoSeleccionado !== 'numero-expediente' && filtroNumeroExpediente && expedienteSeleccionado['numero-expediente']) {
                if (useSelect2) {
                    jQuery(filtroNumeroExpediente).val(expedienteSeleccionado['numero-expediente'] || '').trigger('change.select2');
                } else {
                    filtroNumeroExpediente.value = expedienteSeleccionado['numero-expediente'] || '';
                }
            }
            
            // Mostrar detalles
            mostrarDetallesClienteExpediente(clienteSeleccionado, expedienteSeleccionado);
        } else {
            // No encontramos datos relacionados
            mostrarMensajeNoEncontrado();
        }
        
        // Si el campo seleccionado es el número de expediente, cargar sus fechas asociadas
        // (Independiente de si encontramos cliente o expediente)
        if (campoSeleccionado === 'numero-expediente' && valorSeleccionado) {
            cargarFechasDeRegistro(valorSeleccionado, 'fecha-registro');
        }
    }
    
    // Función para mostrar detalles del cliente y expediente
    function mostrarDetallesClienteExpediente(cliente, expediente) {
        if (!expedienteDetalleContainer) return;
        
        if (!cliente && !expediente) {
            mostrarMensajeNoEncontrado();
            return;
        }
        
        // Determinar si hay fechas disponibles para este expediente
        const expedientes = window.apiData.expedientes || {};
        const numeroExpediente = expediente ? expediente['numero-expediente'] : (cliente ? cliente['numero-expediente'] : null);
        let hayFechas = false;
        
        if (numeroExpediente) {
            const expedientesConEsteNumero = Object.values(expedientes).filter(exp => 
                exp['numero-expediente'] === numeroExpediente && exp['fecha-registro']);
            hayFechas = expedientesConEsteNumero.length > 0;
        }
        
        // Crear contenido HTML con solo el botón correspondiente
        let htmlContent = `
            <div class="card">
                <div class="card-body text-center">
                    <h5 class="card-title mb-4">${cliente ? cliente.nombre : 'Cliente'} - ${numeroExpediente || 'Sin expediente'}</h5>
                    <div class="d-grid gap-2 col-md-6 mx-auto">
        `;
        
        if (hayFechas) {
            htmlContent += `
                <button class="btn btn-primary btn-cargar-registro" data-numero-expediente="${numeroExpediente}">
                    <i class="fas fa-folder-open me-2"></i> Cargar Registro
                </button>
            `;
        } else {
            htmlContent += `
                <button class="btn btn-success btn-crear-registro" data-numero-expediente="${numeroExpediente}">
                    <i class="fas fa-plus-circle me-2"></i> Crear Registro
                </button>
            `;
        }
        
        htmlContent += `
                    </div>
                </div>
            </div>
        `;
        
        expedienteDetalleContainer.innerHTML = htmlContent;
        
        // Asignar eventos a los nuevos botones
        const btnCargarRegistro = expedienteDetalleContainer.querySelector('.btn-cargar-registro');
        if (btnCargarRegistro) {
            btnCargarRegistro.addEventListener('click', function() {
                const numExpediente = this.getAttribute('data-numero-expediente');
                mostrarFormularioRegistro(numExpediente, true);
            });
        }
        
        const btnCrearRegistro = expedienteDetalleContainer.querySelector('.btn-crear-registro');
        if (btnCrearRegistro) {
            btnCrearRegistro.addEventListener('click', function() {
                const numExpediente = this.getAttribute('data-numero-expediente');
                mostrarFormularioRegistro(numExpediente, false);
            });
        }
    }
    
    // Función para mostrar mensaje de selección
    function mostrarMensajeSeleccion() {
        if (!expedienteDetalleContainer) return;
        
        // Obtener los valores de los filtros
        const nombreSeleccionado = filtroNombre ? filtroNombre.value : '';
        const numeroClienteSeleccionado = filtroNumeroCliente ? filtroNumeroCliente.value : '';
        const numeroExpedienteSeleccionado = filtroNumeroExpediente ? filtroNumeroExpediente.value : '';
        
        // Verificar si hay al menos un filtro seleccionado, excepto fecha
        const haySeleccion = nombreSeleccionado || numeroClienteSeleccionado || numeroExpedienteSeleccionado;
        
        // Si hay selección pero no hay fecha seleccionada, mostrar botón de crear
        if (haySeleccion) {
            // Buscar cliente seleccionado
            const clientes = window.apiData.clientes || {};
            let clienteSeleccionado = null;
            
            if (nombreSeleccionado) {
                clienteSeleccionado = Object.values(clientes).find(c => c['id-contacto'] === nombreSeleccionado);
            } else if (numeroClienteSeleccionado) {
                clienteSeleccionado = Object.values(clientes).find(c => c['numero-cliente'] === numeroClienteSeleccionado);
            } else if (numeroExpedienteSeleccionado) {
                clienteSeleccionado = Object.values(clientes).find(c => c['numero-expediente'] === numeroExpedienteSeleccionado);
            }
            
            if (clienteSeleccionado) {
                expedienteDetalleContainer.innerHTML = `
                    <div class="card">
                        <div class="card-body text-center">
                            <h5 class="card-title mb-4">${clienteSeleccionado.nombre} - ${clienteSeleccionado['numero-expediente'] || 'Sin expediente'}</h5>
                            <div class="d-grid gap-2 col-md-6 mx-auto">
                                <button class="btn btn-success btn-crear-registro" data-numero-expediente="${clienteSeleccionado['numero-expediente'] || ''}">
                                    <i class="fas fa-plus-circle me-2"></i> Crear Registro
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Asignar evento al botón
                const btnCrearRegistro = expedienteDetalleContainer.querySelector('.btn-crear-registro');
                if (btnCrearRegistro) {
                    btnCrearRegistro.addEventListener('click', function() {
                        const numExpediente = this.getAttribute('data-numero-expediente');
                        mostrarFormularioRegistro(numExpediente, false);
                    });
                }
                
                return;
            }
        }
        
        // No mostrar mensaje por defecto, el área queda vacía ya que tenemos instrucciones en la parte superior
        expedienteDetalleContainer.innerHTML = '';
    }
    
    // Función para mostrar mensaje de no encontrado
    function mostrarMensajeNoEncontrado() {
        if (!expedienteDetalleContainer) return;
        expedienteDetalleContainer.innerHTML = `
            <div class="alert alert-warning">
                No se encontraron datos para los criterios seleccionados.
            </div>
        `;
    }
    
    // Función para limpiar todos los filtros
    function limpiarFiltros() {
        const useSelect2 = typeof jQuery !== 'undefined' && typeof jQuery.fn.select2 !== 'undefined';
        
        if (filtroNombre) {
            if (useSelect2) {
                jQuery(filtroNombre).val('').trigger('change.select2');
            } else {
                filtroNombre.value = '';
            }
        }
        
        if (filtroNumeroCliente) {
            if (useSelect2) {
                jQuery(filtroNumeroCliente).val('').trigger('change.select2');
            } else {
                filtroNumeroCliente.value = '';
            }
        }
        
        if (filtroNumeroExpediente) {
            if (useSelect2) {
                jQuery(filtroNumeroExpediente).val('').trigger('change.select2');
            } else {
                filtroNumeroExpediente.value = '';
            }
        }
        
        if (filtroFechaRegistro) {
            // Limpiar opciones de fechas
            while (filtroFechaRegistro.options.length > 1) {
                filtroFechaRegistro.remove(1);
            }
            
            // Restaurar opción inicial
            filtroFechaRegistro.options[0].text = 'Seleccione un expediente primero';
            
            if (useSelect2) {
                jQuery(filtroFechaRegistro).val('').trigger('change.select2');
            } else {
                filtroFechaRegistro.value = '';
            }
        }
        
        mostrarMensajeSeleccion();
    }
    
    // Asignar eventos a los selectores
    if (filtroNombre) {
        filtroNombre.addEventListener('change', function() {
            actualizarFiltros('nombre', this.value);
        });
    }
    
    if (filtroNumeroCliente) {
        filtroNumeroCliente.addEventListener('change', function() {
            actualizarFiltros('numero-cliente', this.value);
        });
    }
    
    if (filtroNumeroExpediente) {
        filtroNumeroExpediente.addEventListener('change', function() {
            actualizarFiltros('numero-expediente', this.value);
        });
    }
    
    if (filtroFechaRegistro) {
        filtroFechaRegistro.addEventListener('change', function() {
            actualizarFiltros('fecha-registro', this.value);
        });
    }
    
    // Asignar evento al botón de limpiar filtros
    if (btnLimpiarFiltros) {
        btnLimpiarFiltros.addEventListener('click', limpiarFiltros);
    }
    
    // Inicialmente mostrar mensaje de selección
    mostrarMensajeSeleccion();
}

/**
 * Mostrar formulario para registrar o cargar un registro de expediente
 * @param {string} numeroExpediente - Número de expediente
 * @param {boolean} esCargar - Indica si se está cargando un registro existente
 */
function mostrarFormularioRegistro(numeroExpediente, esCargar) {
    // Obtener el contenedor de detalles del expediente
    const expedienteDetalleContainer = document.getElementById('expediente-detalle-container');
    if (!expedienteDetalleContainer) return;
    
    // Obtener datos de clientes y expedientes
    const clientes = window.apiData.clientes || {};
    const expedientes = window.apiData.expedientes || {};
    
    // Buscar el cliente asociado al número de expediente
    const clienteAsociado = Object.values(clientes).find(cliente => 
        cliente['numero-expediente'] === numeroExpediente);
    
    console.log('Cliente asociado encontrado:', clienteAsociado);
    
    // Obtener el expediente si estamos cargando
    let datosRegistro = {
        'id-expediente': '',  // Este valor será generado automáticamente en guardarRegistroExpediente
        'fecha-registro': '',  // Este valor será generado automáticamente en guardarRegistroExpediente
        'numero-expediente': numeroExpediente,
        'peso-inicial': clienteAsociado ? clienteAsociado['peso-inicial'] || '' : '',
        'peso-deseado': clienteAsociado ? clienteAsociado['peso-deseado'] || '' : '',
        'peso-actual': '',
        'grasa-inicial': clienteAsociado ? clienteAsociado['grasa-inicial'] || '' : '',
        'grasa-deseada': clienteAsociado ? clienteAsociado['grasa-deseada'] || '' : '',
        'grasa-actual': '',
        'dias-entrenamiento': '',
        'horas-entrenamiento': '',
        'nivel': '',
        'disciplina': [],
        'objetivo': [],
        'condiciones-medicas': ''
    };
    
    let expedienteActual = null;
    
    if (esCargar && numeroExpediente) {
        // Si es cargar, buscar el expediente por número
        const expedientesConEsteNumero = Object.values(expedientes).filter(exp => 
            exp['numero-expediente'] === numeroExpediente);
        
        if (expedientesConEsteNumero.length > 0) {
            // Tomar el primero disponible o mostrar selector
            expedienteActual = expedientesConEsteNumero[0];
            
            // Llenar datos del expediente - esto sobrescribirá los valores iniciales si existen
            Object.keys(datosRegistro).forEach(key => {
                if (expedienteActual[key] !== undefined) {
                    datosRegistro[key] = expedienteActual[key];
                }
            });
        }
    }
    
    // Verificar los valores después de cargar datos
    console.log('Datos de registro después de cargar:', {
        'peso-inicial': datosRegistro['peso-inicial'],
        'peso-deseado': datosRegistro['peso-deseado'],
        'grasa-inicial': datosRegistro['grasa-inicial'],
        'grasa-deseada': datosRegistro['grasa-deseada']
    });
    
    // Obtener todos los expedientes con este número para gráficos
    const historialExpedientes = Object.values(expedientes).filter(exp => 
        exp['numero-expediente'] === numeroExpediente && exp['fecha-registro']);
    
    // Ordenar expedientes por fecha
    historialExpedientes.sort((a, b) => {
        // Parsear fechas en formato DD/MM/YYYY
        const parseDate = dateStr => {
            if (!dateStr) return null;
            const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
            return new Date(year, month - 1, day);
        };
        
        const dateA = parseDate(a['fecha-registro']);
        const dateB = parseDate(b['fecha-registro']);
        
        if (!dateA || !dateB) return 0;
        return dateA - dateB;
    });
    
    console.log('Historial de expedientes encontrados:', historialExpedientes.length);
    
    // Obtener la fecha actual para el valor por defecto
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const anio = fechaActual.getFullYear();
    const fechaActualFormateada = `${dia}/${mes}/${anio}`;
    
    // Formatear la fecha de registro para eliminar la hora si existe
    let fechaRegistroFormateada = datosRegistro['fecha-registro'] || fechaActualFormateada;
    
    // Convertir formato ISO a DD/MM/AAAA si es necesario
    if (fechaRegistroFormateada.includes('T')) {
        try {
            const fecha = new Date(fechaRegistroFormateada);
            if (!isNaN(fecha)) {
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                const anio = fecha.getFullYear();
                fechaRegistroFormateada = `${dia}/${mes}/${anio}`;
            }
        } catch (e) {
            console.error('Error al formatear fecha ISO:', e);
        }
    } else if (fechaRegistroFormateada.includes(' ')) {
        fechaRegistroFormateada = fechaRegistroFormateada.split(' ')[0];
    }
    
    // Crear opciones para los selectores
    const opcionesDias = [
        '<option value="">Seleccionar</option>'
    ].concat(Array.from({length: 7}, (_, i) => {
        const valor = i + 1;
        return `<option value="${valor}" ${datosRegistro['dias-entrenamiento'] == valor ? 'selected' : ''}>${valor} día${valor > 1 ? 's' : ''}</option>`;
    })).join('');
    
    const opcionesHoras = [
        '<option value="">Seleccionar</option>',
        {valor: '0.5', texto: '30 minutos'},
        {valor: '1', texto: '1 hora'},
        {valor: '1.5', texto: '1 hora y media'},
        {valor: '2', texto: '2 horas'},
        {valor: '2.5', texto: '2 horas y media'},
        {valor: '3', texto: '3 horas'},
        {valor: '3.5', texto: '3 horas y media'},
        {valor: '4', texto: '4 horas'}
    ].map(opcion => {
        if (typeof opcion === 'string') return opcion;
        return `<option value="${opcion.valor}" ${datosRegistro['horas-entrenamiento'] == opcion.valor ? 'selected' : ''}>${opcion.texto}</option>`;
    }).join('');
    
    const opcionesNivel = [
        '<option value="">Seleccionar</option>',
        {valor: 'Principiante', texto: 'Principiante'},
        {valor: 'Intermedio', texto: 'Intermedio'},
        {valor: 'Avanzado', texto: 'Avanzado'}
    ].map(opcion => {
        if (typeof opcion === 'string') return opcion;
        return `<option value="${opcion.valor}" ${datosRegistro['nivel'] === opcion.valor ? 'selected' : ''}>${opcion.texto}</option>`;
    }).join('');
    
    // Crear opciones disciplina como checkboxes
    const opcionesDisciplina = [
        {valor: 'Levantamiento de pesas', texto: 'Levantamiento de pesas'},
        {valor: 'CrossFit', texto: 'CrossFit'},
        {valor: 'Yoga', texto: 'Yoga'},
        {valor: 'Pilates', texto: 'Pilates'},
        {valor: 'Cardio', texto: 'Cardio'},
        {valor: 'Natación', texto: 'Natación'},
        {valor: 'Ciclismo', texto: 'Ciclismo'},
        {valor: 'Running', texto: 'Running'},
        {valor: 'Artes marciales', texto: 'Artes marciales'},
        {valor: 'Entrenamiento funcional', texto: 'Entrenamiento funcional'},
        {valor: 'HIIT', texto: 'HIIT (Entrenamiento por intervalos)'},
        {valor: 'Calistenia', texto: 'Calistenia'}
    ].map((opcion, index) => {
        const seleccionado = datosRegistro['disciplina'] && datosRegistro['disciplina'].includes(opcion.valor);
        const id = `disciplina-${index}`;
        return `
            <div class="form-check col-md-6">
                <input class="form-check-input disciplina-check" type="checkbox" value="${opcion.valor}" id="${id}" ${seleccionado ? 'checked' : ''}>
                <label class="form-check-label" for="${id}">${opcion.texto}</label>
            </div>
        `;
    }).join('');
    
    // Crear opciones objetivo como checkboxes
    const opcionesObjetivo = [
        {valor: 'Ganar masa muscular', texto: 'Ganar masa muscular'},
        {valor: 'Bajar de peso', texto: 'Bajar de peso'},
        {valor: 'Mejorar la condición física', texto: 'Mejorar la condición física'},
        {valor: 'Mejorar apariencia', texto: 'Mejorar apariencia'},
        {valor: 'Rehabilitación', texto: 'Rehabilitación'},
        {valor: 'Preparación deportiva', texto: 'Preparación deportiva'},
        {valor: 'Mantenimiento', texto: 'Mantenimiento'},
        {valor: 'Tonificación', texto: 'Tonificación'}
    ].map((opcion, index) => {
        const seleccionado = datosRegistro['objetivo'] && datosRegistro['objetivo'].includes(opcion.valor);
        const id = `objetivo-${index}`;
        return `
            <div class="form-check col-md-6">
                <input class="form-check-input objetivo-check" type="checkbox" value="${opcion.valor}" id="${id}" ${seleccionado ? 'checked' : ''}>
                <label class="form-check-label" for="${id}">${opcion.texto}</label>
            </div>
        `;
    }).join('');
    
    // Preparar contenido para la pestaña de avance
    let contenidoAvance = '';
    
    if (historialExpedientes.length === 0) {
        contenidoAvance = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i> No hay registros disponibles para mostrar el avance.
            </div>
        `;
    } else {
        // Preparar datos para los gráficos
        const fechas = historialExpedientes.map(exp => {
            // Quitar la parte de horas si existe
            if (exp['fecha-registro'] && exp['fecha-registro'].includes(' ')) {
                return exp['fecha-registro'].split(' ')[0]; // Solo tomar la parte de la fecha
            }
            return exp['fecha-registro'];
        });
        
        // Datos para gráfico de peso
        const pesoInicial = parseFloat(historialExpedientes[0]['peso-inicial']) || 0;
        const pesoDeseado = parseFloat(historialExpedientes[0]['peso-deseado']) || 0;
        const pesosActuales = historialExpedientes.map(exp => parseFloat(exp['peso-actual']) || 0);
        
        // Datos para gráfico de grasa
        const grasaInicial = parseFloat(historialExpedientes[0]['grasa-inicial']) || 0;
        const grasaDeseada = parseFloat(historialExpedientes[0]['grasa-deseada']) || 0;
        const grasasActuales = historialExpedientes.map(exp => parseFloat(exp['grasa-actual']) || 0);
        
        // Datos para gráficos de entrenamiento separados
        const diasEntrenamiento = historialExpedientes.map(exp => parseFloat(exp['dias-entrenamiento']) || 0);
        const horasEntrenamiento = historialExpedientes.map(exp => parseFloat(exp['horas-entrenamiento']) || 0);
        
        contenidoAvance = `
            <div class="row mb-4">
                <div class="col-12">
                    <h5 class="mb-3">Evolución de peso</h5>
                    <canvas id="grafico-peso" width="400" height="200"></canvas>
                </div>
            </div>
            <div class="row mb-4">
                <div class="col-12">
                    <h5 class="mb-3">Evolución de porcentaje de grasa</h5>
                    <canvas id="grafico-grasa" width="400" height="200"></canvas>
                </div>
            </div>
            <div class="row mb-4">
                <div class="col-12">
                    <h5 class="mb-3">Días de entrenamiento por semana</h5>
                    <canvas id="grafico-dias" width="400" height="200"></canvas>
                </div>
            </div>
            <div class="row mb-4">
                <div class="col-12">
                    <h5 class="mb-3">Horas de entrenamiento por semana</h5>
                    <canvas id="grafico-horas" width="400" height="200"></canvas>
                </div>
            </div>
        `;
    }
    
    // Crear el HTML del contenedor con pestañas
    let htmlFormulario = `
        <div class="card mt-4">
            <div class="card-header">
                <ul class="nav nav-tabs card-header-tabs" id="expediente-tabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="registro-tab" data-bs-toggle="tab" 
                            data-bs-target="#registro-tab-pane" type="button" role="tab" 
                            aria-controls="registro-tab-pane" aria-selected="true">
                            <i class="fas fa-clipboard-list me-1"></i> Registro
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="avance-tab" data-bs-toggle="tab" 
                            data-bs-target="#avance-tab-pane" type="button" role="tab" 
                            aria-controls="avance-tab-pane" aria-selected="false">
                            <i class="fas fa-chart-line me-1"></i> Avance
                        </button>
                    </li>
                </ul>
            </div>
            <div class="card-body">
                <div class="tab-content" id="expedienteTabContent">
                    <div class="tab-pane fade show active" id="registro-tab-pane" role="tabpanel" aria-labelledby="registro-tab" tabindex="0">
                        <h5 class="card-title mb-3">${esCargar ? 'Cargar Registro de Expediente' : 'Crear Nuevo Registro'}</h5>
                        ${clienteAsociado ? `
                        <div class="alert alert-info mb-3">
                            <i class="fas fa-info-circle me-2"></i> 
                            Datos cargados del cliente: <strong>${clienteAsociado.nombre || 'Cliente'}</strong>
                        </div>
                        ` : ''}
                        <form id="registro-expediente-form" class="needs-validation" novalidate>
                            <!-- Campos ocultos solo para edición/actualización -->
                            ${esCargar ? `<input type="hidden" id="id-expediente" value="${datosRegistro['id-expediente']}">` : ''}
                            <input type="hidden" id="numero-expediente" value="${datosRegistro['numero-expediente']}">
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="fecha-registro" class="form-label">
                                        <i class="far fa-calendar-alt me-1"></i> Fecha de Registro
                                    </label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="fecha-registro" 
                                            value="${esCargar ? fechaRegistroFormateada : fechaActualFormateada}" 
                                            ${esCargar ? '' : 'readonly'} required>
                                        <span class="input-group-text"><i class="far fa-calendar"></i></span>
                                    </div>
                                    ${!esCargar ? '<small class="text-muted">La fecha actual se usará automáticamente</small>' : ''}
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-4">
                                    <label for="peso-inicial" class="form-label">
                                        <i class="fas fa-weight me-1"></i> Peso Inicial (kg)
                                    </label>
                                    <input type="number" step="0.1" class="form-control" id="peso-inicial" 
                                        value="${datosRegistro['peso-inicial']}" required>
                                    ${clienteAsociado && clienteAsociado['peso-inicial'] ? '<small class="text-muted">Datos obtenidos del cliente</small>' : ''}
                                </div>
                                <div class="col-md-4">
                                    <label for="peso-deseado" class="form-label">
                                        <i class="fas fa-bullseye me-1"></i> Peso Deseado (kg)
                                    </label>
                                    <input type="number" step="0.1" class="form-control" id="peso-deseado" 
                                        value="${datosRegistro['peso-deseado']}" required>
                                    ${clienteAsociado && clienteAsociado['peso-deseado'] ? '<small class="text-muted">Datos obtenidos del cliente</small>' : ''}
                                </div>
                                <div class="col-md-4">
                                    <label for="peso-actual" class="form-label">
                                        <i class="fas fa-balance-scale me-1"></i> Peso Actual (kg)
                                    </label>
                                    <input type="number" step="0.1" class="form-control" id="peso-actual" 
                                        value="${datosRegistro['peso-actual']}" required>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-4">
                                    <label for="grasa-inicial" class="form-label">
                                        <i class="fas fa-percentage me-1"></i> Grasa Inicial (%)
                                    </label>
                                    <input type="number" step="0.1" class="form-control" id="grasa-inicial" 
                                        value="${datosRegistro['grasa-inicial']}" required>
                                    ${clienteAsociado && clienteAsociado['grasa-inicial'] ? '<small class="text-muted">Datos obtenidos del cliente</small>' : ''}
                                </div>
                                <div class="col-md-4">
                                    <label for="grasa-deseada" class="form-label">
                                        <i class="fas fa-bullseye me-1"></i> Grasa Deseada (%)
                                    </label>
                                    <input type="number" step="0.1" class="form-control" id="grasa-deseada" 
                                        value="${datosRegistro['grasa-deseada']}" required>
                                    ${clienteAsociado && clienteAsociado['grasa-deseada'] ? '<small class="text-muted">Datos obtenidos del cliente</small>' : ''}
                                </div>
                                <div class="col-md-4">
                                    <label for="grasa-actual" class="form-label">
                                        <i class="fas fa-percentage me-1"></i> Grasa Actual (%)
                                    </label>
                                    <input type="number" step="0.1" class="form-control" id="grasa-actual" 
                                        value="${datosRegistro['grasa-actual']}" required>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-4">
                                    <label for="dias-entrenamiento" class="form-label">
                                        <i class="far fa-calendar-check me-1"></i> Días de Entrenamiento
                                    </label>
                                    <select class="form-select" id="dias-entrenamiento" required>
                                        ${opcionesDias}
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label for="horas-entrenamiento" class="form-label">
                                        <i class="far fa-clock me-1"></i> Horas de Entrenamiento
                                    </label>
                                    <select class="form-select" id="horas-entrenamiento" required>
                                        ${opcionesHoras}
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label for="nivel" class="form-label">
                                        <i class="fas fa-trophy me-1"></i> Nivel
                                    </label>
                                    <select class="form-select" id="nivel" required>
                                        ${opcionesNivel}
                                    </select>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">
                                        <i class="fas fa-running me-1"></i> Disciplina Deportiva
                                    </label>
                                    <div class="row px-2">
                                        ${opcionesDisciplina}
                                    </div>
                                    <div class="form-text">Puedes seleccionar múltiples disciplinas</div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">
                                        <i class="fas fa-flag-checkered me-1"></i> Objetivo
                                    </label>
                                    <div class="row px-2">
                                        ${opcionesObjetivo}
                                    </div>
                                    <div class="form-text">Puedes seleccionar múltiples objetivos</div>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-12">
                                    <label for="condiciones-medicas" class="form-label">
                                        <i class="fas fa-heartbeat me-1"></i> Condiciones Médicas
                                    </label>
                                    <textarea class="form-control" id="condiciones-medicas" rows="3">${datosRegistro['condiciones-medicas']}</textarea>
                                </div>
                            </div>
                            
                            <div class="d-flex justify-content-end">
                                <button type="button" class="btn btn-secondary me-2" id="btn-cancelar-registro">
                                    <i class="fas fa-times me-1"></i> Cancelar
                                </button>
                                <button type="button" class="btn btn-primary" id="btn-guardar-registro">
                                    <i class="fas fa-save me-1"></i> ${esCargar ? 'Actualizar Registro' : 'Guardar Registro'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="tab-pane fade" id="avance-tab-pane" role="tabpanel" aria-labelledby="avance-tab" tabindex="0">
                        ${contenidoAvance}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar el formulario al contenedor
    expedienteDetalleContainer.innerHTML = htmlFormulario;
    
    // Verificar si se necesita cargar la librería Chart.js
    if (historialExpedientes.length > 0) {
        // Asegurar que Chart.js esté disponible
        if (typeof Chart === 'undefined') {
            console.log('Cargando Chart.js dinámicamente');
            // Cargar Chart.js dinámicamente si no está disponible
            const chartScript = document.createElement('script');
            chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            chartScript.onload = function() {
                console.log('Chart.js cargado correctamente');
                inicializarGraficos(historialExpedientes);
            };
            document.head.appendChild(chartScript);
        } else {
            console.log('Chart.js ya está disponible');
            // Si Chart.js ya está disponible, inicializar los gráficos directamente
            setTimeout(() => {
                inicializarGraficos(historialExpedientes);
            }, 100);
        }
    }
    
    // Función para inicializar los gráficos
    function inicializarGraficos(historialExpedientes) {
        console.log('Inicializando gráficos con historial:', historialExpedientes.length);
        
        // Preparar datos para los gráficos - Formatear las fechas para quitar la parte de horas
        const fechas = historialExpedientes.map(exp => {
            // Asegurar que tenemos un formato dd/mm/yyyy
            if (exp['fecha-registro']) {
                // Si tiene formato con hora, quitar la hora
                if (exp['fecha-registro'].includes(' ')) {
                    return exp['fecha-registro'].split(' ')[0];
                }
                
                // Si ya tiene formato dd/mm/yyyy, devolverlo como está
                if (exp['fecha-registro'].includes('/')) {
                    return exp['fecha-registro'];
                }
                
                // Si está en otro formato (ISO), convertirlo
                try {
                    const fecha = new Date(exp['fecha-registro']);
                    if (!isNaN(fecha)) {
                        const dia = String(fecha.getDate()).padStart(2, '0');
                        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                        const anio = fecha.getFullYear();
                        return `${dia}/${mes}/${anio}`;
                    }
                } catch (e) {
                    console.error('Error al formatear fecha:', e);
                }
            }
            return exp['fecha-registro'] || '';
        });
        
        // Datos para gráfico de peso
        const pesoInicial = parseFloat(historialExpedientes[0]['peso-inicial']) || 0;
        const pesoDeseado = parseFloat(historialExpedientes[0]['peso-deseado']) || 0;
        const pesosActuales = historialExpedientes.map(exp => parseFloat(exp['peso-actual']) || 0);
        
        // Datos para gráfico de grasa
        const grasaInicial = parseFloat(historialExpedientes[0]['grasa-inicial']) || 0;
        const grasaDeseada = parseFloat(historialExpedientes[0]['grasa-deseada']) || 0;
        const grasasActuales = historialExpedientes.map(exp => parseFloat(exp['grasa-actual']) || 0);
        
        // Datos para gráficos de entrenamiento
        const diasEntrenamiento = historialExpedientes.map(exp => parseFloat(exp['dias-entrenamiento']) || 0);
        const horasEntrenamiento = historialExpedientes.map(exp => parseFloat(exp['horas-entrenamiento']) || 0);
        
        // Configuración común para todos los gráficos
        const opcionesComunesGraficos = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                }
            }
        };
        
        // Inicializar el gráfico de peso
        const ctxPeso = document.getElementById('grafico-peso');
        if (ctxPeso) {
            console.log('Inicializando gráfico de peso');
            new Chart(ctxPeso, {
                type: 'line',
                data: {
                    labels: fechas,
                    datasets: [
                        {
                            label: 'Peso Actual',
                            data: pesosActuales,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            tension: 0.1,
                            fill: false,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        },
                        {
                            label: 'Peso Inicial',
                            data: Array(fechas.length).fill(pesoInicial),
                            borderColor: 'rgba(54, 162, 235, 0.7)',
                            borderDash: [5, 5],
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false
                        },
                        {
                            label: 'Peso Deseado',
                            data: Array(fechas.length).fill(pesoDeseado),
                            borderColor: 'rgba(255, 99, 132, 0.7)',
                            borderDash: [5, 5],
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false
                        }
                    ]
                },
                options: {
                    ...opcionesComunesGraficos,
                    scales: {
                        ...opcionesComunesGraficos.scales,
                        y: {
                            title: {
                                display: true,
                                text: 'Peso (kg)'
                            }
                        }
                    }
                }
            });
        } else {
            console.error('No se encontró el elemento canvas para el gráfico de peso');
        }
        
        // Inicializar el gráfico de grasa
        const ctxGrasa = document.getElementById('grafico-grasa');
        if (ctxGrasa) {
            console.log('Inicializando gráfico de grasa');
            new Chart(ctxGrasa, {
                type: 'line',
                data: {
                    labels: fechas,
                    datasets: [
                        {
                            label: 'Grasa Actual',
                            data: grasasActuales,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            tension: 0.1,
                            fill: false,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        },
                        {
                            label: 'Grasa Inicial',
                            data: Array(fechas.length).fill(grasaInicial),
                            borderColor: 'rgba(54, 162, 235, 0.7)',
                            borderDash: [5, 5],
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false
                        },
                        {
                            label: 'Grasa Deseada',
                            data: Array(fechas.length).fill(grasaDeseada),
                            borderColor: 'rgba(255, 99, 132, 0.7)',
                            borderDash: [5, 5],
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false
                        }
                    ]
                },
                options: {
                    ...opcionesComunesGraficos,
                    scales: {
                        ...opcionesComunesGraficos.scales,
                        y: {
                            title: {
                                display: true,
                                text: 'Grasa corporal (%)'
                            }
                        }
                    }
                }
            });
        } else {
            console.error('No se encontró el elemento canvas para el gráfico de grasa');
        }
        
        // Inicializar el gráfico de días de entrenamiento
        const ctxDias = document.getElementById('grafico-dias');
        if (ctxDias) {
            console.log('Inicializando gráfico de días de entrenamiento');
            new Chart(ctxDias, {
                type: 'line', // Cambiado de 'bar' a 'line'
                data: {
                    labels: fechas,
                    datasets: [
                        {
                            label: 'Días por semana',
                            data: diasEntrenamiento,
                            borderColor: 'rgb(54, 162, 235)',
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            tension: 0.1,
                            fill: false,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        }
                    ]
                },
                options: {
                    ...opcionesComunesGraficos,
                    scales: {
                        ...opcionesComunesGraficos.scales,
                        y: {
                            title: {
                                display: true,
                                text: 'Días'
                            },
                            min: 0,
                            max: 7,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        } else {
            console.error('No se encontró el elemento canvas para el gráfico de días de entrenamiento');
        }
        
        // Inicializar el gráfico de horas de entrenamiento
        const ctxHoras = document.getElementById('grafico-horas');
        if (ctxHoras) {
            console.log('Inicializando gráfico de horas de entrenamiento');
            new Chart(ctxHoras, {
                type: 'line', // Cambiado de 'bar' a 'line'
                data: {
                    labels: fechas,
                    datasets: [
                        {
                            label: 'Horas por semana',
                            data: horasEntrenamiento,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            tension: 0.1,
                            fill: false,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        }
                    ]
                },
                options: {
                    ...opcionesComunesGraficos,
                    scales: {
                        ...opcionesComunesGraficos.scales,
                        y: {
                            title: {
                                display: true,
                                text: 'Horas'
                            },
                            min: 0,
                            max: 4,
                            ticks: {
                                stepSize: 0.5
                            }
                        }
                    }
                }
            });
        } else {
            console.error('No se encontró el elemento canvas para el gráfico de horas de entrenamiento');
        }
    }
    
    // Inicializar evento para mostrar gráficos cuando se cambia a la pestaña de avance
    document.getElementById('avance-tab').addEventListener('shown.bs.tab', function() {
        console.log('Pestaña de avance mostrada');
        if (historialExpedientes.length > 0 && typeof Chart !== 'undefined') {
            inicializarGraficos(historialExpedientes);
        }
    });
    
    // Agregar eventos a los botones
    document.getElementById('btn-cancelar-registro').addEventListener('click', function() {
        // Volver a la vista anterior
        const cliente = Object.values(window.apiData.clientes || {}).find(c => 
            c['numero-expediente'] === numeroExpediente);
        mostrarDetallesClienteExpediente(cliente, expedienteActual);
    });
    
    document.getElementById('btn-guardar-registro').addEventListener('click', function() {
        // Validar formulario
        const form = document.getElementById('registro-expediente-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Recopilar datos del formulario
        const formData = {
            'numero-expediente': document.getElementById('numero-expediente').value,
            'peso-inicial': document.getElementById('peso-inicial').value,
            'peso-deseado': document.getElementById('peso-deseado').value,
            'peso-actual': document.getElementById('peso-actual').value,
            'grasa-inicial': document.getElementById('grasa-inicial').value,
            'grasa-deseada': document.getElementById('grasa-deseada').value,
            'grasa-actual': document.getElementById('grasa-actual').value,
            'dias-entrenamiento': document.getElementById('dias-entrenamiento').value,
            'horas-entrenamiento': document.getElementById('horas-entrenamiento').value,
            'nivel': document.getElementById('nivel').value,
            'condiciones-medicas': document.getElementById('condiciones-medicas').value,
            'disciplina': [],
            'objetivo': []
        };
        
        // Agregar id-expediente solo si estamos actualizando un registro existente
        if (esCargar) {
            const idExpElement = document.getElementById('id-expediente');
            if (idExpElement) {
                formData['id-expediente'] = idExpElement.value;
            }
            formData['fecha-registro'] = document.getElementById('fecha-registro').value;
        }
        
        // Obtener valores de los checkboxes de disciplina
        document.querySelectorAll('.disciplina-check:checked').forEach(checkbox => {
            formData['disciplina'].push(checkbox.value);
        });
        
        // Obtener valores de los checkboxes de objetivo
        document.querySelectorAll('.objetivo-check:checked').forEach(checkbox => {
            formData['objetivo'].push(checkbox.value);
        });
        
        // Guardar el registro
        guardarRegistroExpediente(formData, esCargar);
    });
}

/**
 * Guardar el registro de expediente
 * @param {Object} datos - Datos del registro
 * @param {boolean} esActualizacion - Indica si es una actualización de un registro existente
 */
function guardarRegistroExpediente(datos, esActualizacion) {
    try {
        showLoading(true);
        console.log('Guardando expediente, es actualización:', esActualizacion);
        
        // Generar nuevo objeto con los datos actualizados
        const datosActualizados = {...datos};
        
        // Obtener fecha y hora actual para generar valores frescos
        const ahora = new Date();
        
        // Formatear día, mes y año para la fecha de registro
        const dia = String(ahora.getDate()).padStart(2, '0');
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const anio = ahora.getFullYear();
        
        // Formatear hora, minutos y segundos para el ID
        const hora = String(ahora.getHours()).padStart(2, '0');
        const minuto = String(ahora.getMinutes()).padStart(2, '0');
        const segundo = String(ahora.getSeconds()).padStart(2, '0');
        
        // Obtener mes corto en español para el ID
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const mesCorto = meses[ahora.getMonth()];
        
        // Generar valores finales con el formato correcto
        const fechaRegistro = `${dia}/${mes}/${anio}`;
        const idExpediente = `EXP${dia}${mesCorto}${anio}${hora}${minuto}${segundo}`;
        
        console.log('=== GENERANDO VALORES ACTUALES ===');
        console.log('Fecha registro generada:', fechaRegistro);
        console.log('ID expediente generado:', idExpediente);
        
        // FORZAR la asignación de valores nuevos para fecha e ID
        // sin importar si es actualización o no
        datosActualizados['fecha-registro'] = fechaRegistro;
        datosActualizados['id-expediente'] = idExpediente;
        
        console.log('DESPUÉS DE FORZAR ACTUALIZACIÓN:');
        console.log('id-expediente ahora es:', datosActualizados['id-expediente']);
        console.log('fecha-registro ahora es:', datosActualizados['fecha-registro']);
        
        // Si los campos de disciplina y objetivo son arrays, convertirlos a string
        if (Array.isArray(datosActualizados.disciplina)) {
            datosActualizados.disciplina = datosActualizados.disciplina.join(', ');
        }
        
        if (Array.isArray(datosActualizados.objetivo)) {
            datosActualizados.objetivo = datosActualizados.objetivo.join(', ');
        }
        
        // Verificar y registrar los valores específicos que estamos enviando
        console.log('VERIFICACIÓN DE CAMPOS CRÍTICOS:');
        console.log('id-expediente:', datosActualizados['id-expediente']);
        console.log('fecha-registro:', datosActualizados['fecha-registro']);
        console.log('numero-expediente:', datosActualizados['numero-expediente']);
        
        // Preparar los datos para enviar al servidor
        const apiUrl = 'https://script.google.com/macros/s/AKfycbwUmM1zVgZq8kgYhCDv4n0Wqi8V7FQMGAYf7sUG2uAueI7vxLMTtkptgX35PF0rE49EOQ/exec';
        
        // Estructura correcta con expediente anidado en data
        const dataToSend = {
            action: 'insertexpediente',
            data: {
                action: 'insertexpediente',
                expediente: datosActualizados
            }
        };
        
        // Verificar explícitamente que estos campos estén en el objeto final
        const expedienteFinal = dataToSend.data.expediente;
        console.log('VERIFICACIÓN FINAL:');
        console.log('id-expediente en objeto final:', expedienteFinal['id-expediente']);
        console.log('fecha-registro en objeto final:', expedienteFinal['fecha-registro']);
        
        console.log('Datos FINALES a enviar:', JSON.stringify(dataToSend, null, 2));
        
        // Enviar datos usando fetch con no-cors
        fetch(apiUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        })
        .then(() => {
            console.log('Solicitud enviada a la API');
            
            // No podemos verificar la respuesta con no-cors, asumimos éxito
            showLoading(false);
            showMessage(esActualizacion ? 'Registro actualizado correctamente' : 'Registro creado correctamente', 'success');
            
            // Recargar los datos del servidor después de un breve retraso
            setTimeout(() => {
                window.apiService.obtenerTodosLosDatos().then(() => {
                    cargarInterfazExpedientes();
                });
            }, 1000);
        })
        .catch(error => {
            console.error('Error al enviar datos a la API:', error);
            showLoading(false);
            showMessage('Error al enviar los datos. Por favor, intente nuevamente.', 'error');
        });
        
    } catch (error) {
        showLoading(false);
        console.error('Error al guardar el registro:', error);
        showMessage('Error al guardar los datos. Por favor, intente nuevamente.', 'error');
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
        showCancelButton: false,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#E63946'
    });
}
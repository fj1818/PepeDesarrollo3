// API para comunicación con Google Apps Script
// Este archivo contiene funciones para conectarse con el endpoint de la aplicación

// Almacenamiento global de datos
window.apiData = {
    prospectos: null,
    clientes: null,
    expedientes: null,
    lastUpdate: null
};

// URL del endpoint de Google Apps Script
const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbzgPrxGlctWVNokR1ydEwgJjVG2LmPSOs8vU59H2jG7iahKxxrl_zOfHGo43rNUS1gq0g/exec";

// Función para obtener todos los datos del sistema
async function obtenerTodosLosDatos() {
    try {
        showLoading(true);
        
        try {
            // Intentar obtener datos reales del servidor primero
            console.log("Conectando a Google Apps Script...");
            
            // Intentar fetch normal primero (sin no-cors)
            const response = await fetch(`${API_ENDPOINT}`);
            
            if (!response.ok) {
                throw new Error(`Error de red: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Datos obtenidos del servidor:", data);
            
            // Usar directamente los datos del servidor sin transformar
            window.apiData = {
                prospectos: data.prospecto || {},
                clientes: data.contactosClientes || {},
                expedientes: data.expedienteClientes || {},
                lastUpdate: new Date().toISOString()
            };
            
            console.log("Datos cargados:", window.apiData);
            
            // Actualizar UI con datos reales
            updateCounters();
            updateCharts();
            
            Swal.fire({
                icon: 'success',
                title: 'Conexión exitosa',
                text: 'Se han cargado los datos del servidor correctamente.',
                confirmButtonColor: '#E63946',
                timer: 2000
            });
            
        } catch (error) {
            console.warn("Error al conectar con el servidor:", error);
            
            // Si hay error de CORS o network, usar datos directamente del endpoint conocido
            // Datos tomados de: https://script.google.com/macros/s/AKfycbzgPrxGlctWVNokR1ydEwgJjVG2LmPSOs8vU59H2jG7iahKxxrl_zOfHGo43rNUS1gq0g/exec
            const apiData = {"prospecto":{"PP08Mar25143429":{"id-prospecto":"PP08Mar25143429","nombre":"a a f sm","telefono":3333333333,"email":"3q@d.com","ubicacion":"San Pedro Garza García, Nuevo León","canal":"instagram","fecha-prospecto":"2025-03-08T20:49:52.000Z","contactado":"true","interesado":"true","motivo":"adadada","numero-cliente":"NMC00001"},"PP08Mar25143751":{"id-prospecto":"PP08Mar25143751","nombre":"da ada","telefono":4444444444,"email":"dd@gl.com","ubicacion":"San Pedro Garza García, Nuevo León","canal":"instagram","fecha-prospecto":"2025-03-08T20:49:52.000Z","contactado":"true","interesado":"true","motivo":"","numero-cliente":"NMC00002"},"PP08Mar25144126":{"id-prospecto":"PP08Mar25144126","nombre":"ad as","telefono":2222222222,"email":"d@a.com","ubicacion":"San José de Gracia, Aguascalientes","canal":"instagram","fecha-prospecto":"2025-03-08T20:49:52.000Z","contactado":"true","interesado":"true","motivo":"","numero-cliente":"NMC00003"},"PP08Mar25144359":{"id-prospecto":"PP08Mar25144359","nombre":"Francisco Rodríguez","telefono":3328333544,"email":"fjrv1818@gmail.com","ubicacion":"San Pedro Garza García, Nuevo León","canal":"twitter","fecha-prospecto":"2025-03-08T20:49:52.000Z","contactado":"true","interesado":"true","motivo":"","numero-cliente":"NMC00004"},"PP08Mar25144701":{"id-prospecto":"PP08Mar25144701","nombre":"prueba pruebax","telefono":3333333333,"email":"33@g.com","ubicacion":"San Pedro Garza García, Nuevo León","canal":"twitter","fecha-prospecto":"2025-03-08T20:49:52.000Z","contactado":"true","interesado":"true","motivo":"","numero-cliente":"NMC00006"},"PP08Mar25144952":{"id-prospecto":"PP08Mar25144952","nombre":"aa af","telefono":5555555555,"email":"5555@of.com","ubicacion":"San Pedro Garza García, Nuevo León","canal":"twitter","fecha-prospecto":"2025-03-08T20:49:52.000Z","contactado":"true","interesado":"true","motivo":"","numero-cliente":"NMC00007"},"PP10Mar25204958":{"id-prospecto":"PP10Mar25204958","nombre":"Carlos Dominguez","telefono":8888888888,"email":"f@gmail.com","ubicacion":"Monterrey, Nuevo León","canal":"instagram","fecha-prospecto":"2025-03-08T20:49:52.000Z","contactado":"false","interesado":"false","motivo":"","numero-cliente":""},"PP16Mar25180513":{"id-prospecto":"PP16Mar25180513","nombre":"Pepe Urueta","telefono":8117077220,"email":"jujrpepe@gmail.com","ubicacion":"Monterrey, Nuevo León","canal":"instagram","fecha-prospecto":"2025-03-17T00:05:13.000Z","contactado":"false","interesado":"false","motivo":"","numero-cliente":""}},"contactosClientes":{"CC16Mar2025100846":{"id-contacto":"CC16Mar2025100846","nombre":"da ada","telefono":4444444446,"email":"dd@gl.com","fecha-nacimiento":"2025-03-04T06:00:00.000Z","genero":"masculino","ubicacion":"San Pedro Garza García, Nuevo León","peso-inicial":70.7,"peso-deseado":70.8,"grasa-inicial":89.6,"grasa-deseada":98.6,"fecha-prospecto":"2025-03-08T20:49:52.000Z","fecha-cliente":"2025-03-16T16:08:22.000Z","canal":"instagram","numero-expediente":"EXP00001","numero-cliente":"NMC00001","plan":"Plan 2","finalizado":false},"CC16Mar2025101600":{"id-contacto":"CC16Mar2025101600","nombre":"ad as","telefono":2222222222,"email":"d@a.com","fecha-nacimiento":"2025-03-28T06:00:00.000Z","genero":"masculino","ubicacion":"San José de Gracia, Aguascalientes","peso-inicial":76.8,"peso-deseado":76.3,"grasa-inicial":6.4,"grasa-deseada":6.8,"fecha-prospecto":"2025-03-08T20:49:52.000Z","fecha-cliente":"2025-03-16T16:15:36.000Z","canal":"instagram","numero-expediente":"EXP00002","numero-cliente":"NMC00003","plan":"Plan 9","finalizado":false},"CC16Mar2025102000":{"id-contacto":"CC16Mar2025102000","nombre":"Francisco Rodríguez","telefono":3328333544,"email":"fjrv1818@gmail.com","fecha-nacimiento":"2025-03-27T06:00:00.000Z","genero":"masculino","ubicacion":"San Pedro Garza García, Nuevo León","peso-inicial":67.8,"peso-deseado":89,"grasa-inicial":25,"grasa-deseada":52,"fecha-prospecto":"2025-03-08T20:49:52.000Z","fecha-cliente":"2025-03-16T16:19:44.000Z","canal":"twitter","numero-expediente":"EXP00003","numero-cliente":"NMC00004","plan":"Plan 10","finalizado":false},"CC16Mar2025131835":{"id-contacto":"CC16Mar2025131835","nombre":"Esau Barajas Ba","telefono":3314597752,"email":"zu.020794@gmail.com","fecha-nacimiento":"2025-03-13T06:00:00.000Z","genero":"masculino","ubicacion":"Guadalajara ","peso-inicial":70,"peso-deseado":75,"grasa-inicial":10,"grasa-deseada":12,"fecha-prospecto":"2025-03-16T17:51:53.000Z","fecha-cliente":"2025-03-16T19:18:14.000Z","canal":"otro","numero-expediente":"EXP00004","numero-cliente":"NMC00005","plan":"Plan 2","finalizado":false},"CC16Mar2025134300":{"id-contacto":"CC16Mar2025134300","nombre":"aa af","telefono":5555555555,"email":"5555@of.com","fecha-nacimiento":"2025-03-06T06:00:00.000Z","genero":"femenino","ubicacion":"San Pedro Garza García, Nuevo León","peso-inicial":67,"peso-deseado":80,"grasa-inicial":5,"grasa-deseada":15,"fecha-prospecto":"2025-03-08T20:49:52.000Z","fecha-cliente":"2025-03-16T19:42:44.000Z","canal":"twitter","numero-expediente":"EXP00005","numero-cliente":"NMC00007","plan":"Plan 2","finalizado":false},"CC16Mar2025174952":{"id-contacto":"CC16Mar2025174952","nombre":"javier rodriguezz","telefono":4444444444,"email":"fq@f.com","fecha-nacimiento":"2025-03-13T06:00:00.000Z","genero":"masculino","ubicacion":"Coatzacoalcos, Veracruz","peso-inicial":65,"peso-deseado":80,"grasa-inicial":15,"grasa-deseada":10,"fecha-prospecto":"2025-03-16T17:44:16.000Z","fecha-cliente":"2025-03-16T23:49:25.000Z","canal":"facebook","numero-expediente":"EXP00006","numero-cliente":"NMC00008","plan":"Plan 7","finalizado":false},"CC16Mar2025180846":{"id-contacto":"CC16Mar2025180846","nombre":"Pepe Urueta","telefono":8117077220,"email":"jujrpepe@gmail.com","fecha-nacimiento":"1995-06-06T06:00:00.000Z","genero":"masculino","ubicacion":"Monterrey, Nuevo León","peso-inicial":65,"peso-deseado":89,"grasa-inicial":5,"grasa-deseada":8,"fecha-prospecto":"NaN/NaN/NaN NaN:NaN:NaN","fecha-cliente":"2025-03-17T00:07:36.000Z","canal":"instagram","numero-expediente":"EXP00007","numero-cliente":"NMC00009","plan":"Plan 4","finalizado":true}},"expedienteClientes":{"EXP16Mar2025141159":{"id-expediente":"EXP16Mar2025141159","fecha-registro":"2025-03-14T06:00:00.000Z","numero-expediente":"EXP00003","peso-inicial":67.8,"peso-deseado":89,"peso-actual":76,"grasa-inicial":25,"grasa-deseada":52,"grasa-actual":34,"dias-entrenamiento":1,"horas-entrenamiento":0.5,"nivel":"Principiante","disciplina":"Musculación, Cardio, CrossFit","objetivo":"Pérdida de peso, Ganancia muscular, Tonificación","condiciones-medicas":"lesión"},"EXP16Mar2025141509":{"id-expediente":"EXP16Mar2025141509","fecha-registro":"2025-03-15T06:00:00.000Z","numero-expediente":"EXP00003","peso-inicial":67.8,"peso-deseado":89,"peso-actual":75,"grasa-inicial":25,"grasa-deseada":52,"grasa-actual":45,"dias-entrenamiento":2,"horas-entrenamiento":0.5,"nivel":"Principiante","disciplina":"Musculación, Cardio, CrossFit","objetivo":"Pérdida de peso, Ganancia muscular, Tonificación","condiciones-medicas":"lesión"},"EXP16Mar2025145747":{"id-expediente":"EXP16Mar2025145747","fecha-registro":"2025-03-16T06:00:00.000Z","numero-expediente":"EXP00003","peso-inicial":67.8,"peso-deseado":89,"peso-actual":76,"grasa-inicial":25,"grasa-deseada":52,"grasa-actual":34,"dias-entrenamiento":2,"horas-entrenamiento":0.5,"nivel":"Principiante","disciplina":"Musculación, Cardio, CrossFit","objetivo":"Pérdida de peso, Ganancia muscular, Tonificación","condiciones-medicas":"lesión"},"EXP17Mar2025103459":{"id-expediente":"EXP17Mar2025103459","fecha-registro":"2025-03-17T06:00:00.000Z","numero-expediente":"EXP00003","peso-inicial":67.8,"peso-deseado":89,"peso-actual":70,"grasa-inicial":25,"grasa-deseada":52,"grasa-actual":27,"dias-entrenamiento":2,"horas-entrenamiento":0.5,"nivel":"Principiante","disciplina":"Musculación, Mixto","objetivo":"Ganancia muscular, Rendimiento deportivo","condiciones-medicas":"lesión"},"EXP17Mar2025103801":{"id-expediente":"EXP17Mar2025103801","fecha-registro":"2025-03-17T06:00:00.000Z","numero-expediente":"EXP00003","peso-inicial":67.8,"peso-deseado":89,"peso-actual":72,"grasa-inicial":25,"grasa-deseada":52,"grasa-actual":30,"dias-entrenamiento":1,"horas-entrenamiento":0.5,"nivel":"Principiante","disciplina":"Musculación, CrossFit","objetivo":"Tonificación, Mantenimiento","condiciones-medicas":"prueba"},"EXP17Mar2025110201":{"id-expediente":"EXP17Mar2025110201","fecha-registro":"2025-03-17T06:00:00.000Z","numero-expediente":"EXP00003","peso-inicial":67.8,"peso-deseado":89,"peso-actual":78,"grasa-inicial":25,"grasa-deseada":52,"grasa-actual":45,"dias-entrenamiento":1,"horas-entrenamiento":0.5,"nivel":"Principiante","disciplina":"Musculación, Cardio","objetivo":"Tonificación, Definición","condiciones-medicas":""}}};
            
            window.apiData = {
                prospectos: apiData.prospecto || {},
                clientes: apiData.contactosClientes || {},
                expedientes: apiData.expedienteClientes || {},
                lastUpdate: new Date().toISOString()
            };

            console.log("Usando datos precargados de la API:", window.apiData);
            
            // Actualizar UI con datos reales
            updateCounters();
            updateCharts();
            
            Swal.fire({
                icon: 'info',
                title: 'Usando datos precargados',
                text: 'No se pudo conectar al servidor. Usando datos precargados de la API.',
                confirmButtonColor: '#E63946',
                timer: 3000
            });
        }
        
        console.log("Datos cargados:", window.apiData);
        return window.apiData;
    } catch (error) {
        console.error("Error al obtener datos:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los datos. Por favor, intente nuevamente.',
            confirmButtonColor: '#E63946'
        });
        return null;
    } finally {
        showLoading(false);
    }
}

// Funciones para transformar los datos recibidos del servidor al formato esperado por la app
function transformarProspectos(datosServidor) {
    const resultado = {};
    
    // Convertir cada objeto del servidor al formato esperado
    Object.entries(datosServidor).forEach(([id, prospecto]) => {
        const contactado = prospecto.contactado === true || prospecto.contactado === "true";
        
        resultado[id] = {
            id: id,
            nombre: prospecto.nombre || '',
            email: prospecto.email || '',
            telefono: prospecto.telefono || '',
            fechaContacto: prospecto['fecha-contacto'] || '',
            contactado: contactado,
            notas: prospecto.notas || ''
        };
    });
    
    return resultado;
}

function transformarClientes(datosServidor) {
    const resultado = {};
    
    // Convertir cada objeto del servidor al formato esperado
    Object.entries(datosServidor).forEach(([id, cliente]) => {
        const finalizado = cliente.finalizado === true || cliente.finalizado === "true";
        
        resultado[id] = {
            id: id,
            nombre: cliente.nombre || '',
            contacto: cliente.nombre || '',  // Usar nombre como contacto para compatibilidad
            email: cliente.email || '',
            telefono: cliente.telefono || '',
            fechaInicio: cliente['fecha-cliente'] || '',
            tipo: 'Individual', // Valor por defecto
            estado: finalizado ? 'Finalizado' : 'Activo',
            finalizado: finalizado,  // Agregar explícitamente la propiedad finalizado
            numeroExpediente: cliente['numero-expediente'] || '', // Agregar número de expediente
            notas: ''
        };
    });
    
    return resultado;
}

function transformarExpedientes(datosServidor) {
    const resultado = {};
    
    // Convertir cada objeto del servidor al formato esperado
    Object.entries(datosServidor).forEach(([id, expediente]) => {
        resultado[id] = {
            id: id,
            cliente: expediente['numero-expediente'] || '',
            titulo: `Expediente ${expediente['numero-expediente'] || id}`,
            fechaApertura: expediente['fecha-registro'] || '',
            fechaCierre: '',
            estado: 'En proceso',
            responsable: 'Administrador',
            notas: expediente['condiciones-medicas'] || ''
        };
    });
    
    return resultado;
}

// Función para obtener sólo prospectos
async function obtenerProspectos() {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_ENDPOINT}?action=getProspectos`);
        
        if (!response.ok) {
            throw new Error(`Error de red: ${response.status}`);
        }
        
        const data = await response.json();
        window.apiData.prospectos = data.prospectos || {};
        updateCounters();
        
        return window.apiData.prospectos;
    } catch (error) {
        console.error("Error al obtener prospectos:", error);
        return null;
    } finally {
        showLoading(false);
    }
}

// Función para obtener sólo clientes
async function obtenerClientes() {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_ENDPOINT}?action=getClientes`);
        
        if (!response.ok) {
            throw new Error(`Error de red: ${response.status}`);
        }
        
        const data = await response.json();
        window.apiData.clientes = data.clientes || {};
        updateCounters();
        
        return window.apiData.clientes;
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        return null;
    } finally {
        showLoading(false);
    }
}

// Función para obtener sólo expedientes
async function obtenerExpedientes() {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_ENDPOINT}?action=getExpedientes`);
        
        if (!response.ok) {
            throw new Error(`Error de red: ${response.status}`);
        }
        
        const data = await response.json();
        window.apiData.expedientes = data.expedientes || {};
        updateCounters();
        
        return window.apiData.expedientes;
    } catch (error) {
        console.error("Error al obtener expedientes:", error);
        return null;
    } finally {
        showLoading(false);
    }
}

// Actualizar contadores en la interfaz
function updateCounters() {
    // Actualizar contador de prospectos
    const prospectosTotal = document.getElementById('prospectos-total');
    if (prospectosTotal && window.apiData.prospectos) {
        const count = Object.keys(window.apiData.prospectos).length;
        prospectosTotal.textContent = count;
        animateCounter(prospectosTotal, count);
    }
    
    // Actualizar contador de clientes
    const clientesTotal = document.getElementById('clientes-total');
    if (clientesTotal && window.apiData.clientes) {
        const count = Object.keys(window.apiData.clientes).length;
        clientesTotal.textContent = count;
        animateCounter(clientesTotal, count);
    }
    
    // Actualizar contador de expedientes
    const expedientesTotal = document.getElementById('expedientes-total');
    if (expedientesTotal && window.apiData.expedientes) {
        const count = Object.keys(window.apiData.expedientes).length;
        expedientesTotal.textContent = count;
        animateCounter(expedientesTotal, count);
    }
}

// Función para animar un contador (usado por updateCounters)
function animateCounter(element, value) {
    // Primero verificamos si CountUp está disponible como clase global
    if (typeof CountUp === 'function') {
        const current = parseInt(element.textContent) || 0;
        if (current !== value) {
            const counter = new CountUp(element, current, value, 0, 1.5, {
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.'
            });
            counter.start();
        }
    } else {
        // Si CountUp no está disponible, simplemente actualizamos el valor
        element.textContent = value;
        
        // Y cargamos la versión browser (no módulo) del script si no lo hemos intentado ya
        if (!window.countUpAttempted) {
            window.countUpAttempted = true;
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/countup.js@2.0.8/dist/countUp.umd.min.js';
            document.head.appendChild(script);
        }
    }
}

// Actualizar gráficos con los datos obtenidos
function updateCharts() {
    // Actualizar gráfico de estado de prospectos
    if (window.prospectosChart && window.apiData.prospectos) {
        const prospectos = Object.values(window.apiData.prospectos);
        const noContactados = prospectos.filter(p => p.contactado !== "true").length;
        const contactados = prospectos.length - noContactados;
        
        window.prospectosChart.data.datasets[0].data = [noContactados, contactados];
        window.prospectosChart.update();
    }
    
    // Actualizar gráfico de estado de clientes
    if (window.clientesChart && window.apiData.clientes) {
        const clientes = Object.values(window.apiData.clientes);
        const activos = clientes.filter(c => c.finalizado !== true).length;
        const cerrados = clientes.length - activos;
        
        window.clientesChart.data.datasets[0].data = [activos, cerrados];
        window.clientesChart.update();
    }
}

// Función para enviar mensaje por WhatsApp
function sendWhatsAppMessage(phone, message) {
    // Preparar número de teléfono (eliminar caracteres no numéricos)
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Mensaje codificado para URL
    const encodedMessage = encodeURIComponent(message);
    
    // URL del API de WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
    
    // Abrir en nueva ventana
    window.open(whatsappUrl, '_blank');
    
    // Registrar en sistema (en una implementación real, se enviaría al servidor)
    logCommunication('whatsapp', { phone, message });
}

// Función para enviar correo electrónico (simulado)
function sendEmail(email, subject, message) {
    // En una implementación real, esto enviaría el correo a través del servidor
    // Para este ejemplo, mostraremos una alerta de éxito
    
    Swal.fire({
        title: 'Correo enviado',
        html: `
            <div class="text-start">
                <p><strong>Para:</strong> ${email}</p>
                <p><strong>Asunto:</strong> ${subject}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${message}</p>
            </div>
        `,
        icon: 'success',
        confirmButtonColor: '#E63946'
    });
    
    // Registrar en sistema (en una implementación real, se enviaría al servidor)
    logCommunication('email', { email, subject, message });
}

// Función para mostrar modal de comunicación
function showCommunicationModal(contacto) {
    Swal.fire({
        title: 'Enviar Comunicación',
        html: `
            <form id="communicationForm" class="text-start">
                <div class="mb-3">
                    <label class="form-label">Contacto</label>
                    <input type="text" class="form-control" value="${contacto.nombre}" readonly>
                </div>
                <div class="mb-3">
                    <label for="comm-type" class="form-label">Tipo de comunicación</label>
                    <select class="form-select" id="comm-type">
                        <option value="whatsapp">WhatsApp</option>
                        <option value="email">Correo Electrónico</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="comm-message" class="form-label">Mensaje</label>
                    <textarea class="form-control" id="comm-message" rows="4">Hola ${contacto.nombre}, te contactamos de URUETA CRM.</textarea>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#E63946',
        cancelButtonColor: '#6c757d',
        preConfirm: () => {
            return {
                type: document.getElementById('comm-type').value,
                message: document.getElementById('comm-message').value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { type, message } = result.value;
            
            if (type === 'whatsapp') {
                sendWhatsAppMessage(contacto.telefono, message);
            } else if (type === 'email') {
                sendEmail(contacto.email, 'Información importante - URUETA CRM', message);
            }
        }
    });
}

// Función para registrar comunicación en el sistema
function logCommunication(type, data) {
    console.log(`Comunicación ${type} registrada:`, data);
    // En una implementación real, esto enviaría los datos al servidor
}

// Función para mostrar/ocultar indicador de carga
function showLoading(show) {
    const loader = document.getElementById('global-loader');
    
    if (!loader && show) {
        // Si no existe el loader y queremos mostrarlo, crearlo
        const newLoader = document.createElement('div');
        newLoader.id = 'global-loader';
        newLoader.classList.add('global-loader');
        newLoader.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        `;
        document.body.appendChild(newLoader);
    } else if (loader) {
        // Si existe, mostrar u ocultar
        if (show) {
            loader.style.display = 'flex';
        } else {
            loader.style.display = 'none';
            // Asegurar que se elimine completamente después de ocultarlo
            setTimeout(() => {
                if (loader && loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 500);
        }
    }
}

// Cargar datos iniciales al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Agregar estilos para el loader global
    const style = document.createElement('style');
    style.textContent = `
        .global-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);
    
    // Los datos se cargarán bajo demanda al cargar una sección, por lo que
    // no es necesario iniciar una carga aquí
});

// Exportar funciones para uso en otros archivos
window.apiService = {
    obtenerTodosLosDatos,
    obtenerProspectos,
    obtenerClientes,
    obtenerExpedientes,
    sendWhatsAppMessage,
    sendEmail,
    showCommunicationModal
};

// Funciones para generar datos de ejemplo (para desarrollo)
function generarDatosEjemploProspectos() {
    return {
        "p1": {
            id: "p1",
            nombre: "Juan Pérez",
            email: "juan.perez@ejemplo.com",
            telefono: "5512345678",
            fecha: "2023-10-15",
            fuente: "Facebook",
            contactado: "false",
            notas: "Interesado en servicios legales para empresa"
        },
        "p2": {
            id: "p2",
            nombre: "María García",
            email: "maria.garcia@ejemplo.com",
            telefono: "5587654321",
            fecha: "2023-10-20",
            fuente: "Referido",
            contactado: "true",
            notas: "Requiere asesoría para trámites fiscales"
        },
        "p3": {
            id: "p3",
            nombre: "Carlos Rodríguez",
            email: "carlos.rodriguez@ejemplo.com",
            telefono: "5545678901",
            fecha: "2023-11-05",
            fuente: "Sitio web",
            contactado: "false",
            notas: "Empresario buscando asesoría legal"
        },
        "p4": {
            id: "p4",
            nombre: "Ana Martínez",
            email: "ana.martinez@ejemplo.com",
            telefono: "5532109876",
            fecha: "2023-11-10",
            fuente: "Instagram",
            contactado: "true",
            notas: "Interesada en servicios de consultoría"
        },
        "p5": {
            id: "p5",
            nombre: "Roberto Sánchez",
            email: "roberto.sanchez@ejemplo.com",
            telefono: "5567890123",
            fecha: "2023-11-15",
            fuente: "LinkedIn",
            contactado: "false",
            notas: "Busca asesoría para expandir negocio"
        }
    };
}

function generarDatosEjemploClientes() {
    return {
        "c1": {
            id: "c1",
            nombre: "Empresas XYZ",
            contacto: "Pedro López",
            email: "pedro.lopez@xyz.com",
            telefono: "5598765432",
            fechaInicio: "2023-09-01",
            tipo: "Empresa",
            estado: "Activo",
            notas: "Cliente frecuente, requiere servicios mensuales"
        },
        "c2": {
            id: "c2",
            nombre: "Construcciones ABC",
            contacto: "Laura Torres",
            email: "laura.torres@abc.com",
            telefono: "5512348765",
            fechaInicio: "2023-08-15",
            tipo: "Empresa",
            estado: "Activo",
            notas: "Proyecto de asesoría legal para construcción"
        },
        "c3": {
            id: "c3",
            nombre: "José Ramírez",
            contacto: "José Ramírez",
            email: "jose.ramirez@personal.com",
            telefono: "5543215678",
            fechaInicio: "2023-07-10",
            tipo: "Individual",
            estado: "Finalizado",
            notas: "Caso de asesoría fiscal completado"
        }
    };
}

function generarDatosEjemploExpedientes() {
    return {
        "e1": {
            id: "e1",
            cliente: "c1",
            titulo: "Trámites fiscales 2023",
            fechaApertura: "2023-09-05",
            fechaCierre: "",
            estado: "En proceso",
            responsable: "Juan Abogado",
            notas: "Trámites fiscales anuales para Empresas XYZ"
        },
        "e2": {
            id: "e2",
            cliente: "c2",
            titulo: "Contrato de obra pública",
            fechaApertura: "2023-08-20",
            fechaCierre: "",
            estado: "En proceso",
            responsable: "María Abogada",
            notas: "Revisión y asesoría para licitación pública"
        },
        "e3": {
            id: "e3",
            cliente: "c3",
            titulo: "Declaración anual",
            fechaApertura: "2023-07-15",
            fechaCierre: "2023-10-30",
            estado: "Cerrado",
            responsable: "Pedro Contador",
            notas: "Declaración anual de impuestos para José Ramírez"
        }
    };
}

// Cargar datos del servidor
async function cargarDatosAPI() {
    try {
        // Mostrar indicador de carga
        showLoading(true);
        
        // Obtener todos los datos de una vez
        await obtenerTodosLosDatos();
        
        console.log('Todos los datos cargados correctamente');
        
        // Emitir evento para notificar que los datos están cargados
        document.dispatchEvent(new CustomEvent('datos-cargados'));
        
        // Ocultar indicador de carga
        showLoading(false);
        
        return true;
        
    } catch (error) {
        console.error('Error al cargar datos del API:', error);
        showLoading(false);
        showMessage('Error al cargar datos. Por favor, intente nuevamente.', 'error');
        return false;
    }
} 
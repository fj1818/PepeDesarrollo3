// Funcionalidad principal de la aplicación

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Inicializar componentes principales
        initSidebar();
        
        // Cargar home.js para las notificaciones
        await loadScript('js/home.js');
        
        // La carga de datos se realizará en loadContent para evitar múltiples cargas
        
        // Configurar notificaciones
        if (typeof setupNotifications === 'function') {
            setupNotifications();
        }
        
        // Cargar la sección activa
        const activeMenuItem = document.querySelector('.nav-item.active');
        if (activeMenuItem) {
            const section = activeMenuItem.getAttribute('data-section');
            if (section) {
                await loadContent(section);
            }
        }
    } catch (error) {
        console.error('Error durante la inicialización:', error);
        showMessage('Ocurrió un error durante la carga. Por favor, recargue la página.', 'error');
    }
});

// Inicializar animaciones y bibliotecas externas
function initExternalLibraries() {
    // Inicializar AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
    
    // Inicializar Tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Inicializar CountUp si está disponible
    if (typeof CountUp === 'undefined') {
        loadScript('https://cdn.jsdelivr.net/npm/countup.js@2.0.8/dist/countUp.umd.min.js');
    }
    
    // Inicializar Swiper si está disponible
    if (typeof Swiper !== 'undefined') {
        const swipers = document.querySelectorAll('.swiper-container');
        if (swipers.length > 0) {
            swipers.forEach(swiperContainer => {
                new Swiper(swiperContainer, {
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                });
            });
        }
    }
}

// Inicializar la barra lateral
function initSidebar() {
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Toggle para mostrar/ocultar sidebar
    if (menuBtn && sidebar && mainContent) {
        menuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }
    
    // Manejador de clics en los elementos del menú
    const menuItems = document.querySelectorAll('.nav-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remover clase active de todos los elementos
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Agregar clase active al elemento actual
            this.classList.add('active');
            
            // Obtener la sección a cargar desde el atributo data-section
            const section = this.getAttribute('data-section');
            if (section) {
                loadContent(section);
                
                // En móviles, cerrar el sidebar después de seleccionar
                if (window.innerWidth < 768) {
                    sidebar.classList.remove('collapsed');
                    mainContent.classList.add('expanded');
                }
            }
        });
    });
    
    // Cargar contenido inicial basado en el elemento activo del menú
    const activeMenuItem = document.querySelector('.nav-item.active');
    if (activeMenuItem) {
        const section = activeMenuItem.getAttribute('data-section');
        if (section) {
            // Agregar un pequeño retraso para asegurarse de que todo esté inicializado
            setTimeout(() => {
                loadContent(section);
            }, 100);
        }
    }
}

// Variable para controlar si ya se está cargando datos
let isLoadingData = false;

// Carga el contenido de una sección
async function loadContent(section) {
    // Mostrar indicador de carga
    showLoading(true);
    
    // Ajustar título de la página
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) {
        switch(section) {
            case 'home': headerTitle.textContent = 'Home'; break;
            case 'prospectos': headerTitle.textContent = 'Prospectos'; break;
            case 'clientes': headerTitle.textContent = 'Clientes'; break;
            case 'expedientes': headerTitle.textContent = 'Expedientes'; break;
            case 'comunicaciones': headerTitle.textContent = 'Comunicaciones'; break;
            default: headerTitle.textContent = 'Home';
        }
    }
    
    // Obtener el contenedor principal
    const contentElement = document.getElementById('content');
    if (!contentElement) {
        console.error('Elemento de contenido no encontrado');
        showLoading(false);
        return;
    }
    
    // Crear el contenedor específico para la sección si no existe
    const sectionId = `content-${section}`;
    let sectionElement = document.getElementById(sectionId);
    
    if (!sectionElement) {
        // Limpiar el contenedor principal
        contentElement.innerHTML = '';
        
        // Crear el elemento específico para la sección
        sectionElement = document.createElement('div');
        sectionElement.id = sectionId;
        contentElement.appendChild(sectionElement);
    }
    
    try {
        // Cargar los datos de la API solo si no están cargados y no hay una carga en progreso
        if (!window.apiData || (Object.keys(window.apiData).length === 0 && !isLoadingData)) {
            console.log('Cargando datos de la API...');
            isLoadingData = true;
            if (!window.apiData) window.apiData = {};
            await cargarDatosAPI();
            isLoadingData = false;
        } else {
            console.log('Usando datos ya cargados o carga en progreso');
        }
        
        // Cargar el script correspondiente a la sección
        switch(section) {
            case 'home':
                if (!window.homeInitialized) {
                    await loadScript('js/home.js');
                    window.homeInitialized = true;
                }
                if (typeof initHome === 'function') {
                    await initHome();
                } else if (typeof window.initHome === 'function') {
                    await window.initHome();
                } else {
                    throw new Error('La función initHome no está definida.');
                }
                break;
                
            case 'prospectos':
                if (!window.prospectosInitialized) {
                    await loadScript('js/prospectos.js');
                    window.prospectosInitialized = true;
                }
                if (typeof initProspectos === 'function') {
                    await initProspectos();
                } else if (typeof window.initProspectos === 'function') {
                    await window.initProspectos();
                } else {
                    throw new Error('La función initProspectos no está definida.');
                }
                break;
                
            case 'clientes':
                if (!window.clientesInitialized) {
                    await loadScript('js/clientes.js');
                    window.clientesInitialized = true;
                }
                if (typeof initClientes === 'function') {
                    await initClientes();
                } else if (typeof window.initClientes === 'function') {
                    await window.initClientes();
                } else {
                    throw new Error('La función initClientes no está definida.');
                }
                break;
                
            case 'expedientes':
                if (!window.expedientesInitialized) {
                    await loadScript('js/expedientes.js');
                    window.expedientesInitialized = true;
                }
                if (typeof initExpedientes === 'function') {
                    await initExpedientes();
                } else if (typeof window.initExpedientes === 'function') {
                    await window.initExpedientes();
                } else {
                    throw new Error('La función initExpedientes no está definida.');
                }
                break;
                
            case 'comunicaciones':
                if (!window.comunicacionesInitialized) {
                    await loadScript('js/comunicaciones.js');
                    window.comunicacionesInitialized = true;
                }
                if (typeof initComunicaciones === 'function') {
                    await initComunicaciones();
                } else if (typeof window.initComunicaciones === 'function') {
                    await window.initComunicaciones();
                } else {
                    throw new Error('La función initComunicaciones no está definida.');
                }
                break;
                
            default:
                console.warn(`Sección desconocida: ${section}`);
                contentElement.innerHTML = '<div class="error-message">Sección no encontrada</div>';
        }
        
        // Disparar evento para notificar que el contenido se ha cargado
        document.dispatchEvent(new CustomEvent('load-content', { 
            detail: { section: section }
        }));
    } catch (error) {
        console.error(`Error al cargar la sección ${section}:`, error);
        contentElement.innerHTML = '<div class="error-message">Error al cargar el contenido</div>';
    } finally {
        // Asegurarse de ocultar el indicador de carga
        showLoading(false);
    }
}

// Inicializar manejadores para cargar contenido
function initContentLoading() {
    // Manejador de clic para logo (regresar a home)
    const logo = document.querySelector('.logo-details');
    if (logo) {
        logo.addEventListener('click', function() {
            loadContent('home');
            
            // Actualizar menú activo
            const menuItems = document.querySelectorAll('.nav-item');
            menuItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-section') === 'home') {
                    item.classList.add('active');
                }
            });
        });
    }
}

// Cargar script específico de la sección
function loadSectionScript(section) {
    const scriptSrc = `js/${section}.js`;
    
    // Verificar si el script ya está cargado
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    
    if (!existingScript) {
        // Si no está cargado, cargar el script
        loadScript(scriptSrc);
    } else {
        // Si ya está cargado, disparar un evento para reiniciar la funcionalidad
        const event = new CustomEvent('script-reloaded', { 
            detail: { script: scriptSrc }
        });
        document.dispatchEvent(event);
    }
}

// Función para mostrar u ocultar el spinner de carga
function showLoading(show) {
    const loadingElement = document.getElementById('loading-spinner');
    if (loadingElement) {
        loadingElement.style.display = show ? 'flex' : 'none';
    }
}

// Función para mostrar un mensaje al usuario
function showMessage(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        console.error('Contenedor de alertas no encontrado');
        return;
    }
    
    // Crear el elemento de alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Agregar la alerta al contenedor
    alertContainer.appendChild(alert);
    
    // Remover la alerta después de 3 segundos
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Función para cargar un script dinámicamente
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Función para cargar archivo CSS
function loadCssFile(href) {
    // Verificar si el CSS ya está cargado
    const existingLink = document.querySelector(`link[href="${href}"]`);
    
    if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
}

// Manejar cambios de tamaño para comportamiento responsive
function handleResize() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (!sidebar || !mainContent) return;
    
    if (window.innerWidth <= 768) {
        sidebar.classList.add('close');
        mainContent.classList.add('expanded');
    }
}

// Función para enviar datos a la API
async function enviarDatosAPI(dataToSend, esActualizacion) {
    const apiUrl = 'https://tu-api.com/insertarExpediente'; // Reemplaza con la URL correcta de tu API

    // Crear objeto XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('POST', apiUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Configurar manejador de respuesta
    xhr.onload = function() {
        showLoading(false);
        if (xhr.status === 200) {
            let response;
            try {
                response = JSON.parse(xhr.responseText);
                if (response.result === 'success') {
                    showMessage(esActualizacion ? 'Registro actualizado correctamente' : 'Registro creado correctamente', 'success');
                    setTimeout(() => {
                        window.apiService.obtenerTodosLosDatos().then(() => {
                            cargarInterfazExpedientes();
                        });
                    }, 1000);
                } else {
                    showMessage('Error en la respuesta del servidor: ' + (response.message || 'Error desconocido'), 'error');
                }
            } catch (e) {
                showMessage('Error al procesar la respuesta del servidor', 'error');
            }
        } else {
            showMessage('Error al enviar datos: ' + xhr.status, 'error');
        }
    };

    // Manejar errores
    xhr.onerror = function() {
        showLoading(false);
        showMessage('Error de conexión al servidor', 'error');
    };

    // Enviar los datos
    xhr.send(JSON.stringify(dataToSend));
} 
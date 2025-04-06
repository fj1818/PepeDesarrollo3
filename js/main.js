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
            
            // Usar padding en lugar de margin para mejor visualización
            if (sidebar.classList.contains('collapsed')) {
                if (window.innerWidth <= 768) {
                    mainContent.style.paddingLeft = '250px';
                }
            } else {
                mainContent.style.paddingLeft = '0';
            }
            
            // Prevenir colapso después de la transición
            setTimeout(preventCollapseOnMobile, 300);
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
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('collapsed');
                    mainContent.style.paddingLeft = '0';
                    // Restaurar márgenes de elementos internos
                    adjustContentForSidebar(false);
                }
            }
        });
    });
    
    // Función para ajustar el contenido cuando el sidebar está abierto
    function adjustContentForSidebar(sidebarOpen) {
        if (window.innerWidth <= 768) {
            // Ajustar el header
            const header = document.querySelector('.dashboard-header');
            if (header) {
                header.style.paddingLeft = sidebarOpen ? getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width') : '12px';
            }
            
            // Evitar que el contenido se comprima
            const contentItems = document.querySelectorAll('#content > *, .content-section > *');
            contentItems.forEach(el => {
                // Asegurar que los elementos mantengan su ancho y no se compriman
                if (el.classList) {
                    if (el.classList.contains('crm-card') || 
                        el.classList.contains('stats-card') || 
                        el.classList.contains('metric-card') ||
                        el.classList.contains('card')) {
                        
                        el.style.width = '100%';
                        el.style.boxSizing = 'border-box';
                        el.style.maxWidth = 'none';
                    }
                }
            });
            
            // Asegurarse de que las filas y columnas usen todo el ancho disponible
            document.querySelectorAll('.row, [class*="col-"]').forEach(el => {
                el.style.width = '100%';
                el.style.maxWidth = 'none';
                el.style.paddingLeft = '5px';
                el.style.paddingRight = '5px';
                el.style.boxSizing = 'border-box';
                el.style.marginLeft = '0';
                el.style.marginRight = '0';
            });
        }
    }
    
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
                    // Primero cargar el fixer para asegurar que initComunicaciones esté accesible
                    await loadScript('js/comunicaciones-fix-init.js');
                    window.comunicacionesInitialized = true;
                }
                try {
                    // Esperar a que la función esté lista mediante la promesa
                    if (window.initComunicacionesReady) {
                        console.log('Esperando a que la función initComunicaciones esté disponible...');
                        await window.initComunicacionesReady;
                    }
                    
                    // Intentar usar la versión segura si está disponible
                    if (typeof window._initComunicaciones === 'function') {
                        console.log('Llamando a _initComunicaciones (función segura)');
                        await window._initComunicaciones();
                    } else if (typeof initComunicaciones === 'function') {
                        console.log('Llamando a initComunicaciones (función local)');
                        await initComunicaciones();
                    } else if (typeof window.initComunicaciones === 'function') {
                        console.log('Llamando a window.initComunicaciones (función global)');
                        await window.initComunicaciones();
                    } else {
                        throw new Error('La función initComunicaciones no está definida.');
                    }
                } catch (error) {
                    console.error('Error al inicializar comunicaciones:', error);
                    contentElement.innerHTML = `
                        <div class="alert alert-danger mt-3">
                            <h4><i class="fas fa-exclamation-triangle"></i> Error en el módulo de comunicaciones</h4>
                            <p>Se ha producido un error al cargar la sección de comunicaciones: ${error.message}</p>
                            <button class="btn btn-sm btn-primary mt-2" onclick="location.reload()">Reintentar carga</button>
                        </div>
                    `;
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
        // Comportamiento en móvil
        sidebar.classList.remove('collapsed'); // Inicialmente cerrado en móvil
        mainContent.style.paddingLeft = '0'; // Usar padding en vez de margin
        mainContent.style.marginLeft = '0'; // Asegurar que no hay margen
        mainContent.classList.add('expanded');
        
        // Ajustar elementos para mejorar visualización en móvil
        const cards = document.querySelectorAll('.crm-card, .stats-card, .metric-card');
        cards.forEach(card => {
            card.style.width = '100%';
            card.style.marginLeft = '0';
            card.style.marginRight = '0';
            card.style.maxWidth = 'none';
        });
        
        // Asegurarnos que los iconos sean suficientemente grandes para interacción táctil
        const icons = document.querySelectorAll('.nav-item i, .menu-btn i, .notification i');
        icons.forEach(icon => {
            icon.style.fontSize = '22px';
        });
        
        // Asegurar que los contenedores ocupen todo el ancho
        const containers = document.querySelectorAll('.content-section, #content');
        containers.forEach(container => {
            if (container) {
                container.style.width = '100%';
                container.style.padding = '10px 5px';
                container.style.boxSizing = 'border-box';
                container.style.overflow = 'visible';
            }
        });
        
        // Eliminar márgenes horizontales innecesarios
        document.querySelectorAll('.row, .col, .col-12, [class*="col-md-"]').forEach(el => {
            el.style.marginLeft = '0';
            el.style.marginRight = '0';
            el.style.paddingLeft = '5px';
            el.style.paddingRight = '5px';
            el.style.maxWidth = 'none';
            el.style.width = '100%';
            el.style.boxSizing = 'border-box';
        });
        
        // Garantizar que todas las tarjetas y contenedores sean visibles
        document.querySelectorAll('.card, .crm-card, .metric-card, .stat-card, .action-card').forEach(el => {
            el.style.maxWidth = 'none';
            el.style.width = '100%';
            el.style.boxSizing = 'border-box';
        });
    } else {
        // Comportamiento en desktop
        if (sidebar.classList.contains('collapsed')) {
            mainContent.classList.add('expanded');
        } else {
            mainContent.classList.remove('expanded');
        }
        mainContent.style.paddingLeft = ''; // Eliminar padding inline
        mainContent.style.marginLeft = ''; // Eliminar margen inline
        mainContent.style.transform = ''; // Eliminar transformación en desktop
    }
}

// Inicializar el evento de resize y ejecutarlo inmediatamente
document.addEventListener('DOMContentLoaded', function() {
    // Registrar el manejador de resize
    window.addEventListener('resize', handleResize);
    
    // Ejecutar inmediatamente para configurar el layout inicial
    handleResize();
    
    // También ejecutar después de cargar el contenido
    document.addEventListener('load-content', function() {
        setTimeout(handleResize, 100);
    });
});

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

// Funcion para evitar que los elementos se colapsen en modo móvil
function preventCollapseOnMobile() {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;
    
    const contentContainer = document.getElementById('content');
    if (!contentContainer) return;
    
    // Asegurar que todo el contenido tiene el ancho adecuado
    contentContainer.style.width = '100%';
    contentContainer.style.maxWidth = 'none';
    contentContainer.style.boxSizing = 'border-box';
    
    // Procesar todos los contenedores importantes
    const containers = document.querySelectorAll('#content .card, #content .container, #content .row, .comunicaciones-container, .contacts-list, .message-composer');
    containers.forEach(container => {
        container.style.width = '100%';
        container.style.maxWidth = 'none';
        container.style.minWidth = '200px';
        container.style.boxSizing = 'border-box';
    });
    
    // Asegurar que las tablas no se rompan
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        table.style.width = '100%';
        table.style.minWidth = '200px';
        if (table.parentElement) {
            table.parentElement.style.overflowX = 'auto';
        }
    });
}

// Fix sidebar toggle functionality to ensure it works correctly
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing sidebar toggle - fixed version');
    
    // Get relevant elements
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (menuBtn && sidebar && mainContent) {
        // Remove all existing click event listeners using cloneNode
        const newMenuBtn = menuBtn.cloneNode(true);
        if (menuBtn.parentNode) {
            menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);
        }
        
        // Use the new reference for the button
        newMenuBtn.addEventListener('click', function() {
            console.log('Menu button clicked - toggle sidebar');
            
            // Toggle collapsed class
            sidebar.classList.toggle('collapsed');
            
            // Determine if we're in mobile or desktop view
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                console.log('Mobile view - using transform');
                // In mobile: we use transform to push content                
                if (sidebar.classList.contains('collapsed')) {
                    console.log('Sidebar is expanded');
                    mainContent.style.transform = 'translateX(250px)';
                    
                    // Fix for header position
                    const header = document.querySelector('.dashboard-header');
                    if (header) {
                        header.style.transform = 'translateX(250px)';
                    }
                } else {
                    console.log('Sidebar is collapsed');
                    mainContent.style.transform = 'translateX(0)';
                    
                    // Fix for header position
                    const header = document.querySelector('.dashboard-header');
                    if (header) {
                        header.style.transform = 'translateX(0)';
                    }
                }
                
                // Apply additional fixes after transition
                setTimeout(function() {
                    console.log('Applying post-toggle fixes');
                    
                    // Fix navigation buttons
                    if (typeof fixNavigationButtons === 'function') {
                        fixNavigationButtons();
                    }
                    
                    // Prevent content collapse
                    preventContentCollapseFixed();
                }, 350);
            } else {
                console.log('Desktop view - using margin');
                // In desktop mode
                if (sidebar.classList.contains('collapsed')) {
                    mainContent.style.marginLeft = 'var(--sidebar-width-collapsed)';
                } else {
                    mainContent.style.marginLeft = 'var(--sidebar-width)';
                }
            }
        });
        
        // New unified prevent collapse function
        window.preventContentCollapseFixed = function() {
            const contentContainer = document.getElementById('content');
            if (!contentContainer) return;
            
            console.log('Preventing content collapse');
            
            // Force content width to prevent collapse
            contentContainer.style.width = '100%';
            contentContainer.style.maxWidth = 'none';
            contentContainer.style.boxSizing = 'border-box';
            
            // Process all important containers
            const containers = contentContainer.querySelectorAll('.card, .container, .row, .comunicaciones-container, .contacts-list, .message-composer');
            containers.forEach(container => {
                container.style.width = '100%';
                container.style.maxWidth = 'none';
                container.style.minWidth = '200px';
                container.style.boxSizing = 'border-box';
            });
            
            // Ensure tables don't break
            const tables = document.querySelectorAll('table');
            tables.forEach(table => {
                table.style.width = '100%';
                if (table.parentElement) {
                    table.parentElement.style.overflowX = 'auto';
                }
            });
        };
        
        // Fix to make sure the navigation buttons handler is accessible
        if (typeof fixNavigationButtons !== 'function') {
            window.fixNavigationButtons = function() {
                const isMobile = window.innerWidth <= 768;
                
                // Obtain navigation elements
                const menuBtn = document.querySelector('.menu-btn');
                const navbarRight = document.querySelector('.navbar-right');
                const notificationContainer = document.querySelector('.notification-container');
                const refreshContainer = document.querySelector('.refresh-container');
                
                if (isMobile) {
                    console.log('Fixing navigation buttons for mobile');
                    
                    // Ensure menu button is visible and functional
                    if (menuBtn) {
                        menuBtn.style.display = 'flex';
                        menuBtn.style.position = 'fixed';
                        menuBtn.style.top = '10px';
                        menuBtn.style.right = '10px';
                        menuBtn.style.zIndex = '2500';
                        menuBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                        menuBtn.style.borderRadius = '50%';
                        menuBtn.style.width = '40px';
                        menuBtn.style.height = '40px';
                        menuBtn.style.alignItems = 'center';
                        menuBtn.style.justifyContent = 'center';
                        menuBtn.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                    }
                    
                    // Ensure the right navbar buttons are visible
                    if (navbarRight) {
                        navbarRight.style.position = 'fixed';
                        navbarRight.style.top = '10px';
                        navbarRight.style.right = '60px';
                        navbarRight.style.zIndex = '2400';
                        navbarRight.style.display = 'flex';
                        navbarRight.style.alignItems = 'center';
                        navbarRight.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                        navbarRight.style.borderRadius = '20px';
                        navbarRight.style.padding = '5px 10px';
                        navbarRight.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                    }
                }
            };
        }
        
        // Handle resize events
        window.addEventListener('resize', function() {
            const isMobile = window.innerWidth <= 768;
            
            // Reset styles on resize
            if (!isMobile) {
                mainContent.style.transform = '';
                
                const header = document.querySelector('.dashboard-header');
                if (header) {
                    header.style.transform = '';
                }
                
                // In desktop mode
                if (sidebar.classList.contains('collapsed')) {
                    mainContent.style.marginLeft = 'var(--sidebar-width-collapsed)';
                } else {
                    mainContent.style.marginLeft = 'var(--sidebar-width)';
                }
            } else {
                // In mobile mode
                mainContent.style.marginLeft = '0';
                
                if (sidebar.classList.contains('collapsed')) {
                    mainContent.style.transform = 'translateX(250px)';
                    
                    const header = document.querySelector('.dashboard-header');
                    if (header) {
                        header.style.transform = 'translateX(250px)';
                    }
                } else {
                    mainContent.style.transform = 'translateX(0)';
                    
                    const header = document.querySelector('.dashboard-header');
                    if (header) {
                        header.style.transform = 'translateX(0)';
                    }
                }
                
                // Always ensure content doesn't collapse
                if (typeof preventContentCollapseFixed === 'function') {
                    preventContentCollapseFixed();
                }
                
                // Fix navigation buttons
                if (typeof fixNavigationButtons === 'function') {
                    fixNavigationButtons();
                }
            }
        });
        
        // Initialize based on current window size
        const initialIsMobile = window.innerWidth <= 768;
        
        if (initialIsMobile) {
            console.log('Initializing for mobile');
            // Start with sidebar closed on mobile
            sidebar.classList.remove('collapsed');
            mainContent.style.transform = 'translateX(0)';
            
            const header = document.querySelector('.dashboard-header');
            if (header) {
                header.style.transform = 'translateX(0)';
            }
            
            // Ensure buttons are visible
            if (typeof fixNavigationButtons === 'function') {
                fixNavigationButtons();
            }
        } else {
            console.log('Initializing for desktop');
            // On desktop, initialize according to sidebar state
            if (sidebar.classList.contains('collapsed')) {
                mainContent.style.marginLeft = 'var(--sidebar-width-collapsed)';
            } else {
                mainContent.style.marginLeft = 'var(--sidebar-width)';
            }
        }
    }
}); 
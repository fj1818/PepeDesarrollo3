/**
 * Home Dashboard - Indicadores principales
 */

// Inicializar módulo
document.addEventListener('DOMContentLoaded', initHome);

// Reiniciar si el script ya estaba cargado
document.addEventListener('script-reloaded', function(e) {
    if (e.detail.script === 'js/home.js') {
        initHome();
    }
});

// Variables para gráficos
window.prospectosChart = null;
window.clientesChart = null;
window.expedientesChart = null;

/**
 * Inicializar el dashboard principal
 */
async function initHome() {
    try {
        // Mostrar indicador de carga
        showLoading(true);
        
        // Verificar si tenemos datos
        if (!window.apiData || !window.apiData.prospectos) {
            // Si no hay datos, intentar cargarlos
            await window.apiService.obtenerTodosLosDatos();
        }
        
        // Calcular métricas
        const metricas = calcularMetricasDashboard();
        
        // Actualizar UI con las métricas
        actualizarIndicadores(metricas);
        
        // Actualizar notificación de prospectos sin atender
        actualizarNotificacionProspectos(metricas.prospectosSinAtender);
        
        // Configurar botón de actualizar
        setupRefreshButton();
        
        // Ocultar indicador de carga
        showLoading(false);
    } catch (error) {
        console.error('Error al inicializar la página de inicio:', error);
        showLoading(false);
        showMessage('Error al cargar los datos. Por favor, intente nuevamente.', 'error');
    }
}

/**
 * Configurar el botón de actualizar
 */
function setupRefreshButton() {
    const refreshBtn = document.getElementById('refresh-btn');
    if (!refreshBtn) return;
    
    refreshBtn.addEventListener('click', async function() {
        // Añadir clase para animación de rotación
        this.classList.add('rotating');
        
        try {
            // Volver a cargar todos los datos
            await window.apiService.obtenerTodosLosDatos();
            
            // Recargar la interfaz actual
            const currentSection = document.querySelector('.nav-item.active');
            if (currentSection) {
                const section = currentSection.getAttribute('data-section');
                if (section) {
                    await loadContent(section);
                }
            }
            
            showMessage('Datos actualizados correctamente', 'success');
        } catch (error) {
            console.error('Error al actualizar datos:', error);
            showMessage('Error al actualizar los datos', 'error');
        } finally {
            // Quitar clase de rotación
            setTimeout(() => {
                this.classList.remove('rotating');
            }, 500);
        }
    });
}

/**
 * Configurar las notificaciones de la campana
 */
function setupNotifications() {
    // Obtener el elemento badge de notificación
    const notificationBadge = document.querySelector('.notification-badge');
    if (!notificationBadge) return;
    
    // Calcular prospectos sin atender
    if (window.apiData && window.apiData.prospectos) {
        const prospectosSinAtender = getProspectosSinAtender().length;
        
        // Actualizar el badge
        notificationBadge.textContent = prospectosSinAtender;
        
        // Mostrar u ocultar el badge según si hay notificaciones
        if (prospectosSinAtender > 0) {
            notificationBadge.style.display = 'flex';
        } else {
            notificationBadge.style.display = 'none';
        }
        
        // Agregar evento al hacer clic en la notificación
        const notificationIcon = document.querySelector('.notification-container');
        if (notificationIcon) {
            notificationIcon.addEventListener('click', function() {
                // Mostrar toast con mensaje
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'info',
                    title: `Tienes ${prospectosSinAtender} prospectos sin atender`,
                    showConfirmButton: true,
                    confirmButtonText: 'Ver prospectos',
                    confirmButtonColor: '#E63946',
                    timer: 5000
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Navegar a la sección de prospectos
                        const prospectoItem = document.querySelector('.nav-item[data-section="prospectos"]');
                        if (prospectoItem) {
                            prospectoItem.click();
                        }
                    }
                });
            });
        }
    }
}

/**
 * Cargar la interfaz del dashboard principal
 */
function loadHomeUI() {
    const contentSection = document.querySelector('.content-section');
    if (!contentSection) return;
    
    // Verificar si tenemos datos
    if (!window.apiData || !window.apiData.prospectos) {
        // Si no hay datos, mostrar indicador de carga y esperar
        contentSection.innerHTML = `
            <div class="loading-container">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-3 text-muted">Cargando datos del sistema...</p>
            </div>
        `;
        
        // Intentar cargar datos
        if (window.apiService) {
            window.apiService.obtenerTodosLosDatos().then(() => {
                loadHomeUI(); // Recargar UI cuando los datos estén disponibles
            });
        }
        
        return;
    }
    
    // Calcular métricas
    const metricas = calcularMetricasDashboard();
    
    // Crear contenido del dashboard
    contentSection.innerHTML = `
        <div class="row mb-4">
            <div class="col-12">
                <div class="crm-card">
                    <div class="card-header">
                        <h5 class="card-title">
                            <i class="fas fa-tachometer-alt me-2"></i> Dashboard
                        </h5>
                    </div>
                    <div class="card-body">
                        <p>Bienvenido al panel de control. Aquí encontrarás un resumen de la actividad del sistema.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Métricas de Prospectos -->
        <div class="row mb-4">
            <div class="col-12">
                <h5 class="section-title"><i class="fas fa-user-plus me-2"></i> Prospectos</h5>
            </div>
            
            <div class="col-md-4 mb-3">
                <div class="crm-card stats-card">
                    <div class="stats-icon primary">
                        <i class="fas fa-user-clock"></i>
                    </div>
                    <div class="stats-info">
                        <h4 id="prospectos-sin-atender">${metricas.prospectosSinAtender}</h4>
                        <p>Sin atender</p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4 mb-3">
                <div class="crm-card stats-card">
                    <div class="stats-icon success">
                        <i class="fas fa-user-check"></i>
                    </div>
                    <div class="stats-info">
                        <h4 id="prospectos-contactados">${metricas.prospectosContactados}</h4>
                        <p>Contactados</p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4 mb-3">
                <div class="crm-card stats-card">
                    <div class="stats-icon secondary">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stats-info">
                        <h4 id="prospectos-total">${metricas.prospectosTotales}</h4>
                        <p>Total</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Métricas de Clientes -->
        <div class="row mb-4">
            <div class="col-12">
                <h5 class="section-title"><i class="fas fa-users me-2"></i> Clientes</h5>
            </div>
            
            <div class="col-md-4 mb-3">
                <div class="crm-card stats-card">
                    <div class="stats-icon primary">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="stats-info">
                        <h4 id="clientes-activos">${metricas.clientesActivos}</h4>
                        <p>Activos</p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4 mb-3">
                <div class="crm-card stats-card">
                    <div class="stats-icon warning">
                        <i class="fas fa-user-slash"></i>
                    </div>
                    <div class="stats-info">
                        <h4 id="clientes-finalizados">${metricas.clientesFinalizados}</h4>
                        <p>Finalizados</p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4 mb-3">
                <div class="crm-card stats-card">
                    <div class="stats-icon secondary">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stats-info">
                        <h4 id="clientes-total">${metricas.clientesTotales}</h4>
                        <p>Total</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Métricas de Expedientes -->
        <div class="row mb-4">
            <div class="col-12">
                <h5 class="section-title"><i class="fas fa-folder-open me-2"></i> Expedientes</h5>
            </div>
            
            <div class="col-md-4 mb-3">
                <div class="crm-card stats-card">
                    <div class="stats-icon primary">
                        <i class="fas fa-folder-plus"></i>
                    </div>
                    <div class="stats-info">
                        <h4 id="expedientes-abiertos">${metricas.expedientesAbiertos}</h4>
                        <p>Abiertos</p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4 mb-3">
                <div class="crm-card stats-card">
                    <div class="stats-icon success">
                        <i class="fas fa-folder-minus"></i>
                    </div>
                    <div class="stats-info">
                        <h4 id="expedientes-cerrados">${metricas.expedientesCerrados}</h4>
                        <p>Cerrados</p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4 mb-3">
                <div class="crm-card stats-card">
                    <div class="stats-icon secondary">
                        <i class="fas fa-folders"></i>
                    </div>
                    <div class="stats-info">
                        <h4 id="expedientes-total">${metricas.expedientesTotales}</h4>
                        <p>Total</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Gráficos -->
        <div class="row">
            <div class="col-md-4 mb-3">
                <div class="crm-card">
                    <div class="card-header">
                        <h5 class="card-title">Prospectos</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="prospectosChart" height="250"></canvas>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4 mb-3">
                <div class="crm-card">
                    <div class="card-header">
                        <h5 class="card-title">Clientes</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="clientesChart" height="250"></canvas>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4 mb-3">
                <div class="crm-card">
                    <div class="card-header">
                        <h5 class="card-title">Expedientes</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="expedientesChart" height="250"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Inicializar gráficos
    initCharts(metricas);
    
    // Configurar notificaciones
    setupNotifications();
}

/**
 * Calcular todas las métricas requeridas para el dashboard
 */
function calcularMetricasDashboard() {
    // Prospectos
    const prospectosSinAtender = getProspectosSinAtender().length;
    const prospectosContactados = getProspectosContactados().length;
    const prospectosTotales = Object.keys(window.apiData.prospectos || {}).length;
    
    // Clientes
    const clientesActivos = getClientesActivos().length;
    const clientesFinalizados = getClientesFinalizados().length;
    const clientesTotales = Object.keys(window.apiData.clientes || {}).length;
    
    // Expedientes
    const expedientesAbiertos = getExpedientesAbiertos().length;
    const expedientesCerrados = getExpedientesCerrados().length;
    const expedientesTotales = getExpedientesTotales().length;
    
    return {
        prospectosSinAtender,
        prospectosContactados,
        prospectosTotales,
        clientesActivos,
        clientesFinalizados,
        clientesTotales,
        expedientesAbiertos,
        expedientesCerrados,
        expedientesTotales
    };
}

/**
 * Inicializar gráficos del dashboard
 */
function initCharts(metricas) {
    // Gráfico de Prospectos
    const prospectosCtx = document.getElementById('prospectosChart');
    if (prospectosCtx) {
        window.prospectosChart = new Chart(prospectosCtx, {
            type: 'doughnut',
            data: {
                labels: ['Sin atender', 'Contactados'],
                datasets: [{
                    data: [metricas.prospectosSinAtender, metricas.prospectosContactados],
                    backgroundColor: ['#E63946', '#28a745'],
                    borderColor: ['#fff', '#fff'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Gráfico de Clientes
    const clientesCtx = document.getElementById('clientesChart');
    if (clientesCtx) {
        window.clientesChart = new Chart(clientesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Activos', 'Finalizados'],
                datasets: [{
                    data: [metricas.clientesActivos, metricas.clientesFinalizados],
                    backgroundColor: ['#457B9D', '#ffc107'],
                    borderColor: ['#fff', '#fff'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Gráfico de Expedientes
    const expedientesCtx = document.getElementById('expedientesChart');
    if (expedientesCtx) {
        window.expedientesChart = new Chart(expedientesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Abiertos', 'Cerrados'],
                datasets: [{
                    data: [metricas.expedientesAbiertos, metricas.expedientesCerrados],
                    backgroundColor: ['#457B9D', '#28a745'],
                    borderColor: ['#fff', '#fff'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

/**
 * Obtener prospectos sin atender
 */
function getProspectosSinAtender() {
    if (!window.apiData || !window.apiData.prospectos) return [];
    
    return Object.values(window.apiData.prospectos).filter(p => 
        p.contactado !== "true" && p.contactado !== true
    );
}

/**
 * Obtener prospectos contactados
 */
function getProspectosContactados() {
    if (!window.apiData || !window.apiData.prospectos) return [];
    
    return Object.values(window.apiData.prospectos).filter(p => 
        p.contactado === "true" || p.contactado === true
    );
}

/**
 * Obtener clientes activos
 */
function getClientesActivos() {
    if (!window.apiData || !window.apiData.clientes) return [];
    
    return Object.values(window.apiData.clientes).filter(c => 
        c.finalizado !== true && c.finalizado !== "true" && 
        c.estado !== "Finalizado"
    );
}

/**
 * Obtener clientes finalizados
 */
function getClientesFinalizados() {
    if (!window.apiData || !window.apiData.clientes) return [];
    
    return Object.values(window.apiData.clientes).filter(c => 
        c.finalizado === true || c.finalizado === "true" || 
        c.estado === "Finalizado"
    );
}

/**
 * Obtener expedientes abiertos
 */
function getExpedientesAbiertos() {
    // Si tenemos datos cargados directamente de expedientes
    if (window.apiData && window.apiData.expedientes) {
        return Object.values(window.apiData.expedientes).filter(e => 
            !e.fechaCierre || e.estado !== "Cerrado"
        );
    }
    
    // Si no tenemos datos directos de expedientes, usar la relación desde clientes
    if (!window.apiData || !window.apiData.clientes) return [];
    
    // Filtrar clientes con expediente y sin finalizar
    return Object.values(window.apiData.clientes)
        .filter(c => c.numeroExpediente || c['numero-expediente'])
        .filter(c => c.finalizado !== true && c.finalizado !== "true");
}

/**
 * Obtener expedientes cerrados
 */
function getExpedientesCerrados() {
    // Si tenemos datos cargados directamente de expedientes
    if (window.apiData && window.apiData.expedientes) {
        return Object.values(window.apiData.expedientes).filter(e => 
            e.fechaCierre || e.estado === "Cerrado"
        );
    }
    
    // Si no tenemos datos directos de expedientes, usar la relación desde clientes
    if (!window.apiData || !window.apiData.clientes) return [];
    
    // Filtrar clientes con expediente y finalizados
    return Object.values(window.apiData.clientes)
        .filter(c => c.numeroExpediente || c['numero-expediente'])
        .filter(c => c.finalizado === true || c.finalizado === "true");
}

/**
 * Obtener total de expedientes
 */
function getExpedientesTotales() {
    // Si tenemos datos cargados directamente de expedientes
    if (window.apiData && window.apiData.expedientes) {
        return Object.values(window.apiData.expedientes);
    }
    
    // Si no tenemos datos directos de expedientes, usar la relación desde clientes
    if (!window.apiData || !window.apiData.clientes) return [];
    
    // Filtrar clientes con expediente
    return Object.values(window.apiData.clientes)
        .filter(c => c.numeroExpediente || c['numero-expediente']);
}

// Función para calcular las métricas
function calcularMetricas(prospectos, clientes, expedientes) {
    // Prospectos
    const prospectosSinAtender = Object.values(prospectos).filter(p => p.contactado !== true).length;
    const prospectosContactados = Object.values(prospectos).filter(p => p.contactado === true).length;
    const prospectosTotales = Object.values(prospectos).length;
    
    // Clientes
    const clientesActivos = Object.values(clientes).filter(c => c.finalizado !== true).length;
    const clientesFinalizados = Object.values(clientes).filter(c => c.finalizado === true).length;
    const clientesTotales = Object.values(clientes).length;
    
    // Expedientes
    const expedientesAbiertos = Object.values(expedientes).filter(e => e.finalizado !== true).length;
    const expedientesCerrados = Object.values(expedientes).filter(e => e.finalizado === true).length;
    const expedientesTotales = Object.values(expedientes).length;
    
    return {
        prospectosSinAtender,
        prospectosContactados,
        prospectosTotales,
        clientesActivos,
        clientesFinalizados,
        clientesTotales,
        expedientesAbiertos,
        expedientesCerrados,
        expedientesTotales
    };
}

// Función para actualizar los indicadores en la UI
function actualizarIndicadores(metricas) {
    const homeContainer = document.querySelector('#content');
    if (!homeContainer) return;
    
    homeContainer.innerHTML = `
        <div class="dashboard-header">
            <h1>Dashboard</h1>
        </div>
        
        <div class="metrics-container">
            <div class="metrics-section">
                <h2>Prospectos</h2>
                <div class="metrics-cards">
                    <div class="metric-card">
                        <div class="metric-value">${metricas.prospectosSinAtender}</div>
                        <div class="metric-label">Sin atender</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${metricas.prospectosContactados}</div>
                        <div class="metric-label">Contactados</div>
                    </div>
                    <div class="metric-card total">
                        <div class="metric-value">${metricas.prospectosTotales}</div>
                        <div class="metric-label">Total</div>
                    </div>
                </div>
            </div>
            
            <div class="metrics-section">
                <h2>Clientes</h2>
                <div class="metrics-cards">
                    <div class="metric-card">
                        <div class="metric-value">${metricas.clientesActivos}</div>
                        <div class="metric-label">Activos</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${metricas.clientesFinalizados}</div>
                        <div class="metric-label">Finalizados</div>
                    </div>
                    <div class="metric-card total">
                        <div class="metric-value">${metricas.clientesTotales}</div>
                        <div class="metric-label">Total</div>
                    </div>
                </div>
            </div>
            
            <div class="metrics-section">
                <h2>Expedientes</h2>
                <div class="metrics-cards">
                    <div class="metric-card">
                        <div class="metric-value">${metricas.expedientesAbiertos}</div>
                        <div class="metric-label">Abiertos</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${metricas.expedientesCerrados}</div>
                        <div class="metric-label">Cerrados</div>
                    </div>
                    <div class="metric-card total">
                        <div class="metric-value">${metricas.expedientesTotales}</div>
                        <div class="metric-label">Total</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="charts-container">
            <div class="chart-section">
                <h3>Distribución de Prospectos</h3>
                <div class="chart-card">
                    <canvas id="prospectosChart"></canvas>
                </div>
            </div>
            <div class="chart-section">
                <h3>Estado de Clientes</h3>
                <div class="chart-card">
                    <canvas id="clientesChart"></canvas>
                </div>
            </div>
            <div class="chart-section">
                <h3>Prospectos Recientes</h3>
                <div class="recent-list">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Contacto</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody id="recent-prospectos">
                            <!-- Contenido dinámico de prospectos recientes -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Función para actualizar la notificación de prospectos sin atender
function actualizarNotificacionProspectos(cantidad) {
    const notificacionBadge = document.querySelector('.notification-badge');
    if (notificacionBadge) {
        if (cantidad > 0) {
            notificacionBadge.textContent = cantidad;
            notificacionBadge.style.display = 'flex';
        } else {
            notificacionBadge.style.display = 'none';
        }
    }
} 
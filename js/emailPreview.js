/**
 * Funciones para la vista previa de email
 */

/**
 * Crear vista previa HTML de email
 * @param {string} content - Contenido del correo
 * @returns {string} HTML formateado para la vista previa
 */
function createEmailHtmlPreview(content) {
    // Convertir saltos de línea en <br>
    content = content.replace(/\n/g, '<br>');
    
    // Crear estructura HTML para el email
    return `
    <div style="max-width: 600px; font-family: Arial, sans-serif; border: 1px solid #e1e1e1; border-radius: 5px; overflow: hidden;">
        <div style="background-color: #00AEEF; padding: 15px; text-align: center;">
            <h2 style="color: white; margin: 0;">Pepe Urueta</h2>
            <p style="color: white; margin: 5px 0 0;">Entrenador Personal</p>
        </div>
        <div style="padding: 20px; background-color: white;">
            ${content}
        </div>
        <div style="background-color: #f7f7f7; padding: 15px; text-align: center; border-top: 1px solid #e1e1e1;">
            <img src="Footer.jpg" alt="Pepe Urueta" style="max-width: 150px; height: auto;">
        </div>
    </div>
    `;
}

// Exponer la función globalmente
window.emailPreview = {
    createEmailHtmlPreview: createEmailHtmlPreview
}; 
/**
 * Google Apps Script para el backend del CRM
 * Para usar: Copiar este código a un nuevo proyecto de Google Apps Script
 * y publicar como aplicación web con acceso para "Cualquier persona, incluso anónimos"
 */

// Configuración global
const SPREADSHEET_ID = 'TU_ID_DE_SPREADSHEET'; // Reemplazar con el ID de tu hoja

/**
 * Función principal para manejar solicitudes GET
 */
function doGet(e) {
  // Configurar los encabezados CORS para permitir solicitudes desde cualquier origen
  const output = ContentService.createTextOutput();
  
  // Obtener la acción solicitada
  const action = e.parameter.action;
  let responseData = {};
  
  // Ejecutar la acción correspondiente
  switch(action) {
    case 'getAllData':
      responseData = getAllData();
      break;
    case 'getProspectos':
      responseData = { prospectos: getProspectos() };
      break;
    case 'getClientes':
      responseData = { clientes: getClientes() };
      break;
    case 'getExpedientes':
      responseData = { expedientes: getExpedientes() };
      break;
    default:
      responseData = { error: 'Acción no válida' };
  }
  
  // Devolver la respuesta con encabezados CORS adecuados
  return output
    .setMimeType(ContentService.MimeType.JSON)
    .setContent(JSON.stringify(responseData))
    .addHeader('Access-Control-Allow-Origin', '*');
}

/**
 * Maneja solicitudes OPTIONS (preflight de CORS)
 */
function doOptions(e) {
  // Configurar encabezados CORS completos para el preflight
  const output = ContentService.createTextOutput();
  output.setContent(JSON.stringify({ status: 'ok' }));
  
  return output
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Obtiene todos los datos del sistema
 */
function getAllData() {
  return {
    prospectos: getProspectos(),
    clientes: getClientes(),
    expedientes: getExpedientes()
  };
}

/**
 * Obtiene todos los prospectos
 */
function getProspectos() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Prospectos');
    return getSheetDataAsObject(sheet, 'p');
  } catch (error) {
    Logger.log('Error al obtener prospectos: ' + error);
    return {};
  }
}

/**
 * Obtiene todos los clientes
 */
function getClientes() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Clientes');
    return getSheetDataAsObject(sheet, 'c');
  } catch (error) {
    Logger.log('Error al obtener clientes: ' + error);
    return {};
  }
}

/**
 * Obtiene todos los expedientes
 */
function getExpedientes() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Expedientes');
    return getSheetDataAsObject(sheet, 'e');
  } catch (error) {
    Logger.log('Error al obtener expedientes: ' + error);
    return {};
  }
}

/**
 * Convierte los datos de una hoja en un objeto con ids
 */
function getSheetDataAsObject(sheet, prefix) {
  // Obtener todas las filas y encabezados
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0]; // Primera fila son los encabezados
  
  const result = {};
  
  // Convertir filas en objetos
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const item = {};
    
    // Asignar id único si no tiene uno
    const id = row[0] || `${prefix}${i}`;
    
    // Crear objeto con propiedades basadas en encabezados
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j].toLowerCase().replace(/\s+/g, '');
      item[header] = row[j];
    }
    
    // Asegurar que el id está en el objeto
    item.id = id;
    result[id] = item;
  }
  
  return result;
} 
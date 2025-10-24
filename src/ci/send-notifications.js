// src/ci/send-notifications.js

/**
 * Script de notificaciones para Azure DevOps
 * Reemplaza el sistema de email por notificaciones nativas más seguras
 */

const fs = require('fs');
const path = require('path');

// Importar el servicio de notificaciones
const { AzureNotificationService, NotificationServiceFactory } = require('./azure-notifications');

/**
 * Configuración de notificaciones
 */
const NOTIFICATION_CONFIG = {
  enabled: process.env.NOTIFICATIONS_ENABLED !== 'false',
  channels: process.env.NOTIFICATION_CHANNELS?.split(',') || ['console', 'azure-devops'],
  webhookUrl: process.env.WEBHOOK_URL,
  includeArtifacts: process.env.INCLUDE_ARTIFACTS !== 'false',
  includeScreenshots: process.env.INCLUDE_SCREENSHOTS === 'true'
};

/**
 * Directorios de artefactos
 */
const ARTIFACTS_DIR = process.env.ARTIFACTS_DIR || './test-results';
const REPORTS_DIR = path.join(ARTIFACTS_DIR, 'reports');
const SCREENSHOTS_DIR = path.join(ARTIFACTS_DIR, 'screenshots');
const VIDEOS_DIR = path.join(ARTIFACTS_DIR, 'videos');

/**
 * Función principal
 */
async function main() {
  try {
    console.log('🚀 Starting notification process...');
    
    // Crear servicio de notificaciones
    const notificationService = new AzureNotificationService(NOTIFICATION_CONFIG);
    
    // Procesar resultados de pruebas
    const testResults = await processTestResults();
    if (testResults.length > 0) {
      await notificationService.sendTestResults(testResults);
    }
    
    // Procesar artefactos
    if (NOTIFICATION_CONFIG.includeArtifacts) {
      const artifacts = await processArtifacts();
      if (artifacts.length > 0) {
        await notificationService.sendArtifactsNotification(artifacts);
      }
    }
    
    console.log('✅ Notification process completed successfully');
    
  } catch (error) {
    console.error('❌ Notification process failed:', error);
    process.exit(1);
  }
}

/**
 * Procesa resultados de pruebas desde archivos de reporte
 */
async function processTestResults() {
  const results = [];
  
  try {
    // Buscar archivos de reporte
    const reportFiles = findReportFiles();
    
    for (const reportFile of reportFiles) {
      const reportData = await parseReportFile(reportFile);
      if (reportData) {
        results.push(reportData);
      }
    }
    
  } catch (error) {
    console.error('Error processing test results:', error);
  }
  
  return results;
}

/**
 * Busca archivos de reporte
 */
function findReportFiles() {
  const reportFiles = [];
  
  if (fs.existsSync(REPORTS_DIR)) {
    const files = fs.readdirSync(REPORTS_DIR);
    files.forEach(file => {
      if (file.endsWith('.json') || file.endsWith('.xml') || file.endsWith('.html')) {
        reportFiles.push(path.join(REPORTS_DIR, file));
      }
    });
  }
  
  return reportFiles;
}

/**
 * Parsea archivo de reporte
 */
async function parseReportFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // Intentar parsear como JSON (Playwright JSON report)
    if (fileName.endsWith('.json')) {
      const data = JSON.parse(content);
      return {
        testSuite: fileName.replace('.json', ''),
        passed: data.stats?.passed || 0,
        failed: data.stats?.failed || 0,
        skipped: data.stats?.skipped || 0,
        duration: data.stats?.duration || 0,
        timestamp: new Date()
      };
    }
    
    // Para otros formatos, crear resultado básico
    return {
      testSuite: fileName,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      timestamp: new Date()
    };
    
  } catch (error) {
    console.error(`Error parsing report file ${filePath}:`, error);
    return null;
  }
}

/**
 * Procesa artefactos generados
 */
async function processArtifacts() {
  const artifacts = [];
  
  try {
    // Procesar screenshots
    if (NOTIFICATION_CONFIG.includeScreenshots && fs.existsSync(SCREENSHOTS_DIR)) {
      const screenshotFiles = fs.readdirSync(SCREENSHOTS_DIR);
      screenshotFiles.forEach(file => {
        const filePath = path.join(SCREENSHOTS_DIR, file);
        const stats = fs.statSync(filePath);
        artifacts.push({
          name: file,
          path: filePath,
          size: stats.size,
          type: 'screenshot'
        });
      });
    }
    
    // Procesar videos
    if (fs.existsSync(VIDEOS_DIR)) {
      const videoFiles = fs.readdirSync(VIDEOS_DIR);
      videoFiles.forEach(file => {
        const filePath = path.join(VIDEOS_DIR, file);
        const stats = fs.statSync(filePath);
        artifacts.push({
          name: file,
          path: filePath,
          size: stats.size,
          type: 'video'
        });
      });
    }
    
    // Procesar reportes
    if (fs.existsSync(REPORTS_DIR)) {
      const reportFiles = fs.readdirSync(REPORTS_DIR);
      reportFiles.forEach(file => {
        const filePath = path.join(REPORTS_DIR, file);
        const stats = fs.statSync(filePath);
        artifacts.push({
          name: file,
          path: filePath,
          size: stats.size,
          type: 'report'
        });
      });
    }
    
  } catch (error) {
    console.error('Error processing artifacts:', error);
  }
  
  return artifacts;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { main, processTestResults, processArtifacts };


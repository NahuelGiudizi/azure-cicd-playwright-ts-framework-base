// src/ci/azure-notifications.ts

/**
 * Sistema de notificaciones nativo de Azure DevOps
 * Reemplaza el uso de credenciales de email por notificaciones seguras del sistema CI
 */

export interface TestResult {
  testSuite: string;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  timestamp: Date;
}

export interface TestArtifact {
  name: string;
  path: string;
  size: number;
  type: 'report' | 'screenshot' | 'video' | 'log';
}

export interface NotificationConfig {
  enabled: boolean;
  channels: ('console' | 'azure-devops' | 'webhook')[];
  webhookUrl?: string;
  includeArtifacts: boolean;
  includeScreenshots: boolean;
}

/**
 * Clase para manejar notificaciones de Azure DevOps
 */
export class AzureNotificationService {
  private config: NotificationConfig;

  constructor(config: Partial<NotificationConfig> = {}) {
    this.config = {
      enabled: true,
      channels: ['console', 'azure-devops'],
      includeArtifacts: true,
      includeScreenshots: false,
      ...config
    };
  }

  /**
   * Envía notificación de resultados de pruebas
   */
  async sendTestResults(results: TestResult[]): Promise<void> {
    if (!this.config.enabled) {
      console.log('Notifications disabled');
      return;
    }

    const summary = this.generateTestSummary(results);
    
    for (const channel of this.config.channels) {
      switch (channel) {
        case 'console':
          this.sendConsoleNotification(summary);
          break;
        case 'azure-devops':
          await this.sendAzureDevOpsNotification(summary);
          break;
        case 'webhook':
          if (this.config.webhookUrl) {
            await this.sendWebhookNotification(summary);
          }
          break;
      }
    }
  }

  /**
   * Envía notificación de artefactos generados
   */
  async sendArtifactsNotification(artifacts: TestArtifact[]): Promise<void> {
    if (!this.config.enabled || !this.config.includeArtifacts) {
      return;
    }

    const artifactSummary = this.generateArtifactSummary(artifacts);
    
    for (const channel of this.config.channels) {
      switch (channel) {
        case 'console':
          this.sendConsoleNotification(artifactSummary);
          break;
        case 'azure-devops':
          await this.sendAzureDevOpsNotification(artifactSummary);
          break;
        case 'webhook':
          if (this.config.webhookUrl) {
            await this.sendWebhookNotification(artifactSummary);
          }
          break;
      }
    }
  }

  /**
   * Genera resumen de resultados de pruebas
   */
  private generateTestSummary(results: TestResult[]): string {
    const totalTests = results.reduce((sum, r) => sum + r.passed + r.failed + r.skipped, 0);
    const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
    const totalSkipped = results.reduce((sum, r) => sum + r.skipped, 0);
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0';

    let summary = `## 🧪 Test Results Summary\n\n`;
    summary += `**Overall Results:**\n`;
    summary += `- ✅ Passed: ${totalPassed}\n`;
    summary += `- ❌ Failed: ${totalFailed}\n`;
    summary += `- ⏭️ Skipped: ${totalSkipped}\n`;
    summary += `- 📊 Success Rate: ${successRate}%\n`;
    summary += `- ⏱️ Total Duration: ${(totalDuration / 1000).toFixed(1)}s\n\n`;

    summary += `**Test Suites:**\n`;
    results.forEach(result => {
      const suiteSuccessRate = result.passed + result.failed > 0 
        ? ((result.passed / (result.passed + result.failed)) * 100).toFixed(1)
        : '0';
      
      summary += `- **${result.testSuite}**: ${result.passed}✅ ${result.failed}❌ ${result.skipped}⏭️ (${suiteSuccessRate}% success)\n`;
    });

    return summary;
  }

  /**
   * Genera resumen de artefactos
   */
  private generateArtifactSummary(artifacts: TestArtifact[]): string {
    if (artifacts.length === 0) {
      return '## 📁 No artifacts generated';
    }

    let summary = `## 📁 Test Artifacts Generated\n\n`;
    summary += `**Total Artifacts:** ${artifacts.length}\n\n`;

    const byType = artifacts.reduce((acc, artifact) => {
      acc[artifact.type] = (acc[artifact.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    summary += `**By Type:**\n`;
    Object.entries(byType).forEach(([type, count]) => {
      const icon = this.getArtifactIcon(type);
      summary += `- ${icon} ${type}: ${count}\n`;
    });

    summary += `\n**Files:**\n`;
    artifacts.forEach(artifact => {
      const icon = this.getArtifactIcon(artifact.type);
      const size = this.formatFileSize(artifact.size);
      summary += `- ${icon} ${artifact.name} (${size})\n`;
    });

    return summary;
  }

  /**
   * Envía notificación a consola
   */
  private sendConsoleNotification(message: string): void {
    console.log('\n' + '='.repeat(80));
    console.log(message);
    console.log('='.repeat(80) + '\n');
  }

  /**
   * Envía notificación a Azure DevOps
   */
  private async sendAzureDevOpsNotification(message: string): Promise<void> {
    // Azure DevOps automáticamente captura output de consola
    // También podemos usar Azure DevOps REST API si es necesario
    console.log(`##vso[task.logissue type=info]${message.replace(/\n/g, '%0A')}`);
  }

  /**
   * Envía notificación a webhook
   */
  private async sendWebhookNotification(message: string): Promise<void> {
    if (!this.config.webhookUrl) {
      return;
    }

    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          timestamp: new Date().toISOString(),
          source: 'azure-cicd-playwright-framework'
        })
      });

      if (!response.ok) {
        console.error(`Webhook notification failed: ${response.status}`);
      }
    } catch (error) {
      console.error(`Webhook notification error: ${error}`);
    }
  }

  /**
   * Obtiene icono para tipo de artefacto
   */
  private getArtifactIcon(type: string): string {
    const icons: Record<string, string> = {
      report: '📊',
      screenshot: '📸',
      video: '🎥',
      log: '📝'
    };
    return icons[type] || '📄';
  }

  /**
   * Formatea tamaño de archivo
   */
  private formatFileSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }
}

/**
 * Factory para crear servicios de notificación
 */
export class NotificationServiceFactory {
  /**
   * Crea servicio para Azure DevOps
   */
  static createAzureService(): AzureNotificationService {
    return new AzureNotificationService({
      channels: ['console', 'azure-devops'],
      includeArtifacts: true,
      includeScreenshots: false
    });
  }

  /**
   * Crea servicio con webhook personalizado
   */
  static createWebhookService(webhookUrl: string): AzureNotificationService {
    return new AzureNotificationService({
      channels: ['console', 'webhook'],
      webhookUrl,
      includeArtifacts: true,
      includeScreenshots: true
    });
  }

  /**
   * Crea servicio solo para consola (desarrollo)
   */
  static createConsoleService(): AzureNotificationService {
    return new AzureNotificationService({
      channels: ['console'],
      includeArtifacts: false,
      includeScreenshots: false
    });
  }
}


# 🔄 Pipeline Multiplataforma - Azure DevOps

Este documento explica las diferentes estrategias para ejecutar el pipeline en agentes Windows y Linux.

## 📋 **Opciones Disponibles**

### ✅ **Opción 1: Tasks Multiplataforma (Recomendado)**

**Archivo:** `azure-pipelines.yml`

#### **Ventajas:**

- ✅ Un solo pipeline para ambos OS
- ✅ Usa tasks nativos de Azure DevOps
- ✅ Más confiable y mantenible
- ✅ Mejor logging y debugging
- ✅ Soporte oficial de Microsoft

#### **Características:**

- Usa `Docker@2` task para comandos Docker
- Usa `Bash@3` task para scripts (funciona en ambos OS)
- Gestión automática de rutas y variables

```yaml
# Ejemplo de comando Docker multiplataforma
- task: Docker@2
  displayName: "Execute E2E Tests"
  inputs:
    command: "run"
    arguments: '--rm --env-file .env -v "$(Build.SourcesDirectory)/results":/app/results $(dockerImageName) npm run tests:e2e'
```

---

### 🔀 **Opción 2: Pipeline Condicional**

**Archivo:** `azure-pipelines-conditional.yml`

#### **Ventajas:**

- ✅ Control granular por OS
- ✅ Optimización específica por plataforma
- ✅ Debugging más fácil para problemas específicos de OS

#### **Características:**

- Detección automática del OS
- Steps específicos para Windows y Linux
- Comandos optimizados por plataforma

```yaml
# Ejemplo de detección de OS
- task: PowerShell@2
  displayName: "Detect Operating System"
  inputs:
    script: |
      if ($IsWindows) {
        Write-Host "##vso[task.setvariable variable=isWindows]true"
      } else {
        Write-Host "##vso[task.setvariable variable=isWindows]false"
      }

# Steps condicionales
- task: PowerShell@2
  condition: eq(variables['isWindows'], 'true')
  # Comandos para Windows

- task: Bash@3
  condition: eq(variables['isWindows'], 'false')
  # Comandos para Linux
```

---

### 🔁 **Opción 3: Matrix Strategy**

**Archivo:** `azure-pipelines-matrix.yml`

#### **Ventajas:**

- ✅ Ejecución paralela en ambos OS
- ✅ Comparación de resultados entre plataformas
- ✅ Detección temprana de problemas específicos de OS

#### **Características:**

- Jobs paralelos para Windows y Linux
- Resultados separados por OS
- Ideal para testing exhaustivo

```yaml
strategy:
  matrix:
    linux:
      imageName: "ubuntu-latest"
      osType: "linux"
    windows:
      imageName: "windows-latest"
      osType: "windows"
```

---

## 🚀 **Recomendación de Uso**

### **Para Desarrollo:**

- **Opción 1 (Tasks Multiplataforma)** - Más simple y confiable

### **Para Testing Exhaustivo:**

- **Opción 3 (Matrix Strategy)** - Para validar en ambos OS

### **Para Debugging:**

- **Opción 2 (Condicional)** - Control granular por OS

---

## ⚙️ **Configuración de Variables**

Todas las opciones usan las mismas variables de pipeline:

```yaml
variables:
  # Variables del Pipeline
  - name: BASE_URL
    value: "https://automationexercise.com"
  - name: API_BASE_URL
    value: "https://automationexercise.com/api"
  - name: TEST_EMAIL
    value: "your-test@email.com"
  - name: TEST_PASSWORD
    value: "your-password"
  - name: EMAIL_USER
    value: "notifications@yourcompany.com"
  - name: EMAIL_PASS
    value: "your-email-password"
  - name: EMAIL_RECIPIENTS
    value: "team@yourcompany.com"
```

---

## 🐳 **Consideraciones Docker**

### **Volúmenes en Windows vs Linux:**

#### **Windows:**

```bash
-v "C:\agent\_work\1\s\results":/app/results
```

#### **Linux:**

```bash
-v "/home/vsts/work/1/s/results":/app/results
```

#### **Solución Multiplataforma:**

```yaml
# Azure DevOps maneja automáticamente las rutas
-v "$(Build.SourcesDirectory)/results":/app/results
```

---

## 📁 **Estructura de Archivos**

```
project/
├── azure-pipelines.yml              # Opción 1: Tasks Multiplataforma (Recomendado)
├── azure-pipelines-conditional.yml  # Opción 2: Pipeline Condicional
├── azure-pipelines-matrix.yml       # Opción 3: Matrix Strategy
├── Dockerfile                       # Imagen Docker para tests
├── docker-compose.yml               # Para desarrollo local
└── PIPELINE_MULTIPLATFORM.md        # Esta documentación
```

---

## 🛠️ **Solución de Problemas**

### **Error: Docker not found (Windows)**

```yaml
# Agregar antes de los comandos Docker
- task: DockerInstaller@0
  displayName: "Install Docker"
  inputs:
    dockerVersion: "20.10.7"
```

### **Error: Rutas con espacios**

```yaml
# Usar comillas dobles para rutas
-v "$(Build.SourcesDirectory)/results":/app/results
```

### **Error: Variables de entorno**

```yaml
# Linux
echo "VAR=value" >> .env

# Windows
"VAR=value" | Out-File -FilePath .env -Append -Encoding UTF8
```

---

## 🔧 **Migración entre Opciones**

### **De PowerShell a Tasks:**

```yaml
# Antes (PowerShell específico)
- powershell: |
    docker run --rm --env-file .env $(dockerImageName) npm test

# Después (Multiplataforma)
- task: Docker@2
  inputs:
    command: "run"
    arguments: "--rm --env-file .env $(dockerImageName) npm test"
```

### **De Script a Bash Task:**

```yaml
# Antes (Script genérico)
- script: echo "Hello World"

# Después (Bash multiplataforma)
- task: Bash@3
  inputs:
    targetType: "inline"
    script: echo "Hello World"
```

---

## 📊 **Comparación de Rendimiento**

| Característica                 | Opción 1 | Opción 2 | Opción 3        |
| ------------------------------ | -------- | -------- | --------------- |
| **Tiempo de ejecución**        | ⭐⭐⭐   | ⭐⭐⭐   | ⭐⭐ (paralelo) |
| **Facilidad de mantenimiento** | ⭐⭐⭐   | ⭐⭐     | ⭐⭐            |
| **Debugging**                  | ⭐⭐     | ⭐⭐⭐   | ⭐⭐⭐          |
| **Compatibilidad**             | ⭐⭐⭐   | ⭐⭐⭐   | ⭐⭐⭐          |
| **Complejidad**                | ⭐⭐⭐   | ⭐⭐     | ⭐              |

---

## 🎯 **Conclusión**

Para la mayoría de casos de uso, **recomendamos la Opción 1 (Tasks Multiplataforma)** por:

1. ✅ **Simplicidad:** Un solo pipeline para ambos OS
2. ✅ **Confiabilidad:** Tasks oficiales de Microsoft
3. ✅ **Mantenibilidad:** Menos código duplicado
4. ✅ **Soporte:** Mejor documentación y community support

**Usa las otras opciones solo si necesitas control específico por OS o testing paralelo.**

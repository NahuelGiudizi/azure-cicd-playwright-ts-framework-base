# Usar la imagen oficial de Playwright con todas las dependencias
FROM mcr.microsoft.com/playwright:v1.45.2-focal

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción y desarrollo
RUN npm ci --only=production && npm ci

# Copiar código fuente
COPY . .

# Instalar navegadores de Playwright
RUN npx playwright install --with-deps

# Crear directorio para resultados
RUN mkdir -p results test-results

# Exponer puerto (por si acaso)
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "flow-tests"]


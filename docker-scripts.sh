#!/bin/bash

# Script de utilidad para Docker con Playwright
# Uso: ./docker-scripts.sh [comando]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}🐳 Playwright Docker Scripts${NC}"
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  build     - Construir imagen Docker"
    echo "  e2e       - Ejecutar tests E2E"
    echo "  api       - Ejecutar tests API"
    echo "  flow      - Ejecutar suite completa"
    echo "  dev       - Entorno de desarrollo interactivo"
    echo "  clean     - Limpiar contenedores e imágenes"
    echo "  logs      - Ver logs de contenedores"
    echo "  help      - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 build"
    echo "  $0 e2e"
    echo "  $0 api"
}

# Función para construir imagen
build_image() {
    echo -e "${BLUE}🔨 Construyendo imagen Docker...${NC}"
    docker build -t playwright-tests .
    echo -e "${GREEN}✅ Imagen construida exitosamente${NC}"
}

# Función para ejecutar tests E2E
run_e2e() {
    echo -e "${BLUE}🧪 Ejecutando tests E2E...${NC}"
    docker-compose --profile e2e up --build
}

# Función para ejecutar tests API
run_api() {
    echo -e "${BLUE}🔌 Ejecutando tests API...${NC}"
    docker-compose --profile api up --build
}

# Función para ejecutar suite completa
run_flow() {
    echo -e "${BLUE}🚀 Ejecutando suite completa...${NC}"
    docker-compose --profile flow up --build
}

# Función para entorno de desarrollo
run_dev() {
    echo -e "${BLUE}💻 Iniciando entorno de desarrollo...${NC}"
    docker-compose --profile dev up --build
}

# Función para limpiar
cleanup() {
    echo -e "${YELLOW}🧹 Limpiando contenedores e imágenes...${NC}"
    docker-compose down --rmi all --volumes --remove-orphans
    docker system prune -f
    echo -e "${GREEN}✅ Limpieza completada${NC}"
}

# Función para ver logs
show_logs() {
    echo -e "${BLUE}📋 Mostrando logs...${NC}"
    docker-compose logs -f
}

# Función principal
main() {
    case "${1:-help}" in
        "build")
            build_image
            ;;
        "e2e")
            run_e2e
            ;;
        "api")
            run_api
            ;;
        "flow")
            run_flow
            ;;
        "dev")
            run_dev
            ;;
        "clean")
            cleanup
            ;;
        "logs")
            show_logs
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Ejecutar función principal
main "$@"


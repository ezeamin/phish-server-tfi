# Backend de ejemplo

Descripción corta del proyecto.

## Requisitos

Es necesario tener Node.js 20.6+ instalado en la PC.

- [Node.js](https://nodejs.org/en/) -> Importante: Debe ser 20.6+ para que funcione el archivo `.env`

## Instalación

1. Clonar este repositorio.
2. Ejecutar `pnpm install` para instalar las dependencias.

## Configuración

- Crear un archivo `.env` en la raíz del proyecto y configurar las variables de entorno necesarias, que están definidas en el archivo `.env_sample`.

## Uso

- Opcion 1: Hacer el build

  Para iniciar el servidor, ejecutar:

  ```bash
  pnpm run build
  ```

  y con la build ya realizada, ejecutar:

  ```bash
  pnpm start
  ```

- Opcion 2: Modo desarrollo

  Sino, puede correrse en modo desarrollo utilizando:

  ```bash
  pnpm run dev
  ```

## Mandando emails

```bash
pnpm send:email --email=***
```
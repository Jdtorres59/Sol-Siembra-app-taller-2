# Sol&Siembra Dashboard

Frontend en React + TypeScript + Vite para el panel "Sol&Siembra". Incluye Tailwind CSS, Recharts y ahora se conecta al backend (Express) para leer datos y enviar comandos.

## Requisitos

- Node.js 18+
- npm 9+ (o pnpm/yarn si lo prefieres)

## Instalación y uso

```bash
npm install      # instala dependencias
npm run dev      # levanta el servidor de desarrollo
npm run build    # compila la versión de producción
npm run preview  # sirve la compilación
```

### Variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```
VITE_API_URL=http://localhost:4000
```

Si el backend no está disponible, la app usa los datos mock de `src/mock/mockData.ts` como respaldo.

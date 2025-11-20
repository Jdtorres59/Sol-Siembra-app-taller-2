# Sol&Siembra Backend

Servidor Express que actúa como puente entre la ESP32 y el dashboard. Expone endpoints REST y un WebSocket básico para enviar actualizaciones en tiempo real.

## Scripts

```bash
npm install   # instala dependencias
npm run dev   # arranca el backend en http://localhost:4000 con recarga
npm start     # ejecuta en modo producción
```

## Endpoints principales

- `GET /api/resumen` – KPIs, alertas y widgets del dashboard.
- `GET /api/zonas` – listado completo de zonas + historiales.
- `POST /api/zonas/:id/acciones` – iniciar/detener riego desde la UI.
- `POST /api/esp32/lecturas` – ruta para que la ESP32 envíe lecturas.

Consulta `src/server.js` para ver todos los detalles y el esquema de datos.

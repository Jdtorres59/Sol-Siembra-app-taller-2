# Sol & Siembra Monorepo

Este repositorio agrupa tres piezas principales del proyecto:

- `frontend/`: aplicación web React (Vite + Tailwind) para el dashboard.
- `backend/`: servidor Express que expone APIs/WS y actúa como puente con la ESP32.
- `firmware/`: código y documentación del microcontrolador ESP32.

## Cómo trabajar

1. **Frontend**
   - Ve a `frontend/` y sigue las instrucciones del `README.md` para instalar dependencias y correr el dashboard.
2. **Backend**
   - En `backend/` tienes la API local (Express). Instala dependencias y corre `npm run dev` para exponer los endpoints en `http://localhost:4000`.
3. **Firmware**
   - Ve a `firmware/` para trabajar el código de la ESP32, diagramas y scripts de carga.

Este layout facilita mantener sincronizados el UI y el firmware dentro del mismo repositorio.

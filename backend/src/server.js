import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { createInitialState } from './data.js';

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

const db = createInitialState();

const broadcast = (event, payload) => {
  const message = JSON.stringify({ event, payload });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
};

const findZone = (zoneId) => db.irrigationZones.find((zone) => zone.id === zoneId);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Calibración básica: valores crudos típicos para seco y mojado.
const DRY_POINT = 3800; // tierra muy seca (puedes ajustarlo)
const WET_POINT = 1200; // sensor sumergido/tierras muy húmedas (ajustable)

// Convierte la lectura cruda a porcentaje 0-100% (0% = muy seco, 100% = muy húmedo) usando la ventana calibrada.
const normalizeHumidity = (raw) => {
  const clamped = clamp(raw, 0, 4095);
  const span = Math.max(100, DRY_POINT - WET_POINT); // evita división por cero
  const pct = ((DRY_POINT - clamped) / span) * 100;
  return clamp(Number(pct.toFixed(1)), 0, 100);
};

const recalcAverageHumidity = () => {
  const avg =
    db.irrigationZones.reduce((sum, zone) => sum + zone.humidity, 0) / db.irrigationZones.length;
  const moistureCard = db.dashboardKpis.find((kpi) => kpi.id === 'soil-moisture');
  if (moistureCard) {
    moistureCard.value = `${avg.toFixed(1)}%`;
  }
};

const registerEvent = ({ type, zone, comment }) => {
  const entry = {
    id: `event-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type,
    zone,
    comment,
  };
  db.eventLogs.unshift(entry);
  broadcast('event-log', entry);
};

app.get('/api/resumen', (_req, res) => {
  res.json({
    systemOverview: db.systemOverview,
    kpis: db.dashboardKpis,
    humidityTrend: db.humidityTrend,
    alerts: db.alerts,
    weather: db.weatherWidget,
    maintenance: db.maintenanceChecklist,
    zones: db.irrigationZones,
  });
});

app.get('/api/zonas', (_req, res) => {
  res.json({
    zones: db.irrigationZones,
    history: db.zoneHistory,
    configs: db.irrigationConfigByZone,
  });
});

app.post('/api/zonas/:id/acciones', (req, res) => {
  const { id } = req.params;
  const { accion } = req.body;
  const zone = findZone(id);
  if (!zone) {
    return res.status(404).json({ message: 'Zona no encontrada' });
  }
  const isStart = accion === 'iniciar';
  zone.actuatorStatus = isStart ? 'Válvula abierta' : 'Válvula cerrada';
  zone.status = isStart ? 'OK' : zone.status;
  registerEvent({
    type: isStart ? 'Riego iniciado' : 'Riego detenido',
    zone: zone.name,
    comment: `Comando remoto ejecutado (${accion})`,
  });
  broadcast('zone-action', { zoneId: id, accion });
  res.json({ success: true, zone });
});

app.get('/api/energia', (_req, res) => {
  res.json({
    energyStatus: db.energyStatus,
    roofStatus: db.roofStatus,
  });
});

app.post('/api/energia/techo', (req, res) => {
  const { state } = req.body;
  db.roofStatus.state = state;
  db.roofStatus.reason = state === 'Modo seguro' ? 'Protección automática' : 'Acción remota';
  db.roofStatus.lastChange = new Date().toISOString();
  registerEvent({ type: 'Cambio techo', zone: 'General', comment: `Estado: ${state}` });
  broadcast('roof-state', db.roofStatus);
  res.json({ success: true, roofStatus: db.roofStatus });
});

app.get('/api/historial', (_req, res) => {
  res.json({
    historyKpis: db.historyKpis,
    historySeries: db.historySeries,
    eventLogs: db.eventLogs,
  });
});

app.get('/api/configuracion', (_req, res) => {
  res.json({
    farmInfo: db.farmInfo,
    displayPreferences: db.displayPreferences,
    alertPreferences: db.alertPreferences,
    users: db.users,
  });
});

app.post('/api/esp32/lecturas', (req, res) => {
  const { zoneId, humedad } = req.body;
  const zone = findZone(zoneId);
  if (!zone) {
    return res.status(404).json({ message: 'Zona no encontrada' });
  }
  const humidityPct = normalizeHumidity(Number(humedad));
  zone.humidity = humidityPct;
  zone.lastIrrigation = new Date().toISOString();
  zone.status =
    humidityPct < zone.targetRange[0]
      ? 'Riesgo de estrés hídrico'
      : humidityPct > zone.targetRange[1]
        ? 'Encharcado'
        : 'OK';
  recalcAverageHumidity();
  const history = db.zoneHistory.find((entry) => entry.zoneId === zoneId);
  if (history) {
    history.readings.push({
      date: new Date().toISOString().slice(0, 10),
      humidity: humidityPct,
      waterUsed: Math.round(Math.random() * 10 + 20),
    });
    history.readings = history.readings.slice(-7);
  }
  registerEvent({ type: 'Lectura humedad', zone: zone.name, comment: `Lectura ${humedad}%` });
  broadcast('sensor-reading', { zoneId, humedad });
  res.json({ success: true });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

httpServer.listen(PORT, () => {
  console.log(`API lista en http://localhost:${PORT}`);
});

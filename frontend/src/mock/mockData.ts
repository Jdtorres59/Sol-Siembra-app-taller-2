// Fuente única de datos mock para sensores, zonas, energía y usuarios.
import {
  Alert,
  AlertPreferences,
  DashboardKpi,
  DisplayPreferences,
  EnergyStatus,
  EventLog,
  FarmInfo,
  HistoryKpis,
  HistorySeriesPoint,
  HumidityTrendPoint,
  IrrigationConfig,
  IrrigationZone,
  MaintenanceTask,
  RoofStatus,
  SystemOverview,
  UserProfile,
  WeatherWidgetData,
  ZoneHistory,
} from '../types';

export const systemOverview: SystemOverview = {
  farmName: 'Finca Uniandes',
  overallStatus: 'Operando',
  connectionLabel: 'Conectado a red privada',
};

export const dashboardKpis: DashboardKpi[] = [
  {
    id: 'soil-moisture',
    label: 'Humedad promedio del suelo',
    value: '32%',
    helper: 'Dentro del rango ideal',
    trendLabel: '+2% vs ayer',
    variation: 2,
  },
  {
    id: 'water-consumption',
    label: 'Consumo de agua hoy',
    value: '38 m³',
    helper: 'Meta: 42 m³',
    trendLabel: '-8% frente a meta',
    variation: -8,
  },
  {
    id: 'solar-energy',
    label: 'Energía solar generada hoy',
    value: '112 kWh',
    helper: 'Autonomía cubierta',
    trendLabel: '+5% vs ayer',
    variation: 5,
  },
  {
    id: 'roof-status',
    label: 'Estado del techo retráctil',
    value: 'Modo seguro',
    helper: 'Por nubosidad alta',
  },
  {
    id: 'alerts',
    label: 'Alertas activas',
    value: '3',
    helper: '1 crítica, 2 advertencias',
  },
];

export const humidityTrend: HumidityTrendPoint[] = Array.from({ length: 12 }).map((_, idx) => ({
  hour: `${idx * 2}:00`,
  value: 26 + Math.round(Math.sin(idx / 2) * 5 + idx),
}));

export const irrigationZones: IrrigationZone[] = [
  {
    id: 'zona-a',
    name: 'Zona Arroz Lote A',
    crop: 'Arroz',
    areaHa: 4.2,
    humidity: 34,
    targetRange: [28, 36],
    lastIrrigation: '2024-05-12T05:30:00Z',
    lastIrrigationDuration: 35,
    nextIrrigation: '2024-05-12T19:00:00Z',
    actuatorStatus: 'Válvula cerrada',
    status: 'OK',
  },
  {
    id: 'zona-b',
    name: 'Zona Arroz Lote B',
    crop: 'Arroz',
    areaHa: 3.1,
    humidity: 24,
    targetRange: [25, 35],
    lastIrrigation: '2024-05-12T04:15:00Z',
    lastIrrigationDuration: 28,
    nextIrrigation: '2024-05-12T17:30:00Z',
    actuatorStatus: 'Válvula cerrada',
    status: 'Riesgo de estrés hídrico',
  },
  {
    id: 'zona-c',
    name: 'Zona Ensayo Cubierta',
    crop: 'Hortalizas',
    areaHa: 1.5,
    humidity: 41,
    targetRange: [22, 32],
    lastIrrigation: '2024-05-11T22:40:00Z',
    lastIrrigationDuration: 18,
    nextIrrigation: '2024-05-12T21:00:00Z',
    actuatorStatus: 'Válvula abierta',
    status: 'Encharcado',
  },
  {
    id: 'zona-d',
    name: 'Zona Semillero',
    crop: 'Plántulas',
    areaHa: 0.8,
    humidity: 29,
    targetRange: [30, 40],
    lastIrrigation: '2024-05-12T06:00:00Z',
    lastIrrigationDuration: 12,
    nextIrrigation: '2024-05-12T16:30:00Z',
    actuatorStatus: 'Válvula cerrada',
    status: 'OK',
  },
];

export const zoneHistory: ZoneHistory[] = irrigationZones.map((zone, idx) => ({
  zoneId: zone.id,
  readings: Array.from({ length: 7 }).map((__, dayIdx) => ({
    date: `2024-05-0${dayIdx + 6}`,
    humidity: Math.max(
      18,
      Math.min(42, zone.humidity + Math.sin(dayIdx + idx) * 4 - dayIdx),
    ),
    waterUsed: Math.round(18 - dayIdx + idx * 2 + Math.random() * 4),
  })),
}));

export const alerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'Nivel bajo en tanque norte',
    message: 'El nivel de agua está en 28%, considere recargar.',
    level: 'critico',
    timestamp: '2024-05-12T09:35:00Z',
    state: 'Pendiente',
  },
  {
    id: 'alert-2',
    title: 'Sensor humedad zona B',
    message: 'Lecturas intermitentes detectadas, revisar cableado.',
    level: 'advertencia',
    timestamp: '2024-05-12T08:20:00Z',
    state: 'Pendiente',
  },
  {
    id: 'alert-3',
    title: 'Pronóstico de lluvia intensa',
    message: 'Probable precipitación en las próximas 3 horas.',
    level: 'advertencia',
    timestamp: '2024-05-12T07:50:00Z',
    state: 'Revisado',
  },
  {
    id: 'alert-4',
    title: 'Mantenimiento programado',
    message: 'Revisión de válvulas menores mañana 6:00 am.',
    level: 'info',
    timestamp: '2024-05-11T20:15:00Z',
    state: 'Revisado',
  },
];

export const weatherWidget: WeatherWidgetData = {
  temperatureC: 30,
  rainProbability: 55,
  message: 'Posible lluvia ligera, ajustar riego nocturno.',
};

export const maintenanceChecklist: MaintenanceTask[] = [
  { id: 'task-1', label: 'Revisar filtros de agua', completed: false },
  { id: 'task-2', label: 'Verificar sensores de humedad', completed: true },
  { id: 'task-3', label: 'Limpiar paneles solares', completed: false },
];

export const energyStatus: EnergyStatus = {
  currentGenerationKw: 14.2,
  generatedTodayKwh: 112,
  batteriesPercent: 86,
  autonomyHours: 11,
  solarCurve: [
    { hour: '06:00', power: 2 },
    { hour: '08:00', power: 5 },
    { hour: '10:00', power: 11 },
    { hour: '12:00', power: 16 },
    { hour: '14:00', power: 14 },
    { hour: '16:00', power: 9 },
    { hour: '18:00', power: 4 },
  ],
  consumptionTable: [
    { day: 'Lun', consumption: 84, generation: 102 },
    { day: 'Mar', consumption: 88, generation: 111 },
    { day: 'Mié', consumption: 86, generation: 117 },
    { day: 'Jue', consumption: 83, generation: 109 },
    { day: 'Vie', consumption: 90, generation: 112 },
  ],
};

export const roofStatus: RoofStatus = {
  state: 'Modo seguro',
  reason: 'Radiación alta a mediodía',
  lastChange: '2024-05-12T12:10:00Z',
};

export const eventLogs: EventLog[] = [
  {
    id: 'event-1',
    timestamp: '2024-05-12T05:30:00Z',
    type: 'Riego iniciado',
    zone: 'Zona Arroz Lote A',
    comment: 'Programa automático',
  },
  {
    id: 'event-2',
    timestamp: '2024-05-12T06:05:00Z',
    type: 'Riego finalizado',
    zone: 'Zona Arroz Lote A',
    comment: 'Humedad alcanzó 34%',
  },
  {
    id: 'event-3',
    timestamp: '2024-05-12T08:20:00Z',
    type: 'Alerta sensor',
    zone: 'Zona Arroz Lote B',
    comment: 'Lecturas irregulares',
  },
  {
    id: 'event-4',
    timestamp: '2024-05-12T09:50:00Z',
    type: 'Cambio techo',
    zone: 'General',
    comment: 'Modo seguro por nubosidad',
  },
  {
    id: 'event-5',
    timestamp: '2024-05-11T22:40:00Z',
    type: 'Riego manual',
    zone: 'Zona Ensayo Cubierta',
    comment: 'Operador ajustó duración',
  },
];

export const historyKpis: HistoryKpis = {
  waterSaving: 28,
  lossReduction: 18,
  uptime: 97,
};

export const historySeries: HistorySeriesPoint[] = [
  { day: 'Lun', waterUsed: 44, efficiency: 1.8 },
  { day: 'Mar', waterUsed: 41, efficiency: 1.9 },
  { day: 'Mié', waterUsed: 39, efficiency: 2.0 },
  { day: 'Jue', waterUsed: 42, efficiency: 1.7 },
  { day: 'Vie', waterUsed: 38, efficiency: 2.1 },
  { day: 'Sáb', waterUsed: 37, efficiency: 2.0 },
  { day: 'Dom', waterUsed: 40, efficiency: 1.85 },
];

export const farmInfo: FarmInfo = {
  name: 'Finca Uniandes',
  location: 'Meta, Colombia',
  crop: 'Arroz tecnificado',
  areaHa: 9.6,
};

export const displayPreferences: DisplayPreferences = {
  units: 'metric',
  theme: 'claro',
};

export const alertPreferences: AlertPreferences = {
  lowWater: true,
  lowHumidity: true,
  sensorFailure: true,
  humidityThreshold: 24,
};

export const users: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Juan David Torres',
    role: 'Ingeniero electrónico',
    permissions: 'Monitoreo integral y soporte de automatización',
  },
  {
    id: 'user-2',
    name: 'Sebastian Cuartas',
    role: 'Ingeniero eléctrico',
    permissions: 'Supervisión energética y coordinación de mantenimiento',
  },
  {
    id: 'user-3',
    name: 'Diego Florez',
    role: 'Ingeniero eléctrico',
    permissions: 'Gestión de válvulas, bombas y reportes técnicos',
  },
];

export const irrigationConfigByZone: Record<string, IrrigationConfig> = {
  'zona-a': {
    minMoisture: 28,
    windows: ['04:00 - 06:00', '18:30 - 20:30'],
    mode: 'Automático',
  },
  'zona-b': {
    minMoisture: 26,
    windows: ['05:00 - 06:30', '17:00 - 19:00'],
    mode: 'Automático',
  },
  'zona-c': {
    minMoisture: 24,
    windows: ['21:00 - 23:00'],
    mode: 'Manual',
  },
  'zona-d': {
    minMoisture: 30,
    windows: ['06:00 - 08:00', '16:00 - 18:00'],
    mode: 'Automático',
  },
};

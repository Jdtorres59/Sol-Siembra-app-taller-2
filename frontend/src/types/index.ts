// Tipos compartidos que describen sensores, zonas, alertas y configuraciones.
export type OverallStatus = 'Operando' | 'Advertencias' | 'Crítico';

export interface SystemOverview {
  farmName: string;
  overallStatus: OverallStatus;
  connectionLabel: string;
}

export interface DashboardKpi {
  id: string;
  label: string;
  value: string;
  helper?: string;
  trendLabel?: string;
  variation?: number;
}

export interface HumidityTrendPoint {
  hour: string;
  value: number;
}

export type ZoneState = 'OK' | 'Riesgo de estrés hídrico' | 'Encharcado';
export type ActuatorStatus = 'Válvula abierta' | 'Válvula cerrada';

export interface IrrigationZone {
  id: string;
  name: string;
  crop: string;
  areaHa: number;
  humidity: number;
  targetRange: [number, number];
  lastIrrigation: string;
  lastIrrigationDuration: number;
  nextIrrigation: string;
  actuatorStatus: ActuatorStatus;
  status: ZoneState;
}

export interface ZoneHistoryPoint {
  date: string;
  humidity: number;
  waterUsed: number;
}

export interface ZoneHistory {
  zoneId: string;
  readings: ZoneHistoryPoint[];
}

export type AlertLevel = 'info' | 'advertencia' | 'critico';
export type AlertState = 'Pendiente' | 'Revisado';

export interface Alert {
  id: string;
  title: string;
  message: string;
  level: AlertLevel;
  timestamp: string;
  state: AlertState;
}

export interface WeatherWidgetData {
  temperatureC: number;
  rainProbability: number;
  message: string;
}

export interface MaintenanceTask {
  id: string;
  label: string;
  completed: boolean;
}

export interface EnergyStatus {
  currentGenerationKw: number;
  generatedTodayKwh: number;
  batteriesPercent: number;
  autonomyHours: number;
  solarCurve: { hour: string; power: number }[];
  consumptionTable: { day: string; consumption: number; generation: number }[];
}

export interface RoofStatus {
  state: 'Abierto' | 'Cerrado' | 'Modo seguro';
  reason: string;
  lastChange: string;
}

export interface EventLog {
  id: string;
  timestamp: string;
  type: string;
  zone: string;
  comment: string;
}

export interface HistoryKpis {
  waterSaving: number;
  lossReduction: number;
  uptime: number;
}

export interface HistorySeriesPoint {
  day: string;
  waterUsed: number;
  efficiency: number;
}

export interface FarmInfo {
  name: string;
  location: string;
  crop: string;
  areaHa: number;
}

export interface DisplayPreferences {
  units: 'metric';
  theme: 'claro' | 'oscuro';
}

export interface AlertPreferences {
  lowWater: boolean;
  lowHumidity: boolean;
  sensorFailure: boolean;
  humidityThreshold: number;
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  permissions: string;
}

export interface IrrigationConfig {
  minMoisture: number;
  windows: string[];
  mode: 'Automático' | 'Manual';
}

export interface DashboardOverviewPayload {
  systemOverview: SystemOverview;
  kpis: DashboardKpi[];
  humidityTrend: HumidityTrendPoint[];
  alerts: Alert[];
  weather: WeatherWidgetData;
  maintenance: MaintenanceTask[];
  zones: IrrigationZone[];
}

export interface IrrigationDataPayload {
  zones: IrrigationZone[];
  history: ZoneHistory[];
  configs: Record<string, IrrigationConfig>;
}

export interface EnergyPayload {
  energyStatus: EnergyStatus;
  roofStatus: RoofStatus;
}

export interface HistoryPayload {
  historyKpis: HistoryKpis;
  historySeries: HistorySeriesPoint[];
  eventLogs: EventLog[];
}

export interface SettingsPayload {
  farmInfo: FarmInfo;
  displayPreferences: DisplayPreferences;
  alertPreferences: AlertPreferences;
  users: UserProfile[];
}

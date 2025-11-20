import { DashboardOverviewPayload, EnergyPayload, HistoryPayload, IrrigationDataPayload, RoofStatus, SettingsPayload } from '../types';
import {
  alertPreferences,
  alerts,
  dashboardKpis,
  displayPreferences,
  energyStatus,
  eventLogs,
  farmInfo,
  historyKpis,
  historySeries,
  humidityTrend,
  irrigationConfigByZone,
  irrigationZones,
  maintenanceChecklist,
  roofStatus,
  systemOverview,
  users,
  weatherWidget,
  zoneHistory,
} from '../mock/mockData';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

const fetchJSON = async <T>(path: string, fallback: T): Promise<T> => {
  try {
    const response = await fetch(`${API_URL}${path}`);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return (await response.json()) as T;
  } catch (error) {
    console.warn(`Fallo al consultar ${path}:`, error);
    return fallback;
  }
};

export const getDashboardOverview = async (): Promise<DashboardOverviewPayload> =>
  fetchJSON<DashboardOverviewPayload>('/api/resumen', {
    systemOverview,
    kpis: dashboardKpis,
    humidityTrend,
    alerts,
    weather: weatherWidget,
    maintenance: maintenanceChecklist,
    zones: irrigationZones,
  });

export const getIrrigationData = async (): Promise<IrrigationDataPayload> =>
  fetchJSON<IrrigationDataPayload>('/api/zonas', {
    zones: irrigationZones,
    history: zoneHistory,
    configs: irrigationConfigByZone,
  });

export const triggerZoneAction = async (zoneId: string, accion: 'iniciar' | 'detener') => {
  try {
    await fetch(`${API_URL}/api/zonas/${zoneId}/acciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion }),
    });
  } catch (error) {
    console.error('No se pudo enviar la acción de riego', error);
  }
};

export const getEnergyData = async (): Promise<EnergyPayload> =>
  fetchJSON<EnergyPayload>('/api/energia', {
    energyStatus,
    roofStatus,
  });

export const sendRoofCommand = async (state: RoofStatus['state']) => {
  try {
    await fetch(`${API_URL}/api/energia/techo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state }),
    });
  } catch (error) {
    console.error('No se pudo actualizar el techo', error);
  }
};

export const getHistoryData = async (): Promise<HistoryPayload> =>
  fetchJSON<HistoryPayload>('/api/historial', {
    historyKpis,
    historySeries,
    eventLogs,
  });

export const getSettingsData = async (): Promise<SettingsPayload> =>
  fetchJSON<SettingsPayload>('/api/configuracion', {
    farmInfo,
    displayPreferences,
    alertPreferences,
    users,
  });

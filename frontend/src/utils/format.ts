// Utilidades para formato de fechas, números y colores según estado.
import { AlertLevel, OverallStatus, ZoneState } from '../types';

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
  });

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat('es-CO', options).format(value);

export const getZoneStateColor = (state: ZoneState) => {
  switch (state) {
    case 'OK':
      return 'bg-green-100 text-green-800';
    case 'Riesgo de estrés hídrico':
      return 'bg-amber-100 text-amber-800';
    case 'Encharcado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const getAlertLevelColor = (level: AlertLevel) => {
  switch (level) {
    case 'critico':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'advertencia':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    default:
      return 'bg-sky-100 text-sky-700 border-sky-200';
  }
};

export const getOverallStatusColor = (status: OverallStatus) => {
  switch (status) {
    case 'Operando':
      return 'bg-green-100 text-green-800';
    case 'Advertencias':
      return 'bg-amber-100 text-amber-800';
    case 'Crítico':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

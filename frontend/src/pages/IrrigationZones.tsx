// Pantalla para supervisar y controlar cada zona de riego en detalle.
import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import {
  irrigationConfigByZone,
  irrigationZones,
  zoneHistory,
} from '../mock/mockData';
import { formatDateTime, getZoneStateColor } from '../utils/format';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getIrrigationData, triggerZoneAction } from '../services/api';

const IrrigationZones = () => {
  const [data, setData] = useState({
    zones: irrigationZones,
    history: zoneHistory,
    configs: irrigationConfigByZone,
  });
  const [selectedZoneId, setSelectedZoneId] = useState(irrigationZones[0]?.id);
  const [irrigationActivity, setIrrigationActivity] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getIrrigationData().then(setData);
  }, []);

  const selectedZone = useMemo(
    () => data.zones.find((zone) => zone.id === selectedZoneId) ?? data.zones[0],
    [selectedZoneId, data.zones],
  );

  const selectedHistory = useMemo(
    () => data.history.find((zone) => zone.zoneId === selectedZone?.id)?.readings ?? [],
    [selectedZone?.id, data.history],
  );

  const zoneConfig = data.configs[selectedZone?.id ?? ''] ?? {
    minMoisture: 0,
    windows: [],
    mode: 'Automático' as const,
  };

  const toggleIrrigation = (state: boolean) => {
    if (!selectedZone) return;
    setIrrigationActivity((prev) => ({ ...prev, [selectedZone.id]: state }));
    triggerZoneAction(selectedZone.id, state ? 'iniciar' : 'detener');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Zonas de riego</h2>
        <p className="text-sm text-gray-500">Detalle de sensores y configuraciones</p>
      </div>

      <Card title="Listado de zonas" subtitle="Seleccione una zona para ver el detalle">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-3 py-2">Zona</th>
                <th className="px-3 py-2">Humedad</th>
                <th className="px-3 py-2">Rango objetivo</th>
                <th className="px-3 py-2">Último riego</th>
                <th className="px-3 py-2">Duración</th>
                <th className="px-3 py-2">Actuador</th>
                <th className="px-3 py-2">Estado</th>
                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 font-medium text-gray-900">{zone.name}</td>
                  <td className="px-3 py-3">{zone.humidity}%</td>
                  <td className="px-3 py-3">
                    {zone.targetRange[0]}% - {zone.targetRange[1]}%
                  </td>
                  <td className="px-3 py-3">{formatDateTime(zone.lastIrrigation)}</td>
                  <td className="px-3 py-3">{zone.lastIrrigationDuration} min</td>
                  <td className="px-3 py-3">{zone.actuatorStatus}</td>
                  <td className="px-3 py-3">
                    <StatusBadge label={zone.status} colorClass={getZoneStateColor(zone.status)} />
                  </td>
                  <td className="px-3 py-3">
                    <button
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        selectedZoneId === zone.id
                          ? 'bg-brand-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setSelectedZoneId(zone.id)}
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedZone && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <Card title={selectedZone.name} subtitle={`Cultivo: ${selectedZone.crop}`}>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Superficie</dt>
                  <dd className="font-semibold text-gray-900">{selectedZone.areaHa} ha</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Humedad actual</dt>
                  <dd className="font-semibold text-gray-900">{selectedZone.humidity}%</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Próximo riego</dt>
                  <dd className="font-semibold text-gray-900">{formatDateTime(selectedZone.nextIrrigation)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Modo de operación</dt>
                  <dd className="font-semibold text-gray-900">{zoneConfig.mode}</dd>
                </div>
              </dl>
              <div className="mt-4 flex gap-3">
                <button
                  className="flex-1 rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm"
                  onClick={() => toggleIrrigation(true)}
                >
                  Iniciar riego
                </button>
                <button
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700"
                  onClick={() => toggleIrrigation(false)}
                >
                  Detener riego
                </button>
              </div>
              {selectedZone && (
                <p className="mt-3 text-sm text-gray-500">
                  Estado actual: {irrigationActivity[selectedZone.id] ? 'Riego en ejecución' : 'Riego detenido'}
                </p>
              )}
            </Card>

            <Card title="Configuración de riego" subtitle="Parámetros de riego">
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Umbral mínimo</dt>
                  <dd className="font-semibold text-gray-900">{zoneConfig.minMoisture}%</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Ventanas horarias</dt>
                  <dd className="mt-1 space-y-1">
                    {zoneConfig.windows.map((window) => (
                      <span
                        key={window}
                        className="mr-2 inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                      >
                        {window}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <Card title="Humedad del suelo (7 días)" subtitle="Lecturas promedio por día">
              <div className="h-64">
                <ResponsiveContainer>
                  <LineChart data={selectedHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis unit="%" stroke="#9CA3AF" />
                    <Tooltip />
                    <Line type="monotone" dataKey="humidity" stroke="#22C55E" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card title="Consumo de agua" subtitle="m³ aplicados por día">
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={selectedHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis unit="m³" stroke="#9CA3AF" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="waterUsed" fill="#8B5E34" radius={[8, 8, 0, 0]} name="Agua usada" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default IrrigationZones;

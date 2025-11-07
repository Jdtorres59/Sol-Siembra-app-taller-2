// Reportes históricos con filtros, gráficos y bitácora de eventos.
import { useMemo, useState } from 'react';
import Card from '../components/Card';
import {
  eventLogs,
  historyKpis,
  historySeries,
  irrigationZones,
} from '../mock/mockData';
import { formatDateTime } from '../utils/format';
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

const HistoryAndReports = () => {
  const [filters, setFilters] = useState({
    startDate: '2024-05-06',
    endDate: '2024-05-12',
    zoneId: 'all',
  });

  const filteredEvents = useMemo(() => {
    if (filters.zoneId === 'all') return eventLogs;
    const zone = irrigationZones.find((z) => z.id === filters.zoneId);
    if (!zone) return eventLogs;
    return eventLogs.filter((event) => event.zone === zone.name);
  }, [filters.zoneId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Historial y reportes</h2>
        <p className="text-sm text-gray-500">Revisa tendencias y eventos registrados</p>
      </div>

      <Card title="Filtros" subtitle="Ajusta el rango a analizar">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Fecha inicio</label>
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              value={filters.startDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, startDate: event.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Fecha fin</label>
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              value={filters.endDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, endDate: event.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Zona</label>
            <select
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              value={filters.zoneId}
              onChange={(event) => setFilters((prev) => ({ ...prev, zoneId: event.target.value }))}
            >
              <option value="all">Todas</option>
              {irrigationZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <div className="w-full rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Vista consolidada en tiempo real.
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Consumo de agua" subtitle="m³ aplicados por día">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={historySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis unit="m³" stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Bar dataKey="waterUsed" fill="#0D9488" name="Agua usada" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Rendimiento hídrico" subtitle="kg de arroz por m³ de agua">
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={historySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis unit="kg/m³" stroke="#9CA3AF" domain={[1.5, 2.2]} />
                <Tooltip />
                <Line type="monotone" dataKey="efficiency" stroke="#F97316" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Ahorro de agua" subtitle="vs riego tradicional">
          <p className="text-4xl font-semibold text-brand-primary">{historyKpis.waterSaving}%</p>
          <p className="text-sm text-gray-500">Basado en últimas 4 semanas</p>
        </Card>
        <Card title="Reducción de pérdidas" subtitle="Eventos climáticos evitados">
          <p className="text-4xl font-semibold text-brand-primary">{historyKpis.lossReduction}%</p>
          <p className="text-sm text-gray-500">Estimación por sensores</p>
        </Card>
        <Card title="Operatividad del sistema" subtitle="Disponibilidad">
          <p className="text-4xl font-semibold text-brand-primary">{historyKpis.uptime}%</p>
          <p className="text-sm text-gray-500">Bombas, válvulas y energía</p>
        </Card>
      </div>

      <Card title="Eventos registrados" subtitle="Últimas actividades">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-3 py-2">Fecha</th>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Zona</th>
                <th className="px-3 py-2">Comentario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td className="px-3 py-3">{formatDateTime(event.timestamp)}</td>
                  <td className="px-3 py-3 font-medium text-gray-900">{event.type}</td>
                  <td className="px-3 py-3">{event.zone}</td>
                  <td className="px-3 py-3 text-gray-600">{event.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default HistoryAndReports;

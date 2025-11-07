// Panel que muestra métricas de energía solar y control del techo retráctil.
import { useState } from 'react';
import Card from '../components/Card';
import { energyStatus, roofStatus } from '../mock/mockData';
import { formatDateTime } from '../utils/format';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const EnergyAndRoof = () => {
  const [roofData, setRoofData] = useState(roofStatus);

  const handleRoofAction = (state: typeof roofStatus.state) => {
    setRoofData({
      state,
      reason: state === 'Modo seguro' ? 'Protección automática' : 'Acción manual registrada',
      lastChange: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Energía y techo</h2>
        <p className="text-sm text-gray-500">Monitoreo agrovoltaico y controles principales</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Generación solar actual" subtitle="kW disponibles">
          <p className="text-3xl font-semibold text-gray-900">{energyStatus.currentGenerationKw} kW</p>
          <p className="text-sm text-gray-500">Promedio de la última hora</p>
        </Card>
        <Card title="Energía generada hoy" subtitle="kWh acumulados">
          <p className="text-3xl font-semibold text-gray-900">{energyStatus.generatedTodayKwh} kWh</p>
          <p className="text-sm text-gray-500">Cubre la demanda proyectada</p>
        </Card>
        <Card title="Estado de baterías" subtitle="Autonomía estimada">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-semibold text-gray-900">{energyStatus.batteriesPercent}%</p>
              <p className="text-sm text-gray-500">{energyStatus.autonomyHours} h de respaldo</p>
            </div>
            <div className="h-16 w-3 rounded-full bg-gray-100">
              <div
                className="h-full w-full rounded-full bg-brand-primary"
                style={{ height: `${energyStatus.batteriesPercent}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      <Card title="Curva solar del día" subtitle="Potencia generada por hora">
        <div className="h-72">
          <ResponsiveContainer>
            <AreaChart data={energyStatus.solarCurve}>
              <defs>
                <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="hour" stroke="#9CA3AF" />
              <YAxis unit="kW" stroke="#9CA3AF" />
              <Tooltip />
              <Area type="monotone" dataKey="power" stroke="#16A34A" fill="url(#solarGradient)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Consumo energético del sistema" subtitle="Comparativo diario">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-3 py-2">Día</th>
                  <th className="px-3 py-2">kWh consumidos</th>
                  <th className="px-3 py-2">kWh solares</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {energyStatus.consumptionTable.map((row) => (
                  <tr key={row.day}>
                    <td className="px-3 py-3 font-medium text-gray-900">{row.day}</td>
                    <td className="px-3 py-3">{row.consumption}</td>
                    <td className="px-3 py-3 text-green-600">{row.generation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Techo retráctil" subtitle="Control del techo">
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Estado</dt>
              <dd className="font-semibold text-gray-900">{roofData.state}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Motivo</dt>
              <dd className="font-semibold text-gray-900">{roofData.reason}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Último cambio</dt>
              <dd className="font-semibold text-gray-900">{formatDateTime(roofData.lastChange)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="flex-1 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700"
              onClick={() => handleRoofAction('Abierto')}
            >
              Abrir
            </button>
            <button
              className="flex-1 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700"
              onClick={() => handleRoofAction('Cerrado')}
            >
              Cerrar
            </button>
            <button
              className="flex-1 rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
              onClick={() => handleRoofAction('Modo seguro')}
            >
              Modo automático
            </button>
          </div>
          <p className="mt-3 text-xs text-amber-700">Registro de acciones aplicado al sistema.</p>
        </Card>
      </div>
    </div>
  );
};

export default EnergyAndRoof;

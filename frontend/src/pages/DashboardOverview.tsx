// Vista general con KPIs, alertas y widgets clave del sistema.
import { useEffect, useState } from 'react';
import {
  alerts as mockAlerts,
  dashboardKpis,
  humidityTrend as mockHumidityTrend,
  irrigationZones as mockZones,
  maintenanceChecklist as initialChecklist,
  weatherWidget,
} from '../mock/mockData';
import KpiCard from '../components/KpiCard';
import ChartContainer from '../components/ChartContainer';
import ZoneStatusGrid from '../components/ZoneStatusGrid';
import AlertsPanel from '../components/AlertsPanel';
import WeatherWidget from '../components/WeatherWidget';
import MaintenanceChecklist from '../components/MaintenanceChecklist';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getDashboardOverview } from '../services/api';
import { DashboardKpi, HumidityTrendPoint, IrrigationZone } from '../types';

const DashboardOverview = () => {
  const [tasks, setTasks] = useState(initialChecklist);
  const [kpis, setKpis] = useState<DashboardKpi[]>(dashboardKpis);
  const [trend, setTrend] = useState<HumidityTrendPoint[]>(mockHumidityTrend);
  const [liveTrend, setLiveTrend] = useState<HumidityTrendPoint[]>([]);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [zones, setZones] = useState<IrrigationZone[]>(mockZones);
  const [weather, setWeather] = useState(weatherWidget);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      const data = await getDashboardOverview();
      if (!active) return;
      setKpis(data.kpis);
      setTrend(data.humidityTrend);
      setAlerts(data.alerts);
      setWeather(data.weather);
      setTasks(data.maintenance);
      setZones(data.zones);
      setLastUpdate(new Date());

      // Construye una serie en tiempo real usando el promedio actual de humedad.
      const nowLabel = new Date().toLocaleTimeString('es-CO', { hour12: false });
      const targetZone = data.zones.find((z) => z.id === 'zona-a') ?? data.zones[0];
      const avgHumidity =
        targetZone?.humidity ??
        data.zones.reduce((sum, zone) => sum + zone.humidity, 0) / Math.max(data.zones.length, 1);
      setLiveTrend((prev) => {
        const next = [...prev, { hour: nowLabel, value: Number(avgHumidity.toFixed(1)) }];
        return next.slice(-90); // ~90 s de muestras a 1s
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Resumen general</h2>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span>Estado actual del sistema de riego y energía</span>
          {lastUpdate && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Actualizado {lastUpdate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ChartContainer
            title="Humedad en tiempo real"
            subtitle="Promedio de humedad por lectura recibida (0% = muy seco, 100% = muy húmedo)"
          >
            <ResponsiveContainer>
              <LineChart data={liveTrend.length ? liveTrend : trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="hour" stroke="#9CA3AF" hide />
                <YAxis unit="%" stroke="#9CA3AF" domain={[0, 100]} tickCount={6} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#16A34A" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ZoneStatusGrid zones={zones} />
        </div>

        <div className="space-y-6">
          <AlertsPanel alerts={alerts.slice(0, 5)} />
          <WeatherWidget data={weather} />
          <MaintenanceChecklist tasks={tasks} onToggle={handleToggleTask} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

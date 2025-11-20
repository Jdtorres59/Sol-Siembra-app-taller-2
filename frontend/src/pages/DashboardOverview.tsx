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
  const [alerts, setAlerts] = useState(mockAlerts);
  const [zones, setZones] = useState<IrrigationZone[]>(mockZones);
  const [weather, setWeather] = useState(weatherWidget);

  useEffect(() => {
    getDashboardOverview().then((data) => {
      setKpis(data.kpis);
      setTrend(data.humidityTrend);
      setAlerts(data.alerts);
      setWeather(data.weather);
      setTasks(data.maintenance);
      setZones(data.zones);
    });
  }, []);

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Resumen general</h2>
        <p className="text-sm text-gray-500">Estado actual del sistema de riego y energía</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ChartContainer title="Humedad promedio (24h)" subtitle="Lecturas horarias recientes">
            <ResponsiveContainer>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
                <YAxis unit="%" stroke="#9CA3AF" domain={[20, 50]} />
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

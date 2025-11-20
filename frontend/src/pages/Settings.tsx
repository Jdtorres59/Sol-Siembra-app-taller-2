// Configuración básica de finca, preferencias y usuarios autorizados.
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { alertPreferences, displayPreferences, farmInfo, users } from '../mock/mockData';
import { getSettingsData } from '../services/api';

const Settings = () => {
  const [farmData, setFarmData] = useState(farmInfo);
  const [displayPrefs, setDisplayPrefs] = useState(displayPreferences);
  const [alertPrefs, setAlertPrefs] = useState(alertPreferences);
  const [usersList, setUsersList] = useState(users);

  useEffect(() => {
    getSettingsData().then((payload) => {
      setFarmData(payload.farmInfo);
      setDisplayPrefs(payload.displayPreferences);
      setAlertPrefs(payload.alertPreferences);
      setUsersList(payload.users);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Configuración</h2>
        <p className="text-sm text-gray-500">Ajustes básicos de la finca y notificaciones</p>
      </div>

      <Card title="Datos de la finca">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-gray-500">Nombre</label>
            <input
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              value={farmData.name}
              onChange={(event) => setFarmData((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Departamento / municipio</label>
            <input
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              value={farmData.location}
              onChange={(event) => setFarmData((prev) => ({ ...prev, location: event.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Cultivo principal</label>
            <input
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              value={farmData.crop}
              onChange={(event) => setFarmData((prev) => ({ ...prev, crop: event.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Área total (ha)</label>
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              value={farmData.areaHa}
              onChange={(event) => setFarmData((prev) => ({ ...prev, areaHa: Number(event.target.value) }))}
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Preferencias de visualización">
          <div className="space-y-4 text-sm">
            <div>
              <label className="text-xs font-medium text-gray-500">Unidades</label>
              <select
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                value={displayPrefs.units}
                onChange={(event) => setDisplayPrefs((prev) => ({ ...prev, units: event.target.value as 'metric' }))}
              >
                <option value="metric">Métrico (°C, mm, m³)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Tema</label>
              <select
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                value={displayPrefs.theme}
                onChange={(event) => setDisplayPrefs((prev) => ({ ...prev, theme: event.target.value as 'claro' | 'oscuro' }))}
              >
                <option value="claro">Claro</option>
                <option value="oscuro">Oscuro</option>
              </select>
            </div>
            <p className="rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-500">
              Configuración sincronizada con la plataforma central.
            </p>
          </div>
        </Card>

        <Card title="Alertas" subtitle="Configura notificaciones clave">
          <div className="space-y-3 text-sm">
            {(
              [
                { key: 'lowWater', label: 'Alertas de bajo nivel de agua' },
                { key: 'lowHumidity', label: 'Alertas de humedad baja' },
                { key: 'sensorFailure', label: 'Alertas de fallo de sensor' },
              ] as const
            ).map((item) => (
              <label key={item.key} className="flex items-center justify-between">
                <span>{item.label}</span>
                <input
                  type="checkbox"
                  className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-gray-200 transition checked:bg-brand-primary"
                  checked={alertPrefs[item.key]}
                  onChange={(event) => setAlertPrefs((prev) => ({ ...prev, [item.key]: event.target.checked }))}
                />
              </label>
            ))}
            <div>
              <label className="text-xs font-medium text-gray-500">Humedad mínima global (%)</label>
              <input
                type="number"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                value={alertPrefs.humidityThreshold}
                onChange={(event) =>
                  setAlertPrefs((prev) => ({ ...prev, humidityThreshold: Number(event.target.value) }))
                }
              />
            </div>
          </div>
        </Card>
      </div>

      <Card title="Usuarios" subtitle="Roles y permisos">
        <div className="space-y-4">
          {usersList.map((user) => (
            <div key={user.id} className="rounded-2xl border border-gray-100 p-4">
              <p className="text-base font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.role}</p>
              <p className="mt-1 text-sm text-gray-600">{user.permissions}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Settings;

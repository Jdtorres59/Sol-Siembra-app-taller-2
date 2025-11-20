// Define el layout base con sidebar, topbar y área de contenido.
import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { systemOverview as mockSystemOverview } from '../mock/mockData';
import { getOverallStatusColor } from '../utils/format';
import StatusBadge from '../components/StatusBadge';
import logo from '../assets/logo.png';
import { getDashboardOverview } from '../services/api';

const navItems = [
  { to: '/', label: 'Resumen', icon: '📊' },
  { to: '/zonas', label: 'Zonas de riego', icon: '💧' },
  { to: '/energia-techo', label: 'Energía y techo', icon: '⚡️' },
  { to: '/historial-reportes', label: 'Historial y reportes', icon: '📈' },
  { to: '/configuracion', label: 'Configuración', icon: '⚙️' },
];

const MainLayout = () => {
  const [systemOverview, setSystemOverview] = useState(mockSystemOverview);

  useEffect(() => {
    getDashboardOverview().then((payload) => setSystemOverview(payload.systemOverview));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-64 flex-col border-r border-gray-100 bg-white p-6 md:flex">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo Sol&Siembra" className="h-12 w-12" />
          <div>
            <div className="text-xl font-semibold text-brand-primary">Sol&Siembra</div>
          </div>
        </div>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-emerald-50 ${
                  isActive ? 'bg-emerald-50 text-brand-primary' : 'text-gray-600'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-semibold">Monitoreo en línea</p>
          <p>Panel principal del sistema agrovoltaico.</p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-white px-6 py-4">
        <div>
          <p className="text-sm text-gray-500">Finca</p>
          <h1 className="text-xl font-semibold text-gray-900">{systemOverview.farmName}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge
            label={systemOverview.overallStatus}
            colorClass={`${getOverallStatusColor(systemOverview.overallStatus)}`}
          />
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {systemOverview.connectionLabel}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

// Configura el enrutamiento principal de la app y asocia cada página.
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardOverview from './pages/DashboardOverview';
import IrrigationZones from './pages/IrrigationZones';
import EnergyAndRoof from './pages/EnergyAndRoof';
import HistoryAndReports from './pages/HistoryAndReports';
import Settings from './pages/Settings';

const App = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<DashboardOverview />} />
      <Route path="zonas" element={<IrrigationZones />} />
      <Route path="energia-techo" element={<EnergyAndRoof />} />
      <Route path="historial-reportes" element={<HistoryAndReports />} />
      <Route path="configuracion" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default App;

// Tablero compacto que muestra el estado actual de cada zona de riego.
import { IrrigationZone } from '../types';
import { formatTime, getZoneStateColor } from '../utils/format';
import Card from './Card';

interface ZoneStatusGridProps {
  zones: IrrigationZone[];
}

const ZoneStatusGrid = ({ zones }: ZoneStatusGridProps) => (
  <Card title="Estado por zona" subtitle="Humedad y programación próxima">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {zones.map((zone) => (
        <div key={zone.id} className="rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">{zone.name}</p>
              <p className="text-xs text-gray-500">Último riego {formatTime(zone.lastIrrigation)}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getZoneStateColor(zone.status)}`}>
              {zone.status}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div>
              <p className="text-xs text-gray-500">Humedad</p>
              <p className="text-lg font-semibold text-gray-900">{zone.humidity}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Próximo riego</p>
              <p className="text-sm font-medium text-gray-900">{formatTime(zone.nextIrrigation)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export default ZoneStatusGrid;

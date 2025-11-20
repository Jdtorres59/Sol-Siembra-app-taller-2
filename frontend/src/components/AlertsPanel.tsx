// Panel que lista las alertas recientes con nivel y estado.
import Card from './Card';
import { Alert } from '../types';
import { formatDateTime, getAlertLevelColor } from '../utils/format';

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel = ({ alerts }: AlertsPanelProps) => (
  <Card title="Alertas recientes" subtitle="Eventos más importantes">
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="rounded-xl border border-gray-100 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
              <p className="text-sm text-gray-600">{alert.message}</p>
            </div>
            <span
              className={`text-xs font-semibold uppercase tracking-wide ${getAlertLevelColor(alert.level)}`}
            >
              {alert.level}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>{formatDateTime(alert.timestamp)}</span>
            <span>{alert.state}</span>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export default AlertsPanel;

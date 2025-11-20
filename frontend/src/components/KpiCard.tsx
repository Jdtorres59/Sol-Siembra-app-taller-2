// Tarjeta compacta para mostrar KPIs numéricos con tendencia.
import clsx from 'clsx';

interface KpiCardProps {
  label: string;
  value: string;
  helper?: string;
  trendLabel?: string;
  variation?: number;
}

const KpiCard = ({ label, value, helper, trendLabel, variation }: KpiCardProps) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    {helper && <p className="mt-1 text-sm text-gray-500">{helper}</p>}
    {trendLabel && (
      <p
        className={clsx('mt-2 inline-flex items-center text-sm font-medium', {
          'text-green-600': (variation ?? 0) > 0,
          'text-red-600': (variation ?? 0) < 0,
          'text-gray-500': !variation,
        })}
      >
        {variation && variation > 0 && '↑'}
        {variation && variation < 0 && '↓'}
        <span className="ml-1">{trendLabel}</span>
      </p>
    )}
  </div>
);

export default KpiCard;

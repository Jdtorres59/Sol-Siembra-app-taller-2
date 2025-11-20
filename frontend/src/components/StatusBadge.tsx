// Etiqueta redondeada para resaltar estados o etiquetas rápidas.
import clsx from 'clsx';
import { ReactNode } from 'react';

interface StatusBadgeProps {
  label: string;
  colorClass?: string;
  icon?: ReactNode;
}

const StatusBadge = ({ label, colorClass = 'bg-gray-100 text-gray-700', icon }: StatusBadgeProps) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
      colorClass,
    )}
  >
    {icon && <span className="mr-1">{icon}</span>}
    {label}
  </span>
);

export default StatusBadge;

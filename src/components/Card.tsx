// Contenedor genérico con borde, título y acciones para agrupar contenido.
import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

const Card = ({ title, subtitle, actions, children, className }: CardProps) => (
  <section className={clsx('rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5', className)}>
    {(title || actions) && (
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {actions}
      </header>
    )}
    {children}
  </section>
);

export default Card;

// Card especializado para ubicar gráficos responsivos.
import { ReactNode } from 'react';
import Card from './Card';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const ChartContainer = ({ title, subtitle, children }: ChartContainerProps) => (
  <Card title={title} subtitle={subtitle}>
    <div className="h-64 w-full">
      {children}
    </div>
  </Card>
);

export default ChartContainer;

// Widget que resume el clima actual y recomendaciones rápidas.
import Card from './Card';
import { WeatherWidgetData } from '../types';

interface WeatherWidgetProps {
  data: WeatherWidgetData;
}

const WeatherWidget = ({ data }: WeatherWidgetProps) => (
  <Card title="Clima rápido" subtitle="Referencia de las próximas horas">
    <div className="flex flex-wrap items-center gap-6">
      <div>
        <p className="text-4xl font-semibold text-gray-900">{data.temperatureC}°C</p>
        <p className="text-sm text-gray-500">Probabilidad de lluvia: {data.rainProbability}%</p>
      </div>
      <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        {data.message}
      </div>
    </div>
  </Card>
);

export default WeatherWidget;

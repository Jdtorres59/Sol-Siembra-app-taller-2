// Lista interactiva para tareas de mantenimiento recurrentes.
import { MaintenanceTask } from '../types';
import Card from './Card';

interface MaintenanceChecklistProps {
  tasks: MaintenanceTask[];
  onToggle: (id: string) => void;
}

const MaintenanceChecklist = ({ tasks, onToggle }: MaintenanceChecklistProps) => (
  <Card title="Checklist de mantenimiento" subtitle="Recordatorios rápidos">
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center justify-between">
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
            />
            {task.label}
          </label>
          <span className="text-xs text-gray-400">Rev. semanal</span>
        </li>
      ))}
    </ul>
  </Card>
);

export default MaintenanceChecklist;

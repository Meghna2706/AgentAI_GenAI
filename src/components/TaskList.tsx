import { CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../agents/types';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Action Tasks</h3>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
          >
            <Circle className="text-gray-400 mt-0.5 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-gray-700">{task.task}</p>
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Calendar } from 'lucide-react';
import { Schedule } from '../agents/types';

interface ScheduleViewProps {
  schedule: Schedule[];
}

export function ScheduleView({ schedule }: ScheduleViewProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="text-blue-600" size={24} />
        <h3 className="text-xl font-semibold text-gray-800">Schedule</h3>
      </div>
      <div className="space-y-3">
        {schedule.map((item, index) => (
          <div
            key={index}
            className="flex gap-4 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
          >
            <div className="flex-shrink-0 w-24 text-center">
              <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                <p className="text-sm font-semibold text-blue-700">
                  {formatDate(item.date)}
                </p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-700">{item.task}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

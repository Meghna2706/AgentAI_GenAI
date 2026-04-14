import { Task, Schedule, CalendarAgentResponse } from './types';

export class CalendarAgent {
  schedule(tasks: Task[]): CalendarAgentResponse {
    const schedules = this.generateSchedule(tasks);
    return { schedule: schedules };
  }

  private generateSchedule(tasks: Task[]): Schedule[] {
    const today = new Date();
    const schedules: Schedule[] = [];

    const highPriorityTasks = tasks.filter(t => t.priority === 'high');
    const mediumPriorityTasks = tasks.filter(t => t.priority === 'medium');
    const lowPriorityTasks = tasks.filter(t => t.priority === 'low');

    let dayOffset = 0;

    highPriorityTasks.forEach((task, index) => {
      const scheduleDate = new Date(today);
      scheduleDate.setDate(today.getDate() + dayOffset);
      schedules.push({
        date: scheduleDate.toISOString().split('T')[0],
        task: task.task
      });
      dayOffset += Math.ceil(2 + index * 0.5);
    });

    mediumPriorityTasks.forEach((task, index) => {
      const scheduleDate = new Date(today);
      scheduleDate.setDate(today.getDate() + dayOffset);
      schedules.push({
        date: scheduleDate.toISOString().split('T')[0],
        task: task.task
      });
      dayOffset += Math.ceil(3 + index * 0.5);
    });

    lowPriorityTasks.forEach((task, index) => {
      const scheduleDate = new Date(today);
      scheduleDate.setDate(today.getDate() + dayOffset);
      schedules.push({
        date: scheduleDate.toISOString().split('T')[0],
        task: task.task
      });
      dayOffset += Math.ceil(4 + index * 0.5);
    });

    return schedules;
  }
}

import { Task, TaskAgentResponse } from './types';

export class TaskAgent {
  breakDown(goal: string): TaskAgentResponse {
    const tasks = this.generateTasks(goal);
    return { tasks };
  }

  private generateTasks(goal: string): Task[] {
    const goalLower = goal.toLowerCase();

    if (goalLower.includes('learn') || goalLower.includes('study')) {
      return this.generateLearningTasks(goal);
    } else if (goalLower.includes('build') || goalLower.includes('create')) {
      return this.generateBuildingTasks(goal);
    } else if (goalLower.includes('fitness') || goalLower.includes('health')) {
      return this.generateFitnessTasks(goal);
    } else if (goalLower.includes('business') || goalLower.includes('startup')) {
      return this.generateBusinessTasks(goal);
    } else {
      return this.generateGenericTasks(goal);
    }
  }

  private generateLearningTasks(goal: string): Task[] {
    return [
      { task: 'Research and identify key learning resources', priority: 'high' },
      { task: 'Create a structured learning curriculum', priority: 'high' },
      { task: 'Set up daily practice schedule', priority: 'medium' },
      { task: 'Join relevant communities or forums', priority: 'medium' },
      { task: 'Work on practical projects', priority: 'high' },
      { task: 'Review and assess progress weekly', priority: 'low' }
    ];
  }

  private generateBuildingTasks(goal: string): Task[] {
    return [
      { task: 'Define requirements and specifications', priority: 'high' },
      { task: 'Create project architecture and plan', priority: 'high' },
      { task: 'Set up development environment', priority: 'medium' },
      { task: 'Build core features iteratively', priority: 'high' },
      { task: 'Test and gather feedback', priority: 'medium' },
      { task: 'Iterate and improve based on feedback', priority: 'medium' }
    ];
  }

  private generateFitnessTasks(goal: string): Task[] {
    return [
      { task: 'Consult with fitness professional', priority: 'high' },
      { task: 'Create personalized workout plan', priority: 'high' },
      { task: 'Set up nutrition tracking system', priority: 'medium' },
      { task: 'Schedule regular workout sessions', priority: 'high' },
      { task: 'Track progress with measurements', priority: 'medium' },
      { task: 'Adjust plan based on results', priority: 'low' }
    ];
  }

  private generateBusinessTasks(goal: string): Task[] {
    return [
      { task: 'Conduct market research', priority: 'high' },
      { task: 'Create business plan and model', priority: 'high' },
      { task: 'Identify target customers', priority: 'high' },
      { task: 'Build minimum viable product', priority: 'high' },
      { task: 'Develop marketing strategy', priority: 'medium' },
      { task: 'Launch and gather customer feedback', priority: 'medium' }
    ];
  }

  private generateGenericTasks(goal: string): Task[] {
    return [
      { task: 'Research and understand the goal deeply', priority: 'high' },
      { task: 'Break goal into smaller milestones', priority: 'high' },
      { task: 'Identify required resources and tools', priority: 'medium' },
      { task: 'Create action plan with deadlines', priority: 'high' },
      { task: 'Execute first milestone', priority: 'high' },
      { task: 'Review progress and adjust approach', priority: 'medium' }
    ];
  }
}

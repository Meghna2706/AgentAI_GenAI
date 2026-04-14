import { supabase } from '../lib/supabase';
import {
  OrchestratorPlan,
  TaskAgentResponse,
  CalendarAgentResponse,
  DecisionAgentResponse,
  MemoryAgentResponse
} from './types';

export class MemoryAgent {
  async store(
    userId: string,
    plan: OrchestratorPlan,
    tasks?: TaskAgentResponse,
    schedule?: CalendarAgentResponse,
    decisions?: DecisionAgentResponse
  ): Promise<MemoryAgentResponse> {
    try {
      const { data: goalData, error: goalError } = await supabase
        .from('goals')
        .insert({
          user_id: userId,
          goal_text: plan.goal,
          status: 'active'
        })
        .select()
        .single();

      if (goalError) throw goalError;

      const goalId = goalData.id;

      if (tasks) {
        const tasksToInsert = tasks.tasks.map(task => ({
          goal_id: goalId,
          task_text: task.task,
          priority: task.priority,
          completed: false
        }));

        const { error: tasksError } = await supabase
          .from('tasks')
          .insert(tasksToInsert);

        if (tasksError) throw tasksError;

        if (schedule) {
          const { data: tasksList } = await supabase
            .from('tasks')
            .select('id, task_text')
            .eq('goal_id', goalId);

          if (tasksList) {
            const schedulesToInsert = schedule.schedule.map(scheduleItem => {
              const matchingTask = tasksList.find(t =>
                t.task_text === scheduleItem.task
              );
              return matchingTask ? {
                task_id: matchingTask.id,
                scheduled_date: scheduleItem.date
              } : null;
            }).filter(Boolean);

            if (schedulesToInsert.length > 0) {
              await supabase.from('schedules').insert(schedulesToInsert);
            }
          }
        }
      }

      if (decisions) {
        const decisionsToInsert = decisions.paths.map(path => ({
          goal_id: goalId,
          path_type: path.type,
          summary: path.summary,
          outcome: path.outcome,
          risk: path.risk,
          success: path.success,
          is_recommended: path.type === decisions.recommended
        }));

        const { error: decisionsError } = await supabase
          .from('decisions')
          .insert(decisionsToInsert);

        if (decisionsError) throw decisionsError;
      }

      const logData = {
        goal: plan.goal,
        reasoning: plan.reasoning,
        agents_called: plan.agents_to_call,
        tasks_count: tasks?.tasks.length || 0,
        schedule_count: schedule?.schedule.length || 0,
        decisions_count: decisions?.paths.length || 0
      };

      await supabase.from('memory_logs').insert({
        goal_id: goalId,
        log_data: logData
      });

      return {
        status: 'stored',
        summary: `Successfully stored goal, ${tasks?.tasks.length || 0} tasks, ${schedule?.schedule.length || 0} schedule items, and ${decisions?.paths.length || 0} decision paths.`
      };
    } catch (error) {
      console.error('Memory storage error:', error);
      return {
        status: 'error',
        summary: 'Failed to store data. Please try again.'
      };
    }
  }

  async getRecentGoals(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async getGoalDetails(goalId: string) {
    const [goal, tasks, decisions, memoryLog] = await Promise.all([
      supabase.from('goals').select('*').eq('id', goalId).single(),
      supabase.from('tasks').select('*').eq('goal_id', goalId),
      supabase.from('decisions').select('*').eq('goal_id', goalId),
      supabase.from('memory_logs').select('*').eq('goal_id', goalId).single()
    ]);

    const taskIds = tasks.data?.map(t => t.id) || [];
    const schedules = taskIds.length > 0
      ? await supabase.from('schedules').select('*').in('task_id', taskIds)
      : { data: [] };

    return {
      goal: goal.data,
      tasks: tasks.data || [],
      decisions: decisions.data || [],
      schedules: schedules.data || [],
      memoryLog: memoryLog.data
    };
  }
}

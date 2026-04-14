import { OrchestratorPlan } from './types';

export class OrchestratorAgent {
  analyze(input: string): OrchestratorPlan {
    const needsTask = true;
    const needsCalendar = this.needsScheduling(input);
    const needsDecision = this.needsDecisionMaking(input);
    const needsMemory = true;

    const agents: string[] = [];
    if (needsTask) agents.push('task');
    if (needsCalendar) agents.push('calendar');
    if (needsDecision) agents.push('decision');
    if (needsMemory) agents.push('memory');

    return {
      goal: this.extractGoal(input),
      agents_to_call: agents,
      reasoning: this.generateReasoning(input, agents)
    };
  }

  private extractGoal(input: string): string {
    return input.trim();
  }

  private needsScheduling(input: string): boolean {
    const scheduleKeywords = ['schedule', 'when', 'time', 'date', 'calendar', 'plan'];
    return scheduleKeywords.some(keyword =>
      input.toLowerCase().includes(keyword)
    );
  }

  private needsDecisionMaking(input: string): boolean {
    const decisionKeywords = ['decide', 'choice', 'option', 'path', 'should i', 'which', 'better'];
    return decisionKeywords.some(keyword =>
      input.toLowerCase().includes(keyword)
    );
  }

  private generateReasoning(input: string, agents: string[]): string {
    const agentPurposes: Record<string, string> = {
      task: 'break down the goal into actionable tasks',
      calendar: 'schedule tasks efficiently',
      decision: 'simulate future paths and outcomes',
      memory: 'store and track progress'
    };

    const purposes = agents.map(agent => agentPurposes[agent]).join(', ');
    return `To achieve your goal, we need to ${purposes}.`;
  }
}

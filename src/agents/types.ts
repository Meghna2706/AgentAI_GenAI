export interface Task {
  task: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Schedule {
  date: string;
  task: string;
}

export interface DecisionPath {
  type: 'Safe' | 'Risky' | 'Smart';
  summary: string;
  outcome: string;
  risk: number;
  success: number;
}

export interface OrchestratorPlan {
  goal: string;
  agents_to_call: string[];
  reasoning: string;
}

export interface TaskAgentResponse {
  tasks: Task[];
}

export interface CalendarAgentResponse {
  schedule: Schedule[];
}

export interface DecisionAgentResponse {
  paths: DecisionPath[];
  recommended: string;
  reason: string;
}

export interface MemoryAgentResponse {
  status: string;
  summary: string;
}

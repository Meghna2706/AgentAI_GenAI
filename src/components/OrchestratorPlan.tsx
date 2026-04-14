import { Brain, CheckCircle } from 'lucide-react';
import { OrchestratorPlan as PlanType } from '../agents/types';

interface OrchestratorPlanProps {
  plan: PlanType;
}

export function OrchestratorPlan({ plan }: OrchestratorPlanProps) {
  const agentNames: Record<string, string> = {
    task: 'Task Agent',
    calendar: 'Calendar Agent',
    decision: 'Decision Agent',
    memory: 'Memory Agent'
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="text-blue-600" size={28} />
        <h3 className="text-xl font-semibold text-gray-800">Orchestrator Analysis</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">Your Goal:</p>
          <p className="text-lg text-gray-800">{plan.goal}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Agents Activated:</p>
          <div className="flex flex-wrap gap-2">
            {plan.agents_to_call.map((agent, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-blue-200 shadow-sm"
              >
                <CheckCircle className="text-green-500" size={16} />
                <span className="text-sm font-medium text-gray-700">
                  {agentNames[agent] || agent}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-gray-600 mb-1">Reasoning:</p>
          <p className="text-gray-700">{plan.reasoning}</p>
        </div>
      </div>
    </div>
  );
}

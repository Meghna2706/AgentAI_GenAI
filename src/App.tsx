import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { GoalInput } from './components/GoalInput';
import { OrchestratorPlan } from './components/OrchestratorPlan';
import { TaskList } from './components/TaskList';
import { ScheduleView } from './components/ScheduleView';
import { DecisionPaths } from './components/DecisionPaths';
import { OrchestratorAgent } from './agents/orchestrator';
import { TaskAgent } from './agents/task';
import { CalendarAgent } from './agents/calendar';
import { DecisionAgent } from './agents/decision';
import { MemoryAgent } from './agents/memory';
import { Brain, LogOut } from 'lucide-react';
import type {
  OrchestratorPlan as PlanType,
  TaskAgentResponse,
  CalendarAgentResponse,
  DecisionAgentResponse
} from './agents/types';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [plan, setPlan] = useState<PlanType | null>(null);
  const [tasks, setTasks] = useState<TaskAgentResponse | null>(null);
  const [schedule, setSchedule] = useState<CalendarAgentResponse | null>(null);
  const [decisions, setDecisions] = useState<DecisionAgentResponse | null>(null);

  //const orchestrator = new OrchestratorAgent();
  //const taskAgent = new TaskAgent();
  //const calendarAgent = new CalendarAgent();
  //const decisionAgent = new DecisionAgent();
  const memoryAgent = new MemoryAgent();

  async function callSupervity(input: string) {
  try {
    const formData = new FormData();

    formData.append("workflowId", "019d2f5c-6377-7000-8ede-d1ebe1d747e3");
    formData.append("inputs[user_input]", input);
    formData.append("inputs[language]", "English");
    formData.append("inputs[notification_mode]", "none");
    formData.append("inputs[user_email]", "test@example.com");

    console.log("Calling API...");

    const response = await fetch(
      "https://auto-workflow-api.supervity.ai/api/v1/workflow-runs/execute",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJCOVg3RVFFWE8td25ucjBJd3Vjbm5vQWlVcWdDM1JpNzh2aGMxMG9xTmJnIn0.eyJleHAiOjE3ODIxMzY2MzcsImlhdCI6MTc3NDM2MDYzNywianRpIjoiMGUxNmY1OGMtYWQ0NC00Mzg3LWI0MTQtZWUwMzg2NGVmOTEwIiwiaXNzIjoiaHR0cHM6Ly9hdXRvLXNzby5zdXBlcnZpdHkuYWkvYXV0aC9yZWFsbXMvdGVjaGZvcmNlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjNmNTE2YmViLWFhNGYtNDk0MS04NjZhLTMyZDU4MDA2ZmU1YiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJvdC1tYWtlciIsInNpZCI6IjExY2NlZTRiLTMxNTAtNDg3OC04NGU5LTdiNjNjYTNmNTMyYiIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2F1dG8uc3VwZXJ2aXR5LmFpIiwiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy10ZWNoZm9yY2UiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6Ik1lZ2huYSBTdWJyYW1hbmkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzbWVndS4yNzA2QGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJNZWdobmEiLCJmYW1pbHlfbmFtZSI6IlN1YnJhbWFuaSIsImVtYWlsIjoic21lZ3UuMjcwNkBnbWFpbC5jb20ifQ.d5A0VVFNTsvHyik9cqw73u891F-ggD7a4AC6ILjoUlZOELm-M5u_VuN9RYbEaPGP0ZSgtZ_y6p87mjXLi1d4uEXcM38UPowZgzWGMVf_bpMcHn_zqtF6xY27asyiqc-0cVrmbUUhZaWdgVyA8cBixhcc3-pT95tJahzfo1Y219tY792gzJrqhiQPPjODi32rb97cVg60cWLFCD9sYfHsXG30Mr25xbw3vaOjwqesIbbdLtmDbROkypT2scR6X3GXNmC0_fJyrSWWoBdT43Dl_YQJV5yWZrcllTezI_O9ZzAPWPAAqrT1geUji4sv8ZsE7shK_AZyWZoHWpbINDWrkA",
          "x-source": "v1"
        },
        body: formData
      }
    );

    console.log("STATUS:", response.status);

    const text = await response.text();

    console.log("RAW RESPONSE:", text);

    return { success: true, raw: text };

  } catch (error) {
    console.error("API FAILED:", error);

    return { success: false };
  }
}
  function generateDynamicPlan(goal: string) {
  const g = goal.toLowerCase();

  // 🎯 DEFAULT
  let tasks = [];
  let schedule = [];
  let decisions = [];

  // 🎓 EDUCATION / EXAM
  if (g.includes("jee") || g.includes("exam") || g.includes("study")) {
    tasks = [
      { task: "Understand core concepts (Physics, Chemistry, Math)", priority: "high" },
      { task: "Practice previous year questions", priority: "high" },
      { task: "Take mock tests regularly", priority: "medium" }
    ];

    schedule = [
      { date: "Day 1", task: "Study fundamentals (2-3 hours)" },
      { date: "Day 2", task: "Practice problem solving" },
      { date: "Day 3", task: "Attempt mock test" }
    ];

  }

  // 💻 PROGRAMMING
  else if (g.includes("python") || g.includes("coding") || g.includes("programming")) {
    tasks = [
      { task: "Learn basics (syntax, variables)", priority: "high" },
      { task: "Practice coding problems", priority: "medium" },
      { task: "Build small projects", priority: "high" }
    ];

    schedule = [
      { date: "Day 1", task: "Learn basics" },
      { date: "Day 2", task: "Solve problems" },
      { date: "Day 3", task: "Build mini project" }
    ];
  }

  // 🏋️ FITNESS
  else if (g.includes("fitness") || g.includes("weight") || g.includes("gym")) {
    tasks = [
      { task: "Create workout routine", priority: "high" },
      { task: "Maintain diet plan", priority: "high" },
      { task: "Track progress weekly", priority: "medium" }
    ];

    schedule = [
      { date: "Day 1", task: "Start workout + diet" },
      { date: "Day 2", task: "Continue routine" },
      { date: "Day 3", task: "Measure progress" }
    ];
  }

  // 🌐 DEFAULT (fallback)
  else {
    tasks = [
      { task: `Research about "${goal}"`, priority: "high" },
      { task: "Break goal into steps", priority: "medium" },
      { task: "Start execution", priority: "high" }
    ];

    schedule = [
      { date: "Day 1", task: "Understand the goal" },
      { date: "Day 2", task: "Plan steps" },
      { date: "Day 3", task: "Start working" }
    ];
  }

  // 🔥 DECISIONS (common)
  decisions = [
    {
      type: "Safe",
      summary: "Slow and steady approach",
      outcome: "Consistent progress",
      risk: 20,
      success: 80
    },
    {
      type: "Risky",
      summary: "Aggressive fast-track",
      outcome: "Quick results or burnout",
      risk: 70,
      success: 60
    },
    {
      type: "Smart",
      summary: "Balanced strategy",
      outcome: "Best long-term success",
      risk: 40,
      success: 90
    }
  ];

  return { tasks, schedule, decisions };
}
  
  const handleGoalSubmit = async (goalInput: string) => {
  console.log("BUTTON CLICKED");

  if (!goalInput) {
    alert("Enter a goal");
    return;
  }

  setIsProcessing(true);

  try {
    const result = await callSupervity(goalInput);

    console.log("RESULT:", result);

    setPlan({
      goal: goalInput,
      agents_to_call: ["task", "calendar", "decision"],
      reasoning: "AI-powered planning system"
    });

    setTasks({
      tasks: [
        { task: "Understand basics", priority: "high" },
        { task: "Practice daily", priority: "medium" },
        { task: "Build small projects", priority: "high" }
      ]
    });

    setSchedule({
      schedule: [
        { date: "Day 1", task: "Learn fundamentals" },
        { date: "Day 2", task: "Practice coding" },
        { date: "Day 3", task: "Build mini project" }
      ]
    });

    const dynamic = generateDynamicPlan(goalInput);

setTasks({ tasks: dynamic.tasks });
setSchedule({ schedule: dynamic.schedule });

setDecisions({
  paths: dynamic.decisions,
  recommended: "Smart Path",
  reason: "Balanced and efficient approach"
});

  } catch (error) {
    console.error(error);
  } finally {
    setIsProcessing(false);
  }
};

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="mx-auto mb-4 text-blue-600 animate-pulse" size={48} />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">AgentMind</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            AgentMind AI
          </h2>
          <p className="text-gray-600">
            Enter your goal and let our AI agents break it down, schedule it, and simulate future paths
          </p>
        </div>

        <div className="mb-8">
          <GoalInput onSubmit={handleGoalSubmit} isProcessing={isProcessing && <p>⏳ AI is thinking...</p>}/>
        </div>

        {plan && (
          <div className="space-y-6">
            <OrchestratorPlan plan={plan} />

            {tasks && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TaskList tasks={tasks.tasks} />
                {schedule && <ScheduleView schedule={schedule.schedule} />}
              </div>
            )}

            {decisions && (
              <DecisionPaths
                paths={decisions.paths}
                recommended={decisions.recommended}
                reason={decisions.reason}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}


export default App;

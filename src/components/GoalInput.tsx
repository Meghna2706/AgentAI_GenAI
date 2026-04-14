import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface GoalInputProps {
  onSubmit: (goal: string) => void;
  isProcessing: boolean;
}

export function GoalInput({ onSubmit, isProcessing }: GoalInputProps) {
  const [goal, setGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim() && !isProcessing) {
      onSubmit(goal);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What's your goal? (e.g., 'Learn Python programming', 'Start a fitness journey', 'Build a mobile app')"
            className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
            rows={3}
            disabled={isProcessing}
          />
          <Sparkles className="absolute right-4 top-4 text-gray-400" size={20} />
        </div>
        <button
          type="submit"
          disabled={!goal.trim() || isProcessing}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {isProcessing ? 'Processing...' : 'Analyze My Goal'}
        </button>
      </form>
    </div>
  );
}

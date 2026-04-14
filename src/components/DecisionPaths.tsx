import { TrendingUp, Shield, Zap, Award } from 'lucide-react';
import { DecisionPath } from '../agents/types';

interface DecisionPathsProps {
  paths: DecisionPath[];
  recommended: string;
  reason: string;
}

export function DecisionPaths({ paths, recommended, reason }: DecisionPathsProps) {
  const getPathIcon = (type: string) => {
    switch (type) {
      case 'Safe':
        return <Shield className="text-green-600" size={24} />;
      case 'Risky':
        return <Zap className="text-orange-600" size={24} />;
      case 'Smart':
        return <Award className="text-blue-600" size={24} />;
      default:
        return <TrendingUp className="text-gray-600" size={24} />;
    }
  };

  const getPathColor = (type: string) => {
    switch (type) {
      case 'Safe':
        return 'border-green-200 bg-green-50';
      case 'Risky':
        return 'border-orange-200 bg-orange-50';
      case 'Smart':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getRiskBarColor = (risk: number) => {
    if (risk < 30) return 'bg-green-500';
    if (risk < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSuccessBarColor = (success: number) => {
    if (success < 40) return 'bg-red-500';
    if (success < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">Future Path Simulation</h3>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Recommended:</span> {recommended} Path
        </p>
        <p className="text-sm text-blue-700 mt-1">{reason}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paths.map((path, index) => (
          <div
            key={index}
            className={`rounded-lg border-2 p-5 ${getPathColor(path.type)} ${
              path.type === recommended ? 'ring-2 ring-blue-400' : ''
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {getPathIcon(path.type)}
              <h4 className="font-semibold text-lg text-gray-800">{path.type} Path</h4>
            </div>

            <p className="text-sm text-gray-700 mb-4">{path.summary}</p>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Risk Level</span>
                  <span className="font-semibold text-gray-800">{path.risk}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getRiskBarColor(path.risk)} transition-all`}
                    style={{ width: `${path.risk}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Success Probability</span>
                  <span className="font-semibold text-gray-800">{path.success}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getSuccessBarColor(path.success)} transition-all`}
                    style={{ width: `${path.success}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-600 font-medium mb-1">Expected Outcome:</p>
              <p className="text-sm text-gray-700">{path.outcome}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

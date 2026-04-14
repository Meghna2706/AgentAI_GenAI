import { DecisionPath, DecisionAgentResponse } from './types';

export class DecisionAgent {
  simulate(goal: string): DecisionAgentResponse {
    const paths = this.generatePaths(goal);
    const recommended = this.determineRecommended(paths);
    const reason = this.generateReason(recommended, paths);

    return { paths, recommended, reason };
  }

  private generatePaths(goal: string): DecisionPath[] {
    const goalLower = goal.toLowerCase();

    return [
      {
        type: 'Safe',
        summary: this.generateSafeSummary(goalLower),
        outcome: this.generateSafeOutcome(goalLower),
        risk: this.calculateRisk('safe', goalLower),
        success: this.calculateSuccess('safe', goalLower)
      },
      {
        type: 'Risky',
        summary: this.generateRiskySummary(goalLower),
        outcome: this.generateRiskyOutcome(goalLower),
        risk: this.calculateRisk('risky', goalLower),
        success: this.calculateSuccess('risky', goalLower)
      },
      {
        type: 'Smart',
        summary: this.generateSmartSummary(goalLower),
        outcome: this.generateSmartOutcome(goalLower),
        risk: this.calculateRisk('smart', goalLower),
        success: this.calculateSuccess('smart', goalLower)
      }
    ];
  }

  private generateSafeSummary(goal: string): string {
    return 'Take a conservative, step-by-step approach with minimal risk. Focus on proven methods and gradual progress.';
  }

  private generateSafeOutcome(goal: string): string {
    return 'Steady, predictable progress with minimal setbacks. Results may take longer but are more guaranteed. Lower potential for breakthrough success but also lower chance of failure.';
  }

  private generateRiskySummary(goal: string): string {
    return 'Take an aggressive, fast-paced approach with bold moves. Aim for rapid results and maximum impact.';
  }

  private generateRiskyOutcome(goal: string): string {
    return 'Potential for exceptional results and breakthrough success, but with significant chance of setbacks. High reward potential but requires resilience and adaptability.';
  }

  private generateSmartSummary(goal: string): string {
    return 'Combine calculated risks with proven strategies. Balance ambition with pragmatism for optimal results.';
  }

  private generateSmartOutcome(goal: string): string {
    return 'Strong likelihood of achieving goals with manageable risks. Balances speed with sustainability, offering good returns without excessive exposure to failure.';
  }

  private calculateRisk(pathType: string, goal: string): number {
    const baseRisks: Record<string, number> = {
      safe: 15,
      risky: 75,
      smart: 35
    };
    return baseRisks[pathType] + Math.floor(Math.random() * 10);
  }

  private calculateSuccess(pathType: string, goal: string): number {
    const baseSuccess: Record<string, number> = {
      safe: 70,
      risky: 45,
      smart: 80
    };
    return baseSuccess[pathType] + Math.floor(Math.random() * 10);
  }

  private determineRecommended(paths: DecisionPath[]): string {
    const smartPath = paths.find(p => p.type === 'Smart');
    return smartPath ? 'Smart' : paths[0].type;
  }

  private generateReason(recommended: string, paths: DecisionPath[]): string {
    const recommendedPath = paths.find(p => p.type === recommended);
    if (!recommendedPath) return 'Best overall balance of risk and reward.';

    return `The ${recommended} path offers the best balance with ${recommendedPath.success}% success probability and ${recommendedPath.risk}% risk level, providing optimal outcomes while managing potential downsides.`;
  }
}

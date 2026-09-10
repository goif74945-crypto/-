export type GovernorState = "EXTREME" | "HIGH" | "BALANCED" | "SAFE" | "CRITICAL";

export interface PressureSample {
  readonly queueRatio: number;
  readonly workRatio: number;
  readonly memoryRatio: number;
  readonly localGameplayActive: boolean;
}

export interface WorkloadPolicy {
  readonly executionBudget: number;
  readonly allowFar: boolean;
  readonly allowDecorative: boolean;
}

const POLICY: Record<GovernorState, WorkloadPolicy> = {
  EXTREME: { executionBudget: 32, allowFar: true, allowDecorative: true },
  HIGH: { executionBudget: 24, allowFar: true, allowDecorative: true },
  BALANCED: { executionBudget: 16, allowFar: true, allowDecorative: true },
  SAFE: { executionBudget: 8, allowFar: true, allowDecorative: false },
  CRITICAL: { executionBudget: 2, allowFar: false, allowDecorative: false },
};

export class AdaptivePerformanceGovernor {
  private state: GovernorState = "BALANCED";
  private stableWindows = 0;

  public evaluate(sample: PressureSample): GovernorState {
    const pressure = Math.max(sample.queueRatio, sample.workRatio, sample.memoryRatio);
    if (sample.localGameplayActive && pressure >= 0.65) {
      this.state = pressure >= 0.9 ? "CRITICAL" : "SAFE";
      this.stableWindows = 0;
      return this.state;
    }
    if (pressure >= 1) this.state = "CRITICAL";
    else if (pressure >= 0.85) this.state = "SAFE";
    else if (pressure >= 0.65) this.state = "BALANCED";
    else {
      this.stableWindows++;
      if (this.stableWindows >= 3) {
        this.state = this.state === "CRITICAL" ? "SAFE" : this.state === "SAFE" ? "BALANCED" : this.state === "BALANCED" ? "HIGH" : this.state === "HIGH" ? "EXTREME" : "EXTREME";
        this.stableWindows = 0;
      }
    }
    return this.state;
  }

  public getState(): GovernorState {
    return this.state;
  }

  public workloadPolicy(): WorkloadPolicy {
    return POLICY[this.state];
  }
}

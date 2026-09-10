// ZORVION Type System

export type ViewId =
  | 'home'
  | 'decisions'
  | 'scenarios'
  | 'causal-map'
  | 'consequences'
  | 'simulations'
  | 'optimization'
  | 'risk'
  | 'knowledge'
  | 'activity'
  | 'settings'
  | 'location';

export type CoreState =
  | 'IDLE'
  | 'ANALYZING'
  | 'MAPPING'
  | 'SIMULATING'
  | 'DISCOVERING'
  | 'OPTIMIZING'
  | 'COMPLETE'
  | 'WARNING';

export type ConfidenceLevel = 'high' | 'moderate' | 'low' | 'very-low';
export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low';
export type RiskLikelihood = 'likely' | 'possible' | 'unlikely';
export type DataSourceStatus = 'live' | 'updated' | 'stale' | 'unavailable';
export type DataProvenance = 'real' | 'synthetic' | 'estimated' | 'model-output';

export interface Confidence {
  level: ConfidenceLevel;
  percentage: number;
}

export interface CausalNode {
  id: string;
  label: string;
  category: CausalNodeCategory;
  x: number;
  y: number;
  description: string;
  uncertainty?: ConfidenceLevel;
  riskLevel?: RiskSeverity;
  isRoot?: boolean;
  isDiscovered?: boolean;
}

export type CausalNodeCategory =
  | 'infrastructure'
  | 'population'
  | 'economy'
  | 'environment'
  | 'health'
  | 'transport'
  | 'energy'
  | 'water'
  | 'policy'
  | 'technology'
  | 'social';

export interface CausalEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  strength: 'strong' | 'moderate' | 'weak';
  order: 1 | 2 | 3 | 4; // cascade order
  uncertainty?: ConfidenceLevel;
}

export interface CausalGraph {
  nodes: CausalNode[];
  edges: CausalEdge[];
}

export interface CascadeEffect {
  id: string;
  order: 1 | 2 | 3 | 4;
  label: string;
  description: string;
  cause: string;
  effect: string;
  confidence: Confidence;
  timeHorizon: string;
  category: CausalNodeCategory;
}

export interface UnknownConsequence {
  id: string;
  question: string;
  consequence: string;
  whyItMatters: string;
  causalPath: string[];
  confidence: Confidence;
  potentialImpact: 'high' | 'medium' | 'low';
  category: CausalNodeCategory;
}

export interface DiscoveredQuestion {
  id: string;
  question: string;
  category: 'critical' | 'high-impact' | 'strategic' | 'environmental' | 'economic' | 'operational' | 'long-term' | 'low-confidence';
  whyRaised: string;
  confidence: Confidence;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  color: string;
  assumptions: ScenarioAssumption[];
  outcomes: ScenarioOutcome[];
  riskLevel: RiskSeverity;
  confidence: Confidence;
  estimatedCost?: string;
  estimatedTimeline?: string;
  recommended?: boolean;
}

export interface ScenarioAssumption {
  id: string;
  label: string;
  value: string;
  delta: number; // percent change from baseline
  category: CausalNodeCategory;
}

export interface ScenarioOutcome {
  id: string;
  category: CausalNodeCategory;
  label: string;
  value: string;
  delta: number;
  confidence: Confidence;
}

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  likelihood: RiskLikelihood;
  uncertainty: ConfidenceLevel;
  timeHorizon: string;
  affectedSystems: string[];
  cause: string;
  cascade: string[];
  type: 'top' | 'emerging' | 'hidden' | 'systemic' | 'low-confidence';
}

export interface OptimizationOption {
  id: string;
  name: string;
  description: string;
  objectiveScore: number;
  tradeoffs: string[];
  expectedOutcomes: string[];
  riskLevel: RiskSeverity;
  uncertainty: Confidence;
  constraints: string[];
  recommended: boolean;
  reasoning: string;
}

export interface OptimizationModel {
  objective: string;
  constraints: string[];
  options: OptimizationOption[];
  sensitivityNote: string;
}

export interface LocationData {
  id: string;
  name: string;
  region: string;
  population: string;
  infrastructure: string;
  accessibility: string;
  environment: string;
  risk: RiskSeverity;
  constraints: string[];
  availableData: { label: string; status: DataSourceStatus; provenance: DataProvenance }[];
  coordinates: { x: number; y: number };
}

export interface DataSource {
  id: string;
  label: string;
  category: string;
  status: DataSourceStatus;
  provenance: DataProvenance;
  lastUpdated: string;
  coverage: string;
}

export interface DecisionProject {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: 'analyzing' | 'complete' | 'draft' | 'reviewing';
  riskLevel: RiskSeverity;
  lastUpdated: string;
  version: number;
  scenarioCount: number;
  confidence: Confidence;
}

export interface AnalysisStage {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
  description: string;
}

export interface DecisionReport {
  decision: string;
  executiveSummary: string;
  keyFindings: string[];
  importantConsequences: string[];
  questionsNotAsked: string[];
  risks: string[];
  alternatives: string[];
  simulationResults: string[];
  optimalOption: string;
  assumptions: string[];
  uncertainties: string[];
  dataSources: string[];
  nextActions: string[];
}

export interface SystemStatusItem {
  label: string;
  status: 'online' | 'active' | 'ready' | 'warning' | 'offline';
  detail: string;
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  type: 'analysis' | 'discovery' | 'simulation' | 'optimization' | 'risk' | 'report' | 'manual';
  description: string;
  actor: 'system' | 'user';
  view?: ViewId;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  category: string;
  summary: string;
  confidence: Confidence;
  provenance: DataProvenance;
  relatedNodes: string[];
  lastUpdated: string;
}

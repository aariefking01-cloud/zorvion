import type {
  CausalGraph,
  CascadeEffect,
  UnknownConsequence,
  DiscoveredQuestion,
  Scenario,
  RiskItem,
  OptimizationModel,
  LocationData,
  DataSource,
  DecisionProject,
  DecisionReport,
  ActivityEntry,
  KnowledgeEntry,
  SystemStatusItem,
} from '@/types';

export const DEMO_DECISION = 'Should we build a new highway connecting the eastern industrial district to the city center?';

export const SYSTEM_STATUS: SystemStatusItem[] = [
  { label: 'ZORVION CORE', status: 'online', detail: 'Online' },
  { label: 'CAUSAL ENGINE', status: 'active', detail: 'Processing' },
  { label: 'SIMULATION', status: 'ready', detail: 'Ready' },
  { label: 'OPTIMIZATION', status: 'ready', detail: 'Ready' },
  { label: 'DATA SYNC', status: 'online', detail: 'Synced 2m ago' },
  { label: 'VOICE', status: 'ready', detail: 'Ready' },
];

export const CAUSAL_GRAPH: CausalGraph = {
  nodes: [
    { id: 'highway', label: 'New Highway', category: 'transport', x: 400, y: 80, description: 'Proposed 12km highway connecting industrial district to city center', isRoot: true },
    { id: 'traffic', label: 'Traffic Flow', category: 'transport', x: 200, y: 180, description: 'Changes to regional traffic patterns and congestion' },
    { id: 'land-value', label: 'Land Value', category: 'economy', x: 600, y: 180, description: 'Property values along highway corridor' },
    { id: 'development', label: 'Development', category: 'infrastructure', x: 680, y: 300, description: 'New commercial and residential construction' },
    { id: 'population', label: 'Population Shift', category: 'population', x: 550, y: 420, description: 'In-migration to newly accessible areas' },
    { id: 'emissions', label: 'Emissions', category: 'environment', x: 150, y: 300, description: 'Vehicle emissions and air quality impact' },
    { id: 'water-demand', label: 'Water Demand', category: 'water', x: 420, y: 520, description: 'Increased water infrastructure demand' },
    { id: 'energy-demand', label: 'Energy Demand', category: 'energy', x: 720, y: 440, description: 'Electricity consumption growth' },
    { id: 'infra-pressure', label: 'Infrastructure Pressure', category: 'infrastructure', x: 300, y: 440, description: 'Strain on existing public services' },
    { id: 'health-impact', label: 'Health Impact', category: 'health', x: 80, y: 420, description: 'Respiratory and public health effects' },
    { id: 'econ-growth', label: 'Economic Growth', category: 'economy', x: 800, y: 200, description: 'Regional economic activity and employment' },
    { id: 'congestion-shift', label: 'Congestion Shift', category: 'transport', x: 100, y: 200, description: 'Traffic displaced to neighboring districts', isDiscovered: true, uncertainty: 'moderate' },
    { id: 'emergency-response', label: 'Emergency Response', category: 'health', x: 200, y: 540, description: 'Ambulance and emergency service access', riskLevel: 'high', uncertainty: 'low' },
    { id: 'noise', label: 'Noise Pollution', category: 'environment', x: 50, y: 340, description: 'Noise levels in adjacent residential areas' },
    { id: 'biodiversity', label: 'Biodiversity', category: 'environment', x: 850, y: 380, description: 'Habitat fragmentation from construction', uncertainty: 'moderate' },
  ],
  edges: [
    { id: 'e1', from: 'highway', to: 'traffic', label: 'alters', strength: 'strong', order: 1 },
    { id: 'e2', from: 'highway', to: 'land-value', label: 'increases', strength: 'strong', order: 1 },
    { id: 'e3', from: 'highway', to: 'congestion-shift', label: 'displaces', strength: 'moderate', order: 1, uncertainty: 'moderate' },
    { id: 'e4', from: 'highway', to: 'emissions', label: 'produces', strength: 'moderate', order: 1 },
    { id: 'e5', from: 'highway', to: 'noise', label: 'generates', strength: 'moderate', order: 1 },
    { id: 'e6', from: 'traffic', to: 'emissions', label: 'contributes', strength: 'strong', order: 2 },
    { id: 'e7', from: 'land-value', to: 'development', label: 'drives', strength: 'strong', order: 2 },
    { id: 'e8', from: 'development', to: 'population', label: 'attracts', strength: 'moderate', order: 2 },
    { id: 'e9', from: 'development', to: 'energy-demand', label: 'requires', strength: 'strong', order: 2 },
    { id: 'e10', from: 'population', to: 'water-demand', label: 'increases', strength: 'strong', order: 3 },
    { id: 'e11', from: 'population', to: 'infra-pressure', label: 'stresses', strength: 'strong', order: 3 },
    { id: 'e12', from: 'infra-pressure', to: 'emergency-response', label: 'impairs', strength: 'moderate', order: 3 },
    { id: 'e13', from: 'emissions', to: 'health-impact', label: 'causes', strength: 'strong', order: 3 },
    { id: 'e14', from: 'land-value', to: 'econ-growth', label: 'stimulates', strength: 'moderate', order: 2 },
    { id: 'e15', from: 'development', to: 'biodiversity', label: 'reduces', strength: 'weak', order: 3, uncertainty: 'moderate' },
    { id: 'e16', from: 'congestion-shift', to: 'infra-pressure', label: 'compounds', strength: 'moderate', order: 2, uncertainty: 'moderate' },
  ],
};

export const CASCADE_EFFECTS: CascadeEffect[] = [
  {
    id: 'c1', order: 1, label: 'Altered Traffic Flow', description: 'Highway redirects 35% of freight and commuter traffic from existing routes',
    cause: 'New Highway', effect: 'Reduced central congestion, increased corridor traffic',
    confidence: { level: 'high', percentage: 82 }, timeHorizon: '0–6 months', category: 'transport',
  },
  {
    id: 'c2', order: 1, label: 'Land Value Increase', description: 'Properties within 2km of highway access points see 15–25% value increase',
    cause: 'New Highway', effect: 'Land speculation and development pressure',
    confidence: { level: 'high', percentage: 78 }, timeHorizon: '0–12 months', category: 'economy',
  },
  {
    id: 'c3', order: 2, label: 'Accelerated Development', description: 'Commercial and residential construction accelerates along corridor',
    cause: 'Land Value Increase', effect: 'New housing, retail, and industrial zones',
    confidence: { level: 'moderate', percentage: 64 }, timeHorizon: '1–3 years', category: 'infrastructure',
  },
  {
    id: 'c4', order: 2, label: 'Congestion Displacement', description: 'Traffic shifts to neighboring districts not served by the highway',
    cause: 'Altered Traffic Flow', effect: 'Increased local congestion in adjacent areas',
    confidence: { level: 'moderate', percentage: 58 }, timeHorizon: '6–18 months', category: 'transport',
  },
  {
    id: 'c5', order: 3, label: 'Population In-Migration', description: 'New residents attracted by accessibility and employment',
    cause: 'Accelerated Development', effect: 'Population growth of 8–15% in corridor zone',
    confidence: { level: 'moderate', percentage: 55 }, timeHorizon: '2–5 years', category: 'population',
  },
  {
    id: 'c6', order: 3, label: 'Infrastructure Strain', description: 'Water, power, and public services face demand beyond original capacity',
    cause: 'Population In-Migration', effect: 'Service quality degradation without additional investment',
    confidence: { level: 'high', percentage: 74 }, timeHorizon: '2–5 years', category: 'infrastructure',
  },
  {
    id: 'c7', order: 4, label: 'Emergency Response Degradation', description: 'Ambulance and fire response times increase in displaced-traffic zones',
    cause: 'Infrastructure Strain', effect: 'Public safety risk in adjacent neighborhoods',
    confidence: { level: 'moderate', percentage: 61 }, timeHorizon: '3–7 years', category: 'health',
  },
  {
    id: 'c8', order: 4, label: 'Long-Term Emissions Growth', description: 'Induced demand from development offsets initial traffic efficiency gains',
    cause: 'Accelerated Development', effect: 'Net emissions increase after 5–8 years',
    confidence: { level: 'low', percentage: 42 }, timeHorizon: '5–10 years', category: 'environment',
  },
];

export const UNKNOWN_CONSEQUENCES: UnknownConsequence[] = [
  {
    id: 'uc1',
    question: 'Could the highway shift congestion into neighboring districts that lack the infrastructure to absorb it?',
    consequence: 'Traffic displacement may overwhelm local roads in adjacent residential areas, degrading emergency response times.',
    whyItMatters: 'Neighboring districts were not included in the original traffic model. Their road capacity is significantly lower than the central corridor.',
    causalPath: ['New Highway', 'Altered Traffic Flow', 'Congestion Displacement', 'Infrastructure Strain', 'Emergency Response Degradation'],
    confidence: { level: 'moderate', percentage: 61 },
    potentialImpact: 'high',
    category: 'transport',
  },
  {
    id: 'uc2',
    question: 'Will induced demand from corridor development eventually offset the traffic efficiency the highway was built to provide?',
    consequence: 'Within 5–8 years, new development may generate enough traffic to return congestion to pre-highway levels.',
    whyItMatters: 'The economic case for the highway assumes sustained traffic reduction. Induced demand is a well-documented phenomenon in transportation planning.',
    causalPath: ['New Highway', 'Land Value Increase', 'Accelerated Development', 'Population Shift', 'Long-Term Emissions Growth'],
    confidence: { level: 'low', percentage: 42 },
    potentialImpact: 'high',
    category: 'economy',
  },
  {
    id: 'uc3',
    question: 'How will increased water demand from corridor development affect the regional water system already operating near capacity?',
    consequence: 'Population growth may push water infrastructure beyond its design capacity during peak demand periods.',
    whyItMatters: 'The regional water system is currently at 87% capacity. The highway corridor development was not included in the latest water infrastructure master plan.',
    causalPath: ['New Highway', 'Land Value Increase', 'Accelerated Development', 'Population Shift', 'Water Demand'],
    confidence: { level: 'moderate', percentage: 58 },
    potentialImpact: 'medium',
    category: 'water',
  },
  {
    id: 'uc4',
    question: 'Could habitat fragmentation from highway construction disrupt wildlife corridors that are not currently mapped?',
    consequence: 'Undocumented wildlife movement patterns may be severed, affecting local biodiversity in ways not captured in the environmental assessment.',
    whyItMatters: 'The environmental impact study surveyed only major species. Smaller wildlife corridors and seasonal migration patterns may be overlooked.',
    causalPath: ['New Highway', 'Accelerated Development', 'Biodiversity Loss'],
    confidence: { level: 'low', percentage: 38 },
    potentialImpact: 'medium',
    category: 'environment',
  },
];

export const DISCOVERED_QUESTIONS: DiscoveredQuestion[] = [
  {
    id: 'q1', question: 'What happens to emergency response times in districts adjacent to the highway corridor?',
    category: 'critical', whyRaised: 'Traffic displacement analysis reveals a causal chain leading to infrastructure strain in neighboring areas.',
    confidence: { level: 'moderate', percentage: 61 },
  },
  {
    id: 'q2', question: 'Will the economic benefits be distributed equitably across affected communities?',
    category: 'high-impact', whyRaised: 'Land value increases tend to benefit property owners while displacement affects renters disproportionately.',
    confidence: { level: 'moderate', percentage: 55 },
  },
  {
    id: 'q3', question: 'How does this decision interact with the existing 10-year regional transportation plan?',
    category: 'strategic', whyRaised: 'The highway corridor overlaps with two planned light rail routes that have not been reconciled.',
    confidence: { level: 'high', percentage: 72 },
  },
  {
    id: 'q4', question: 'What is the long-term carbon footprint including induced demand effects?',
    category: 'environmental', whyRaised: 'Initial emissions models do not account for development-driven traffic generation beyond year 3.',
    confidence: { level: 'low', percentage: 42 },
  },
  {
    id: 'q5', question: 'Will construction-phase disruption cause business closures along the corridor?',
    category: 'economic', whyRaised: 'Similar highway projects have shown 8–12% business attrition during construction in affected zones.',
    confidence: { level: 'moderate', percentage: 58 },
  },
  {
    id: 'q6', question: 'How will the highway affect public transit ridership and fare revenue?',
    category: 'operational', whyRaised: 'Improved car travel times historically reduce transit ridership, affecting municipal transit budgets.',
    confidence: { level: 'moderate', percentage: 64 },
  },
  {
    id: 'q7', question: 'What are the effects on community cohesion in neighborhoods bisected by the highway?',
    category: 'long-term', whyRaised: 'Highway construction has been shown to sever social networks in divided neighborhoods for decades.',
    confidence: { level: 'moderate', percentage: 55 },
  },
  {
    id: 'q8', question: 'Are there unmapped seasonal wildlife corridors that construction would disrupt?',
    category: 'low-confidence', whyRaised: 'The environmental assessment surveyed only major species during a single season.',
    confidence: { level: 'low', percentage: 38 },
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 's0', name: 'Baseline', description: 'Current conditions without highway construction', color: '#6b7280',
    assumptions: [
      { id: 'a1', label: 'Population Growth', value: '0%', delta: 0, category: 'population' },
      { id: 'a2', label: 'Traffic Demand', value: 'Current', delta: 0, category: 'transport' },
      { id: 'a3', label: 'Energy Price', value: 'Current', delta: 0, category: 'economy' },
    ],
    outcomes: [
      { id: 'o1', category: 'transport', label: 'Central Congestion', value: 'Severe', delta: 0, confidence: { level: 'high', percentage: 85 } },
      { id: 'o2', category: 'economy', label: 'Regional GDP Impact', value: 'Stagnant', delta: 0, confidence: { level: 'high', percentage: 80 } },
      { id: 'o3', category: 'environment', label: 'Emissions', value: 'Growing', delta: 0, confidence: { level: 'moderate', percentage: 70 } },
    ],
    riskLevel: 'medium', confidence: { level: 'high', percentage: 80 },
  },
  {
    id: 's1', name: 'Option A: Standard Highway', description: '12km highway with 4 lanes, 3 access points, no transit integration', color: '#4a9eff',
    assumptions: [
      { id: 'a1', label: 'Population Growth', value: '+8%', delta: 8, category: 'population' },
      { id: 'a2', label: 'Traffic Demand', value: '+15%', delta: 15, category: 'transport' },
      { id: 'a3', label: 'Construction Cost', value: '$420M', delta: 0, category: 'economy' },
    ],
    outcomes: [
      { id: 'o1', category: 'transport', label: 'Central Congestion', value: 'Reduced 30%', delta: -30, confidence: { level: 'high', percentage: 78 } },
      { id: 'o2', category: 'economy', label: 'Regional GDP Impact', value: '+2.1%', delta: 21, confidence: { level: 'moderate', percentage: 64 } },
      { id: 'o3', category: 'environment', label: 'Emissions', value: '+12% (induced)', delta: 12, confidence: { level: 'low', percentage: 42 } },
      { id: 'o4', category: 'health', label: 'Adjacent District Risk', value: 'Elevated', delta: 35, confidence: { level: 'moderate', percentage: 61 } },
    ],
    riskLevel: 'high', confidence: { level: 'moderate', percentage: 58 },
    estimatedCost: '$420M', estimatedTimeline: '3 years',
  },
  {
    id: 's2', name: 'Option B: Highway + Transit', description: 'Highway with integrated bus rapid transit and dedicated lanes', color: '#2dd4cf',
    assumptions: [
      { id: 'a1', label: 'Population Growth', value: '+8%', delta: 8, category: 'population' },
      { id: 'a2', label: 'Traffic Demand', value: '+10%', delta: 10, category: 'transport' },
      { id: 'a3', label: 'Construction Cost', value: '$580M', delta: 0, category: 'economy' },
      { id: 'a4', label: 'Transit Integration', value: 'BRT + Park-Ride', delta: 0, category: 'transport' },
    ],
    outcomes: [
      { id: 'o1', category: 'transport', label: 'Central Congestion', value: 'Reduced 38%', delta: -38, confidence: { level: 'high', percentage: 75 } },
      { id: 'o2', category: 'economy', label: 'Regional GDP Impact', value: '+2.8%', delta: 28, confidence: { level: 'moderate', percentage: 68 } },
      { id: 'o3', category: 'environment', label: 'Emissions', value: '+4% (net)', delta: 4, confidence: { level: 'moderate', percentage: 55 } },
      { id: 'o4', category: 'health', label: 'Adjacent District Risk', value: 'Moderate', delta: 15, confidence: { level: 'moderate', percentage: 58 } },
    ],
    riskLevel: 'medium', confidence: { level: 'moderate', percentage: 66 },
    estimatedCost: '$580M', estimatedTimeline: '4 years', recommended: true,
  },
  {
    id: 's3', name: 'Option C: Light Rail Only', description: 'No highway. Light rail corridor with transit-oriented development', color: '#a78bfa',
    assumptions: [
      { id: 'a1', label: 'Population Growth', value: '+8%', delta: 8, category: 'population' },
      { id: 'a2', label: 'Traffic Demand', value: '+5%', delta: 5, category: 'transport' },
      { id: 'a3', label: 'Construction Cost', value: '$720M', delta: 0, category: 'economy' },
      { id: 'a4', label: 'Transit Mode Shift', value: '18% of trips', delta: 18, category: 'transport' },
    ],
    outcomes: [
      { id: 'o1', category: 'transport', label: 'Central Congestion', value: 'Reduced 22%', delta: -22, confidence: { level: 'moderate', percentage: 62 } },
      { id: 'o2', category: 'economy', label: 'Regional GDP Impact', value: '+3.4%', delta: 34, confidence: { level: 'moderate', percentage: 60 } },
      { id: 'o3', category: 'environment', label: 'Emissions', value: '-8% (net)', delta: -8, confidence: { level: 'moderate', percentage: 58 } },
      { id: 'o4', category: 'health', label: 'Adjacent District Risk', value: 'Low', delta: -5, confidence: { level: 'high', percentage: 72 } },
    ],
    riskLevel: 'low', confidence: { level: 'moderate', percentage: 60 },
    estimatedCost: '$720M', estimatedTimeline: '5 years',
  },
];

export const RISKS: RiskItem[] = [
  {
    id: 'r1', title: 'Emergency Response Degradation', description: 'Traffic displacement into adjacent districts may increase ambulance and fire response times beyond acceptable thresholds.',
    severity: 'high', likelihood: 'likely', uncertainty: 'low', timeHorizon: '2–5 years',
    affectedSystems: ['Emergency Services', 'Public Safety', 'Healthcare Access'],
    cause: 'Congestion displacement from highway traffic redistribution',
    cascade: ['Highway', 'Traffic Displacement', 'Infrastructure Strain', 'Emergency Response'],
    type: 'top',
  },
  {
    id: 'r2', title: 'Induced Demand Erosion', description: 'Development along the corridor may generate new traffic that erodes the highway\'s congestion benefits within 5–8 years.',
    severity: 'high', likelihood: 'possible', uncertainty: 'moderate', timeHorizon: '5–10 years',
    affectedSystems: ['Transportation', 'Environment', 'Economic Planning'],
    cause: 'Land value increase driving accelerated development and population growth',
    cascade: ['Highway', 'Land Value', 'Development', 'Population', 'Induced Traffic'],
    type: 'emerging',
  },
  {
    id: 'r3', title: 'Water System Capacity Exceeded', description: 'Regional water infrastructure at 87% capacity may be pushed beyond design limits by corridor population growth.',
    severity: 'critical', likelihood: 'possible', uncertainty: 'moderate', timeHorizon: '3–7 years',
    affectedSystems: ['Water Infrastructure', 'Public Health', 'Urban Planning'],
    cause: 'Population growth from corridor development not included in water master plan',
    cascade: ['Highway', 'Development', 'Population', 'Water Demand', 'Capacity Exceeded'],
    type: 'hidden',
  },
  {
    id: 'r4', title: 'Community Severance', description: 'Neighborhoods bisected by the highway may experience long-term social network disruption and reduced cohesion.',
    severity: 'medium', likelihood: 'likely', uncertainty: 'moderate', timeHorizon: '10+ years',
    affectedSystems: ['Social Fabric', 'Community Health', 'Property Values'],
    cause: 'Physical barrier created by highway infrastructure through existing neighborhoods',
    cascade: ['Highway', 'Physical Division', 'Social Disruption', 'Community Decline'],
    type: 'systemic',
  },
  {
    id: 'r5', title: 'Unmapped Wildlife Corridor Disruption', description: 'Seasonal wildlife movement patterns not captured in the environmental assessment may be severed.',
    severity: 'medium', likelihood: 'unlikely', uncertainty: 'very-low', timeHorizon: 'Immediate + long-term',
    affectedSystems: ['Biodiversity', 'Ecosystem Services', 'Conservation'],
    cause: 'Construction through areas with incomplete ecological survey data',
    cascade: ['Highway', 'Construction', 'Habitat Fragmentation', 'Biodiversity Loss'],
    type: 'low-confidence',
  },
  {
    id: 'r6', title: 'Construction-Phase Business Attrition', description: 'Small businesses along the construction corridor may close due to access disruption.',
    severity: 'medium', likelihood: 'likely', uncertainty: 'low', timeHorizon: '0–3 years',
    affectedSystems: ['Local Economy', 'Employment', 'Community Stability'],
    cause: 'Extended construction period reducing customer access to corridor businesses',
    cascade: ['Construction', 'Access Disruption', 'Revenue Loss', 'Business Closure'],
    type: 'top',
  },
];

export const OPTIMIZATION_MODEL: OptimizationModel = {
  objective: 'Maximize regional economic benefit while minimizing environmental impact and infrastructure risk',
  constraints: [
    'Budget ceiling: $750M',
    'Construction timeline: ≤ 5 years',
    'Emissions target: ≤ 5% net increase',
    'Emergency response: No degradation beyond 10%',
    'Transit ridership: Must not decrease',
  ],
  options: [
    {
      id: 'opt1', name: 'Option B: Highway + Transit', description: 'Highway with integrated bus rapid transit and dedicated lanes',
      objectiveScore: 78,
      tradeoffs: ['Higher upfront cost ($580M vs $420M)', 'Longer construction (4 vs 3 years)', 'Reduces induced demand risk', 'Maintains transit ridership'],
      expectedOutcomes: ['38% congestion reduction', '+2.8% GDP growth', '4% net emissions increase', 'Moderate adjacent district risk'],
      riskLevel: 'medium', uncertainty: { level: 'moderate', percentage: 66 },
      constraints: ['Within budget', 'Within timeline', 'Meets emissions target', 'Marginal emergency response impact'],
      recommended: true,
      reasoning: 'Option B performs best under current assumptions. It balances economic benefit with environmental and social risk. The transit integration reduces induced demand risk and maintains ridership, addressing two of the most significant discovered consequences.',
    },
    {
      id: 'opt2', name: 'Option C: Light Rail Only', description: 'No highway. Light rail corridor with transit-oriented development',
      objectiveScore: 72,
      tradeoffs: ['Highest cost ($720M)', 'Longest timeline (5 years)', 'Lowest emissions impact', 'Lower congestion reduction'],
      expectedOutcomes: ['22% congestion reduction', '+3.4% GDP growth', '-8% net emissions', 'Low adjacent district risk'],
      riskLevel: 'low', uncertainty: { level: 'moderate', percentage: 60 },
      constraints: ['Within budget', 'At timeline limit', 'Exceeds emissions target', 'No emergency response impact'],
      recommended: false,
      reasoning: 'Option C has the strongest environmental profile and lowest risk, but provides less congestion relief. If environmental constraints are weighted more heavily, this option becomes competitive.',
    },
    {
      id: 'opt3', name: 'Option A: Standard Highway', description: '12km highway with 4 lanes, 3 access points, no transit integration',
      objectiveScore: 54,
      tradeoffs: ['Lowest cost ($420M)', 'Fastest construction (3 years)', 'Highest induced demand risk', 'Highest adjacent district risk'],
      expectedOutcomes: ['30% congestion reduction', '+2.1% GDP growth', '12% emissions increase (induced)', 'Elevated adjacent district risk'],
      riskLevel: 'high', uncertainty: { level: 'moderate', percentage: 58 },
      constraints: ['Within budget', 'Within timeline', 'Exceeds emissions target', 'Violates emergency response constraint'],
      recommended: false,
      reasoning: 'Option A is the cheapest and fastest but carries the highest risk profile. It violates two constraints and is most vulnerable to induced demand erosion. Not recommended under current assumptions.',
    },
  ],
  sensitivityNote: 'Recommendation is sensitive to the emissions constraint weight. If the emissions target is relaxed to 10%, Option A becomes viable. If tightened to 0%, only Option C satisfies all constraints.',
};

export const LOCATIONS: LocationData[] = [
  {
    id: 'loc1', name: 'Eastern Industrial District', region: 'Corridor Zone A',
    population: '42,000', infrastructure: 'Moderate — industrial roads, limited transit',
    accessibility: 'Low — single arterial connection to city center',
    environment: 'Mixed industrial/residential, moderate air quality',
    risk: 'high',
    constraints: ['Industrial zoning limits', 'Existing rail crossing', 'Contaminated soil zones'],
    availableData: [
      { label: 'Traffic Flow', status: 'updated', provenance: 'real' },
      { label: 'Population Census', status: 'updated', provenance: 'real' },
      { label: 'Air Quality Sensors', status: 'live', provenance: 'real' },
      { label: 'Soil Contamination', status: 'stale', provenance: 'estimated' },
    ],
    coordinates: { x: 720, y: 280 },
  },
  {
    id: 'loc2', name: 'City Center', region: 'Central Zone',
    population: '185,000', infrastructure: 'High — dense road network, full transit coverage',
    accessibility: 'High — multiple access routes, transit hub',
    environment: 'Urban core, elevated noise and emissions',
    risk: 'medium',
    constraints: ['Historic district protections', 'Density limits', 'Transit right-of-way'],
    availableData: [
      { label: 'Traffic Flow', status: 'live', provenance: 'real' },
      { label: 'Population Census', status: 'updated', provenance: 'real' },
      { label: 'Transit Ridership', status: 'live', provenance: 'real' },
      { label: 'Air Quality', status: 'live', provenance: 'real' },
    ],
    coordinates: { x: 280, y: 320 },
  },
  {
    id: 'loc3', name: 'Northgate Residential', region: 'Adjacent Zone B',
    population: '68,000', infrastructure: 'Low — residential streets, no highway access',
    accessibility: 'Low — local roads only, limited transit',
    environment: 'Residential, good air quality, green space',
    risk: 'high',
    constraints: ['School zones', 'Low-density zoning', 'Community opposition'],
    availableData: [
      { label: 'Traffic Flow', status: 'updated', provenance: 'real' },
      { label: 'Population', status: 'updated', provenance: 'real' },
      { label: 'Emergency Response Times', status: 'stale', provenance: 'estimated' },
      { label: 'Air Quality', status: 'unavailable', provenance: 'synthetic' },
    ],
    coordinates: { x: 400, y: 180 },
  },
  {
    id: 'loc4', name: 'Riverside Industrial', region: 'Corridor Zone B',
    population: '24,000', infrastructure: 'Moderate — industrial, river port access',
    accessibility: 'Moderate — river crossing, industrial road',
    environment: 'Riverside, flood risk, industrial contamination',
    risk: 'critical',
    constraints: ['Floodplain', 'Wetland protection', 'Port operations'],
    availableData: [
      { label: 'Flood Risk Maps', status: 'updated', provenance: 'real' },
      { label: 'Traffic', status: 'stale', provenance: 'estimated' },
      { label: 'Water Quality', status: 'updated', provenance: 'real' },
      { label: 'Soil Data', status: 'unavailable', provenance: 'synthetic' },
    ],
    coordinates: { x: 560, y: 420 },
  },
];

export const DATA_SOURCES: DataSource[] = [
  { id: 'ds1', label: 'Traffic Flow Sensors', category: 'Transport', status: 'live', provenance: 'real', lastUpdated: 'Live stream', coverage: 'Central + Corridor A' },
  { id: 'ds2', label: 'Population Census', category: 'Demographics', status: 'updated', provenance: 'real', lastUpdated: '3 months ago', coverage: 'All zones' },
  { id: 'ds3', label: 'Air Quality Network', category: 'Environment', status: 'live', provenance: 'real', lastUpdated: 'Live stream', coverage: 'Central + Industrial' },
  { id: 'ds4', label: 'Water Infrastructure Capacity', category: 'Infrastructure', status: 'updated', provenance: 'real', lastUpdated: '1 month ago', coverage: 'Regional' },
  { id: 'ds5', label: 'Emergency Response Logs', category: 'Public Safety', status: 'stale', provenance: 'estimated', lastUpdated: '8 months ago', coverage: 'Central only' },
  { id: 'ds6', label: 'Economic Activity Index', category: 'Economy', status: 'updated', provenance: 'model-output', lastUpdated: '2 weeks ago', coverage: 'Regional' },
  { id: 'ds7', label: 'Wildlife Corridor Survey', category: 'Environment', status: 'unavailable', provenance: 'synthetic', lastUpdated: 'Never surveyed', coverage: 'Corridor only' },
  { id: 'ds8', label: 'Transit Ridership', category: 'Transport', status: 'live', provenance: 'real', lastUpdated: 'Live stream', coverage: 'Central + North' },
];

export const DECISION_HISTORY: DecisionProject[] = [
  {
    id: 'd1', title: 'Highway Corridor Analysis', description: DEMO_DECISION,
    location: 'Eastern Industrial District → City Center', date: '2026-09-08',
    status: 'complete', riskLevel: 'high', lastUpdated: '2 hours ago',
    version: 3, scenarioCount: 4, confidence: { level: 'moderate', percentage: 66 },
  },
  {
    id: 'd2', title: 'Hospital Site Selection', description: 'Should we build a new regional hospital at the Northgate site?',
    location: 'Northgate Residential', date: '2026-09-02',
    status: 'complete', riskLevel: 'medium', lastUpdated: '5 days ago',
    version: 2, scenarioCount: 3, confidence: { level: 'moderate', percentage: 71 },
  },
  {
    id: 'd3', title: 'Data Center Location', description: 'Where should we locate a new 50MW data center facility?',
    location: 'Riverside Industrial', date: '2026-08-28',
    status: 'reviewing', riskLevel: 'critical', lastUpdated: '1 week ago',
    version: 1, scenarioCount: 2, confidence: { level: 'low', percentage: 48 },
  },
  {
    id: 'd4', title: 'Policy Change: Emission Standards', description: 'What happens if we tighten vehicle emission standards by 30%?',
    location: 'Regional', date: '2026-08-15',
    status: 'complete', riskLevel: 'low', lastUpdated: '3 weeks ago',
    version: 2, scenarioCount: 3, confidence: { level: 'high', percentage: 78 },
  },
];

export const ANALYSIS_STAGES = [
  { id: 's1', label: 'Understanding Decision', status: 'complete' as const, description: 'Parsing decision context and scope' },
  { id: 's2', label: 'Identifying Variables', status: 'complete' as const, description: 'Extracting relevant system variables' },
  { id: 's3', label: 'Connecting Causes', status: 'complete' as const, description: 'Building causal relationship model' },
  { id: 's4', label: 'Exploring Cascades', status: 'complete' as const, description: 'Tracing effect chains across orders' },
  { id: 's5', label: 'Discovering Overlooked Consequences', status: 'complete' as const, description: 'Identifying unasked questions' },
  { id: 's6', label: 'Generating Futures', status: 'complete' as const, description: 'Creating scenario projections' },
  { id: 's7', label: 'Evaluating Risk', status: 'complete' as const, description: 'Assessing severity and likelihood' },
  { id: 's8', label: 'Optimizing Alternatives', status: 'complete' as const, description: 'Comparing options under constraints' },
];

export const ACTIVITY_LOG: ActivityEntry[] = [
  { id: 'a1', timestamp: '2h ago', type: 'analysis', description: 'Highway Corridor Analysis v3 completed — 4 scenarios, 6 risks identified', actor: 'system', view: 'decisions' },
  { id: 'a2', timestamp: '2h ago', type: 'discovery', description: 'Discovered: Congestion displacement into adjacent districts', actor: 'system', view: 'consequences' },
  { id: 'a3', timestamp: '2h ago', type: 'optimization', description: 'Optimization complete — Option B recommended under current constraints', actor: 'system', view: 'optimization' },
  { id: 'a4', timestamp: '3h ago', type: 'simulation', description: 'Simulation run: Population +20% scenario added to Highway analysis', actor: 'user', view: 'simulations' },
  { id: 'a5', timestamp: '5h ago', type: 'risk', description: 'New hidden risk identified: Water system capacity exceeded', actor: 'system', view: 'risk' },
  { id: 'a6', timestamp: '1d ago', type: 'report', description: 'Decision report generated for Hospital Site Selection', actor: 'user', view: 'decisions' },
  { id: 'a7', timestamp: '2d ago', type: 'analysis', description: 'Data Center Location analysis updated to v1 — risk level elevated to critical', actor: 'system', view: 'decisions' },
  { id: 'a8', timestamp: '3d ago', type: 'manual', description: 'User modified assumption: Construction cost ceiling adjusted to $750M', actor: 'user', view: 'optimization' },
];

export const KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  { id: 'k1', title: 'Induced Demand in Highway Construction', category: 'Transportation', summary: 'New highway capacity generates additional traffic that can erode congestion benefits within 5–10 years.', confidence: { level: 'high', percentage: 82 }, provenance: 'real', relatedNodes: ['highway', 'traffic', 'development'], lastUpdated: '1 month ago' },
  { id: 'k2', title: 'Community Severance Effects', category: 'Social', summary: 'Highways bisecting neighborhoods cause long-term disruption to social networks and community cohesion.', confidence: { level: 'high', percentage: 78 }, provenance: 'real', relatedNodes: ['highway', 'population', 'infra-pressure'], lastUpdated: '3 months ago' },
  { id: 'k3', title: 'Land Value Capture Near Highway Access', category: 'Economics', summary: 'Property values within 2km of highway access points increase 15–25%, driving speculative development.', confidence: { level: 'high', percentage: 80 }, provenance: 'real', relatedNodes: ['highway', 'land-value', 'development'], lastUpdated: '2 months ago' },
  { id: 'k4', title: 'Water Infrastructure Capacity Margins', category: 'Infrastructure', summary: 'Regional water system operating at 87% capacity with no master plan update for corridor development.', confidence: { level: 'moderate', percentage: 65 }, provenance: 'estimated', relatedNodes: ['water-demand', 'infra-pressure'], lastUpdated: '6 months ago' },
  { id: 'k5', title: 'Emergency Response Time Sensitivity', category: 'Public Safety', summary: 'Response times degrade non-linearly with traffic congestion increases above 15%.', confidence: { level: 'moderate', percentage: 68 }, provenance: 'model-output', relatedNodes: ['emergency-response', 'traffic', 'infra-pressure'], lastUpdated: '8 months ago' },
  { id: 'k6', title: 'Seasonal Wildlife Corridor Patterns', category: 'Environment', summary: 'Incomplete ecological survey data for the highway corridor. Seasonal migration patterns not documented.', confidence: { level: 'low', percentage: 38 }, provenance: 'synthetic', relatedNodes: ['biodiversity', 'development'], lastUpdated: 'Never surveyed' },
];

export const DECISION_REPORT: DecisionReport = {
  decision: DEMO_DECISION,
  executiveSummary: 'The proposed highway reduces central congestion by 30–38% and stimulates regional economic growth of 2.1–2.8%. However, analysis reveals significant overlooked consequences: traffic displacement into adjacent districts risks degrading emergency response times, induced demand may erode benefits within 5–8 years, and corridor development may exceed water infrastructure capacity. Option B (Highway + Transit) is recommended as it balances economic benefit with environmental and social risk while satisfying all defined constraints.',
  keyFindings: [
    'Congestion reduction of 30–38% is likely in the short term (high confidence)',
    'Induced demand may erode benefits within 5–8 years (low confidence)',
    'Traffic displacement into adjacent districts creates elevated public safety risk (moderate confidence)',
    'Regional water system at 87% capacity — corridor growth was not included in master plan (moderate confidence)',
    'Option B satisfies all defined constraints while Option A violates two',
  ],
  importantConsequences: [
    'Emergency response degradation in neighboring districts (2–5 year horizon)',
    'Long-term emissions growth from induced demand (5–10 year horizon)',
    'Water infrastructure capacity exceeded during peak demand (3–7 year horizon)',
    'Community severance in neighborhoods bisected by the highway (10+ year horizon)',
  ],
  questionsNotAsked: [
    'What happens to emergency response times in adjacent districts?',
    'Will induced demand eventually offset the highway\'s congestion benefits?',
    'How will corridor development affect the regional water system already near capacity?',
    'Are there unmapped wildlife corridors that construction would disrupt?',
  ],
  risks: [
    'High: Emergency response degradation in adjacent districts',
    'High: Induced demand erosion of congestion benefits',
    'Critical: Water system capacity exceeded (hidden risk)',
    'Medium: Community severance in bisected neighborhoods',
    'Medium: Construction-phase business attrition',
  ],
  alternatives: [
    'Option A: Standard Highway — $420M, 3 years, highest risk profile',
    'Option B: Highway + Transit — $580M, 4 years, balanced risk-benefit (recommended)',
    'Option C: Light Rail Only — $720M, 5 years, lowest risk, less congestion relief',
  ],
  simulationResults: [
    'Baseline: No change, congestion remains severe',
    'Option A: 30% congestion reduction, 12% emissions increase (induced)',
    'Option B: 38% congestion reduction, 4% net emissions increase',
    'Option C: 22% congestion reduction, -8% net emissions (reduction)',
  ],
  optimalOption: 'Option B: Highway + Transit — best balance of economic benefit, environmental impact, and infrastructure risk under current assumptions.',
  assumptions: [
    'Population growth of 8% in corridor zone over 5 years',
    'Regional water system remains at current capacity',
    'No major policy changes to emission standards',
    'Construction proceeds without significant delays',
    'Transit ridership trends continue at current rates',
  ],
  uncertainties: [
    'Induced demand magnitude: low confidence (42%)',
    'Wildlife corridor impact: very low confidence (38%)',
    'Long-term emissions trajectory: low confidence (42%)',
    'Water capacity threshold timing: moderate confidence (58%)',
  ],
  dataSources: [
    'Traffic Flow Sensors — live, real data (Central + Corridor A)',
    'Population Census — updated 3 months ago, real data (all zones)',
    'Air Quality Network — live, real data (Central + Industrial)',
    'Water Infrastructure Capacity — updated 1 month ago, real data (Regional)',
    'Emergency Response Logs — stale 8 months, estimated (Central only)',
    'Wildlife Corridor Survey — unavailable, synthetic data',
  ],
  nextActions: [
    'Review Option B recommendation with transportation planning team',
    'Commission updated water infrastructure capacity study for corridor zone',
    'Conduct seasonal wildlife corridor survey before final approval',
    'Engage adjacent district communities on traffic displacement mitigation',
    'Update regional transportation plan to reconcile highway with planned light rail',
  ],
};

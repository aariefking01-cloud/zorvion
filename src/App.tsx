import { useState, useEffect, useCallback } from 'react';
import type { ViewId, CoreState } from '@/types';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { CommandPalette } from '@/components/CommandPalette';
import { VoiceControl } from '@/components/VoiceControl';
import { HomeView } from '@/components/views/HomeView';
import { DecisionWorkspace } from '@/components/views/DecisionWorkspace';
import { CausalMapView } from '@/components/views/CausalMapView';
import { ConsequencesView } from '@/components/views/ConsequencesView';
import { ScenarioView } from '@/components/views/ScenarioView';
import { SimulationView } from '@/components/views/SimulationView';
import { RiskView } from '@/components/views/RiskView';
import { OptimizationView } from '@/components/views/OptimizationView';
import { LocationView } from '@/components/views/LocationView';
import { DecisionsView } from '@/components/views/DecisionsView';
import { ActivityView } from '@/components/views/ActivityView';
import { KnowledgeView } from '@/components/views/KnowledgeView';
import { SettingsView } from '@/components/views/SettingsView';

function App() {
  const [activeView, setActiveView] = useState<ViewId>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [coreState, setCoreState] = useState<CoreState>('IDLE');
  const [analysisMode, setAnalysisMode] = useState(false);

  const handleNavigate = useCallback((view: ViewId) => {
    setActiveView(view);
    setAnalysisMode(false);
  }, []);

  const handleStartAnalysis = useCallback(() => {
    setAnalysisMode(true);
    setActiveView('home');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(o => !o);
      }
      if (e.key === 'Escape') {
        setCommandOpen(false);
        setVoiceActive(false);
        if (focusMode) setFocusMode(false);
      }
      if (e.key === 'f' && !commandOpen && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setFocusMode(f => !f);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandOpen, focusMode]);

  const coreStateLabel = coreState === 'IDLE' ? 'Idle' : coreState.charAt(0) + coreState.slice(1).toLowerCase();

  const renderView = () => {
    if (analysisMode) {
      return <DecisionWorkspace onNavigate={handleNavigate} onSetCoreState={setCoreState} />;
    }

    switch (activeView) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} onStartAnalysis={handleStartAnalysis} coreState={coreState} />;
      case 'decisions':
        return <DecisionsView />;
      case 'scenarios':
        return <ScenarioView />;
      case 'causal-map':
        return <CausalMapView />;
      case 'consequences':
        return <ConsequencesView />;
      case 'simulations':
        return <SimulationView />;
      case 'optimization':
        return <OptimizationView />;
      case 'risk':
        return <RiskView />;
      case 'knowledge':
        return <KnowledgeView />;
      case 'activity':
        return <ActivityView onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsView />;
      case 'location':
        return <LocationView />;
      default:
        return <HomeView onNavigate={handleNavigate} onStartAnalysis={handleStartAnalysis} coreState={coreState} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--z-base)]">
      {/* Sidebar */}
      {!focusMode && (
        <Sidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        {!focusMode && (
          <TopBar
            onOpenCommand={() => setCommandOpen(true)}
            onToggleVoice={() => setVoiceActive(v => !v)}
            onToggleFocus={() => setFocusMode(f => !f)}
            focusMode={focusMode}
            voiceActive={voiceActive}
            coreStateLabel={coreStateLabel}
          />
        )}

        {/* Focus mode bar */}
        {focusMode && (
          <div className="flex items-center justify-between px-4 border-b border-[var(--z-border)] bg-[var(--z-surface)]" style={{ height: 40, flexShrink: 0 }}>
            <div className="flex items-center gap-2">
              <span className="z-label-accent">Focus Mode</span>
              <span className="text-[10px] z-text-dim">Press ESC or F to exit</span>
            </div>
            <button
              onClick={() => setFocusMode(false)}
              className="text-[11px] z-text-muted hover:text-[var(--z-text-secondary)] transition-colors"
            >
              Exit Focus
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 min-h-0 overflow-hidden">
          {renderView()}
        </main>
      </div>

      {/* Command palette */}
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onNavigate={handleNavigate}
        onStartAnalysis={handleStartAnalysis}
      />

      {/* Voice control */}
      <VoiceControl active={voiceActive} onClose={() => setVoiceActive(false)} />
    </div>
  );
}

export default App;

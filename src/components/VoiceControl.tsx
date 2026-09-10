import { useEffect, useState } from 'react';
import { Mic, X, Radio } from 'lucide-react';

interface Props {
  active: boolean;
  onClose: () => void;
}

const voiceCommands = [
  'What is the biggest hidden risk?',
  'Compare these two locations.',
  'What did I miss?',
  'Show the second-order consequences.',
  'Simulate a 20 percent population increase.',
  'Why is Option B better?',
  'What assumptions are driving this result?',
  'Show me what changed.',
];

export function VoiceControl({ active, onClose }: Props) {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!active) {
      setTranscript('');
      setListening(false);
      return;
    }
    setListening(true);
    // Simulated voice transcription
    let i = 0;
    const target = 'What is the biggest hidden risk?';
    const interval = setInterval(() => {
      i++;
      setTranscript(target.slice(0, i));
      if (i >= target.length) {
        clearInterval(interval);
        setListening(false);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 z-slide-in-right" style={{ width: 'min(480px, 90vw)' }}>
      <div className="z-surface-raised overflow-hidden" style={{ boxShadow: 'var(--z-shadow-lg)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--z-border)]">
          <div className="flex items-center gap-2">
            <Radio size={13} className={listening ? 'text-[var(--z-accent)] z-pulse' : 'z-text-muted'} />
            <span className="text-[11px] tracking-wider uppercase z-text-secondary">
              {listening ? 'Listening' : 'Processing'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[var(--z-elevated)] transition-colors">
            <X size={14} className="z-text-muted" />
          </button>
        </div>

        {/* Waveform / Transcript */}
        <div className="px-4 py-4">
          {listening ? (
            <div className="flex items-center justify-center gap-1 h-12">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-full bg-[var(--z-accent)]"
                  style={{
                    height: `${20 + Math.sin(i * 0.8 + Date.now() / 200) * 15 + Math.random() * 10}%`,
                    opacity: 0.4 + Math.random() * 0.6,
                    animation: `z-core-pulse ${0.5 + Math.random() * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-[14px] text-[var(--z-text-primary)] leading-relaxed">
              {transcript}
              <span className="inline-block w-0.5 h-4 bg-[var(--z-accent)] ml-0.5 align-middle z-pulse" />
            </div>
          )}
        </div>

        {/* Suggested commands */}
        <div className="px-4 pb-3 border-t border-[var(--z-border)] pt-2.5">
          <div className="z-label mb-1.5">Try saying</div>
          <div className="flex flex-wrap gap-1.5">
            {voiceCommands.slice(0, 4).map(cmd => (
              <button
                key={cmd}
                className="text-[10px] px-2 py-1 rounded border border-[var(--z-border)] text-[var(--z-text-muted)] hover:border-[var(--z-border-bright)] hover:text-[var(--z-text-secondary)] transition-colors"
              >
                "{cmd}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

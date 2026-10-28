import React from 'react';
import { Scale, Clock, Volume2, VolumeX } from 'lucide-react';

export default function Header({
  countdown,
  soundEnabled,
  setSoundEnabled,
  activeTab,
  setActiveTab,
  cases,
  selectedCaseIndex,
  setSelectedCaseIndex
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-[#E2DBD0] shadow-[0_1px_8px_rgba(28,25,23,0.03)]">
      {/* Supreme Court / High Bar Decorative Top Rule */}
      <div className="h-1 bg-[#8B261D]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Institutional Title & Coat of Arms */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 border border-[#BFA77F] bg-[#FAF8F5] flex items-center justify-center text-[#8B261D] shadow-sm rounded-sm">
            <Scale className="w-6 h-6 stroke-[1.6]" />
          </div>
          <div>
            <div className="flex items-baseline gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-[#1A1917] font-semibold">
                JUDGDLE
              </h1>
              <span className="text-[10px] font-serif tracking-[0.22em] uppercase text-[#8C6D37] border-l border-[#D5CDBD] pl-2.5 font-medium">
                Lex et Iudicium
              </span>
            </div>
            <p className="text-xs text-[#6E6354] font-serif italic mt-0.5">
              The Daily Judicial Sentencing Assessment • Volume I
            </p>
          </div>
        </div>

        {/* Docket Reset Registry Clock & Audio */}
        <div className="flex items-center gap-3">
          <div className="bg-[#FAF8F5] border border-[#DDD5C7] px-3.5 py-1.5 rounded-sm flex items-center gap-2 text-xs text-[#52493E]">
            <Clock className="w-3.5 h-3.5 text-[#8C6D37] shrink-0" />
            <span className="font-serif hidden sm:inline text-[#6E6354]">Next Docket (12:00 AM PST):</span>
            <span className="font-mono font-semibold tracking-wider text-[#1A1917]">{countdown}</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 border border-[#DDD5C7] bg-[#FAF8F5] text-[#52493E] hover:text-[#1A1917] hover:border-[#BFA77F] rounded-sm transition cursor-pointer"
            title={soundEnabled ? 'Mute gavel audio' : 'Unmute gavel audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#8B261D]" /> : <VolumeX className="w-4 h-4 text-[#8C7D6B]" />}
          </button>
        </div>
      </div>

      {/* Refined Tab Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between border-t border-[#EAE3D7] pt-1 pb-1 gap-2 overflow-x-auto">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('game')}
            className={`px-3.5 py-1.5 text-xs font-serif uppercase tracking-[0.14em] transition border-b-2 cursor-pointer ${
              activeTab === 'game'
                ? 'border-[#8B261D] text-[#8B261D] font-semibold bg-[#F2EDE2]'
                : 'border-transparent text-[#6E6354] hover:text-[#1A1917] hover:bg-[#F2EDE2]/60'
            }`}
          >
            Playable Game
          </button>
          <button
            onClick={() => setActiveTab('ux-design')}
            className={`px-3.5 py-1.5 text-xs font-serif uppercase tracking-[0.14em] transition border-b-2 cursor-pointer ${
              activeTab === 'ux-design'
                ? 'border-[#8B261D] text-[#8B261D] font-semibold bg-[#F2EDE2]'
                : 'border-transparent text-[#6E6354] hover:text-[#1A1917] hover:bg-[#F2EDE2]/60'
            }`}
          >
            Answer Input UX Guide
          </button>
          <button
            onClick={() => setActiveTab('data-sources')}
            className={`px-3.5 py-1.5 text-xs font-serif uppercase tracking-[0.14em] transition border-b-2 cursor-pointer ${
              activeTab === 'data-sources'
                ? 'border-[#8B261D] text-[#8B261D] font-semibold bg-[#F2EDE2]'
                : 'border-transparent text-[#6E6354] hover:text-[#1A1917] hover:bg-[#F2EDE2]/60'
            }`}
          >
            Public Records Pipeline
          </button>
        </div>

        {/* Formal Case Archive Selector */}
        {activeTab === 'game' && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-serif uppercase tracking-[0.15em] text-[#8C7D6B] hidden md:inline">Select Case:</span>
            {cases.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseIndex(i)}
                className={`px-2.5 py-0.5 text-xs font-serif tracking-wider uppercase rounded-sm border transition cursor-pointer ${
                  selectedCaseIndex === i
                    ? 'bg-[#8B261D] text-[#FAF8F5] border-[#8B261D] font-semibold'
                    : 'bg-[#FAF8F5] text-[#52493E] border-[#DDD5C7] hover:border-[#BFA77F]'
                }`}
              >
                {c.caseNumber.replace(' DOCKET №', ' #')}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

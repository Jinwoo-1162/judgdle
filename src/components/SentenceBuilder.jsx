import React, { useEffect } from 'react';
import { Gavel, Check, ArrowUp, ArrowDown, Lock } from 'lucide-react';

export default function SentenceBuilder({
  sentenceTiers,
  draftGuess,
  setDraftGuess,
  activeGameState,
  onSubmitGuess,
  isEvaluating,
  revealedPillarCount = 4
}) {
  const lastGuess =
    activeGameState.guesses.length > 0
      ? activeGameState.guesses[activeGameState.guesses.length - 1]
      : null;

  // Auto-lock pillars that are confirmed correct once deliberation completes
  useEffect(() => {
    if (isEvaluating) return;
    if (!lastGuess) return;
    const updates = {};
    let shouldUpdate = false;

    Object.keys(sentenceTiers).forEach((key) => {
      if (lastGuess.evaluation[key]?.result === 'correct') {
        const correctVal = lastGuess[key];
        if (draftGuess[key] !== correctVal) {
          updates[key] = correctVal;
          shouldUpdate = true;
        }
      }
    });

    if (shouldUpdate) {
      setDraftGuess((prev) => ({ ...prev, ...updates }));
    }
  }, [lastGuess, sentenceTiers, setDraftGuess, draftGuess, isEvaluating]);

  // Prevent round history pips from prematurely spoiling results during evaluation
  const displayGuesses = isEvaluating
    ? activeGameState.guesses.slice(0, -1)
    : activeGameState.guesses;

  return (
    <div className="bg-[#FAF8F5] border border-[#D5CDBD] p-6 sm:p-7 shadow-[0_2px_14px_rgba(28,25,23,0.04)] rounded-sm space-y-6">
      {/* Builder Header */}
      <div className="border-b border-[#E2DBD0] pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold uppercase tracking-[0.18em] text-[#1A1917] flex items-center gap-2">
            <Gavel className="w-4 h-4 text-[#8B261D]" />
            <span>Sentence Builder</span>
          </h3>
          <span className="text-[10px] font-serif uppercase tracking-[0.15em] text-[#8C6D37] border border-[#DDD5C7] px-2 py-0.5 rounded-sm bg-[#FFFFFF]">
            Round {displayGuesses.length + 1} of 5
          </span>
        </div>
        <p className="text-xs font-serif text-[#6E6354] mt-1.5 leading-relaxed">
          Calibrate the four judicial sentencing pillars. Directional indicators directly highlight each sanction box as <strong>Higher</strong>, <strong>Lower</strong>, or <strong>Correct</strong>.
        </p>

        {/* Compact Round History Pips */}
        {displayGuesses.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#EAE3D7] flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] font-serif uppercase tracking-widest text-[#8C7D6B] font-semibold shrink-0">
              Deliberation Rounds:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {displayGuesses.map((g, rIdx) => {
                const correctCount = Object.values(g.evaluation).filter(
                  (e) => e.result === 'correct'
                ).length;
                return (
                  <div
                    key={rIdx}
                    className="inline-flex items-center gap-1 bg-[#FFFFFF] border border-[#DDD5C7] px-1.5 py-0.5 rounded-sm text-[10px] font-mono shadow-2xs shrink-0"
                    title={`Round ${rIdx + 1}: ${correctCount} of 4 correct`}
                  >
                    <span className="font-serif text-[#6E6354] font-semibold text-[9px]">R{rIdx + 1}</span>
                    <span className="inline-flex items-center tracking-tighter text-[11px] leading-none">
                      {Object.keys(sentenceTiers).map((k) => {
                        const res = g.evaluation[k].result;
                        if (res === 'correct') return '🟩';
                        if (res === 'higher') return '⬆️';
                        return '⬇️';
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4 Judicial Pillar Sanction Cards */}
      <div className="space-y-5">
        {Object.entries(sentenceTiers).map(([key, tier], idx) => {
          const currentIdx = draftGuess[key];
          const maxIdx = tier.buckets.length - 1;
          const currentLabel = tier.buckets[currentIdx];

          // Determine if this specific pillar has been revealed yet in the current round
          const isRevealed = !isEvaluating || idx < revealedPillarCount;

          // Card only displays the new evaluation once its reveal turn arrives!
          const activeGuess = isRevealed
            ? (activeGameState.guesses.length > 0
                ? activeGameState.guesses[activeGameState.guesses.length - 1]
                : null)
            : (activeGameState.guesses.length > 1
                ? activeGameState.guesses[activeGameState.guesses.length - 2]
                : null);

          const displayedEv = activeGuess ? activeGuess.evaluation[key] : null;
          const isCorrect = displayedEv?.result === 'correct';

          // History of guesses visible for this pillar
          const visiblePillarGuesses = isEvaluating && !isRevealed
            ? activeGameState.guesses.slice(0, -1).map((g, rIdx) => ({
                round: rIdx + 1,
                bucketIdx: g[key],
                result: g.evaluation[key].result
              }))
            : activeGameState.guesses.map((g, rIdx) => ({
                round: rIdx + 1,
                bucketIdx: g[key],
                result: g.evaluation[key].result
              }));

          // Determine ruled-out bounds from visible guesses
          let minViableIdx = 0;
          let maxViableIdx = maxIdx;
          visiblePillarGuesses.forEach((pg) => {
            if (pg.result === 'higher' && pg.bucketIdx >= minViableIdx) {
              minViableIdx = pg.bucketIdx + 1;
            }
            if (pg.result === 'lower' && pg.bucketIdx <= maxViableIdx) {
              maxViableIdx = pg.bucketIdx - 1;
            }
            if (pg.result === 'correct') {
              minViableIdx = pg.bucketIdx;
              maxViableIdx = pg.bucketIdx;
            }
          });

          // Pillar Card Dynamic Styling (Updates in sync with reveal)
          const cardStyle = isCorrect
            ? 'bg-[#F2F8F4] border-[#7DBE8F] shadow-[0_2px_12px_rgba(45,90,61,0.08)]'
            : displayedEv?.result === 'higher'
            ? 'bg-[#FDF8F5] border-[#E8BCAB] shadow-[0_2px_12px_rgba(140,59,26,0.06)]'
            : displayedEv?.result === 'lower'
            ? 'bg-[#F4F8FB] border-[#ADC9DF] shadow-[0_2px_12px_rgba(36,65,92,0.06)]'
            : 'bg-[#FFFFFF] border-[#DDD5C7]';

          // Card animates when its reveal turn is actively executing
          const isCurrentlyAnimating = isEvaluating && idx === revealedPillarCount - 1;

          let animClass = '';
          if (isCurrentlyAnimating && displayedEv) {
            if (displayedEv.result === 'correct') animClass = 'animate-tier-correct';
            else if (displayedEv.result === 'higher') animClass = 'animate-tier-higher';
            else if (displayedEv.result === 'lower') animClass = 'animate-tier-lower';
          }

          return (
            <div
              key={key}
              className={`p-4 rounded-sm space-y-3 border transition-colors duration-300 ${cardStyle} ${animClass}`}
            >
              {/* Pillar Header with Directional Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-serif font-bold text-[#1A1917]">
                    {tier.label}
                  </label>

                  {/* Inline Directional Status Badge (Appears when revealed) */}
                  {displayedEv && (
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border transition-all duration-300 ${
                        isCorrect
                          ? 'bg-[#EBF2EC] border-[#BED6C3] text-[#1E4D2B]'
                          : displayedEv.result === 'higher'
                          ? 'bg-[#FDF2EC] border-[#ECC8B6] text-[#8C3B1A]'
                          : 'bg-[#EEF3F8] border-[#B9CFE3] text-[#24415C]'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>Correct</span>
                        </>
                      ) : displayedEv.result === 'higher' ? (
                        <>
                          <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                          <span>Actual is Higher</span>
                        </>
                      ) : (
                        <>
                          <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                          <span>Actual is Lower</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* Current Value Display Box */}
                <div className="flex items-center gap-1.5">
                  {isCorrect && <Lock className="w-3 h-3 text-[#1E4D2B]" />}
                  <span
                    className={`text-xs font-serif font-semibold px-2.5 py-0.5 rounded-sm border transition-all duration-300 ${
                      isCorrect
                        ? 'bg-[#EBF2EC] border-[#BED6C3] text-[#1E4D2B] font-bold'
                        : displayedEv?.result === 'higher'
                        ? 'bg-[#FDF2EC] border-[#ECC8B6] text-[#8C3B1A]'
                        : displayedEv?.result === 'lower'
                        ? 'bg-[#EEF3F8] border-[#B9CFE3] text-[#24415C]'
                        : currentIdx === 0
                        ? 'bg-[#F9F7F2] border-[#E2DBD0] text-[#8C7D6B]'
                        : 'bg-[#F4EFE6] border-[#CBB8A1] text-[#7A281E]'
                    }`}
                  >
                    {currentLabel}
                  </span>
                </div>
              </div>

              {/* Slider (Disabled if already solved or currently evaluating) */}
              <input
                type="range"
                min={0}
                max={maxIdx}
                step={1}
                disabled={activeGameState.status !== 'playing' || isCorrect || isEvaluating}
                value={currentIdx}
                onChange={(e) =>
                  setDraftGuess((prev) => ({
                    ...prev,
                    [key]: Number(e.target.value)
                  }))
                }
                className={`w-full h-1.5 rounded-sm cursor-pointer transition-colors duration-300 ${
                  isCorrect
                    ? 'accent-[#2D5A3D] bg-[#BED6C3]'
                    : displayedEv?.result === 'higher'
                    ? 'accent-[#8C3B1A] bg-[#ECC8B6]'
                    : displayedEv?.result === 'lower'
                    ? 'accent-[#24415C] bg-[#B9CFE3]'
                    : 'accent-[#8B261D] bg-[#E8E2D6]'
                }`}
              />

              {/* Bucket Selection Boxes / Chips with Individual Indicators */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tier.buckets.map((bLabel, bIdx) => {
                  const isSelected = currentIdx === bIdx;
                  // Look up if this bucket was ever guessed among visible guesses
                  const prior = visiblePillarGuesses.find((pg) => pg.bucketIdx === bIdx);
                  const isRuledOut =
                    !isCorrect && (bIdx < minViableIdx || bIdx > maxViableIdx);

                  let chipStyle = '';
                  let icon = null;

                  if (prior?.result === 'correct') {
                    chipStyle = isSelected
                      ? 'bg-[#2D5A3D] text-[#FAF8F5] border-[#2D5A3D] font-bold ring-2 ring-[#2D5A3D]/40'
                      : 'bg-[#EBF2EC] text-[#1E4D2B] border-[#7DBE8F] font-bold';
                    icon = <Check className="w-2.5 h-2.5 stroke-[2.5]" />;
                  } else if (prior?.result === 'higher') {
                    chipStyle = isSelected
                      ? 'bg-[#8C3B1A] text-[#FAF8F5] border-[#8C3B1A] font-bold ring-2 ring-[#8C3B1A]/40'
                      : 'bg-[#FDF2EC] text-[#8C3B1A] border-[#ECC8B6] font-semibold';
                    icon = <ArrowUp className="w-2.5 h-2.5 stroke-[2.5]" />;
                  } else if (prior?.result === 'lower') {
                    chipStyle = isSelected
                      ? 'bg-[#24415C] text-[#FAF8F5] border-[#24415C] font-bold ring-2 ring-[#24415C]/40'
                      : 'bg-[#EEF3F8] text-[#24415C] border-[#B9CFE3] font-semibold';
                    icon = <ArrowDown className="w-2.5 h-2.5 stroke-[2.5]" />;
                  } else if (isSelected) {
                    chipStyle =
                      'bg-[#8B261D] text-[#FAF8F5] border-[#8B261D] font-bold ring-2 ring-[#8B261D]/25';
                  } else if (isRuledOut) {
                    chipStyle =
                      'bg-[#F5F2EB]/50 text-[#A89E90] border-[#E8E2D6] line-through opacity-50';
                  } else {
                    chipStyle =
                      'bg-[#FAF8F5] text-[#5C5346] border-[#DDD5C7] hover:bg-[#F2EDE2] hover:border-[#BFA77F]';
                  }

                  return (
                    <button
                      key={bIdx}
                      type="button"
                      disabled={activeGameState.status !== 'playing' || isCorrect || isEvaluating}
                      onClick={() =>
                        setDraftGuess((prev) => ({
                          ...prev,
                          [key]: bIdx
                        }))
                      }
                      className={`text-[10px] font-serif px-2.5 py-1 rounded-sm border inline-flex items-center gap-1 transition-all duration-200 cursor-pointer ${chipStyle}`}
                    >
                      {icon}
                      <span>{bLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Sentence Button */}
      <button
        type="button"
        disabled={activeGameState.status !== 'playing' || isEvaluating}
        onClick={onSubmitGuess}
        className={`w-full py-3.5 px-4 font-serif text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 rounded-sm transition shadow-sm ${
          activeGameState.status === 'playing' && !isEvaluating
            ? 'bg-[#8B261D] hover:bg-[#732018] text-[#FAF8F5] cursor-pointer'
            : 'bg-[#EAE4D7] text-[#8C7D6B] cursor-not-allowed border border-[#DDD5C7]'
        }`}
      >
        <Gavel className={`w-4 h-4 ${isEvaluating ? 'animate-bounce' : ''}`} />
        <span>
          {isEvaluating
            ? 'Deliberating Verdict...'
            : activeGameState.status === 'playing'
            ? `Hand Down Sentence (Guess ${activeGameState.guesses.length + 1}/5)`
            : 'Case Closed'}
        </span>
      </button>
    </div>
  );
}

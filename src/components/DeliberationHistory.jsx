import React from 'react';
import { Scale, Check, ArrowUp, ArrowDown } from 'lucide-react';

export default function DeliberationHistory({
  guesses,
  sentenceTiers,
  stageDefinitions
}) {
  return (
    <div className="bg-[#FAF8F5] border border-[#D5CDBD] p-6 sm:p-7 shadow-[0_2px_14px_rgba(28,25,23,0.04)] rounded-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DBD0] pb-3 mb-4">
        <h3 className="text-xs font-serif uppercase tracking-[0.18em] font-bold text-[#1A1917] flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#8B261D]" />
          <span>Sentencing Deliberation Record</span>
        </h3>
        <div className="flex items-center gap-3 text-[11px] font-serif text-[#6E6354]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2D5A3D] inline-block" /> Correct
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#8C3B1A] inline-block" /> Actual ↑ Higher
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#24415C] inline-block" /> Actual ↓ Lower
          </span>
        </div>
      </div>

      {guesses.length === 0 ? (
        <div className="text-center py-7 bg-[#FFFFFF] border border-dashed border-[#DDD5C7] rounded-sm text-xs font-serif italic text-[#8C7D6B]">
          No sentence has been entered into the record. Use the Judicial Sentencing Worksheet to cast your Stage I judgment.
        </div>
      ) : (
        <div className="space-y-3">
          {guesses.map((g, idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF] border border-[#DDD5C7] p-3.5 rounded-sm space-y-2.5"
            >
              <div className="flex items-center justify-between text-[11px] font-serif text-[#6E6354]">
                <span className="font-semibold uppercase tracking-wider text-[#1A1917]">
                  Deliberation #{idx + 1} (At Exhibit {stageDefinitions[g.stageAtGuess - 1].roman})
                </span>
                <span className="text-[#8C6D37] font-medium">
                  {Object.values(g.evaluation).filter((e) => e.result === 'correct').length} of 4 Pillars Correct
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.keys(sentenceTiers).map((key) => {
                  const tierInfo = sentenceTiers[key];
                  const ev = g.evaluation[key];
                  const bucketText = tierInfo.buckets[g[key]];

                  const badgeStyle =
                    ev.result === 'correct'
                      ? 'bg-[#EBF2EC] border-[#BED6C3] text-[#1E4D2B]'
                      : ev.result === 'higher'
                      ? 'bg-[#FDF2EC] border-[#ECC8B6] text-[#8C3B1A]'
                      : 'bg-[#EEF3F8] border-[#B9CFE3] text-[#24415C]';

                  return (
                    <div
                      key={key}
                      className={`p-2.5 rounded-sm border text-xs font-serif flex flex-col justify-between ${badgeStyle}`}
                    >
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider opacity-80 mb-1">
                        <span className="truncate">{tierInfo.shortLabel}</span>
                        {ev.result === 'correct' ? (
                          <span className="inline-flex items-center font-bold">
                            <Check className="w-3 h-3 mr-0.5" /> Correct
                          </span>
                        ) : ev.result === 'higher' ? (
                          <span className="inline-flex items-center font-bold">
                            <ArrowUp className="w-3 h-3" /> Higher
                          </span>
                        ) : (
                          <span className="inline-flex items-center font-bold">
                            <ArrowDown className="w-3 h-3" /> Lower
                          </span>
                        )}
                      </div>
                      <div className="font-bold truncate text-[12px]">{bucketText}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

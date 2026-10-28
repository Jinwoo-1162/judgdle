import React from 'react';
import { Award, Scale, Share2, RotateCcw, X, Eye } from 'lucide-react';

export default function VerdictModal({
  isOpen,
  onClose,
  status,
  guessesCount,
  currentCase,
  onShare,
  copiedToast,
  onReset
}) {
  if (!isOpen || status === 'playing') return null;

  const isWon = status === 'won';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1C1917]/75 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FAF8F5] border-2 border-[#BFA77F] rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Supreme Court High Bar Top Rule */}
        <div className={`h-1.5 ${isWon ? 'bg-[#8B261D]' : 'bg-[#6E6354]'}`} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#8C7D6B] hover:text-[#1A1917] hover:bg-[#EAE4D7] rounded-sm transition cursor-pointer"
          title="Dismiss popup to review court record"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Seal Emblem */}
          <div className="w-14 h-14 mx-auto rounded-full border-2 border-[#BFA77F] bg-[#FAF8F5] flex items-center justify-center shadow-xs mb-3.5">
            {isWon ? (
              <Award className="w-7 h-7 text-[#8B261D] stroke-[1.8]" />
            ) : (
              <Scale className="w-7 h-7 text-[#6E6354] stroke-[1.8]" />
            )}
          </div>

          {/* Celebration Headline */}
          <div className="text-[11px] font-serif uppercase tracking-[0.25em] text-[#8C6D37] font-semibold text-center mb-1">
            {isWon ? 'Judicial Sentence Sustained' : 'Deliberation Concluded'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1917] text-center tracking-tight">
            {isWon
              ? `Sentence Matched on Round ${guessesCount}!`
              : 'Court Adjourned — Out of Guesses'}
          </h2>
          <p className="text-xs font-serif italic text-[#6E6354] text-center mt-1.5">
            {isWon
              ? 'The court confirms that your sentencing determination precisely matches the statutory record.'
              : 'You have reached the 5-round deliberation limit. The final sentence is entered into public record.'}
          </p>

          {/* Official Sentence Summary Box */}
          <div className="mt-6 p-4 sm:p-5 bg-[#F4EFE6] border border-[#DDD5C7] rounded-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DBD0] pb-2.5 text-xs font-serif">
              <div>
                <span className="text-[10px] text-[#8C7D6B] uppercase tracking-wider block font-semibold">
                  Defendant
                </span>
                <span className="font-bold text-[#1A1917] text-sm">
                  {currentCase.stage2.defendantName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#8C7D6B] uppercase tracking-wider block font-semibold">
                  Docket
                </span>
                <span className="font-mono text-xs text-[#52493E]">
                  {currentCase.docketId}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#8C6D37] block font-semibold mb-1">
                Official Court Sentence Pronounced:
              </span>
              <p className="text-sm font-serif font-bold text-[#1A1917] leading-relaxed">
                {currentCase.exactSentenceSummary}
              </p>
            </div>
          </div>

          {/* Archival Citation */}
          <p className="mt-3 text-[11px] font-serif italic text-[#8C7D6B] text-center leading-normal">
            {currentCase.sourceNote}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#EAE3D7]">
            <button
              onClick={onShare}
              className="w-full sm:w-auto px-6 py-3 bg-[#8B261D] hover:bg-[#732018] text-[#FAF8F5] text-xs font-serif uppercase tracking-[0.16em] font-bold flex items-center justify-center gap-2 rounded-sm transition shadow-sm cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedToast ? 'Copied Emoji Grid!' : 'Share Daily Score'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-3 border border-[#DDD5C7] bg-[#FFFFFF] hover:bg-[#F2EDE2] text-[#3E372E] text-xs font-serif uppercase tracking-[0.14em] font-semibold flex items-center justify-center gap-1.5 rounded-sm transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>Review Worksheet</span>
            </button>

            <button
              onClick={() => {
                onReset();
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-3 border border-[#DDD5C7] bg-[#FFFFFF] hover:bg-[#F2EDE2] text-[#3E372E] text-xs font-serif uppercase tracking-[0.14em] font-semibold flex items-center justify-center gap-1.5 rounded-sm transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>Replay Case</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

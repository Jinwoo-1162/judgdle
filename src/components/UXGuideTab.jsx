import React from 'react';

export default function UXGuideTab() {
  return (
    <div className="bg-[#FAF8F5] border border-[#D5CDBD] p-8 shadow-[0_2px_14px_rgba(28,25,23,0.04)] rounded-sm space-y-7">
      <div className="border-b border-[#E2DBD0] pb-5">
        <span className="text-[10px] font-serif uppercase tracking-[0.22em] text-[#8C6D37] font-semibold">
          Judicial Architecture & Interface Doctrine
        </span>
        <h2 className="text-2xl font-serif font-bold text-[#1A1917] mt-1.5">
          The Four-Pillar Sentencing Model & Ternary Feedback
        </h2>
        <p className="text-xs font-serif italic text-[#6E6354] mt-1">
          Reflecting the dignified standards of common law procedure and statutory sentencing structures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] border border-[#DDD5C7] p-5 rounded-sm space-y-2">
          <div className="text-xs font-serif font-bold text-[#8B261D] uppercase tracking-wider">
            I. Four Orthogonal Sanctions
          </div>
          <p className="text-xs font-serif text-[#4A4237] leading-relaxed">
            Sentencing decisions in modern criminal jurisprudence are composite remedies comprising incarceration, post-release supervision, public service hours, and monetary restitution.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#DDD5C7] p-5 rounded-sm space-y-2">
          <div className="text-xs font-serif font-bold text-[#8C6D37] uppercase tracking-wider">
            II. Discrete Judicial Tiers
          </div>
          <p className="text-xs font-serif text-[#4A4237] leading-relaxed">
            Rather than arbitrary continuous sliders, statutory ranges map directly onto standard judicial sentencing thresholds (30 days shock time, 1 year probation, 50 hours service, etc.).
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#DDD5C7] p-5 rounded-sm space-y-2">
          <div className="text-xs font-serif font-bold text-[#2D5A3D] uppercase tracking-wider">
            III. Strict Ternary Pacing
          </div>
          <p className="text-xs font-serif text-[#4A4237] leading-relaxed">
            Feedback is strictly ternary (Higher, Lower, or Correct). This preserves strategic tension across all five clue stages without inadvertently spoiling adjacent buckets.
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function PublicRecordsTab() {
  return (
    <div className="bg-[#FAF8F5] border border-[#D5CDBD] p-8 shadow-[0_2px_14px_rgba(28,25,23,0.04)] rounded-sm space-y-7">
      <div className="border-b border-[#E2DBD0] pb-5">
        <span className="text-[10px] font-serif uppercase tracking-[0.22em] text-[#8C6D37] font-semibold">
          Judicial Records & Open Access Framework
        </span>
        <h2 className="text-2xl font-serif font-bold text-[#1A1917] mt-1.5">
          Authentic Public Domain Booking & Sentencing Archives
        </h2>
        <p className="text-xs font-serif italic text-[#6E6354] mt-1">
          Zero-avatar recurring expense via public government repositories and unencumbered judicial dockets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FFFFFF] border border-[#DDD5C7] p-5 rounded-sm space-y-2">
          <span className="text-xs font-serif font-bold text-[#8B261D] uppercase tracking-wider">
            Florida Public Records Law (Chapter 119)
          </span>
          <p className="text-xs font-serif text-[#4A4237] leading-relaxed">
            Florida statutes guarantee public inspection of government materials. Sheriff booking photographs and Department of Corrections records are public domain documents (PD-FLGov) available without recurring licensing fees.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#DDD5C7] p-5 rounded-sm space-y-2">
          <span className="text-xs font-serif font-bold text-[#8C6D37] uppercase tracking-wider">
            Federal Dockets (RECAP & 17 U.S.C. § 105)
          </span>
          <p className="text-xs font-serif text-[#4A4237] leading-relaxed">
            Official records of the federal government are excluded from copyright under 17 U.S.C. § 105. Indictments, plea agreements, and Judgment in a Criminal Case records (Form AO 245B) provide exact sentencing figures.
          </p>
        </div>
      </div>
    </div>
  );
}

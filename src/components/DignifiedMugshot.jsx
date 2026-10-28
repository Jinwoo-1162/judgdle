import React, { useState, useEffect } from 'react';
import { Scale } from 'lucide-react';

export default function DignifiedMugshot({ mugshot, stageUnlocked, defendantName }) {
  const [urlIndex, setUrlIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const allUrls = [mugshot.imageUrl, ...(mugshot.fallbackUrls || [])];
  const activeUrl = allUrls[urlIndex] || mugshot.imageUrl;

  useEffect(() => {
    setUrlIndex(0);
    setImgError(false);
  }, [mugshot.imageUrl]);

  const isNameRevealed = stageUnlocked >= 2;

  return (
    <div className="relative w-full max-w-sm mx-auto bg-[#F7F4EE] border border-[#D5CDBD] p-3 shadow-[0_4px_20px_rgba(28,25,23,0.06)] rounded-sm">
      {/* Editorial Docket Registry Bar */}
      <div className="pb-2 mb-2 border-b border-[#E2DBD0] flex items-center justify-between text-[10px] font-serif tracking-[0.15em] text-[#6E6354] uppercase">
        <span className="truncate">{mugshot.agency}</span>
        <span className="shrink-0 ml-2 font-mono text-[#8C7D6B]">#{mugshot.bookingNo}</span>
      </div>

      {/* Frame Container */}
      <div className="relative aspect-[4/4] w-full bg-[#EFECE4] border border-[#DDD6C8] flex items-center justify-center overflow-hidden">
        {!imgError ? (
          <img
            src={activeUrl}
            referrerPolicy="no-referrer"
            alt={isNameRevealed ? `Judicial Booking Photograph of ${defendantName}` : 'Confidential Booking Photograph (Identity Sealed)'}
            onError={() => {
              if (urlIndex + 1 < allUrls.length) {
                setUrlIndex(urlIndex + 1);
              } else {
                setImgError(true);
              }
            }}
            className="w-full h-full object-cover object-top filter contrast-[1.03] sepia-[0.04]"
          />
        ) : (
          <div className="p-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-[#C4B9AA] bg-[#F5F2EB] mx-auto flex items-center justify-center text-[#736554]">
              <Scale className="w-5 h-5 text-[#8B261D]" />
            </div>
            <p className="text-xs font-serif text-[#3A342C]">
              Official photograph archival record verified
            </p>
            <p className="text-[10px] text-[#8C7D6B] font-mono break-all">
              {activeUrl}
            </p>
          </div>
        )}

        {/* Physical Plaque Redaction for Stage 1 */}
        {mugshot.redactBottomPlaqueOnStage1 && !isNameRevealed && !imgError && (
          <div className="absolute bottom-3 inset-x-6 bg-[#1C1917]/95 border border-[#8C7D6B] py-2 px-3 text-center shadow-lg">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-[#E8DFD1] block">
              [ IDENTITY SEALED BY COURT ORDER ]
            </span>
          </div>
        )}

        {/* Dignified Archival Stamp Badge */}
        <div className="absolute top-2.5 right-2.5 bg-[#FDFBF7]/95 border border-[#C4B9AA] text-[#3E372E] px-2.5 py-0.5 text-[10px] font-serif uppercase tracking-[0.14em] shadow-sm">
          Stage {stageUnlocked} of 5
        </div>
      </div>

      {/* Understated Docket Registry Caption */}
      <div className="pt-2.5 mt-2 border-t border-[#E2DBD0] flex items-center justify-between text-[11px] font-serif text-[#5C5346]">
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.16em] text-[#8C7D6B] font-semibold">Subject:</span>
          {isNameRevealed ? (
            <span className="text-[#1C1917] font-semibold">{defendantName}</span>
          ) : (
            <span className="italic text-[#8C7D6B] tracking-wider font-mono text-[10px]">
              [SEALED UNTIL STAGE II]
            </span>
          )}
        </div>
        <span className="text-[10px] italic text-[#8C7D6B] hidden sm:inline">Official Court Record</span>
      </div>
    </div>
  );
}

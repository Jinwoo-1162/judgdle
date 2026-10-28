import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  MapPin,
  Calendar,
  Lock,
  RotateCcw,
  Check,
} from "lucide-react";
import DignifiedMugshot from "./DignifiedMugshot";
import { playSound } from "../utils/audio";

export default function EvidenceDossier({
  currentCase,
  activeGameState,
  activeClueTab,
  setActiveClueTab,
  stageDefinitions,
  onResetCase,
  onAdvanceStageDev,
  evidenceFading = false,
  soundEnabled = true,
}) {
  const isIdentityRevealed = activeGameState.stageUnlocked >= 2;

  // Track the most recently unlocked stage to fire extraction animation only once
  const [justUnlockedStage, setJustUnlockedStage] = useState(null);
  const prevUnlockedRef = useRef(activeGameState.stageUnlocked);

  useEffect(() => {
    if (activeGameState.stageUnlocked > prevUnlockedRef.current) {
      setJustUnlockedStage(activeGameState.stageUnlocked);
      const timer = setTimeout(() => {
        setJustUnlockedStage(null);
      }, 750);
      return () => clearTimeout(timer);
    }
    prevUnlockedRef.current = activeGameState.stageUnlocked;
  }, [activeGameState.stageUnlocked]);

  return (
    <div className="space-y-6">
      {/* Case Dossier Header Card */}
      <div className="bg-[#FAF8F5] border border-[#D5CDBD] p-6 sm:p-7 shadow-[0_2px_14px_rgba(28,25,23,0.04)] rounded-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E2DBD0] pb-5 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <span className="text-[11px] font-serif tracking-[0.2em] uppercase text-[#8B261D] font-semibold">
                {currentCase.caseNumber}
              </span>
              <span className="text-xs font-mono text-[#8C7D6B] border-l border-[#D5CDBD] pl-3">
                DOCKET: {currentCase.docketId}
              </span>
              {isIdentityRevealed ? (
                <span className="text-xs font-serif font-semibold text-[#2D5A3D] bg-[#EBF2EC] px-2 py-0.5 border border-[#BED6C3] rounded-sm">
                  DEFENDANT: {currentCase.stage2.defendantName}
                </span>
              ) : (
                <span className="text-xs font-serif italic text-[#8C7D6B] bg-[#F2EDE2] px-2 py-0.5 border border-[#E2DBD0] rounded-sm">
                  Identity Sealed Until Stage II
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1917] tracking-tight">
              {isIdentityRevealed
                ? currentCase.title
                : "In the Matter of the Sealed Grand Jury Indictment"}
            </h2>
            <p className="text-xs font-serif text-[#6E6354] italic mt-1">
              {isIdentityRevealed
                ? currentCase.stage2.location
                : "Stage I: Initial visual booking evaluation — assess the charges and record"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] font-serif uppercase tracking-[0.16em] text-[#8C7D6B]">
                Deliberation
              </div>
              <div className="text-sm font-serif font-bold text-[#1A1917]">
                Round {activeGameState.guesses.length} of 5
              </div>
            </div>
            <button
              onClick={onResetCase}
              className="px-3 py-1.5 border border-[#D5CDBD] bg-[#F2EDE2] hover:bg-[#EBE4D5] text-[#3E372E] text-xs font-serif tracking-wide rounded-sm flex items-center gap-1.5 transition cursor-pointer"
              title="Reset current case file"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 5-Stage Dossier Stepper Tabs */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {stageDefinitions.map((st) => {
            const isUnlocked = st.num <= activeGameState.stageUnlocked;
            const isCurrentView = activeClueTab === st.num;
            const isNewlyUnlocked = justUnlockedStage === st.num;

            if (isUnlocked) {
              return (
                <button
                  key={st.num}
                  onClick={() => {
                    if (activeClueTab !== st.num) {
                      playSound("pageTurn", soundEnabled);
                    }
                    setActiveClueTab(st.num);
                  }}
                  className={`group relative p-[1px] text-left transition-all duration-300 ease-out cursor-pointer min-h-[96px] ${
                    isCurrentView
                      ? "bg-[#8B261D] -translate-y-1.5"
                      : "bg-[#DDD5C7] translate-y-0 hover:bg-[#BFA77F] hover:-translate-y-0.5"
                  } ${isNewlyUnlocked ? "animate-extract" : ""}`}
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%)",
                    filter: isCurrentView
                      ? "drop-shadow(0 6px 14px rgba(139,38,29,0.18))"
                      : "drop-shadow(0 2px 4px rgba(28,25,23,0.06))",
                  }}
                  title={`View Exhibit ${st.roman}: ${st.title}`}
                >
                  {/* Inner Parchment Surface - clipped to create an exact 1px border along all 5 edges */}
                  <div
                    className={`w-full h-full p-2 sm:p-2.5 flex flex-col justify-between transition-colors ${
                      isCurrentView
                        ? "bg-[#FFFDF9]"
                        : "bg-[#FAF8F5] group-hover:bg-[#FFFDF9]"
                    }`}
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
                    }}
                  >
                    {/* The Folded Corner Flap attached along the 45-degree crease */}
                    <div className="absolute top-0 right-0 w-[15px] h-[15px] pointer-events-none z-10">
                      <svg className="w-full h-full" viewBox="0 0 15 15">
                        <polygon
                          points="0,0 15,15 0,15"
                          fill={isCurrentView ? "#EDE4D6" : "#E5DDCF"}
                          stroke="#C4B9AA"
                          strokeWidth="0.75"
                        />
                      </svg>
                    </div>

                    {/* Top Line: Exhibit Roman */}
                    <div className="w-full pr-3">
                      <span
                        className={`text-[11px] sm:text-xs font-serif font-bold whitespace-nowrap tracking-wider block ${
                          isCurrentView ? "text-[#8B261D]" : "text-[#1A1917]"
                        }`}
                      >
                        EXHIBIT {st.roman}
                      </span>
                    </div>

                    {/* Middle: Short Title */}
                    <div className="text-[11px] sm:text-xs font-serif font-semibold text-[#2B2620] truncate mt-1">
                      {st.short}
                    </div>

                    {/* Bottom: Admitted Stamp Badge */}
                    <div className="mt-2 pt-1 border-t border-[#EAE3D7] flex items-center">
                      <span className="text-[9px] font-serif uppercase tracking-wider text-[#2D5A3D] font-bold bg-[#EBF2EC] border border-[#BED6C3] px-1.5 py-0.5 rounded-xs inline-flex items-center gap-1 shadow-2xs">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                        <span>Admitted</span>
                      </span>
                    </div>
                  </div>
                </button>
              );
            }

            // Sealed Envelope Card (Clean vertical hierarchy with zero text overlap)
            return (
              <div
                key={st.num}
                className="relative flex flex-col justify-between p-2 sm:p-2.5 rounded-sm border border-[#C9BDA8] bg-[#E8DFD1] text-left shadow-inner select-none min-h-[96px]"
                title={`Exhibit ${st.roman} is sealed until Round ${st.num}`}
              >
                {/* Envelope Flap Triangular Fold */}
                <svg
                  className="absolute inset-x-0 top-0 w-full h-7 pointer-events-none"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 24"
                >
                  <polygon
                    points="0,0 100,0 50,20"
                    fill="#DDD4C2"
                    stroke="#C4B8A2"
                    strokeWidth="1"
                  />
                </svg>

                {/* Red Wax Seal Badge at Flap Apex */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#8B261D] border border-[#6D1B13] shadow-[0_2px_4px_rgba(0,0,0,0.25)] flex items-center justify-center text-[#F5F0E6] z-10">
                  <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
                </div>

                {/* Middle Content - Centered safely below flap and wax seal */}
                <div className="mt-6 text-center z-10 space-y-1">
                  <div className="text-[10px] sm:text-[11px] font-serif font-bold text-[#5C5346] whitespace-nowrap tracking-wider">
                    EXHIBIT {st.roman}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#8B261D] font-bold bg-[#FAF8F5]/90 border border-[#8B261D]/35 px-1.5 py-0.5 rounded-xs inline-block shadow-2xs -rotate-1">
                      SEALED
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Exhibit Evidence Card */}
      <div
        className={`bg-[#FAF8F5] border border-[#D5CDBD] p-6 sm:p-7 shadow-[0_2px_14px_rgba(28,25,23,0.04)] rounded-sm transition-all duration-400 ease-in-out ${
          evidenceFading ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-3.5 mb-5">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-[#8B261D]" />
            <h3 className="text-xs font-serif uppercase tracking-[0.2em] font-bold text-[#8B261D]">
              Court Record — Exhibit {stageDefinitions[activeClueTab - 1].roman}
              : {stageDefinitions[activeClueTab - 1].title}
            </h3>
          </div>
          {activeGameState.stageUnlocked < 5 &&
            activeGameState.status === "playing" && (
              <button
                onClick={onAdvanceStageDev}
                className="text-[11px] font-serif italic text-[#8C6D37] hover:text-[#8B261D] underline transition cursor-pointer"
              >
                Preview Next Clue Early (Dev Mode)
              </button>
            )}
        </div>

        {/* Stage 1: Pure Mugshot Photographic Evidence */}
        {activeClueTab === 1 && (
          <div className="space-y-5">
            <DignifiedMugshot
              mugshot={currentCase.mugshot}
              stageUnlocked={activeGameState.stageUnlocked}
              defendantName={currentCase.stage2.defendantName}
            />
            <div className="bg-[#F2EDE2] border-l-2 border-[#8B261D] p-4 text-xs font-serif text-[#4A4237] leading-relaxed">
              <strong className="text-[#1A1917] font-semibold block mb-1">
                Preliminary Arraignment Stage:
              </strong>
              The defendant’s identity, charges, and venue remain sealed in
              Round I. Formulate your baseline sentencing judgment from the
              booking portrait and agency jurisdiction.
            </div>
          </div>
        )}

        {/* Stage 2: Defendant Name, Venue & Dates */}
        {activeClueTab === 2 && (
          <div className="space-y-5">
            <div className="bg-[#F4EFE6] border border-[#D8D0C2] p-4 rounded-sm flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-serif uppercase tracking-[0.18em] text-[#8C6D37] font-semibold mb-1">
                  Defendant Identity Disclosed
                </div>
                <div className="text-xl font-serif font-bold text-[#1A1917]">
                  {currentCase.stage2.defendantName}
                </div>
                <div className="text-xs font-serif italic text-[#6E6354] mt-0.5">
                  {currentCase.stage2.ageAtArrest}
                </div>
              </div>
              <img
                src={currentCase.mugshot.imageUrl}
                alt={currentCase.stage2.defendantName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 object-cover border border-[#C4B9AA] shadow-sm rounded-sm shrink-0"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-[#FFFFFF] border border-[#E2DBD0] p-4 rounded-sm">
                <div className="text-[10px] font-serif uppercase tracking-[0.16em] text-[#8C7D6B] mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8C6D37]" />
                  <span>Venue & Jurisdiction</span>
                </div>
                <div className="text-sm font-serif font-semibold text-[#1A1917]">
                  {currentCase.stage2.location}
                </div>
              </div>
              <div className="bg-[#FFFFFF] border border-[#E2DBD0] p-4 rounded-sm">
                <div className="text-[10px] font-serif uppercase tracking-[0.16em] text-[#8C7D6B] mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8C6D37]" />
                  <span>Judicial Dates</span>
                </div>
                <div className="text-xs font-serif text-[#3E372E] space-y-0.5">
                  <div>
                    <strong>Arrest Date:</strong>{" "}
                    {currentCase.stage2.arrestDate}
                  </div>
                  <div>
                    <strong>Sentencing Date:</strong>{" "}
                    {currentCase.stage2.sentencingDate}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F2EDE2] border border-[#DDD5C7] p-4 rounded-sm text-xs font-serif text-[#4A4237]">
              <strong className="text-[#1A1917] uppercase tracking-wider block mb-1 text-[11px]">
                Prior Record & Context:
              </strong>
              {currentCase.stage2.courtNote}
            </div>
          </div>
        )}

        {/* Stage 3: Indictment & Charges */}
        {activeClueTab === 3 && (
          <div className="space-y-5">
            <div className="bg-[#FFFFFF] border border-[#E2DBD0] p-4 rounded-sm text-xs font-serif text-[#3E372E] leading-relaxed">
              <strong className="text-[#8B261D] uppercase tracking-wider block mb-1 text-[11px]">
                Factual Basis & Statement of Offense:
              </strong>
              {currentCase.stage3.summary}
            </div>

            <div className="space-y-2.5">
              <div className="text-[10px] font-serif uppercase tracking-[0.18em] text-[#8C7D6B] font-semibold">
                Counts Charged in the True Bill / Information:
              </div>
              {currentCase.stage3.charges.map((ch, idx) => (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] border border-[#E2DBD0] p-3.5 rounded-sm flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-serif font-bold text-[#8B261D]">
                        {ch.count}
                      </span>
                      <span className="text-xs font-mono text-[#8C7D6B]">
                        § {ch.statute}
                      </span>
                    </div>
                    <div className="text-sm font-serif font-semibold text-[#1A1917] mt-0.5">
                      {ch.name}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 border border-[#CBB8A1] bg-[#F7F3EB] text-[#5A4832] text-xs font-serif rounded-sm">
                    {ch.degree}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 4: Formal Pleas */}
        {activeClueTab === 4 && (
          <div className="space-y-5">
            <div className="bg-[#F2EDE2] border border-[#DDD5C7] p-4 rounded-sm text-xs font-serif text-[#4A4237]">
              <strong className="text-[#1A1917] uppercase tracking-wider block mb-1 text-[11px]">
                Plea Allocution & Pre-Trial Negotiations:
              </strong>
              {currentCase.stage4.context}
            </div>

            <div className="space-y-2.5">
              {currentCase.stage4.pleas.map((pl, idx) => (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] border border-[#E2DBD0] p-3.5 rounded-sm flex flex-wrap items-center justify-between gap-3"
                >
                  <span className="text-xs font-serif font-semibold text-[#1A1917]">
                    {pl.count}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-sm text-xs font-serif border ${
                      pl.badge === "guilty"
                        ? "bg-[#FBEAE8] border-[#E8B8B3] text-[#8B261D]"
                        : pl.badge === "reduced"
                          ? "bg-[#FBF4E8] border-[#E8D4B0] text-[#7A5822]"
                          : pl.badge === "dismissed"
                            ? "bg-[#EBF2EC] border-[#BED6C3] text-[#2D5A3D]"
                            : "bg-[#F2EDE2] border-[#D5CDBD] text-[#5C5346]"
                    }`}
                  >
                    {pl.plea}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 5: Convictions & Guidelines */}
        {activeClueTab === 5 && (
          <div className="space-y-5">
            <div className="bg-[#F2EDE2] border border-[#DDD5C7] p-4 rounded-sm text-xs font-serif text-[#4A4237]">
              <strong className="text-[#1A1917] uppercase tracking-wider block mb-1 text-[11px]">
                Adjudicated Findings of Guilt:
              </strong>
              {currentCase.stage5.context}
            </div>

            <div className="space-y-2.5">
              {currentCase.stage5.convictions.map((cv, idx) => (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] border border-[#E2DBD0] p-3 rounded-sm flex items-center justify-between gap-3 text-xs font-serif"
                >
                  <span className="font-bold text-[#8B261D]">{cv.count}</span>
                  <span className="font-medium text-[#1A1917]">
                    {cv.verdict}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-[#FAF6EE] border border-[#DFD5C2] p-4 rounded-sm text-xs font-serif text-[#4A4237]">
              <strong className="text-[#8C6D37] block mb-1 uppercase tracking-wider text-[11px]">
                Statutory & Guidelines Scope:
              </strong>
              {currentCase.stage5.statutoryRange}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

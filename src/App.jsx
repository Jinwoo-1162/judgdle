import React, { useState, useEffect, useRef } from "react";
import { Award } from "lucide-react";
import { CASES, SENTENCE_TIERS, STAGE_DEFINITIONS } from "./cases";
import {
  Header,
  EvidenceDossier,
  VerdictModal,
  SentenceBuilder,
  UXGuideTab,
  PublicRecordsTab,
} from "./components";
import { playSound } from "./utils/audio";

export default function App() {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const currentCase = CASES[selectedCaseIndex];

  // Game state per case ID
  const [gameStates, setGameStates] = useState(() => {
    const initial = {};
    CASES.forEach((c) => {
      initial[c.id] = {
        stageUnlocked: 1,
        guesses: [],
        status: "playing",
      };
    });
    return initial;
  });

  const activeGameState = gameStates[currentCase.id];

  // Current sentence draft
  const [draftGuess, setDraftGuess] = useState({
    incarceration: 0,
    probation: 0,
    communityService: 0,
    fineRestitution: 0,
  });

  const [activeTab, setActiveTab] = useState("game"); // 'game' | 'ux-design' | 'data-sources'
  const [activeClueTab, setActiveClueTab] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedToast, setCopiedToast] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [showVerdictModal, setShowVerdictModal] = useState(false);
  const [animatingRound, setAnimatingRound] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evidenceFading, setEvidenceFading] = useState(false);
  const [revealedPillarCount, setRevealedPillarCount] = useState(4);

  const animTimeoutsRef = useRef([]);

  const clearAnimTimeouts = () => {
    animTimeoutsRef.current.forEach((t) => clearTimeout(t));
    animTimeoutsRef.current = [];
  };

  useEffect(() => {
    return () => clearAnimTimeouts();
  }, []);

  useEffect(() => {
    setActiveClueTab(activeGameState.stageUnlocked);
  }, [activeGameState.stageUnlocked, selectedCaseIndex]);

  // Midnight PST Reset Countdown
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const pstOffsetMs = -8 * 3600 * 1000;
      const pstNow = new Date(utcMs + pstOffsetMs);

      const nextMidnightPst = new Date(pstNow);
      nextMidnightPst.setHours(24, 0, 0, 0);
      const diff = Math.max(0, nextMidnightPst.getTime() - pstNow.getTime());

      const hrs = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(
        2,
        "0",
      );
      const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setCountdown(`${hrs}:${mins}:${secs}`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Strict Ternary Evaluation
  const evaluateComponent = (key, guessedIdx) => {
    const targetIdx = currentCase.solution[key];
    if (guessedIdx === targetIdx) return { result: "correct" };
    if (guessedIdx < targetIdx) return { result: "higher" };
    return { result: "lower" };
  };

  const handleSubmitGuess = () => {
    if (activeGameState.status !== "playing" || isEvaluating) return;

    clearAnimTimeouts();
    setIsEvaluating(true);

    const evaluation = {
      incarceration: evaluateComponent(
        "incarceration",
        draftGuess.incarceration,
      ),
      probation: evaluateComponent("probation", draftGuess.probation),
      communityService: evaluateComponent(
        "communityService",
        draftGuess.communityService,
      ),
      fineRestitution: evaluateComponent(
        "fineRestitution",
        draftGuess.fineRestitution,
      ),
    };

    const isAllCorrect = Object.values(evaluation).every(
      (ev) => ev.result === "correct",
    );
    const newGuessEntry = {
      ...draftGuess,
      evaluation,
      stageAtGuess: activeGameState.stageUnlocked,
    };

    const updatedGuesses = [...activeGameState.guesses, newGuessEntry];
    let nextStatus = "playing";
    let nextStage = activeGameState.stageUnlocked;

    if (isAllCorrect) {
      nextStatus = "won";
      nextStage = 5;
    } else if (updatedGuesses.length >= 5) {
      nextStatus = "lost";
      nextStage = 5;
    } else {
      nextStage = Math.min(5, activeGameState.stageUnlocked + 1);
    }

    // Step 1: Record guess into game state, reset revealed pillar count to 0
    setGameStates((prev) => ({
      ...prev,
      [currentCase.id]: {
        ...prev[currentCase.id],
        guesses: updatedGuesses,
      },
    }));
    setRevealedPillarCount(0);
    setAnimatingRound(updatedGuesses.length);
    playSound("gavel", soundEnabled);

    // Staggered top-down card reveals: each card reveals its status, triggers its bounce, and plays its verdict audio
    const t0 = setTimeout(() => {
      setRevealedPillarCount(1); // Pillar 0 (Incarceration)
      playSound(evaluation.incarceration.result, soundEnabled);
    }, 60);

    const t1 = setTimeout(() => {
      setRevealedPillarCount(2); // Pillar 1 (Probation)
      playSound(evaluation.probation.result, soundEnabled);
    }, 460);

    const t2 = setTimeout(() => {
      setRevealedPillarCount(3); // Pillar 2 (Community Service)
      playSound(evaluation.communityService.result, soundEnabled);
    }, 860);

    const t3 = setTimeout(() => {
      setRevealedPillarCount(4); // Pillar 3 (Fines & Restitution)
      playSound(evaluation.fineRestitution.result, soundEnabled);
    }, 1260);

    // Step 2: After all 4 tier cards have finished their 620ms animations (~1900ms), start evidence fade out
    const t4 = setTimeout(() => {
      setEvidenceFading(true);
    }, 1950);

    // Step 3: Advance stage unlocked and switch clue tab while evidence is faded out, then smoothly fade in with page turn audio
    const t5 = setTimeout(() => {
      setGameStates((prev) => ({
        ...prev,
        [currentCase.id]: {
          ...prev[currentCase.id],
          stageUnlocked: nextStage,
        },
      }));
      setActiveClueTab(nextStage);
      setEvidenceFading(false);
      playSound("pageTurn", soundEnabled);
    }, 2350);

    // Step 4: Conclude deliberation round, show celebration/conclusion modal if finished, and unlock inputs
    const t6 = setTimeout(() => {
      setGameStates((prev) => ({
        ...prev,
        [currentCase.id]: {
          ...prev[currentCase.id],
          status: nextStatus,
        },
      }));

      if (nextStatus === "won") {
        setShowVerdictModal(true);
        playSound("jailBars", soundEnabled);
      } else if (nextStatus === "lost") {
        setShowVerdictModal(true);
        playSound("doorClose", soundEnabled);
      }

      setAnimatingRound(null);
      setIsEvaluating(false);
      setRevealedPillarCount(4);
    }, 2850);

    animTimeoutsRef.current = [t0, t1, t2, t3, t4, t5, t6];
  };

  const handleResetCase = () => {
    clearAnimTimeouts();
    setIsEvaluating(false);
    setAnimatingRound(null);
    setRevealedPillarCount(4);
    setEvidenceFading(false);
    setShowVerdictModal(false);
    setGameStates((prev) => ({
      ...prev,
      [currentCase.id]: {
        stageUnlocked: 1,
        guesses: [],
        status: "playing",
      },
    }));
    setDraftGuess({
      incarceration: 0,
      probation: 0,
      communityService: 0,
      fineRestitution: 0,
    });
    setActiveClueTab(1);
  };

  const togglePenaltyQuick = (key) => {
    if (activeGameState.status !== "playing") return;
    setDraftGuess((prev) => ({
      ...prev,
      [key]: prev[key] === 0 ? 2 : 0,
    }));
  };

  const handleAdvanceStageDev = () => {
    setGameStates((prev) => ({
      ...prev,
      [currentCase.id]: {
        ...prev[currentCase.id],
        stageUnlocked: Math.min(5, prev[currentCase.id].stageUnlocked + 1),
      },
    }));
  };

  const handleShareResults = () => {
    const rows = activeGameState.guesses
      .map((g, idx) => {
        const icons = [
          "incarceration",
          "probation",
          "communityService",
          "fineRestitution",
        ]
          .map((k) => {
            const res = g.evaluation[k].result;
            if (res === "correct") return "🟩";
            if (res === "higher") return "⬆️";
            return "⬇️";
          })
          .join("");
        return `Stage ${idx + 1}: ${icons}`;
      })
      .join("\n");

    const scoreLabel =
      activeGameState.status === "won"
        ? `${activeGameState.guesses.length}/5`
        : "X/5";

    const shareText = `⚖️ JUDGDLE — ${currentCase.caseNumber} (${currentCase.stage2.defendantName})\nJudicial Verdict: ${scoreLabel}\n${rows}\nResets at 12:00 AM PST`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareText);
      } else {
        const ta = document.createElement("textarea");
        ta.value = shareText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
    } catch (e) {
      // Fallback
    }

    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#22201D] font-serif antialiased pb-16 selection:bg-[#E8DCC9] selection:text-[#1A1917]">
      <Header
        countdown={countdown}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cases={CASES}
        selectedCaseIndex={selectedCaseIndex}
        setSelectedCaseIndex={(idx) => {
          clearAnimTimeouts();
          setIsEvaluating(false);
          setAnimatingRound(null);
          setRevealedPillarCount(4);
          setEvidenceFading(false);
          setShowVerdictModal(false);
          setSelectedCaseIndex(idx);
        }}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {activeTab === "game" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: The Court Record & Evidence (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                <EvidenceDossier
                  currentCase={currentCase}
                  activeGameState={activeGameState}
                  activeClueTab={activeClueTab}
                  setActiveClueTab={setActiveClueTab}
                  stageDefinitions={STAGE_DEFINITIONS}
                  onResetCase={handleResetCase}
                  onAdvanceStageDev={handleAdvanceStageDev}
                  evidenceFading={evidenceFading}
                  soundEnabled={soundEnabled}
                />
              </div>

              {/* RIGHT COLUMN: The Judicial Sentencing Worksheet (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                {activeGameState.status !== "playing" && (
                  <button
                    onClick={() => setShowVerdictModal(true)}
                    className="w-full py-2.5 px-4 bg-[#FAF8F5] border border-[#BFA77F] hover:bg-[#F2EDE2] text-[#8B261D] text-xs font-serif font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2 rounded-sm shadow-xs transition cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-[#8C6D37]" />
                    <span>
                      {activeGameState.status === "won"
                        ? "View Victory Verdict & Share Score"
                        : "View Case Conclusion & Verdict"}
                    </span>
                  </button>
                )}

                <SentenceBuilder
                  sentenceTiers={SENTENCE_TIERS}
                  draftGuess={draftGuess}
                  setDraftGuess={setDraftGuess}
                  activeGameState={activeGameState}
                  onSubmitGuess={handleSubmitGuess}
                  animatingRound={animatingRound}
                  isEvaluating={isEvaluating}
                  revealedPillarCount={revealedPillarCount}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "ux-design" && <UXGuideTab />}
        {activeTab === "data-sources" && <PublicRecordsTab />}
      </main>

      {/* Pop-up Overlay for Case Outcome / Celebration */}
      <VerdictModal
        isOpen={showVerdictModal}
        onClose={() => setShowVerdictModal(false)}
        status={activeGameState.status}
        guessesCount={activeGameState.guesses.length}
        currentCase={currentCase}
        onShare={handleShareResults}
        copiedToast={copiedToast}
        onReset={handleResetCase}
      />
    </div>
  );
}

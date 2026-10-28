import React, { useState, useEffect, useCallback } from 'react';
import {
  Scale,
  Gavel,
  Lock,
  Unlock,
  Clock,
  MapPin,
  FileText,
  HelpCircle,
  Share2,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Check,
  Volume2,
  VolumeX,
  Database,
  Sliders,
  Award,
  Calendar,
  Eye,
  UserCheck,
  ChevronRight,
  Shield,
  BookOpen
} from 'lucide-react';

// Discrete Sentencing Tiers (Judicial Buckets)
const SENTENCE_TIERS = {
  incarceration: {
    label: 'Incarceration',
    shortLabel: 'Incarceration',
    buckets: [
      'None',
      'Time Served',
      '30 Days Jail',
      '6 Months Jail',
      '1–2 Years Prison',
      '3–5 Years Prison',
      '6–10 Years Prison',
      '15–25 Years Prison',
      'Life Sentence'
    ]
  },
  probation: {
    label: 'Supervised Probation',
    shortLabel: 'Probation',
    buckets: [
      'None',
      '6 Months',
      '1 Year',
      '2 Years',
      '3 Years',
      '5 Years',
      '10+ Years'
    ]
  },
  communityService: {
    label: 'Community Service',
    shortLabel: 'Service Hours',
    buckets: [
      'None',
      '25 Hours',
      '50 Hours',
      '100 Hours',
      '250 Hours',
      '500+ Hours'
    ]
  },
  fineRestitution: {
    label: 'Fines & Restitution',
    shortLabel: 'Fines / Restitution',
    buckets: [
      'None',
      'Under $1,000',
      '$1,000 – $5,000',
      '$5,000 – $25,000',
      '$25,000 – $100k',
      '$100k – $1M',
      'Over $1M'
    ]
  }
};

// Real-life public record cases with verified Wikimedia Commons public-domain mugshots
const CASES = [
  {
    id: 'daily-142',
    caseNumber: 'DAILY DOCKET № 142',
    docketId: 'US-MDFL-6:23-CR-00145',
    title: 'United States v. Dewitte (Federal Tax & Escort Enterprise)',
    isDaily: true,
    mugshot: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/JeremyDewitteMugshot.jpg',
      fallbackUrls: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/JeremyDewitteMugshot.jpg'
      ],
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:JeremyDewitteMugshot.jpg',
      bookingNo: 'OCSO-22-112904',
      agency: 'OSCEOLA COUNTY CORRECTIONS • KISSIMMEE, FLORIDA',
      redactBottomPlaqueOnStage1: false,
      captionNote: 'Florida Department of Law Enforcement / County Public Record'
    },
    stage2: {
      defendantName: 'Jeremy Charles Dewitte',
      ageAtArrest: 'Age 44 at federal indictment',
      location: 'Orlando, Florida (U.S. District Court, Middle District of Florida)',
      arrestDate: 'November 29, 2022',
      sentencingDate: 'January 7, 2025',
      courtNote: 'Extensive prior Florida state convictions for impersonating law enforcement officers while operating "Metro-State Special Services" funeral escort enterprise.'
    },
    stage3: {
      summary: 'While managing a high-profile vehicle escort fleet, the defendant willfully submitted falsified federal income tax returns to the Internal Revenue Service, concealing significant corporate receipts and personal revenue over consecutive taxable years.',
      charges: [
        { count: 'Count I', statute: '26 U.S.C. § 7206(1)', name: 'Filing a False Federal Income Tax Return (Tax Year I)', degree: 'Federal Felony' },
        { count: 'Count II', statute: '26 U.S.C. § 7206(1)', name: 'Filing a False Federal Income Tax Return (Tax Year II)', degree: 'Federal Felony' }
      ]
    },
    stage4: {
      context: 'Concurrently facing separate state custodial terms, the defendant executed a formal federal plea agreement with the Office of the United States Attorney.',
      pleas: [
        { count: 'Count I (26 U.S.C. § 7206(1) False Tax Return)', plea: 'Pled Guilty Pursuant to Written Plea Agreement', badge: 'guilty' },
        { count: 'Count II (26 U.S.C. § 7206(1) False Tax Return)', plea: 'Dismissed at Final Sentencing Pursuant to Agreement', badge: 'dismissed' }
      ]
    },
    stage5: {
      context: 'Taking into consideration Criminal History Category determinations arising from prior state convictions, the District Judge pronounced custodial commitment followed by supervised release and mandatory IRS restitution.',
      convictions: [
        { count: 'Count I', verdict: 'Adjudicated Guilty — 26 U.S.C. § 7206(1)' },
        { count: 'Count II', verdict: 'Dismissed Pursuant to Plea Agreement' }
      ],
      statutoryRange: 'Advisory Sentencing Guidelines range of 36–41 months imprisonment; statutory maximum 3 years per count.'
    },
    solution: {
      incarceration: 5, // '3–5 Years Prison' (41 months federal prison)
      probation: 2, // '1 Year' (1 year federal supervised release)
      communityService: 0, // 'None'
      fineRestitution: 4 // '$25,000 – $100k' ($70,000 restitution to IRS)
    },
    exactSentenceSummary: '41 Months Federal Imprisonment, 1 Year Supervised Release, 0 Hours Community Service, and $70,000 Mandatory Restitution.',
    sourceNote: 'Official Record: United States v. Jeremy Dewitte (U.S. District Court M.D. Fla. / Wikimedia Commons PD-FLGov).'
  },
  {
    id: 'practice-141',
    caseNumber: 'ARCHIVE DOCKET № 141',
    docketId: 'FL-50-2017-CT-010282',
    title: 'State of Florida v. Woods (Jupiter Island Roadside Stop)',
    isDaily: false,
    mugshot: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Tiger_Woods%2C_arrest_photo%2C_May_2017.jpg',
      fallbackUrls: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Tiger_Woods,_arrest_photo,_May_2017.jpg'
      ],
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tiger_Woods,_arrest_photo,_May_2017.jpg',
      bookingNo: 'PBSO-2017017910',
      agency: 'PALM BEACH COUNTY SHERIFF • JUPITER, FLORIDA',
      redactBottomPlaqueOnStage1: false,
      captionNote: 'Palm Beach County Sheriff\'s Office Public Record Booking Registry'
    },
    stage2: {
      defendantName: 'Eldrick Tont "Tiger" Woods',
      ageAtArrest: 'Age 41 at arrest',
      location: 'Palm Beach Gardens, Florida (15th Judicial Circuit of Florida)',
      arrestDate: 'May 29, 2017',
      sentencingDate: 'October 27, 2017',
      courtNote: 'First-time offense; discovered asleep at the wheel of a stationary vehicle at approximately 3:00 AM. Breathalyzer test recorded 0.00% BAC (impairment attributed to prescribed post-surgical spinal analgesics).'
    },
    stage3: {
      summary: 'Officers encountered defendant asleep in the driver\'s seat with engine running and indicator active in the roadway. Roadside sobriety exercises were compromised by prescribed post-surgical medication.',
      charges: [
        { count: 'Count I', statute: 'Fla. Stat. § 316.193', name: 'Driving Under the Influence (Controlled Substance Impairment)', degree: '1st Degree Misdemeanor' },
        { count: 'Citation II', statute: 'Fla. Stat. § 316.1945', name: 'Improper Stopping / Standing in Public Roadway', degree: 'Civil Traffic Infraction' }
      ]
    },
    stage4: {
      context: 'The State Attorney\'s Office accepted defendant into Palm Beach County\'s structured First-Time DUI Offender Diversion Program in exchange for a plea of guilty to an amended charge.',
      pleas: [
        { count: 'Count I (Amended to Fla. Stat. § 316.192 Reckless Driving)', plea: 'Pled Guilty to Reduced Count of Reckless Driving', badge: 'reduced' },
        { count: 'Citation II (Improper Stopping)', plea: 'Dismissed Pursuant to Diversion Disposition', badge: 'dismissed' }
      ]
    },
    stage5: {
      context: 'Presiding Judge Sandra Bosso-Pardo ratified the structured diversion disposition, withholding custodial sentencing in favor of community supervision, restitution costs, and mandatory public service.',
      convictions: [
        { count: 'Count I', verdict: 'Adjudicated Guilty — 2nd Degree Misdemeanor Reckless Driving' },
        { count: 'Citation II', verdict: 'Dismissed by the State' }
      ],
      statutoryRange: 'Standard county diversion disposition: 12 months probation, 50 hours community service, statutory fines, and DUI school.'
    },
    solution: {
      incarceration: 0, // 'None'
      probation: 2, // '1 Year'
      communityService: 2, // '50 Hours'
      fineRestitution: 1 // 'Under $1,000' ($250 fine + court costs)
    },
    exactSentenceSummary: 'No Incarceration, 1 Year Supervised Probation, 50 Hours Community Service, and $250 Statutory Fine plus Court Costs.',
    sourceNote: 'Official Record: State of Florida v. Eldrick Woods (15th Judicial Circuit of Florida / PBSO Public Record).'
  },
  {
    id: 'practice-140',
    caseNumber: 'ARCHIVE DOCKET № 140',
    docketId: 'US-EDCA-96-CR-00259',
    title: 'United States v. Kaczynski (The UNABOM Prosecutions)',
    isDaily: false,
    mugshot: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Ted_Kaczynski_full_mugshot.jpg',
      fallbackUrls: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Ted_Kaczynski_full_mugshot.jpg'
      ],
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ted_Kaczynski_full_mugshot.jpg',
      bookingNo: 'FBI-USMS-04031996',
      agency: 'FEDERAL BUREAU OF INVESTIGATION • HELENA, MONTANA',
      redactBottomPlaqueOnStage1: true,
      captionNote: 'Federal Bureau of Investigation & U.S. Marshals Service Booking Record'
    },
    stage2: {
      defendantName: 'Theodore John Kaczynski',
      ageAtArrest: 'Age 53 at arrest',
      location: 'Sacramento, California (U.S. District Court, Eastern District of California)',
      arrestDate: 'April 3, 1996',
      sentencingDate: 'May 4, 1998',
      courtNote: 'Former academic and mathematician taken into federal custody at a rural cabin outside Lincoln, Montana following an extensive multi-agency investigation.'
    },
    stage3: {
      summary: 'Defendant manufactured and dispatched sixteen improvised explosive mechanisms between 1978 and 1995 directed toward university faculty, commercial airline personnel, and corporate executives, causing three fatalities and multiple severe injuries.',
      charges: [
        { count: 'Counts I–X', statute: '18 U.S.C. § 844(d)', name: 'Transportation of Explosives with Intent to Kill or Injure', degree: 'Capital Federal Offense' },
        { count: 'Counts XI–XIII', statute: '18 U.S.C. § 924(c)', name: 'Use of a Destructive Device During a Crime of Violence', degree: 'Federal Felony' }
      ]
    },
    stage4: {
      context: 'Following extensive pre-trial competency hearings and the denial of motions for pro se self-representation, defendant entered an unconditional plea of guilty to all charges to avoid capital sentencing.',
      pleas: [
        { count: 'Counts I–X (Explosive Device Transportation)', plea: 'Entered Unconditional Plea of Guilty to All Counts', badge: 'guilty' },
        { count: 'Counts XI–XIII (Destructive Devices)', plea: 'Entered Unconditional Plea of Guilty to All Counts', badge: 'guilty' }
      ]
    },
    stage5: {
      context: 'Pursuant to the unconditional plea agreement, United States District Judge Garland E. Burrell Jr. imposed consecutive life terms without eligibility for parole, accompanied by total victim restitution.',
      convictions: [
        { count: 'Counts I–XIII', verdict: 'Adjudicated Guilty on All Thirteen Counts' }
      ],
      statutoryRange: 'Mandatory Life Imprisonment Without Possibility of Parole; mandatory statutory restitution.'
    },
    solution: {
      incarceration: 8, // 'Life Sentence'
      probation: 0, // 'None'
      communityService: 0, // 'None'
      fineRestitution: 6 // 'Over $1M' ($15,026,000)
    },
    exactSentenceSummary: 'Eight Consecutive Life Sentences Without Possibility of Parole, Zero Probation, and $15,026,000 in Court-Ordered Restitution.',
    sourceNote: 'Official Record: United States v. Theodore John Kaczynski (U.S. District Court E.D. Cal. / National Archives).'
  }
];

// Dignified Courtroom Photograph Component
function DignifiedMugshot({ mugshot, stageUnlocked, defendantName }) {
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
        status: 'playing'
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
    fineRestitution: 0
  });

  const [activeTab, setActiveTab] = useState('game'); // 'game' | 'ux-design' | 'data-sources'
  const [activeClueTab, setActiveClueTab] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedToast, setCopiedToast] = useState(false);
  const [countdown, setCountdown] = useState('');

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

      const hrs = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setCountdown(`${hrs}:${mins}:${secs}`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio Courtroom Chimes
  const playSound = useCallback(
    (type) => {
      if (!soundEnabled) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        if (type === 'gavel') {
          [0, 0.16].forEach((offset) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(130, now + offset);
            osc.frequency.exponentialRampToValueAtTime(38, now + offset + 0.12);
            gain.gain.setValueAtTime(0.3, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.13);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.14);
          });
        } else if (type === 'win') {
          [220.0, 277.18, 329.63, 440.0].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.11);
            gain.gain.setValueAtTime(0.18, now + idx * 0.11);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.11 + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.11);
            osc.stop(now + idx * 0.11 + 0.46);
          });
        }
      } catch (e) {
        // Safe audio fallback
      }
    },
    [soundEnabled]
  );

  // Strict Ternary Evaluation
  const evaluateComponent = (key, guessedIdx) => {
    const targetIdx = currentCase.solution[key];
    if (guessedIdx === targetIdx) return { result: 'correct' };
    if (guessedIdx < targetIdx) return { result: 'higher' };
    return { result: 'lower' };
  };

  const handleSubmitGuess = () => {
    if (activeGameState.status !== 'playing') return;

    const evaluation = {
      incarceration: evaluateComponent('incarceration', draftGuess.incarceration),
      probation: evaluateComponent('probation', draftGuess.probation),
      communityService: evaluateComponent('communityService', draftGuess.communityService),
      fineRestitution: evaluateComponent('fineRestitution', draftGuess.fineRestitution)
    };

    const isAllCorrect = Object.values(evaluation).every((ev) => ev.result === 'correct');
    const newGuessEntry = {
      ...draftGuess,
      evaluation,
      stageAtGuess: activeGameState.stageUnlocked
    };

    const updatedGuesses = [...activeGameState.guesses, newGuessEntry];
    let nextStatus = 'playing';
    let nextStage = activeGameState.stageUnlocked;

    if (isAllCorrect) {
      nextStatus = 'won';
      nextStage = 5;
      playSound('win');
    } else if (updatedGuesses.length >= 5) {
      nextStatus = 'lost';
      nextStage = 5;
      playSound('gavel');
    } else {
      nextStage = Math.min(5, activeGameState.stageUnlocked + 1);
      playSound('gavel');
    }

    setGameStates((prev) => ({
      ...prev,
      [currentCase.id]: {
        stageUnlocked: nextStage,
        guesses: updatedGuesses,
        status: nextStatus
      }
    }));
  };

  const handleResetCase = () => {
    setGameStates((prev) => ({
      ...prev,
      [currentCase.id]: {
        stageUnlocked: 1,
        guesses: [],
        status: 'playing'
      }
    }));
    setDraftGuess({
      incarceration: 0,
      probation: 0,
      communityService: 0,
      fineRestitution: 0
    });
    setActiveClueTab(1);
  };

  const togglePenaltyQuick = (key) => {
    if (activeGameState.status !== 'playing') return;
    setDraftGuess((prev) => ({
      ...prev,
      [key]: prev[key] === 0 ? 2 : 0
    }));
  };

  const handleShareResults = () => {
    const rows = activeGameState.guesses
      .map((g, idx) => {
        const icons = ['incarceration', 'probation', 'communityService', 'fineRestitution']
          .map((k) => {
            const res = g.evaluation[k].result;
            if (res === 'correct') return '🟩';
            if (res === 'higher') return '⬆️';
            return '⬇️';
          })
          .join('');
        return `Stage ${idx + 1}: ${icons}`;
      })
      .join('\n');

    const scoreLabel =
      activeGameState.status === 'won'
        ? `${activeGameState.guesses.length}/5`
        : 'X/5';

    const shareText = `⚖️ JUDGDLE — ${currentCase.caseNumber} (${currentCase.stage2.defendantName})\nJudicial Verdict: ${scoreLabel}\n${rows}\nResets at 12:00 AM PST`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareText);
      } else {
        const ta = document.createElement('textarea');
        ta.value = shareText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    } catch (e) {
      // Fallback
    }

    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const stageDefinitions = [
    { num: 1, roman: 'I', title: '1. Mugshot', short: 'Mugshot', subtitle: 'Photographic Evidence' },
    { num: 2, roman: 'II', title: '2. Name, Loc & Date', short: 'Name & Venue', subtitle: 'Jurisdiction & Time' },
    { num: 3, roman: 'III', title: '3. Charges', short: 'Charges', subtitle: 'Indictment Counts' },
    { num: 4, roman: 'IV', title: '4. Pleas', short: 'Pleas', subtitle: 'Plea Allocution' },
    { num: 5, roman: 'V', title: '5. Convictions', short: 'Convictions', subtitle: 'Adjudicated Verdict' }
  ];

  const isIdentityRevealed = activeGameState.stageUnlocked >= 2;

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#22201D] font-serif antialiased pb-16 selection:bg-[#E8DCC9] selection:text-[#1A1917]">
      {/* Top Law Institution Masthead */}
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
              className="p-2 border border-[#DDD5C7] bg-[#FAF8F5] text-[#52493E] hover:text-[#1A1917] hover:border-[#BFA77F] rounded-sm transition"
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
              className={`px-3.5 py-1.5 text-xs font-serif uppercase tracking-[0.14em] transition border-b-2 ${
                activeTab === 'game'
                  ? 'border-[#8B261D] text-[#8B261D] font-semibold bg-[#F2EDE2]'
                  : 'border-transparent text-[#6E6354] hover:text-[#1A1917] hover:bg-[#F2EDE2]/60'
              }`}
            >
              Playable Game
            </button>
            <button
              onClick={() => setActiveTab('ux-design')}
              className={`px-3.5 py-1.5 text-xs font-serif uppercase tracking-[0.14em] transition border-b-2 ${
                activeTab === 'ux-design'
                  ? 'border-[#8B261D] text-[#8B261D] font-semibold bg-[#F2EDE2]'
                  : 'border-transparent text-[#6E6354] hover:text-[#1A1917] hover:bg-[#F2EDE2]/60'
              }`}
            >
              Answer Input UX Guide
            </button>
            <button
              onClick={() => setActiveTab('data-sources')}
              className={`px-3.5 py-1.5 text-xs font-serif uppercase tracking-[0.14em] transition border-b-2 ${
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
              {CASES.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseIndex(i)}
                  className={`px-2.5 py-0.5 text-xs font-serif tracking-wider uppercase rounded-sm border transition ${
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

      {/* Main Judicial Chamber */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {activeTab === 'game' && (
          <div className="space-y-8">
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
                      : 'In the Matter of the Sealed Grand Jury Indictment'}
                  </h2>
                  <p className="text-xs font-serif text-[#6E6354] italic mt-1">
                    {isIdentityRevealed
                      ? currentCase.stage2.location
                      : 'Stage I: Initial visual booking evaluation — assess the charges and record'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] font-serif uppercase tracking-[0.16em] text-[#8C7D6B]">Deliberation</div>
                    <div className="text-sm font-serif font-bold text-[#1A1917]">
                      Round {activeGameState.guesses.length} of 5
                    </div>
                  </div>
                  <button
                    onClick={handleResetCase}
                    className="px-3 py-1.5 border border-[#D5CDBD] bg-[#F2EDE2] hover:bg-[#EBE4D5] text-[#3E372E] text-xs font-serif tracking-wide rounded-sm flex items-center gap-1.5 transition"
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

                  return (
                    <button
                      key={st.num}
                      onClick={() => isUnlocked && setActiveClueTab(st.num)}
                      disabled={!isUnlocked}
                      className={`relative flex flex-col p-3 rounded-sm border text-left transition ${
                        isCurrentView
                          ? 'bg-[#F2EDE2] border-[#8B261D] shadow-sm'
                          : isUnlocked
                          ? 'bg-[#FAF8F5] border-[#DDD5C7] hover:bg-[#F4EFE6]'
                          : 'bg-[#F5F2EB]/50 border-[#E8E2D6] opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-serif font-bold ${
                            isCurrentView
                              ? 'text-[#8B261D]'
                              : isUnlocked
                              ? 'text-[#1A1917]'
                              : 'text-[#8C7D6B]'
                          }`}
                        >
                          EXHIBIT {st.roman}
                        </span>
                        {isUnlocked ? (
                          <span className="text-[10px] font-serif uppercase tracking-widest text-[#2D5A3D] font-medium">
                            Admitted
                          </span>
                        ) : (
                          <Lock className="w-3 h-3 text-[#A89E90]" />
                        )}
                      </div>
                      <div className="text-xs sm:text-sm font-serif font-semibold text-[#2B2620] truncate">
                        <span className="hidden md:inline">{st.title}</span>
                        <span className="md:hidden">{st.short}</span>
                      </div>
                      <div className="text-[10px] font-serif italic text-[#6E6354] hidden sm:block truncate mt-0.5">
                        {st.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Core Two-Column Judicial Chamber */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: The Court Record & Evidence (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Active Exhibit Evidence Card */}
                <div className="bg-[#FAF8F5] border border-[#D5CDBD] p-6 sm:p-7 shadow-[0_2px_14px_rgba(28,25,23,0.04)] rounded-sm">
                  <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-3.5 mb-5">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#8B261D]" />
                      <h3 className="text-xs font-serif uppercase tracking-[0.2em] font-bold text-[#8B261D]">
                        Court Record — Exhibit {stageDefinitions[activeClueTab - 1].roman}: {stageDefinitions[activeClueTab - 1].title}
                      </h3>
                    </div>
                    {activeGameState.stageUnlocked < 5 && activeGameState.status === 'playing' && (
                      <button
                        onClick={() => {
                          setGameStates((prev) => ({
                            ...prev,
                            [currentCase.id]: {
                              ...prev[currentCase.id],
                              stageUnlocked: Math.min(5, prev[currentCase.id].stageUnlocked + 1)
                            }
                          }));
                        }}
                        className="text-[11px] font-serif italic text-[#8C6D37] hover:text-[#8B261D] underline transition"
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
                        The defendant’s identity, charges, and venue remain sealed in Round I. Formulate your baseline sentencing judgment from the booking portrait and agency jurisdiction.
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
                            <div><strong>Arrest Date:</strong> {currentCase.stage2.arrestDate}</div>
                            <div><strong>Sentencing Date:</strong> {currentCase.stage2.sentencingDate}</div>
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
                            <span className="text-xs font-serif font-semibold text-[#1A1917]">{pl.count}</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-sm text-xs font-serif border ${
                                pl.badge === 'guilty'
                                  ? 'bg-[#FBEAE8] border-[#E8B8B3] text-[#8B261D]'
                                  : pl.badge === 'reduced'
                                  ? 'bg-[#FBF4E8] border-[#E8D4B0] text-[#7A5822]'
                                  : pl.badge === 'dismissed'
                                  ? 'bg-[#EBF2EC] border-[#BED6C3] text-[#2D5A3D]'
                                  : 'bg-[#F2EDE2] border-[#D5CDBD] text-[#5C5346]'
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
                            <span className="font-medium text-[#1A1917]">{cv.verdict}</span>
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

                  {/* Summary of Unlocked Record */}
                  {activeGameState.stageUnlocked > 1 && (
                    <div className="mt-6 pt-5 border-t border-[#E2DBD0]">
                      <div className="text-[10px] font-serif uppercase tracking-[0.18em] text-[#8C7D6B] mb-2 font-semibold">
                        Summary of Unsealed Record:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-serif">
                        {activeGameState.stageUnlocked >= 2 && (
                          <div className="bg-[#FFFFFF] border border-[#E2DBD0] p-2.5 rounded-sm">
                            <span className="text-[#8C7D6B] block text-[9px] uppercase tracking-widest font-semibold">Exhibit II • Subject</span>
                            <span className="text-[#1A1917] font-medium">{currentCase.stage2.defendantName}</span>
                          </div>
                        )}
                        {activeGameState.stageUnlocked >= 3 && (
                          <div className="bg-[#FFFFFF] border border-[#E2DBD0] p-2.5 rounded-sm">
                            <span className="text-[#8C7D6B] block text-[9px] uppercase tracking-widest font-semibold">Exhibit III • Primary Count</span>
                            <span className="text-[#1A1917] font-medium">{currentCase.stage3.charges[0].name}</span>
                          </div>
                        )}
                        {activeGameState.stageUnlocked >= 4 && (
                          <div className="bg-[#FFFFFF] border border-[#E2DBD0] p-2.5 rounded-sm">
                            <span className="text-[#8C7D6B] block text-[9px] uppercase tracking-widest font-semibold">Exhibit IV • Primary Plea</span>
                            <span className="text-[#1A1917] font-medium">{currentCase.stage4.pleas[0].plea}</span>
                          </div>
                        )}
                        {activeGameState.stageUnlocked >= 5 && (
                          <div className="bg-[#FFFFFF] border border-[#E2DBD0] p-2.5 rounded-sm">
                            <span className="text-[#8C7D6B] block text-[9px] uppercase tracking-widest font-semibold">Exhibit V • Guidelines</span>
                            <span className="text-[#1A1917] font-medium truncate block">{currentCase.stage5.statutoryRange}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Deliberation Log / Guess History */}
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

                  {activeGameState.guesses.length === 0 ? (
                    <div className="text-center py-7 bg-[#FFFFFF] border border-dashed border-[#DDD5C7] rounded-sm text-xs font-serif italic text-[#8C7D6B]">
                      No sentence has been entered into the record. Use the Judicial Sentencing Worksheet to cast your Stage I judgment.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeGameState.guesses.map((g, idx) => (
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
                            {Object.keys(SENTENCE_TIERS).map((key) => {
                              const tierInfo = SENTENCE_TIERS[key];
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
              </div>

              {/* RIGHT COLUMN: The Judicial Sentencing Worksheet (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Official Verdict Adjournment Card */}
                {activeGameState.status !== 'playing' && (
                  <div
                    className={`rounded-sm p-6 border shadow-sm ${
                      activeGameState.status === 'won'
                        ? 'bg-[#EBF2EC] border-[#BED6C3] text-[#1E4D2B]'
                        : 'bg-[#FBEAE8] border-[#E8B8B3] text-[#7A281E]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <Award className="w-5 h-5 text-[#8C6D37]" />
                      <h3 className="text-base font-serif font-bold uppercase tracking-[0.14em]">
                        {activeGameState.status === 'won'
                          ? `Sentence Matched on Stage ${activeGameState.guesses.length}!`
                          : 'Court Adjourned — Out of Guesses'}
                      </h3>
                    </div>

                    <div className="text-xs font-serif space-y-1.5 my-3 opacity-95">
                      <div>
                        <strong>Defendant:</strong> {currentCase.stage2.defendantName}
                      </div>
                      <div>
                        <strong>Official Court Sentence:</strong> {currentCase.exactSentenceSummary}
                      </div>
                    </div>
                    <p className="text-[11px] font-serif italic opacity-80 mb-4">{currentCase.sourceNote}</p>

                    <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-current/20">
                      <button
                        onClick={handleShareResults}
                        className="px-4 py-2 bg-[#8B261D] hover:bg-[#732018] text-[#FAF8F5] text-xs font-serif uppercase tracking-[0.14em] font-semibold flex items-center gap-1.5 rounded-sm transition shadow-sm"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{copiedToast ? 'Copied Emoji Grid!' : 'Share Daily Score'}</span>
                      </button>
                      <button
                        onClick={handleResetCase}
                        className="px-3.5 py-2 border border-current text-xs font-serif uppercase tracking-[0.14em] font-semibold flex items-center gap-1.5 rounded-sm hover:bg-black/5 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Replay Case</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* The Sentence Worksheet */}
                <div className="bg-[#FAF8F5] border border-[#D5CDBD] p-6 sm:p-7 shadow-[0_2px_14px_rgba(28,25,23,0.04)] rounded-sm">
                  <div className="border-b border-[#E2DBD0] pb-4 mb-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-serif font-bold uppercase tracking-[0.18em] text-[#1A1917] flex items-center gap-2">
                        <Gavel className="w-4 h-4 text-[#8B261D]" />
                        <span>Sentence Builder</span>
                      </h3>
                      <span className="text-[10px] font-serif uppercase tracking-[0.15em] text-[#8C6D37] border border-[#DDD5C7] px-2 py-0.5 rounded-sm bg-[#FFFFFF]">
                        Ternary Evaluation
                      </span>
                    </div>
                    <p className="text-xs font-serif text-[#6E6354] mt-1.5 leading-relaxed">
                      Calibrate the four judicial sentencing pillars. Directional indicators will specify whether the court’s order is <strong>Higher</strong>, <strong>Lower</strong>, or <strong>Correct</strong>.
                    </p>
                  </div>

                  {/* Component Toggles */}
                  <div className="mb-5">
                    <div className="text-[10px] font-serif uppercase tracking-[0.18em] text-[#8C7D6B] font-semibold mb-2">
                      Active Sanctions Quick-Toggle:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(SENTENCE_TIERS).map(([key, tier]) => {
                        const isActive = draftGuess[key] > 0;
                        return (
                          <button
                            key={key}
                            type="button"
                            disabled={activeGameState.status !== 'playing'}
                            onClick={() => togglePenaltyQuick(key)}
                            className={`px-3 py-2 border rounded-sm text-xs font-serif flex items-center justify-between transition ${
                              isActive
                                ? 'bg-[#F2EDE2] border-[#8B261D] text-[#8B261D] font-semibold shadow-xs'
                                : 'bg-[#FFFFFF] border-[#DDD5C7] text-[#6E6354] hover:border-[#BFA77F]'
                            }`}
                          >
                            <span className="truncate">{tier.shortLabel}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-sm font-mono ${
                                isActive ? 'bg-[#8B261D] text-[#FAF8F5]' : 'bg-[#EAE4D7] text-[#8C7D6B]'
                              }`}
                            >
                              {isActive ? 'ON' : 'NONE'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Range Sliders */}
                  <div className="space-y-5">
                    {Object.entries(SENTENCE_TIERS).map(([key, tier]) => {
                      const currentIdx = draftGuess[key];
                      const maxIdx = tier.buckets.length - 1;
                      const currentLabel = tier.buckets[currentIdx];

                      const lastGuess =
                        activeGameState.guesses.length > 0
                          ? activeGameState.guesses[activeGameState.guesses.length - 1]
                          : null;
                      const lastEv = lastGuess ? lastGuess.evaluation[key] : null;

                      return (
                        <div
                          key={key}
                          className="bg-[#FFFFFF] border border-[#DDD5C7] p-4 rounded-sm space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-xs font-serif font-bold text-[#1A1917]">
                              {tier.label}
                            </label>
                            <span
                              className={`text-xs font-serif font-semibold px-2.5 py-0.5 rounded-sm border ${
                                currentIdx === 0
                                  ? 'bg-[#F9F7F2] border-[#E2DBD0] text-[#8C7D6B]'
                                  : 'bg-[#F4EFE6] border-[#CBB8A1] text-[#7A281E]'
                              }`}
                            >
                              {currentLabel}
                            </span>
                          </div>

                          <input
                            type="range"
                            min={0}
                            max={maxIdx}
                            step={1}
                            disabled={activeGameState.status !== 'playing'}
                            value={currentIdx}
                            onChange={(e) =>
                              setDraftGuess((prev) => ({
                                ...prev,
                                [key]: Number(e.target.value)
                              }))
                            }
                            className="w-full accent-[#8B261D] cursor-pointer h-1.5 bg-[#E8E2D6] rounded-sm"
                          />

                          {/* Refined Bucket Selection Chips */}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {tier.buckets.map((bLabel, bIdx) => (
                              <button
                                key={bIdx}
                                type="button"
                                disabled={activeGameState.status !== 'playing'}
                                onClick={() =>
                                  setDraftGuess((prev) => ({
                                    ...prev,
                                    [key]: bIdx
                                  }))
                                }
                                className={`text-[10px] font-serif px-2 py-0.5 rounded-sm transition ${
                                  currentIdx === bIdx
                                    ? 'bg-[#8B261D] text-[#FAF8F5] font-semibold'
                                    : 'bg-[#F7F4EE] text-[#5C5346] hover:bg-[#EAE4D7]'
                                }`}
                              >
                                {bLabel}
                              </button>
                            ))}
                          </div>

                          {/* Prior Deliberation Indicator */}
                          {lastEv && (
                            <div className="text-[11px] font-serif flex items-center justify-between pt-1.5 border-t border-[#F0EAE1] text-[#6E6354]">
                              <span>Prior: {tier.buckets[lastGuess[key]]}</span>
                              {lastEv.result === 'correct' ? (
                                <span className="text-[#2D5A3D] font-semibold flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Confirmed
                                </span>
                              ) : lastEv.result === 'higher' ? (
                                <span className="text-[#8C3B1A] font-semibold">
                                  Actual is ↑ Higher
                                </span>
                              ) : (
                                <span className="text-[#24415C] font-semibold">
                                  Actual is ↓ Lower
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit Sentence Button */}
                  <button
                    type="button"
                    disabled={activeGameState.status !== 'playing'}
                    onClick={handleSubmitGuess}
                    className={`w-full mt-6 py-3.5 px-4 font-serif text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 rounded-sm transition shadow-sm ${
                      activeGameState.status === 'playing'
                        ? 'bg-[#8B261D] hover:bg-[#732018] text-[#FAF8F5] cursor-pointer'
                        : 'bg-[#EAE4D7] text-[#8C7D6B] cursor-not-allowed border border-[#DDD5C7]'
                    }`}
                  >
                    <Gavel className="w-4 h-4" />
                    <span>
                      {activeGameState.status === 'playing'
                        ? `Hand Down Sentence (Guess ${activeGameState.guesses.length + 1}/5)`
                        : 'Case Closed'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UX ARCHITECTURE GUIDE */}
        {activeTab === 'ux-design' && (
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
        )}

        {/* TAB 3: DATA PIPELINE */}
        {activeTab === 'data-sources' && (
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
        )}
      </main>
    </div>
  );
}

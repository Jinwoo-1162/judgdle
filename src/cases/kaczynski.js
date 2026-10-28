export const kaczynskiCase = {
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
};

export const dewitteCase = {
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
};

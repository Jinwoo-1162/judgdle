export const woodsCase = {
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
};

// Discrete Sentencing Tiers (Judicial Buckets)
export const SENTENCE_TIERS = {
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

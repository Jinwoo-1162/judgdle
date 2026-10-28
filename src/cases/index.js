import { SENTENCE_TIERS } from './sentenceTiers';
import { STAGE_DEFINITIONS } from './stages';
import { dewitteCase } from './dewitte';
import { woodsCase } from './woods';
import { kaczynskiCase } from './kaczynski';

export const CASES = [
  dewitteCase,
  woodsCase,
  kaczynskiCase
];

export {
  SENTENCE_TIERS,
  STAGE_DEFINITIONS,
  dewitteCase,
  woodsCase,
  kaczynskiCase
};

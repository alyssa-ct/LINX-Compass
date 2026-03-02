import { CompassQuestion, DimensionId } from '@/lib/types';
import { responsibilityQuestions } from './responsibility';
import { controlQuestions } from './control';
import { feelingsQuestions } from './feelings';
import { riskOrientationQuestions } from './risk-orientation';
import { energyCapacityQuestions } from './energy-capacity';
import { communicationQuestions } from './communication';
import { worldOutlookQuestions } from './world-outlook';
import { needForStructureQuestions } from './need-for-structure';
import { logicalThinkingQuestions } from './logical-thinking';
import { creativeThinkingQuestions } from './creative-thinking';
import { anxietyQuestions } from './anxiety';
import { selfEsteemQuestions } from './self-esteem';
import { motivationValuesQuestions } from './motivation-values';
import { learningAdaptabilityQuestions } from './learning-adaptability';
import { integrityQuestions } from './integrity';

export const QUESTION_BANK: Record<DimensionId, CompassQuestion[]> = {
  'responsibility': responsibilityQuestions,
  'control': controlQuestions,
  'feelings': feelingsQuestions,
  'risk-orientation': riskOrientationQuestions,
  'energy-capacity': energyCapacityQuestions,
  'communication': communicationQuestions,
  'world-outlook': worldOutlookQuestions,
  'need-for-structure': needForStructureQuestions,
  'logical-thinking': logicalThinkingQuestions,
  'creative-thinking': creativeThinkingQuestions,
  'anxiety': anxietyQuestions,
  'self-esteem': selfEsteemQuestions,
  'motivation-values': motivationValuesQuestions,
  'learning-adaptability': learningAdaptabilityQuestions,
  'integrity': integrityQuestions,
};

export const ALL_QUESTIONS: CompassQuestion[] = Object.values(QUESTION_BANK).flat();

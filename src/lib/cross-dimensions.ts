import { DimensionScore, CrossDimensionPairing, DimensionId } from './types';
import { CROSS_DIMENSION_PAIRINGS } from './constants';

/**
 * Analyze a single cross-dimension pairing and return insight.
 */
function analyzePairing(
  pairingDef: typeof CROSS_DIMENSION_PAIRINGS[number],
  scores: DimensionScore[]
): CrossDimensionPairing {
  const scoreA = scores.find(s => s.dimensionId === pairingDef.dimensionA)?.rawScore ?? 5;
  const scoreB = scores.find(s => s.dimensionId === pairingDef.dimensionB)?.rawScore ?? 5;

  const highA = scoreA >= 7;
  const lowA = scoreA < 4;
  const highB = scoreB >= 7;
  const lowB = scoreB < 4;

  const nameA = pairingDef.dimensionA.replace(/-/g, ' ');
  const nameB = pairingDef.dimensionB.replace(/-/g, ' ');

  let pattern: string;
  let insight: string;

  // Generate pattern and insight based on the specific pairing
  switch (pairingDef.id) {
    case 'control-feelings':
      if (highA && lowB) {
        pattern = 'High Control + Low Feelings';
        insight = 'Strong behavioral control with limited emotional awareness. May appear composed but risk suppressing important signals. Effective in structured environments but may struggle with empathy-driven leadership.';
      } else if (lowA && highB) {
        pattern = 'Low Control + High Feelings';
        insight = 'High emotional awareness with limited behavioral control. Deeply empathetic but may struggle to maintain composure under pressure. Benefits from environments that value emotional intelligence.';
      } else if (highA && highB) {
        pattern = 'High Control + High Feelings';
        insight = 'Strong behavioral control paired with high emotional awareness. Can regulate emotions effectively while remaining attuned to others. Well-suited for leadership and high-stakes interpersonal roles.';
      } else if (lowA && lowB) {
        pattern = 'Low Control + Low Feelings';
        insight = 'Limited engagement with both behavioral control and emotional processing. May appear disengaged or passive. Benefits from structured environments with clear expectations.';
      } else {
        pattern = 'Balanced Control-Feelings';
        insight = 'Moderate balance between behavioral control and emotional awareness. Generally adaptive emotional regulation with room for growth in both areas.';
      }
      break;

    case 'anxiety-self-esteem':
      if (highA && lowB) {
        pattern = 'High Anxiety + Low Self-Esteem';
        insight = 'Elevated worry combined with low self-confidence creates a vulnerability pattern. May avoid challenges, seek excessive reassurance, and struggle under scrutiny. Benefits from supportive environments with gradual exposure to challenge.';
      } else if (lowA && highB) {
        pattern = 'Low Anxiety + High Self-Esteem';
        insight = 'Calm disposition paired with strong self-belief. Resilient under pressure and confident in decision-making. Well-suited for high-stakes roles but should maintain openness to feedback.';
      } else if (highA && highB) {
        pattern = 'High Anxiety + High Self-Esteem';
        insight = 'Internal tension despite strong self-belief. May experience stress but push through due to confidence. Can be effective under pressure but risk burnout if anxiety is not managed.';
      } else if (lowA && lowB) {
        pattern = 'Low Anxiety + Low Self-Esteem';
        insight = 'Calm but lacking confidence. May not worry excessively but also may not advocate for themselves. Benefits from validation and confidence-building experiences.';
      } else {
        pattern = 'Balanced Anxiety-Self-Esteem';
        insight = 'Moderate anxiety levels paired with adequate self-confidence. Generally resilient with normal stress responses and reasonable self-assurance.';
      }
      break;

    case 'risk-structure':
      if (highA && lowB) {
        pattern = 'High Risk + Low Structure';
        insight = 'Comfort with uncertainty paired with flexibility. Thrives in ambiguous, fast-moving environments. Entrepreneurial profile but may lack follow-through without external structure.';
      } else if (lowA && highB) {
        pattern = 'Low Risk + High Structure';
        insight = 'Cautious approach paired with strong need for order. Excels in compliance, quality assurance, and process-oriented roles. May struggle in rapidly changing environments.';
      } else if (highA && highB) {
        pattern = 'High Risk + High Structure';
        insight = 'Willing to take risks but within defined frameworks. Strategic risk-taker who plans carefully. Well-suited for calculated growth and strategic leadership roles.';
      } else if (lowA && lowB) {
        pattern = 'Low Risk + Low Structure';
        insight = 'Risk-averse yet comfortable without structure. May appear indecisive or passive. Benefits from roles with moderate challenge and moderate structure.';
      } else {
        pattern = 'Balanced Risk-Structure';
        insight = 'Moderate comfort with both risk and structure. Adaptable across environments, able to work within processes while tolerating some uncertainty.';
      }
      break;

    case 'logical-creative':
      if (highA && lowB) {
        pattern = 'High Logical + Low Creative';
        insight = 'Strong analytical thinker who relies on data and evidence. Excels at optimization and problem-solving within existing frameworks. May struggle with innovation or generating novel solutions.';
      } else if (lowA && highB) {
        pattern = 'Low Logical + High Creative';
        insight = 'Highly intuitive and creative thinker who generates novel ideas. May struggle with systematic analysis or detailed execution. Benefits from partnerships that complement analytical gaps.';
      } else if (highA && highB) {
        pattern = 'High Logical + High Creative';
        insight = 'Rare combination of analytical rigor and creative insight. Can both generate innovative ideas and validate them systematically. Highly valuable in strategy, R&D, and complex problem-solving roles.';
      } else if (lowA && lowB) {
        pattern = 'Low Logical + Low Creative';
        insight = 'Prefers practical, hands-on approaches over abstract reasoning or creative ideation. Best suited for execution-focused roles with clear procedures and defined outcomes.';
      } else {
        pattern = 'Balanced Logical-Creative';
        insight = 'Moderate balance between analytical and creative thinking. Can engage both modes as needed, though may not excel strongly in either extreme.';
      }
      break;

    case 'energy-responsibility':
      if (highA && highB) {
        pattern = 'High Energy + High Responsibility';
        insight = 'Strong stamina combined with high accountability. Sustainable high performer who reliably delivers. Watch for overwork tendencies if not paired with self-awareness.';
      } else if (lowA && highB) {
        pattern = 'Low Energy + High Responsibility';
        insight = 'High accountability but limited stamina. May over-commit and burn out. Risk of chronic stress from gap between desire to deliver and capacity to sustain effort.';
      } else if (highA && lowB) {
        pattern = 'High Energy + Low Responsibility';
        insight = 'Strong capacity but limited accountability. May be inconsistent despite having the energy to deliver. Benefits from external accountability structures and clear ownership frameworks.';
      } else if (lowA && lowB) {
        pattern = 'Low Energy + Low Responsibility';
        insight = 'Limited stamina combined with low accountability. May struggle in demanding roles. Benefits from lighter workloads with clear, simple expectations.';
      } else {
        pattern = 'Balanced Energy-Responsibility';
        insight = `Moderate energy paired with adequate accountability. Generally reliable within normal demands. Capacity and commitment are proportionally aligned.`;
      }
      break;

    default:
      pattern = `${nameA} + ${nameB}`;
      insight = 'Cross-dimension analysis not available for this pairing.';
  }

  return {
    id: pairingDef.id,
    dimensionA: pairingDef.dimensionA as DimensionId,
    dimensionB: pairingDef.dimensionB as DimensionId,
    label: pairingDef.label,
    pattern,
    insight,
  };
}

/**
 * Analyze all 5 cross-dimension pairings.
 */
export function analyzeCrossDimensions(
  scores: DimensionScore[]
): CrossDimensionPairing[] {
  return CROSS_DIMENSION_PAIRINGS.map(pairing => analyzePairing(pairing, scores));
}

'use server';

import { analyzeDecision, DecisionHelperInput, DecisionHelperOutput } from '@/ai/flows/decision-helper-flow';

/**
 * @fileOverview AI Decision Helper Server Action
 */

export async function executeDecisionAction(input: DecisionHelperInput): Promise<DecisionHelperOutput> {
  try {
    return await analyzeDecision(input);
  } catch (error: any) {
    console.error('Decision Analysis Failure:', error);
    throw new Error('The decision analysis protocol failed.');
  }
}

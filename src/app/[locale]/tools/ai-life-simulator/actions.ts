'use server';

import { simulateLifePath, LifeSimulatorInput, LifeSimulatorOutput } from '@/ai/flows/life-simulator-flow';

/**
 * @fileOverview AI Life Simulator Server Action (Localized)
 */

export async function executeLifeSimulationAction(input: LifeSimulatorInput): Promise<LifeSimulatorOutput> {
  try {
    return await simulateLifePath(input);
  } catch (error: any) {
    console.error('Simulation Failure:', error);
    throw new Error('The temporal simulation sequence failed.');
  }
}

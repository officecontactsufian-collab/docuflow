'use server';

import { runAIStudioProtocol, AIStudioInput, AIStudioOutput } from '@/ai/flows/ai-studio-flow';
import { initializeFirebase, getSdks } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, Timestamp } from 'firebase/firestore';

/**
 * @fileOverview DOCFLOW AI Studio Actions
 * Handles the secure server-side execution of AI protocols and Firestore usage logging.
 */

const DAILY_FREE_LIMIT = 10;

export async function executeAIStudioAction(input: AIStudioInput, userId?: string): Promise<AIStudioOutput> {
  const { firestore } = initializeFirebase();

  // 1. RATE LIMITING LOGIC (If user is identified)
  if (userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const logsRef = collection(firestore, 'users', userId, 'usageLogs');
    const q = query(
      logsRef, 
      where('requestTimestamp', '>=', Timestamp.fromDate(today))
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.size >= DAILY_FREE_LIMIT) {
      throw new Error(`PROTOCOL LIMIT REACHED: You have reached the daily threshold of ${DAILY_FREE_LIMIT} AI operations.`);
    }
  }

  try {
    // 2. EXECUTE AI PROTOCOL
    const result = await runAIStudioProtocol(input);

    // 3. LOG USAGE (Non-blocking)
    if (userId) {
      addDoc(collection(firestore, 'users', userId, 'usageLogs'), {
        userId,
        toolUsed: `AI_${input.tool}`,
        requestTimestamp: serverTimestamp(),
        status: 'SUCCESS',
        costUnits: 1
      });
    }

    return result;
  } catch (error: any) {
    console.error('AI Studio Protocol Failure:', error);
    
    // Log failure
    if (userId) {
      addDoc(collection(firestore, 'users', userId, 'usageLogs'), {
        userId,
        toolUsed: `AI_${input.tool}`,
        requestTimestamp: serverTimestamp(),
        status: 'ERROR',
        costUnits: 0
      });
    }

    throw new Error(error.message || 'The industrial AI sequence failed to initialize.');
  }
}

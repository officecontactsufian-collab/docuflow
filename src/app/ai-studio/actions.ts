
'use server';

import { runAIStudioProtocol, AIStudioInput, AIStudioOutput } from '@/ai/flows/ai-studio-flow';
import { initializeFirebase } from '@/firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  Timestamp, 
  limit, 
  orderBy 
} from 'firebase/firestore';
import { createHash } from 'crypto';

/**
 * @fileOverview DOCFLOW AI Studio Hardened Actions
 * Implements industrial-grade rate limiting and result caching using Firestore.
 * Ensures the API Key remains hidden on the server.
 */

const DAILY_FREE_LIMIT = 10;

// Deterministic hash for caching logic based on all relevant input parameters
function generateRequestHash(input: AIStudioInput): string {
  const data = JSON.stringify({
    tool: input.tool,
    text: input.text,
    userQuestion: input.userQuestion,
    targetLanguage: input.targetLanguage,
    // Note: In high-fidelity caching, a file checksum would be used here.
    // For now we use the raw metadata.
  });
  return createHash('sha256').update(data).digest('hex');
}

export async function executeAIStudioAction(input: AIStudioInput, userId?: string): Promise<AIStudioOutput> {
  const { firestore } = initializeFirebase();

  if (!userId) {
    throw new Error("IDENTITY REQUIRED: This protocol requires a verified user session.");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = Timestamp.fromDate(today);

  // 1. INDUSTRIAL RATE LIMITING CHECK
  const logsRef = collection(firestore, 'users', userId, 'usageLogs');
  const rateLimitQuery = query(
    logsRef, 
    where('requestTimestamp', '>=', todayTimestamp),
    where('status', '==', 'SUCCESS')
  );
  
  const usageSnapshot = await getDocs(rateLimitQuery);
  if (usageSnapshot.size >= DAILY_FREE_LIMIT) {
    throw new Error(`PROTOCOL THRESHOLD: Daily limit of ${DAILY_FREE_LIMIT} operations reached. Registry resets at midnight.`);
  }

  // 2. STATELESS CACHE LOOKUP
  const requestHash = generateRequestHash(input);
  const opsRef = collection(firestore, 'users', userId, 'operations');
  const cacheQuery = query(
    opsRef,
    where('operationType', '==', `AI_${input.tool}`),
    where('aiPrompt', '==', requestHash), // Using aiPrompt field to store the request hash
    where('status', '==', 'COMPLETED'),
    orderBy('createdAt', 'desc'),
    limit(1)
  );

  const cacheSnapshot = await getDocs(cacheQuery);
  if (!cacheSnapshot.empty) {
    const cachedDoc = cacheSnapshot.docs[0].data();
    console.log(`CACHE HIT: Restoring session for hash ${requestHash}`);
    return { result: cachedDoc.aiResult };
  }

  try {
    // 3. EXECUTE INDUSTRIAL AI SEQUENCE
    const response = await runAIStudioProtocol(input);

    // 4. ARCHIVE OPERATION (For Caching & Audit)
    await addDoc(opsRef, {
      userId,
      operationType: `AI_${input.tool}`,
      status: 'COMPLETED',
      createdAt: serverTimestamp(),
      aiPrompt: requestHash, // Store the deterministic hash
      aiResult: response.result,
      inputFilesIds: input.fileDataUri ? ["STAGED_ASSET"] : []
    });

    // 5. LOG USAGE (For Rate Limiting)
    await addDoc(logsRef, {
      userId,
      toolUsed: `AI_${input.tool}`,
      requestTimestamp: serverTimestamp(),
      status: 'SUCCESS',
      costUnits: 1,
      ipAddress: 'PROXIED_TUNNEL' 
    });

    return response;
  } catch (error: any) {
    console.error('Industrial Protocol Failure:', error);
    
    // LOG FAILURE FOR AUDIT REGISTRY
    await addDoc(logsRef, {
      userId,
      toolUsed: `AI_${input.tool}`,
      requestTimestamp: serverTimestamp(),
      status: 'ERROR',
      costUnits: 0
    });

    throw new Error(error.message || 'The industrial AI sequence failed to establish a stable stream.');
  }
}

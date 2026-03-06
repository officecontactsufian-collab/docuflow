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
  limit 
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
  });
  return createHash('sha256').update(data).digest('hex');
}

export async function executeAIStudioAction(input: AIStudioInput, userId?: string): Promise<AIStudioOutput> {
  // Use isomorphic initialization to access Firestore on the server
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
    where('requestTimestamp', '>=', todayTimestamp)
  );
  
  const usageSnapshot = await getDocs(rateLimitQuery);
  const successCount = usageSnapshot.docs.filter(doc => doc.data().status === 'SUCCESS').length;

  if (successCount >= DAILY_FREE_LIMIT) {
    throw new Error(`PROTOCOL THRESHOLD: Daily limit of ${DAILY_FREE_LIMIT} operations reached. Registry resets at midnight.`);
  }

  // 2. STATELESS CACHE LOOKUP
  const requestHash = generateRequestHash(input);
  const opsRef = collection(firestore, 'users', userId, 'operations');
  
  // Use a simple query to avoid indexing requirements for the prototype phase
  const cacheQuery = query(
    opsRef,
    where('aiPrompt', '==', requestHash),
    limit(1)
  );

  const cacheSnapshot = await getDocs(cacheQuery);
  const validCache = cacheSnapshot.docs.find(doc => {
    const data = doc.data();
    return data.status === 'COMPLETED' && data.operationType === `AI_${input.tool}`;
  });

  if (validCache) {
    const data = validCache.data();
    console.log(`CACHE HIT: Restoring session for hash ${requestHash}`);
    return { result: data.aiResult };
  }

  try {
    // 3. EXECUTE INDUSTRIAL AI SEQUENCE
    // Gemini key is used server-side only via runAIStudioProtocol
    const response = await runAIStudioProtocol(input);

    // 4. ARCHIVE OPERATION (For Caching & Audit)
    await addDoc(opsRef, {
      userId,
      operationType: `AI_${input.tool}`,
      status: 'COMPLETED',
      createdAt: serverTimestamp(),
      aiPrompt: requestHash, // Deterministic hash used as lookup key
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

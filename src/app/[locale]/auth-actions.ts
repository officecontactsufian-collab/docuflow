'use server';

/**
 * @fileOverview DOCFLOW Administrative Auth Actions
 * Executes server-side reCAPTCHA verification to protect identity tunnels.
 */

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

/**
 * Verifies a reCAPTCHA v3 token via the Google Security API.
 * Uses a robust POSTBody protocol for industrial-grade transmission.
 * @param token The client-generated reCAPTCHA token.
 * @returns {Promise<boolean>} True if human verification succeeds with score >= 0.5.
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY is missing. Skipping verification in development mode.');
    return true;
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', token);

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data: RecaptchaResponse = await response.json();

    if (!data.success) {
      console.error('reCAPTCHA Verification Failed:', data['error-codes']);
      return false;
    }

    // Industrial Threshold: 0.5 is the standard for low-risk interactive actions
    // Returns true only if the score meets or exceeds the professional benchmark
    return data.score >= 0.5;
  } catch (error) {
    console.error('reCAPTCHA Protocol Error:', error);
    return false;
  }
}

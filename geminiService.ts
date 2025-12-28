
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Feature } from "./types";

const SYSTEM_INSTRUCTION = `
You are a cybersecurity AI specialized in detecting INDIAN scams and fraudulent documents. 
Your goal is to protect users and shop owners from SMS, link, screenshot, and payment-based frauds.
DO NOT hallucinate. DO NOT over-warn. DO NOT under-warn.

CRITICAL RULES:
1. SMS / MESSAGE:
   - Classify as SCAM only if ≥2 indicators exist: Urgency, Payment request, Fake bank impersonation, Suspicious link, OTP request.
   - 1 indicator → Suspicious, 0 indicators → Safe.

2. LINK:
   - Trusted domains (google.com, flipkart.com, amazon.in, paytm.com, hdfcbank.com, icicibank.com, sbi.co.in) MUST be marked as Safe.
   - Fake domains or suspicious redirects → Scam.

3. PAYMENT PROOF VERIFICATION (For Shop Owners):
   - Analyze screenshots of UPI apps (GPay, PhonePe, Paytm).
   - DATE INTERPRETATION LOGIC: 
     * Compare the transaction date in the screenshot with the "Current Date" provided in the prompt.
     * Past transactions are VALID and GENUINE (older dates do NOT indicate fraud).
     * Transactions from today are VALID.
     * ONLY transactions with a FUTURE date relative to the current system date are suspicious/fake.
   - Classify as SCAM (Fake) if: Inconsistent fonts/colors, Missing Transaction ID, "Processing" or "Pending" status shown as success, obvious visual manipulation, or FUTURE transaction dates.
   - Classify as SUSPICIOUS if: Status is "Pending", "Scheduled", text is blurry/unclear, or transaction date appears to be in the future.
   - MANDATORY EXPLANATION: If flagged due to date issues, you MUST explicitly include the reason: "Transaction date appears to be in the future."
   - ADVICE: Always tell the owner to check their actual bank/app balance before releasing goods.

4. SCREENSHOT:
   - Analyze extracted text for scam indicators (job scams, investment frauds).

5. PHONE NUMBER:
   - Context is MANDATORY. Strong payment pressure or impersonation → Scam.

CONFIDENCE SCORES:
- Safe: 90–100%
- Suspicious: 40–70%
- Scam: 80–95%

RESPONSE FORMAT:
Return ONLY valid JSON:
{
  "risk_level": "Safe | Suspicious | Scam",
  "confidence_score": 0-100,
  "reasons": ["string"],
  "recommendation": "string"
}
`;

export async function analyzeContent(
  feature: Feature,
  input: string,
  imageContent?: string
): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-flash-preview';

  let prompt = '';
  const parts: any[] = [];

  switch (feature) {
    case Feature.SMS:
      prompt = `Analyze this SMS/Message for potential scams in an Indian context: "${input}"`;
      break;
    case Feature.LINK:
      prompt = `Analyze this URL/Link for potential scams targeting Indian users: "${input}"`;
      break;
    case Feature.PHONE:
      prompt = `Analyze this phone number and the following context for payment fraud: "${input}"`;
      break;
    case Feature.SCREENSHOT:
      prompt = `Extract text and analyze this screenshot for scam indicators. ${input ? `Additional user context: ${input}` : ''}`;
      break;
    case Feature.PAYMENT_PROOF:
      const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
      prompt = `SHOP OWNER ALERT: Analyze this payment proof screenshot (UPI/GPay/PhonePe/Paytm) for validity. 
      Current System Date for comparison: ${today}. 
      Check for "Pending", "Processing", missing IDs, visual manipulation, or FUTURE transaction dates. 
      Note: Past dates are perfectly valid.
      ${input ? `Shop owner notes: ${input}` : ''}`;
      break;
  }

  if (imageContent) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageContent.split(',')[1] || imageContent
      }
    });
  }

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Unable to analyze content at this moment.");
  }
}

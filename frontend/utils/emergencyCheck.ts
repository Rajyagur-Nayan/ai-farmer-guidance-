/**
 * List of critical symptoms that require immediate medical attention
 */
const EMERGENCY_KEYWORDS = [
  'chest pain',
  'breathing issue',
  'unconscious',
  'difficulty breathing',
  'shortness of breath',
  'heart attack',
  'severe bleeding'
];

/**
 * Checks if the input text contains any emergency symptoms
 * @param text The user's input symptom description
 * @returns boolean true if emergency detected
 */
export const detectEmergency = (text: string): boolean => {
  const lowercaseText = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(keyword => lowercaseText.includes(keyword));
};

/**
 * Standard emergency message for the assistant
 */
export const EMERGENCY_ADVICE = "CRITICAL ALERT: Your symptoms suggest a potential medical emergency. Please visit the nearest hospital or call emergency services immediately. Do not wait for AI advice.";

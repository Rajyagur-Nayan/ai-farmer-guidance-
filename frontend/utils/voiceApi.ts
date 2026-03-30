const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://ai-farmer-guidance.onrender.com"
    : "http://localhost:8000");

export interface VoiceApiResponse {
  text: string;
  audio: string; // base64 encoded mp3
}

export const voiceApi = {
  /**
   * Sends recorded audio blob to the FastAPI backend
   * @param audioBlob The recorded audio from MediaRecorder
   */
  sendAudio: async (audioBlob: Blob): Promise<VoiceApiResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      const response = await fetch(`${BACKEND_URL}/voice`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Voice processing failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Voice API Error:", error);
      throw error;
    }
  },

  /**
   * Fetches TTS audio for a specific text string from the backend
   * @param text The text to convert to speech
   */
  getGreetingTTS: async (text: string): Promise<string> => {
    try {
      const response = await fetch(`${BACKEND_URL}/voice/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch greeting TTS");
      }

      const data = await response.json();
      return data.audio; // base64
    } catch (error) {
      console.error("TTS API Error:", error);
      throw error;
    }
  },
};

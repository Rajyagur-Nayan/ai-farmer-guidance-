import { useState, useRef, useCallback, useEffect } from "react";
import { voiceApi } from "@/utils/voiceApi";

export const useVoiceAgent = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  const cleanup = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
  }, []);

  const playGreeting = async () => {
    try {
      setIsSpeaking(true);
      setError(null);
      const audioBase64 = await voiceApi.getGreetingTTS("नमस्ते! मैं आपका कृषि सहायक हूँ। मैं आपकी फसल, मिट्टी और मौसम की जानकारी में मदद कर सकता हूँ।");
      if (audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
        activeAudioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        await audio.play();
      } else {
         setIsSpeaking(false);
      }
    } catch (err) {
      console.error(err);
      setIsSpeaking(false);
    }
  };

  const startListening = async () => {
    try {
      // Stop any AI audio currently playing
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        setIsSpeaking(false);
      }
      
      setError(null);
      setTranscribedText("");
      setRecordedBlob(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordedBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      setError("Microphone access denied or hardware failure.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const sendAudioQuery = async () => {
    if (!recordedBlob) return;
    setIsProcessing(true);
    setError(null);
    setTranscribedText("");

    try {
      const response = await voiceApi.sendAudio(recordedBlob);
      setTranscribedText(response.text);

      if (response.audio) {
        setIsSpeaking(true);
        const audioData = `data:audio/mp3;base64,${response.audio}`;
        const audio = new Audio(audioData);
        activeAudioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        await audio.play();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Vocal link failure");
    } finally {
      setIsProcessing(false);
      setRecordedBlob(null); 
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isSpeaking,
    isListening,
    isProcessing,
    transcribedText,
    error,
    recordedBlob,
    playGreeting,
    startListening,
    stopListening,
    sendAudioQuery,
  };
};

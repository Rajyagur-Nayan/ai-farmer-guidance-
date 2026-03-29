"use client";

const OFFLINE_QUEUE_KEY = 'medical_offline_messages';

export interface QueuedMessage {
  text: string;
  timestamp: string;
}

export const offlineStorage = {
  saveMessage: (text: string) => {
    if (typeof window === 'undefined') return;
    const queue = offlineStorage.getQueue();
    const newMessage: QueuedMessage = {
      text,
      timestamp: new Date().toISOString(),
    };
    queue.push(newMessage);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  },

  getQueue: (): QueuedMessage[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  clearQueue: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  },

  hasPendingMessages: (): boolean => {
    return offlineStorage.getQueue().length > 0;
  }
};

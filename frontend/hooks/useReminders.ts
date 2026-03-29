import { useState, useEffect } from 'react';

export interface Reminder {
  id: string;
  medicineName: string;
  time: string;
  isActive: boolean;
}

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('med_reminders');
    if (saved) {
      try {
        setReminders(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse reminders", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('med_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = (medicineName: string, time: string) => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      medicineName,
      time,
      isActive: true
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return { reminders, addReminder, toggleReminder, deleteReminder };
};

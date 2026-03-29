"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  User,
  Bot,
  Paperclip,
  MoreVertical,
  Smile,
  RefreshCcw,
  Volume2,
  Loader2,
  X,
  Circle,
  MessageSquare,
  ChevronDown,
  WifiOff,
} from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { syncManager } from "@/utils/syncManager";
import { detectEmergency, EMERGENCY_ADVICE } from "@/utils/emergencyCheck";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiService } from "@/utils/api";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`flex max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"} items-start gap-3`}
      >
        <div
          className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 ${isUser ? "bg-primary-500 border-primary-500 shadow-lg" : "bg-white border-medical-border shadow-sm"}`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-primary-500" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div
            className={`
            relative px-5 py-3 rounded-2xl text-[13px] font-bold leading-relaxed
            ${
              isUser
                ? "bg-primary-500 text-white shadow-xl shadow-primary-500/10"
                : "bg-white text-primary-900 border border-medical-border shadow-sm"
            }
            `}
          >
            <p>{message.text}</p>
          </div>
          <span
            className={`text-xs font-semibold uppercase tracking-widest ${isUser ? "text-primary-300 text-right" : "text-medical-textSecondary"}`}
          >
            {message.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
};

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const addMessage = useCallback((text: string, sender: "user" | "ai") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const isOnline = useOnlineStatus();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    if (!text) setInputText("");

    // Emergency Check
    if (detectEmergency(messageText)) {
      const emergencyMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: EMERGENCY_ADVICE,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, emergencyMsg]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiService.sendChatMessage(messageText);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Network connection fault. Please try asking again.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button for Mobile */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-16 h-16 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all lg:hidden"
      >
        <MessageSquare className="w-8 h-8" />
      </button>

      {/* Main Chat Container (Desktop fixed, Mobile bottom-sheet) */}
      <div
        className={`
        flex flex-col h-[650px] w-full max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden shadow-medical-hover border border-medical-border transition-all duration-500
        ${isMobileOpen ? "fixed inset-0 h-full z-[100] rounded-none lg:relative lg:h-[650px] lg:rounded-2xl lg:z-auto" : "relative"}
        ${!isMobileOpen ? "hidden lg:flex" : "flex"}
      `}
      >
        {/* Header */}
        <div className="bg-white px-8 py-6 flex items-center justify-between border-b border-medical-border z-20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className={`w-12 h-12 border-2 ${isOnline ? "border-primary-500 bg-primary-500" : "border-medical-border bg-white"} rounded-2xl flex items-center justify-center transition-all`}
              >
                <Bot
                  className={`w-6 h-6 ${isOnline ? "text-white" : "text-medical-textSecondary"}`}
                />
              </div>
              <span
                className={`absolute -top-1 -right-1 w-3 h-3 ${isOnline ? "bg-medical-green" : "bg-medical-border"} border-2 border-white rounded-full ${isOnline ? "animate-pulse" : ""}`}
              ></span>
            </div>
            <div>
              <h4 className="font-semibold text-primary-900 tracking-tight leading-none text-base">
                Agriculture Advisor
              </h4>
              <span
                className={`text-sm font-semibold uppercase tracking-widest ${isOnline ? "text-primary-400" : "text-medical-textSecondary"}`}
              >
                {isOnline ? "Protocol Synchronized" : "Local Mode active"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isOnline && (
              <div className="flex items-center gap-2 bg-medical-bg text-primary-900 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest border border-medical-border">
                <WifiOff className="w-3 h-3" />
                <span>Offline</span>
              </div>
            )}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 hover:bg-medical-bg rounded-xl transition-colors lg:hidden"
            >
              <ChevronDown className="w-6 h-6 text-primary-900" />
            </button>
            <button className="hidden lg:block p-2 hover:bg-medical-bg rounded-xl transition-colors">
              <MoreVertical className="w-5 h-5 text-primary-900" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-medical-bg/20">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <div className="p-8 bg-white rounded-3xl border border-medical-border mb-2 shadow-sm">
                <MessageSquare className="w-10 h-10 text-primary-500" />
              </div>
              <h5 className="text-sm font-semibold uppercase tracking-widest text-primary-900">
                Agriculture Advisor Active
              </h5>
              <p className="text-xs font-bold text-medical-textSecondary max-w-[240px] leading-relaxed">
                No information yet. Try asking a question about your farm or crops.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-6 animate-in fade-in duration-300">
                  <div className="flex flex-row items-start gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-white border border-medical-border flex items-center justify-center flex-shrink-0 shadow-sm font-semibold  tracking-tight text-primary-500">
                      AI
                    </div>
                    <div className="bg-white text-primary-900 border border-medical-border px-5 py-3 rounded-2xl shadow-sm flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-medical-border">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative group">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question about your farm..."
                className="bg-medical-bg border-none rounded-2xl py-8 pl-8 pr-16 focus:bg-white focus:ring-8 focus:ring-primary-500/5 text-primary-900 font-bold placeholder:text-medical-textSecondary placeholder: transition-all shadow-inner"
              />
            </div>

            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className={`
                  h-16 w-16 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-lg
                  ${inputText.trim() ? "bg-primary-500 text-white hover:bg-primary-600 shadow-primary-500/20" : "bg-medical-bg text-medical-textSecondary cursor-not-allowed shadow-none"}
              `}
            >
              <Send className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatUI;

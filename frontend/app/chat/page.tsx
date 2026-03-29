"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import ChatUI from "@/components/ChatUI";

export default function ChatPage() {
  return (
    <Layout>
      <div className="py-8 px-4 flex flex-col items-center">
        <div className="w-full max-w-2xl mb-8">
          <h2 className="text-3xl font-bold text-healthcare-900 mb-2">Health Assistant</h2>
          <p className="text-healthcare-500">How can we help you today? Please type your concern below for clinical assistance.</p>
        </div>
        
        <ChatUI />
      </div>
    </Layout>
  );
}

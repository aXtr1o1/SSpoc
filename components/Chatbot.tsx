// components/Chatbot.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Upload, Send } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Bodoni_Moda } from 'next/font/google'

const bodoni = Bodoni_Moda({ subsets: ['latin'] })

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type ChatbotProps = {
  channel: "startups" | "investors" | "contact"
}

export default function Chatbot({ channel }: ChatbotProps) {
  console.log("Chatbot Channel Prop:", channel); // Debug log
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem(`${channel}-messages`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error(`Error parsing ${channel} messages:`, error);
        localStorage.removeItem(`${channel}-messages`);
        setMessages([]); // Clear messages if parsing fails
      }
    } else {
      setMessages([]); // Ensure messages are empty if no data
    }
  }, [channel]);

  useEffect(() => {
    localStorage.setItem(`${channel}-messages`, JSON.stringify(messages));
  }, [messages, channel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: `You said: ${input.trim()}`,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    setIsUploading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFile(uploadedFile);

      const systemMessage = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: `CSV file "${uploadedFile.name}" has been uploaded. You can now ask questions about its contents.`,
      };

      setMessages((prev) => [...prev, systemMessage]);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  rounded-2xl p-4 max-w-[70%] 
                  ${
                    message.role === "user"
                      ? "bg-black/20 backdrop-blur-lg border border-white/10"
                      : "bg-white/5 backdrop-blur-sm border border-white/5"
                  }
                `}
              >
                <p className="text-white/90">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4">
        <div className="relative flex items-center gap-2">
          <input
            type="file"
            id="file-upload"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
          <motion.label
            htmlFor="file-upload"
            className={`
              flex items-center justify-center w-12 h-12 rounded-full 
              bg-black/20 backdrop-blur-xl border border-white/10 cursor-pointer 
              hover:bg-black/30 transition-colors
              ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
            `}
            whileTap={{ scale: 0.95 }}
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-white/70" />
            )}
          </motion.label>
          <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-black/20 backdrop-blur-xl border-white/10 text-white/90 placeholder:text-white/40 rounded-full px-6 transition-all duration-200 focus:bg-black/30"
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              className={`
                w-12 h-12 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 
                hover:bg-black/30 transition-colors p-0 flex items-center justify-center
                ${isLoading || !input.trim() ? "opacity-50 cursor-not-allowed" : ""}
              `}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-5 h-5 text-white/70" />
            </motion.button>
          </form>
        </div>
      </div>
      <p className={`${bodoni.className} text-center text-white/50 mt-4 text-sm`}>an aXtr prototype</p>
    </div>
  )
}
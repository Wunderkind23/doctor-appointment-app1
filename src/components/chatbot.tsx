'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Calendar, AlertCircle, MessageCircleMore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { api } from '@/lib/api/axios';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const DAILY_MESSAGE_LIMIT = 10;
const STORAGE_KEY = 'chatbot_usage';

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm your health assistant. How can I help you with basic health questions today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load usage data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { count, date } = JSON.parse(stored);
        const today = new Date().toDateString();

        if (date === today) {
          setMessageCount(count);
          setLimitReached(count >= DAILY_MESSAGE_LIMIT);
        } else {
          // Reset for new day
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: 0, date: today }));
          setMessageCount(0);
          setLimitReached(false);
        }
      } catch (error) {
        console.error('Error loading usage data:', error);
      }
    } else {
      const today = new Date().toDateString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: 0, date: today }));
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const updateUsageCount = () => {
    const newCount = messageCount + 1;
    const today = new Date().toDateString();

    setMessageCount(newCount);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: newCount, date: today }));

    if (newCount >= DAILY_MESSAGE_LIMIT) {
      setLimitReached(true);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || limitReached) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const payload = {
        messages: [...messages, userMessage],
      };

      const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/chat-bot`, payload);

      if (!response?.data?.data) {
        console.log(response);
        throw new Error('API request failed');
      }

      const data = await response?.data?.data;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply || "Sorry, I couldn't process that.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      updateUsageCount();
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Sorry, I'm having trouble connecting right now. Please try again later or book an appointment for direct assistance.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = () => {
    setIsOpen(false);
    window.location.href = '/doctors';
  };

  const remainingMessages = DAILY_MESSAGE_LIMIT - messageCount;

  return (
    <>
      {user?.role === 'PATIENT' && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {/* Moved closer to edge on mobile, original position on sm+ */}
            <div className="fixed bottom-6 right-4 sm:bottom-20 sm:right-20 z-50 flex flex-col items-center">
              {/* animated text */}
              <span className="mb-2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white animate-bounce shadow-md flex flex-row gap-0.5 items-center">
                <MessageCircleMore className="h-3 w-3 mr-1" />
                Quick chat
              </span>

              <Button
                className="h-25 w-25 rounded-full border-2 border-brand-600 bg-transparent hover:bg-brand-700 shadow-lg"
                size="icon"
              >
                <Image
                  src="/babcock-logo.png"
                  alt="Babcock health Logo"
                  width={150}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </Button>
            </div>
          </DialogTrigger>

          {/*
            Mobile:  full-screen (w-full, h-dvh, no rounded corners)
            sm+:     original max-w-md, h-[600px], rounded corners
          */}
          <DialogContent
            className="
            p-0 flex flex-col
            w-full max-w-full h-[100dvh] rounded-none
            sm:max-w-md sm:h-[600px] sm:rounded-lg
          "
          >
            <DialogHeader className="p-4 border-b shrink-0">
              <DialogTitle>Health Chat Assistant</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                {remainingMessages > 0
                  ? `${remainingMessages} message${remainingMessages !== 1 ? 's' : ''} remaining today`
                  : 'Daily limit reached'}
              </p>
            </DialogHeader>

            {limitReached && (
              <div className="px-4 pt-4 shrink-0">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You&apos;ve reached your daily message limit. Please try again tomorrow or book
                    an appointment.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4" ref={scrollRef}>
              <div className="space-y-4 py-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg break-words ${
                        msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-black p-3 rounded-lg">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                        <span
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0.4s' }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t space-y-3 shrink-0">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={limitReached ? 'Daily limit reached' : 'Ask a health question...'}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  disabled={isLoading || limitReached}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim() || limitReached}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleBookAppointment} className="w-full" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

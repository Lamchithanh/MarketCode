"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
// import { Badge } from '@/components/ui/badge'; // Tạm thời comment để tắt rate limit display
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  AlertCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatboxProps {
  dailyLimit?: number;
  className?: string;
  userId?: string;
}

export function Chatbox({ dailyLimit = 10, className, userId = 'guest' }: ChatboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load daily count from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('chatbox_daily_count');
    const storedDate = localStorage.getItem('chatbox_date');
    
    if (storedDate === today && stored) {
      setDailyCount(parseInt(stored));
    } else {
      setDailyCount(0);
      localStorage.setItem('chatbox_date', today);
      localStorage.setItem('chatbox_daily_count', '0');
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const updateDailyCount = (count: number) => {
    setDailyCount(count);
    localStorage.setItem('chatbox_daily_count', count.toString());
  };

  const canSendMessage = () => {
    return true; // Tạm thời tắt rate limit để test
    // return dailyCount < dailyLimit;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return; // Bỏ check canSendMessage() để test

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          messages: messages.slice(-5), // Send last 5 messages for context
          userId: userId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          toast.error(data.error || 'Bạn đã vượt quá giới hạn tin nhắn');
        } else if (response.status === 400) {
          toast.error(data.error || 'Tin nhắn không hợp lệ');
        } else {
          toast.error('Lỗi hệ thống, vui lòng thử lại sau');
        }
        return;
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || data.message || 'Không có phản hồi',
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update remaining messages count if provided
      if (data.remainingMessages !== undefined) {
        updateDailyCount(dailyLimit - data.remainingMessages);
      } else {
        updateDailyCount(dailyCount + 1);
      }
      
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format bot response with markdown-style formatting
  const formatBotResponse = (content: string) => {
    // Split by lines to handle each line separately
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      // Handle bold text (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        // Add text before bold
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        
        // Add bold text
        parts.push(
          <strong key={`bold-${index}-${match.index}`} className="font-semibold text-foreground">
            {match[1]}
          </strong>
        );
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }
      
      // If no parts were added, add the whole line
      if (parts.length === 0) {
        parts.push(line);
      }
      
      return (
        <span key={index}>
          {parts}
          {index < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className={`relative w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group overflow-hidden bg-primary hover:bg-primary/90 ${className}`}
          size="icon"
        >          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full bg-white/30 animate-ping opacity-75 group-hover:opacity-100"></div>
          
          {/* Floating dots animation */}
          <div className="absolute inset-0">
            <div className="absolute top-2 right-2 w-1 h-1 bg-white/50 rounded-full animate-pulse delay-75"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/50 rounded-full animate-pulse delay-150"></div>
            <div className="absolute top-3 left-3 w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse delay-300"></div>
          </div>
          
          {/* Main icon */}
          <MessageCircle className="w-6 h-6 relative z-10 text-primary-foreground group-hover:animate-bounce transition-all duration-200" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 shadow-2xl z-50 flex flex-col transition-all duration-200 ${isMinimized ? 'h-14' : 'h-[500px]'} ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5 rounded-t-lg flex-shrink-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          Trợ lý AI MarketCode
        </CardTitle>
        <div className="flex items-center gap-1">
          {/* Tạm thời ẩn badge để test */}
          {/* <Badge variant="secondary" className="text-xs">
            {dailyCount}/{dailyLimit}
          </Badge> */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Xin chào! Tôi là trợ lý AI của MarketCode.</p>
                    <p className="text-xs mt-1">Hỏi tôi về sản phẩm, dịch vụ hoặc cách sử dụng website.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="w-3 h-3 text-primary" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm break-words ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <div className="whitespace-pre-wrap break-words">
                            {message.role === 'assistant' 
                              ? formatBotResponse(message.content)
                              : message.content
                            }
                          </div>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="w-3 h-3 text-primary" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-3 h-3 text-primary" />
                        </div>
                        <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Đang suy nghĩ...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="border-t p-4 flex-shrink-0">
            {/* Tạm thời ẩn thông báo hết lượt để test */}
            {false && !canSendMessage() ? (
              <div className="text-center text-sm text-muted-foreground py-2">
                <AlertCircle className="w-4 h-4 mx-auto mb-1" />
                <p>Bạn đã hết lượt chat hôm nay ({dailyLimit} câu hỏi/ngày)</p>
                <p className="text-xs">Quay lại vào ngày mai để tiếp tục!</p>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Nhập câu hỏi..."
                  disabled={isLoading}
                  className="flex-1"
                  maxLength={500}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

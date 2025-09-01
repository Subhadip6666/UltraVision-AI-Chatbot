
'use client';

import { useState } from 'react';
import { AiAssistantChat, type Message } from '@/components/ai-assistant-chat';
import { Button } from '@/components/ui/button';
import { BrainCircuit, ChevronDown, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}


export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const handleNewChat = () => {
    setActiveChatId(null);
  };
  
  const getActiveChat = () => {
    if (!activeChatId) return null;
    return chats.find(chat => chat.id === activeChatId) ?? null;
  }

  const handleSendMessage = (userMessage: Message, assistantMessage: Message) => {
    setChats(prevChats => {
      const existingChat = prevChats.find(chat => chat.id === activeChatId);
      
      if (existingChat) {
        // Update existing chat
        return prevChats.map(chat => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: [...chat.messages, userMessage, assistantMessage],
            };
          }
          return chat;
        });
      } else {
        // Create new chat
        const newChat: Chat = {
          id: `chat-${Date.now()}`,
          title: (userMessage.content as string).substring(0, 30) + '...',
          messages: [userMessage, assistantMessage],
        };
        setActiveChatId(newChat.id);
        return [newChat, ...prevChats];
      }
    });
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-[280px_1fr]">
      <aside className="flex flex-col border-r bg-card text-card-foreground">
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold">UltraVision AI</h2>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4">
          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleNewChat}>
                <Pencil className="h-4 w-4" />
                New chat
            </Button>
          </nav>
          
          {chats.length > 0 && (
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold uppercase text-muted-foreground">Chats</h3>
              <nav className="mt-2 space-y-1">
                  {chats.map((chat) => (
                      <a
                      href="#"
                      key={chat.id}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveChatId(chat.id)
                      }}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-foreground ${activeChatId === chat.id ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                      >
                      {chat.title}
                      </a>
                  ))}
              </nav>
            </div>
          )}
        </div>

        <div className="mt-auto border-t p-4">
            <div className="flex cursor-pointer items-center gap-3">
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src="https://picsum.photos/100" alt="@user" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="text-sm font-semibold">User</p>
                    <p className="text-xs text-muted-foreground">Free</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
        </div>
      </aside>
      <main className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
            <div />
        </header>
        <div className="flex flex-1 flex-col">
          <AiAssistantChat 
            key={activeChatId}
            chat={getActiveChat()}
            onSendMessage={handleSendMessage}
           />
        </div>
      </main>
    </div>
  );
}

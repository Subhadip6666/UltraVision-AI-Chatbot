
'use client';

import { useState } from 'react';
import { AiAssistantChat, type Message } from '@/components/ai-assistant-chat';
import { Button } from '@/components/ui/button';
import { BrainCircuit, ChevronDown, Pencil, BookOpenCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quiz } from '@/components/quiz';

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}


export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'chat' | 'quiz'>('chat');

  const handleNewChat = () => {
    setActiveChatId(null);
    setActiveView('chat');
  };
  
  const getActiveChat = () => {
    if (!activeChatId) return null;
    return chats.find(chat => chat.id === activeChatId) ?? null;
  }

  const handleSendMessage = (userMessage: Message, assistantMessage: Message) => {
    setChats(prevChats => {
      const chatToUpdateId = activeChatId ?? `chat-${Date.now()}`;
      const existingChatIndex = prevChats.findIndex(chat => chat.id === chatToUpdateId);
  
      if (existingChatIndex > -1) {
        const updatedChats = [...prevChats];
        const updatedChat = {
          ...updatedChats[existingChatIndex],
          messages: [...updatedChats[existingChatIndex].messages, userMessage, assistantMessage],
        };
        updatedChats[existingChatIndex] = updatedChat;
        return updatedChats;
      } else {
        const newChat: Chat = {
          id: chatToUpdateId,
          title: (userMessage.content as string).substring(0, 30) + '...',
          messages: [userMessage, assistantMessage],
        };
        if (!activeChatId) {
          setActiveChatId(newChat.id);
        }
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
                        setActiveView('chat');
                      }}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-foreground ${activeChatId === chat.id && activeView === 'chat' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
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
        <header className="flex h-16 shrink-0 items-center justify-end border-b bg-background px-6">
            <Button variant="outline" size="icon" onClick={() => setActiveView('quiz')}>
              <BookOpenCheck className="h-4 w-4" />
              <span className="sr-only">Start Quiz</span>
            </Button>
        </header>
        <div className="flex flex-1 flex-col">
          {activeView === 'chat' ? (
            <AiAssistantChat 
              key={activeChatId}
              chat={getActiveChat()}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <Quiz onExitQuiz={() => setActiveView('chat')} />
          )}
        </div>
      </main>
    </div>
  );
}

import { AiAssistantChat } from '@/components/ai-assistant-chat';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, MessageSquare, BrainCircuit, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="grid min-h-screen w-full grid-cols-[280px_1fr]">
      <aside className="flex flex-col border-r bg-secondary">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <h2 className="text-lg font-semibold">Chat History</h2>
        </header>
        <div className="flex-1 overflow-auto p-4">
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
          <nav className="mt-4 space-y-1">
            {/* Placeholder for chat history items */}
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <MessageSquare className="h-4 w-4" />
              Initial Prompt
            </a>
          </nav>
        </div>
        <div className="mt-auto border-t p-6">
          <div className="text-sm font-semibold">User ID:</div>
          <div className="truncate text-xs text-muted-foreground">04884075911465919674</div>
        </div>
      </aside>
      <main className="flex flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <h2 className="text-lg font-semibold">New Conversation</h2>
          <Button variant="outline">
            <Sparkles className="mr-2 h-4 w-4" />
            Summarize
          </Button>
        </header>
        <div className="flex flex-1 flex-col">
          <AiAssistantChat />
        </div>
      </main>
    </div>
  );
}

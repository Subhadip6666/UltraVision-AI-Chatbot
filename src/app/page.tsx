import { AiAssistantChat } from '@/components/ai-assistant-chat';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, BrainCircuit, Settings, LogOut, User, Bell, Code, FileCode, Bot, Pencil, Library, LayoutGrid, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const chatHistory = [
  { id: '1', title: 'React component generation' },
  { id: '2', title: 'Async/await promise handling' },
  { id: '3', title: 'Data Scraping Script' },
  { id: '4', title: 'Semantic layout' },
  { id: '5', title: 'Flexbox layout' },
  { id: '6', title: 'Python dictionary sorting' },
  { id: '7', title: 'Java array manipulation' },
];


export default function Home() {
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
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted">
                <Pencil className="h-4 w-4" />
                New chat
            </a>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground">
                <Library className="h-4 w-4" />
                Library
            </a>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground">
                <LayoutGrid className="h-4 w-4" />
                GPTs
            </a>
          </nav>

          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold uppercase text-muted-foreground">Chats</h3>
            <nav className="mt-2 space-y-1">
                {chatHistory.map((chat) => (
                    <a
                    href="#"
                    key={chat.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-foreground"
                    >
                    {chat.title}
                    </a>
                ))}
            </nav>
          </div>
        </div>

        <div className="mt-auto border-t p-4">
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src="https://picsum.photos/100" alt="@user" />
                  <AvatarFallback>SP</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="text-sm font-semibold">Subhadip Patra</p>
                    <p className="text-xs text-muted-foreground">Free</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
        </div>
      </aside>
      <main className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
            <div />
            <div className="flex items-center gap-4">
                 <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src="https://picsum.photos/100" alt="@user" />
                  <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                </Avatar>
            </div>
        </header>
        <div className="flex flex-1 flex-col">
          <AiAssistantChat />
        </div>
      </main>
    </div>
  );
}

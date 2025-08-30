import { AiAssistantChat } from '@/components/ai-assistant-chat';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, MessageSquare, Code, Shell, FileJson, Settings, LogOut, Book, User, Bell, BrainCircuit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const chatHistory = [
  {
    id: 'js-1',
    language: 'JavaScript',
    chats: [
        { id: 'js-1-1', title: 'React component generation' },
        { id: 'js-1-2', title: 'Async/await promise handling' },
    ]
  },
  {
    id: 'py-1',
    language: 'Python',
    chats: [
        { id: 'py-1-1', title: 'Data Scraping Script' },
    ]
  },
  {
    id: 'css-1',
    language: 'CSS',
    chats: [
        { id: 'css-1-1', title: 'Flexbox layout' },
    ]
  },
];


export default function Home() {
  return (
    <div className="grid min-h-screen w-full grid-cols-[280px_1fr]">
      <aside className="flex flex-col border-r bg-card text-card-foreground">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b px-6">
          <BrainCircuit className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Code Sensei</h2>
        </header>

        <div className="flex-1 overflow-auto p-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>

          <div className="mt-6">
            <h3 className="px-2 text-xs font-semibold uppercase text-muted-foreground">History</h3>
            <Accordion type="multiple" className="w-full mt-2" defaultValue={chatHistory.map(group => group.language)}>
              {chatHistory.map((group) => (
                  <AccordionItem value={group.language} key={group.id} className="border-b-0">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-2 px-2">
                      {group.language}
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <nav className="space-y-1">
                        {group.chats.map((chat) => (
                          <a
                            href="#"
                            key={chat.id}
                            className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-all hover:text-foreground"
                          >
                            <MessageSquare className="h-4 w-4" />
                            {chat.title}
                          </a>
                        ))}
                      </nav>
                    </AccordionContent>
                  </AccordionItem>
              ))}
              </Accordion>
          </div>
        </div>

        <div className="mt-auto border-t p-4">
            <nav className="space-y-1">
                 <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground">
                    <Settings className="h-4 w-4" />
                    Settings
                </a>
                 <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground">
                    <LogOut className="h-4 w-4" />
                    Logout
                </a>
            </nav>
        </div>
      </aside>
      <main className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost">
                    <Book className="mr-2 h-4 w-4" />
                    Teach me
                </Button>
            </div>
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

import { AiAssistantChat } from '@/components/ai-assistant-chat';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, MessageSquare, BrainCircuit, Settings, LogOut, User, Bell } from 'lucide-react';
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
          <BrainCircuit className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold">UltraVision AI</h2>
        </header>

        <div className="flex-1 overflow-auto p-4">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>

          <div className="mt-6">
            <h3 className="px-2 text-xs font-semibold uppercase text-muted-foreground">History</h3>
            <Accordion type="multiple" className="w-full mt-2" defaultValue={chatHistory.map(group => group.language)}>
              {chatHistory.map((group) => (
                  <AccordionItem value={group.language} key={group.id} className="border-b-0">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-2 px-2">
                      <div className="flex items-center gap-2">
                        {group.language === 'JavaScript' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M10 18h1a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4h-1v11z"/><path d="M17 18h1a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4h-1v11z"/></svg>}
                        {group.language === 'Python' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M14.5 11h-5L11 15h3l-2.5 4"/><path d="M14 8a2 2 0 1 0-4 0"/><path d="M17.5 11h2l-2 5.5"/><path d="m20 18-2 2-2-2"/><path d="M10 8a2 2 0 1 1-4 0"/><path d="M6.5 11h-2l2 5.5"/><path d="m4 18 2 2 2-2"/></svg>}
                        {group.language === 'CSS' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
                        {group.language}
                      </div>
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

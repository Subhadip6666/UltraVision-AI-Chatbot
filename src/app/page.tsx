import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiAssistantChat } from '@/components/ai-assistant-chat';
import { CodeGenerator } from '@/components/code-generator';
import { StepwiseGuide } from '@/components/stepwise-guide';
import { BrainCircuit } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <main className="container mx-auto flex w-full flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-primary p-3 text-primary-foreground">
              <BrainCircuit size={32} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
              UltraVision Assistant
            </h1>
          </div>
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Your intelligent partner for coding. Get instant code suggestions, contextual solutions, and step-by-step
            guidance.
          </p>
        </header>

        <div className="mx-auto w-full max-w-4xl">
          <Tabs defaultValue="assistant" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
              <TabsTrigger value="generator">Code Generator</TabsTrigger>
              <TabsTrigger value="guide">Step-by-Step Guide</TabsTrigger>
            </TabsList>
            <TabsContent value="assistant" className="mt-6">
              <AiAssistantChat />
            </TabsContent>
            <TabsContent value="generator" className="mt-6">
              <CodeGenerator />
            </TabsContent>
            <TabsContent value="guide" className="mt-6">
              <StepwiseGuide />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

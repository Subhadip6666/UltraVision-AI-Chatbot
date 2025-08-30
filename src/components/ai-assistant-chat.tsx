
"use client";

import { useState, useEffect } from "react";
import { understandContextProvideSolutions } from "@/ai/flows/understand-context-provide-solutions";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Send, BrainCircuit, Code, Bug, FileText } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { CodeBlock } from "./code-block";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { Chat } from "@/app/page";

const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

type ChatFormValues = z.infer<typeof chatSchema>;

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: React.ReactNode;
}

const ActionCard = ({ icon, title, example, onClick }: { icon: React.ReactNode, title: string, example: string, onClick?: () => void }) => (
    <Card className="cursor-pointer hover:bg-card/80 transition-colors" onClick={onClick}>
        <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
                {icon}
                <h3 className="font-semibold">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{example}</p>
        </CardContent>
    </Card>
);

interface AiAssistantChatProps {
    chat: Chat | null;
    onSendMessage: (userMessage: Message, assistantMessage: Message) => void;
}


export function AiAssistantChat({ chat, onSendMessage }: AiAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (chat) {
        setMessages(chat.messages)
    }
  }, [chat]);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      message: "",
    },
  });

  const handleActionCardClick = (message: string) => {
    form.setValue("message", message);
    form.handleSubmit(onSubmit)();
  }

  const onSubmit: SubmitHandler<ChatFormValues> = async (data) => {
    setIsLoading(true);
    const userMessageContent = data.message;
    const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: userMessageContent
    };
    
    // Optimistically update UI
    setMessages(prev => [...prev, userMessage]);


    try {
      const result = await understandContextProvideSolutions({
        userRequest: data.message,
        problemDescription: data.message,
      });

      const assistantMessageContent = (
        <div>
          <p>{result.explanation}</p>
          <CodeBlock code={result.suggestedSolution} className="mt-2" />
        </div>
      );

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: assistantMessageContent,
      };

      onSendMessage(userMessage, assistantMessage);

      form.reset();
    } catch (error) {
      console.error(error);
      const errorMessageContent = <p className="text-destructive">An error occurred. Please try again.</p>;
      const errorResponseMessage: Message = { id: `error-${Date.now()}`, role: "assistant", content: errorMessageContent };
      onSendMessage(userMessage, errorResponseMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <div className={cn("p-6 flex flex-col items-center", messages.length > 0 ? "" : "h-full justify-center")}>
          {messages.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-4 mb-4">
                <BrainCircuit className="h-10 w-10 text-primary" />
                <h2 className="text-4xl font-bold">UltraVision AI</h2>
              </div>
              <p className="text-muted-foreground mb-8">Your AI-powered coding assistant. Start by generating, explaining, or debugging code below.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                <ActionCard icon={<Code />} title="Generate Code" example="e.g., 'Create a React button with a primary variant.'" onClick={() => handleActionCardClick("Create a React button with a primary variant.")} />
                <ActionCard icon={<Bug />} title="Debug Code" example="e.g., 'Why is my useEffect running twice?'" onClick={() => handleActionCardClick("Why is my useEffect running twice?")} />
                <ActionCard icon={<FileText />} title="Explain Code" example="e.g., 'What does this Python script do?'" onClick={() => handleActionCardClick("What does this Python script do?")} />
              </div>
            </div>
          ) : (
            <div className="space-y-8 w-full">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex items-start gap-4", message.role === "user" ? "" : "")}>
                {message.role === "assistant" ? (
                  <Avatar className="h-9 w-9 border-2 border-primary">
                    <AvatarFallback className="bg-primary/20">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                   <Avatar className="h-9 w-9 border">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-3",
                    message.role === "user" ? "" : "bg-card"
                  )}
                >
                    <span className="font-bold mb-2 block">{message.role === 'user' ? 'You' : 'UltraVision AI'}</span>
                  {message.content}
                </div>
              </div>
            ))}
            </div>
          )}
          {isLoading && (
            <div className="flex items-start gap-4 mt-8 w-full">
              <Avatar className="h-9 w-9 border-2 border-primary">
                <AvatarFallback className="bg-primary/20">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center rounded-lg bg-card px-4 py-3">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
       <div className="border-t bg-background p-4">
           <div className="relative rounded-lg border bg-input">
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Textarea
                  {...form.register("message")}
                  placeholder="Ready With Your Questions Today"
                  className="min-h-[60px] w-full resize-none border-0 bg-transparent pr-40 pl-4 py-4 focus-visible:ring-0"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center space-x-2">
                    <Select defaultValue="generate">
                        <SelectTrigger className="w-auto gap-2 bg-transparent">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="generate">Generate Code</SelectItem>
                            <SelectItem value="debug">Debug Code</SelectItem>
                            <SelectItem value="explain">Explain Code</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="javascript">
                        <SelectTrigger className="w-auto gap-2 bg-transparent">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="javascript">JavaScript</SelectItem>
                            <SelectItem value="typescript">TypeScript</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="csharp">C#</SelectItem>
                            <SelectItem value="go">Go</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                            <SelectItem value="css">CSS</SelectItem>
                             <SelectItem value="cplusplus">C++</SelectItem>
                            <SelectItem value="ruby">Ruby</SelectItem>
                            <SelectItem value="php">PHP</SelectItem>
                            <SelectItem value="swift">Swift</SelectItem>
                            <SelectItem value="kotlin">Kotlin</SelectItem>
                            <SelectItem value="rust">Rust</SelectItem>
                            <SelectItem value="dart">Dart</SelectItem>
                        </SelectContent>
                    </Select>
                  <Button type="submit" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
            </form>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">Shift+Enter for new line</p>
         </div>
    </div>
  );
}

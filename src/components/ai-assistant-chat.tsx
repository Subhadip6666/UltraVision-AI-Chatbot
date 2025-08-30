"use client";

import { useState, useEffect } from "react";
import { understandContextProvideSolutions } from "@/ai/flows/understand-context-provide-solutions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Send, BrainCircuit, Code, Bug, FileText, ChevronDown } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { CodeBlock } from "./code-block";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

type ChatFormValues = z.infer<typeof chatSchema>;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: React.ReactNode;
}

const ActionCard = ({ icon, title, example }: { icon: React.ReactNode, title: string, example: string }) => (
    <Card className="cursor-pointer hover:bg-card/80 transition-colors">
        <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
                {icon}
                <h3 className="font-semibold">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{example}</p>
        </CardContent>
    </Card>
);

export function AiAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Generate a random user ID on mount for display purposes
    setUserId(Math.random().toString(36).substring(2, 15));
  }, []);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<ChatFormValues> = async (data) => {
    setIsLoading(true);
    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    const userMessageContent = <p>{data.message}</p>;

    setMessages((prev) => [...prev, { id: userMessageId, role: "user", content: userMessageContent }]);

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

      setMessages((prev) => [...prev, { id: assistantMessageId, role: "assistant", content: assistantMessageContent }]);
      form.reset();
    } catch (error) {
      console.error(error);
      const errorMessageContent = <p className="text-destructive">An error occurred. Please try again.</p>;
      setMessages((prev) => [
        ...prev,
        { id: `error-${Date.now()}`, role: "assistant", content: errorMessageContent },
      ]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-8">
          {messages.length === 0 && !isLoading ? (
            <div className="flex h-full flex-col items-center justify-center text-center -mt-8">
              <div className="flex items-center gap-4 mb-4">
                <BrainCircuit className="h-10 w-10 text-foreground" />
                <h2 className="text-4xl font-bold">UltraVision AI</h2>
              </div>
              <p className="text-muted-foreground mb-8">Your AI-powered coding assistant. Start by generating, explaining, or debugging code below.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                <ActionCard icon={<Code />} title="Generate Code" example="e.g., 'Create a React button with a primary variant.'" />
                <ActionCard icon={<Bug />} title="Debug Code" example="e.g., 'Why is my useEffect running twice?'" />
                <ActionCard icon={<FileText />} title="Explain Code" example="e.g., 'What does this Python script do?'" />
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={cn("flex items-start gap-4", message.role === "user" ? "" : "")}>
                {message.role === "assistant" ? (
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback>
                      <BrainCircuit className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                   <Avatar className="h-9 w-9 border">
                    <AvatarImage src="https://picsum.photos/100" alt="@user" />
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
            ))
          )}
          {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="h-9 w-9 border">
                <AvatarFallback>
                  <BrainCircuit className="h-5 w-5" />
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
                  placeholder="e.g., 'Create a React button component with a primary variant.'"
                  className="min-h-[60px] w-full resize-none border-0 bg-transparent pr-40 pl-4 py-4 focus-visible:ring-0"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center space-x-2">
                    <Select defaultValue="generate">
                        <SelectTrigger className="w-auto gap-2 bg-transparent">
                            <Code className="h-4 w-4" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="generate"><div className="flex items-center gap-2"><Code className="h-4 w-4" />Generate Code</div></SelectItem>
                            <SelectItem value="debug"><div className="flex items-center gap-2"><Bug className="h-4 w-4" />Debug Code</div></SelectItem>
                            <SelectItem value="explain"><div className="flex items-center gap-2"><FileText className="h-4 w-4" />Explain Code</div></SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="javascript">
                        <SelectTrigger className="w-auto gap-2 bg-transparent">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="javascript">JavaScript</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="css">CSS</SelectItem>
                        </SelectContent>
                    </Select>
                  <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
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

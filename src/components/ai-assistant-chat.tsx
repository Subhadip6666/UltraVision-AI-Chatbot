"use client";

import { useState, useEffect } from "react";
import { understandContextProvideSolutions } from "@/ai/flows/understand-context-provide-solutions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Loader2, User, Send, BrainCircuit, GripVertical } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { CodeBlock } from "./code-block";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sparkles } from "lucide-react";

const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

type ChatFormValues = z.infer<typeof chatSchema>;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: React.ReactNode;
}

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
        <div className="space-y-6">
          {messages.length === 0 && !isLoading ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <BrainCircuit className="mb-4 h-16 w-16 text-primary" />
              <h2 className="text-3xl font-bold">UltraVision AI</h2>
              <p className="text-muted-foreground">Your AI-powered chat assistant. Start a new conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-4 ${message.role === "user" ? "justify-end" : ""}`}>
                {message.role === "assistant" && (
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="h-9 w-9 border">
                <AvatarFallback>
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center rounded-lg bg-muted px-4 py-3">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t bg-background p-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <Input
            {...form.register("message")}
            placeholder="Type your message..."
            className="h-12 w-full rounded-full bg-muted pr-24 pl-6"
            disabled={isLoading}
            autoComplete="off"
          />
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center space-x-2">
             <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <GripVertical />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-1">
                 <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Enhance
                 </Button>
              </PopoverContent>
            </Popover>
            <Button type="submit" size="icon" className="h-9 w-9 rounded-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

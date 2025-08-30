"use client";

import { useState } from "react";
import { understandContextProvideSolutions } from "@/ai/flows/understand-context-provide-solutions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { CodeBlock } from "./code-block";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const chatSchema = z.object({
  problemDescription: z.string().min(10, "Please describe your problem in at least 10 characters."),
  codeContext: z.string().optional(),
});

type ChatFormValues = z.infer<typeof chatSchema>;

interface Message {
  role: "user" | "assistant";
  content: React.ReactNode;
}

export function AiAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      problemDescription: "",
      codeContext: "",
    },
  });

  const onSubmit: SubmitHandler<ChatFormValues> = async (data) => {
    setIsLoading(true);

    const userMessageContent = (
      <div>
        <p className="font-semibold">Problem:</p>
        <p>{data.problemDescription}</p>
        {data.codeContext && (
          <>
            <p className="mt-2 font-semibold">Code Context:</p>
            <CodeBlock code={data.codeContext} className="mt-1" />
          </>
        )}
      </div>
    );

    setMessages((prev) => [...prev, { role: "user", content: userMessageContent }]);

    try {
      const result = await understandContextProvideSolutions({
        userRequest: data.problemDescription,
        problemDescription: data.problemDescription,
        codeContext: data.codeContext || "No context provided.",
      });

      const assistantMessageContent = (
        <div>
          <p>{result.explanation}</p>
          <CodeBlock code={result.suggestedSolution} className="mt-2" />
        </div>
      );

      setMessages((prev) => [...prev, { role: "assistant", content: assistantMessageContent }]);
      form.reset();
    } catch (error) {
      console.error(error);
      const errorMessage = {
        role: "assistant" as const,
        content: <p className="text-destructive">An error occurred. Please try again.</p>,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
        <CardDescription>
          Describe your coding problem and provide any relevant code context. The AI will analyze it and suggest a
          solution.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-semibold">Chat History</h3>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-9 w-9 border">
                        <AvatarFallback>
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-3 ${
                        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="h-9 w-9 border">
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
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
                {messages.length === 0 && !isLoading && (
                  <p className="text-center text-muted-foreground">Your chat history will appear here.</p>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="md:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="problemDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem / Question</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., How do I center a div?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="codeContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code Context (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste relevant code here..."
                          {...field}
                          rows={8}
                          className="font-code"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                    Send
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

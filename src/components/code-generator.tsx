"use client";

import { useState } from "react";
import { generateCodeSnippet } from "@/ai/flows/generate-code-snippet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Code, Loader2 } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { CodeBlock } from "./code-block";

const generatorSchema = z.object({
  description: z.string().min(10, "Please provide a description of at least 10 characters."),
});

type GeneratorFormValues = z.infer<typeof generatorSchema>;

export function CodeGenerator() {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<GeneratorFormValues>({
    resolver: zodResolver(generatorSchema),
  });

  const onSubmit: SubmitHandler<GeneratorFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedCode(null);
    setError(null);

    try {
      const result = await generateCodeSnippet({ description: data.description });
      setGeneratedCode(result.code);
    } catch (err) {
      setError("Failed to generate code snippet. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Code Generator</CardTitle>
        <CardDescription>Describe the code snippet you need, and the AI will generate it for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Snippet Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., A React component for a login form with email and password fields."
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Code />}
                Generate Code
              </Button>
            </div>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-6 flex items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Generating your code...</span>
          </div>
        )}

        {error && <div className="mt-6 text-center text-destructive">{error}</div>}

        {generatedCode && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-semibold">Generated Code:</h3>
            <CodeBlock code={generatedCode} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import {
  stepwiseGuidanceWithExamples,
  type StepwiseGuidanceWithExamplesOutput,
} from "@/ai/flows/stepwise-guidance-with-examples";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookMarked, Loader2 } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { CodeBlock } from "./code-block";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const guideSchema = z.object({
  query: z.string().min(10, "Please describe the procedure in at least 10 characters."),
});

type GuideFormValues = z.infer<typeof guideSchema>;

export function StepwiseGuide() {
  const [guidance, setGuidance] = useState<StepwiseGuidanceWithExamplesOutput['steps'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<GuideFormValues>({
    resolver: zodResolver(guideSchema),
  });

  const onSubmit: SubmitHandler<GuideFormValues> = async (data) => {
    setIsLoading(true);
    setGuidance(null);
    setError(null);

    try {
      const result = await stepwiseGuidanceWithExamples({ query: data.query });
      if (result.steps && result.steps.length > 0) {
        setGuidance(result.steps);
      } else {
        setError("The AI couldn't generate steps for this query. Please try rephrasing it.");
      }
    } catch (err) {
      setError("Failed to generate guidance. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Step-by-Step Guide</CardTitle>
        <CardDescription>
          Ask for help with a complex procedure, and the AI will break it down into manageable steps with code examples.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What do you need help with?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., How to implement authentication in a Next.js app with Firebase."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <BookMarked />}
                Generate Guide
              </Button>
            </div>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-6 flex items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Generating your guide...</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {guidance && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-semibold">Your Step-by-Step Guide:</h3>
            <Accordion type="single" collapsible className="w-full">
              {guidance.map((step) => (
                <AccordionItem value={`step-${step.stepNumber}`} key={step.stepNumber}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                        {step.stepNumber}
                      </div>
                      <span className="flex-1">{step.instruction}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CodeBlock code={step.codeExample} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

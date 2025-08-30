'use server';
/**
 * @fileOverview Provides step-by-step guidance with code examples for complex coding procedures.
 *
 * - stepwiseGuidanceWithExamples - A function that provides step-by-step guidance with code examples.
 * - StepwiseGuidanceWithExamplesInput - The input type for the stepwiseGuidanceWithExamples function.
 * - StepwiseGuidanceWithExamplesOutput - The return type for the stepwiseGuidanceWithExamples function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StepwiseGuidanceWithExamplesInputSchema = z.object({
  query: z.string().describe('The complex coding procedure the user is asking about.'),
});
export type StepwiseGuidanceWithExamplesInput = z.infer<typeof StepwiseGuidanceWithExamplesInputSchema>;

const StepwiseGuidanceWithExamplesOutputSchema = z.object({
  steps: z.array(
    z.object({
      stepNumber: z.number().describe('The step number in the procedure.'),
      instruction: z.string().describe('A clear instruction for this step.'),
      codeExample: z.string().describe('A code example for this step in React or Javascript.'),
    })
  ).describe('An array of steps with instructions and code examples.'),
});
export type StepwiseGuidanceWithExamplesOutput = z.infer<typeof StepwiseGuidanceWithExamplesOutputSchema>;

export async function stepwiseGuidanceWithExamples(input: StepwiseGuidanceWithExamplesInput): Promise<StepwiseGuidanceWithExamplesOutput> {
  return stepwiseGuidanceWithExamplesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'stepwiseGuidanceWithExamplesPrompt',
  input: {schema: StepwiseGuidanceWithExamplesInputSchema},
  output: {schema: StepwiseGuidanceWithExamplesOutputSchema},
  prompt: `You are an AI coding assistant.  When the user asks for assistance on a complex procedure, you will provide step-by-step guidance with code examples.

  Here is the user's request:
  {{query}}
  `,
});

const stepwiseGuidanceWithExamplesFlow = ai.defineFlow(
  {
    name: 'stepwiseGuidanceWithExamplesFlow',
    inputSchema: StepwiseGuidanceWithExamplesInputSchema,
    outputSchema: StepwiseGuidanceWithExamplesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

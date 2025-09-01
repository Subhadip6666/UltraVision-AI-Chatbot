
'use server';
/**
 * @fileOverview Generates a list of topics for a given programming language.
 *
 * - getTopicsForLanguage - A function that gets topics for a language.
 * - GetTopicsForLanguageInput - The input type for the function.
 * - GetTopicsForLanguageOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetTopicsForLanguageInputSchema = z.object({
  language: z.string().describe('The programming language to get topics for.'),
});
export type GetTopicsForLanguageInput = z.infer<typeof GetTopicsForLanguageInputSchema>;

const GetTopicsForLanguageOutputSchema = z.object({
  topics: z.array(z.string()).describe('An array of 12 programming topics for the given language, from beginner to advanced.'),
});
export type GetTopicsForLanguageOutput = z.infer<typeof GetTopicsForLanguageOutputSchema>;

export async function getTopicsForLanguage(input: GetTopicsForLanguageInput): Promise<GetTopicsForLanguageOutput> {
  return getTopicsForLanguageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getTopicsForLanguagePrompt',
  input: { schema: GetTopicsForLanguageInputSchema },
  output: { schema: GetTopicsForLanguageOutputSchema },
  prompt: `You are an expert curriculum designer for programming languages.

  Generate a list of exactly 12 relevant topics for the {{{language}}} programming language.
  
  The topics should cover a good range, from fundamental concepts to more advanced subjects. Do not include project ideas.`,
});

const getTopicsForLanguageFlow = ai.defineFlow(
  {
    name: 'getTopicsForLanguageFlow',
    inputSchema: GetTopicsForLanguageInputSchema,
    outputSchema: GetTopicsForLanguageOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

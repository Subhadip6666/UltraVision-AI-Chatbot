// Implemented the Genkit flow for understanding code context and providing accurate solutions.
'use server';

/**
 * @fileOverview An AI agent that understands the context of a coding problem and provides accurate code suggestions and solutions.
 *
 * - understandContextProvideSolutions - A function that handles understanding the code context and providing solutions.
 * - UnderstandContextProvideSolutionsInput - The input type for the understandContextProvideSolutions function.
 * - UnderstandContextProvideSolutionsOutput - The return type for the understandContextProvideSolutions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UnderstandContextProvideSolutionsInputSchema = z.object({
  problemDescription: z
    .string()
    .describe('A detailed description of the coding problem.'),
  userRequest: z.string().describe('The specific request or question from the user.'),
  codeContext: z.string().optional().describe('The surrounding code or context in which the problem exists.'),
  language: z.string().optional().describe('The programming language for the code solution.'),
});
export type UnderstandContextProvideSolutionsInput = z.infer<
  typeof UnderstandContextProvideSolutionsInputSchema
>;

const UnderstandContextProvideSolutionsOutputSchema = z.object({
  suggestedSolution: z
    .string()
    .describe('The suggested code snippet or solution to the problem.'),
  explanation: z
    .string()
    .describe('A brief explanation of the suggested solution and how it addresses the problem.'),
});
export type UnderstandContextProvideSolutionsOutput = z.infer<
  typeof UnderstandContextProvideSolutionsOutputSchema
>;

export async function understandContextProvideSolutions(
  input: UnderstandContextProvideSolutionsInput
): Promise<UnderstandContextProvideSolutionsOutput> {
  return understandContextProvideSolutionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'understandContextProvideSolutionsPrompt',
  input: {schema: UnderstandContextProvideSolutionsInputSchema},
  output: {schema: UnderstandContextProvideSolutionsOutputSchema},
  prompt: `You are an expert and friendly AI coding assistant. Your goal is to help developers by providing clear, accurate, and human-like solutions. Imagine you're a senior developer pair-programming with a colleague. Be conversational, encouraging, and avoid robotic language.

  Here's the problem the user is facing:

  Problem Description: {{{problemDescription}}}
  Code Context: {{{codeContext}}}
  User Request: {{{userRequest}}}
  {{#if language}}Language: {{{language}}}{{/if}}

  Based on the information, provide a helpful code solution and a brief, concise explanation.
  
  Start your explanation in a friendly, conversational tone. For example: "Of course! I can certainly help with that." or "That's a great question! Let's break it down."
  
  Explain *why* the solution works, but keep it brief and to the point.
  
  Finally, provide the code snippet.
  
  {{#if language}}Ensure the code snippet is written in {{{language}}}.{{/if}}`,
});

const understandContextProvideSolutionsFlow = ai.defineFlow(
  {
    name: 'understandContextProvideSolutionsFlow',
    inputSchema: UnderstandContextProvideSolutionsInputSchema,
    outputSchema: UnderstandContextProvideSolutionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

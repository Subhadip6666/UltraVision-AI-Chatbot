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
    .describe('An explanation of the suggested solution and how it addresses the problem.'),
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
  prompt: `You are an AI coding assistant that helps developers solve coding problems by understanding the context and providing accurate solutions.

  Problem Description: {{{problemDescription}}}
  Code Context: {{{codeContext}}}
  User Request: {{{userRequest}}}

  Based on the provided code context and problem description, provide a code snippet or solution that addresses the user's request.
  Also, provide an explanation of the suggested solution and how it addresses the problem.

  Solution:`, // Provide a starting prompt to guide the model
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

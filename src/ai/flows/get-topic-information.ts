
'use server';
/**
 * @fileOverview Provides detailed information about a specific programming topic.
 *
 * - getTopicInformation - A function that gets detailed information for a topic.
 * - GetTopicInformationInput - The input type for the function.
 * - GetTopicInformationOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetTopicInformationInputSchema = z.object({
  language: z.string().describe('The programming language.'),
  topic: z.string().describe('The topic to get information about.'),
});
export type GetTopicInformationInput = z.infer<typeof GetTopicInformationInputSchema>;

const SectionSchema = z.object({
    title: z.string().describe('The title of this section.'),
    explanation: z.string().describe('A detailed explanation of the concept for this section. Use newlines for paragraphs.'),
    codeExample: z.string().optional().describe('A relevant, well-formatted code example for this section.'),
});

const GetTopicInformationOutputSchema = z.object({
  title: z.string().describe('The main title of the topic.'),
  introduction: z.string().describe('A brief introduction to the topic.'),
  sections: z.array(SectionSchema).describe('An array of 2 to 4 detailed sections to explain the topic.'),
});
export type GetTopicInformationOutput = z.infer<typeof GetTopicInformationOutputSchema>;

export async function getTopicInformation(input: GetTopicInformationInput): Promise<GetTopicInformationOutput> {
  return getTopicInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getTopicInformationPrompt',
  input: { schema: GetTopicInformationInputSchema },
  output: { schema: GetTopicInformationOutputSchema },
  prompt: `You are an expert programmer and technical writer. 
  
  Provide a detailed, easy-to-understand explanation for the following topic:
  
  Language: {{{language}}}
  Topic: {{{topic}}}
  
  Structure your response with:
  1. A clear title for the overall topic.
  2. A concise introduction.
  3. A series of sections, each with a subtitle, a detailed explanation, and a relevant, well-formatted code snippet if applicable. The explanation should be thorough and clear for a learner.`,
});

const getTopicInformationFlow = ai.defineFlow(
  {
    name: 'getTopicInformationFlow',
    inputSchema: GetTopicInformationInputSchema,
    outputSchema: GetTopicInformationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

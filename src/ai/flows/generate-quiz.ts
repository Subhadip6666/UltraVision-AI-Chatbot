
'use server';
/**
 * @fileOverview Generates a multiple-choice quiz on a given programming language.
 *
 * - generateQuiz - A function that creates a quiz.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateQuizInputSchema = z.object({
  language: z.string().describe('The programming language for the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuizQuestionSchema = z.object({
    question: z.string().describe('The quiz question.'),
    options: z.array(z.string()).describe('An array of 4 multiple-choice options.'),
    correctAnswer: z.string().describe('The correct answer from the options array.'),
    explanation: z.string().describe('A brief explanation of why the answer is correct.'),
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

const GenerateQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe('An array of 5 quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an expert programmer and educator. Generate a 5-question multiple-choice quiz about the {{{language}}} programming language. 
  
  The questions should cover a range of topics from beginner to intermediate.
  For each question, provide 4 options, one of which is the correct answer.
  Also provide a brief explanation for the correct answer.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

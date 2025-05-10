'use server';
/**
 * @fileOverview An AI agent that suggests a CNN backbone architecture based on dataset characteristics and project goals.
 *
 * - suggestCNNBackboneArchitecture - A function that suggests a CNN backbone architecture.
 * - SuggestCNNBackboneArchitectureInput - The input type for the suggestCNNBackboneArchitecture function.
 * - SuggestCNNBackboneArchitectureOutput - The return type for the suggestCNNBackboneArchitecture function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCNNBackboneArchitectureInputSchema = z.object({
  datasetType: z
    .string()
    .describe('The type of dataset being used (e.g., COCO, Pascal VOC, Open Images).'),
  imageSize: z
    .string()
    .describe('The average size of images in the dataset (e.g., 256x256, 512x512).'),
  projectGoal: z
    .string()
    .describe(
      'The primary goal of the project (e.g., high accuracy, fast inference, resource efficiency).'
    ),
  performanceRequirement: z
    .string()
    .describe('The desired performance level (e.g., high, medium, low).'),
});
export type SuggestCNNBackboneArchitectureInput = z.infer<typeof SuggestCNNBackboneArchitectureInputSchema>;

const SuggestCNNBackboneArchitectureOutputSchema = z.object({
  suggestedBackbone: z
    .string()
    .describe('The suggested CNN backbone architecture (e.g., ResNet50, VGG16, MobileNet).'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggestion, considering dataset characteristics and project goals.'),
});
export type SuggestCNNBackboneArchitectureOutput = z.infer<typeof SuggestCNNBackboneArchitectureOutputSchema>;

export async function suggestCNNBackboneArchitecture(
  input: SuggestCNNBackboneArchitectureInput
): Promise<SuggestCNNBackboneArchitectureOutput> {
  return suggestCNNBackboneArchitectureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCNNBackboneArchitecturePrompt',
  input: {schema: SuggestCNNBackboneArchitectureInputSchema},
  output: {schema: SuggestCNNBackboneArchitectureOutputSchema},
  prompt: `You are an expert in computer vision and deep learning.
Based on the dataset characteristics and project goals provided, suggest the most appropriate CNN backbone architecture for object detection.

Consider the following factors:
- Dataset type: {{{datasetType}}}
- Image size: {{{imageSize}}}
- Project goal: {{{projectGoal}}}
- Performance requirement: {{{performanceRequirement}}}

Explain your reasoning for the suggestion.

Your output MUST be a JSON object with "suggestedBackbone" and "reasoning" fields. Do not include any other text. Here is the output schema:
\n${JSON.stringify(SuggestCNNBackboneArchitectureOutputSchema.shape, null, 2)}`,
});

const suggestCNNBackboneArchitectureFlow = ai.defineFlow(
  {
    name: 'suggestCNNBackboneArchitectureFlow',
    inputSchema: SuggestCNNBackboneArchitectureInputSchema,
    outputSchema: SuggestCNNBackboneArchitectureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

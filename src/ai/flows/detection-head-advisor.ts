'use server';
/**
 * @fileOverview Chooses an appropriate object detection framework (SSD, FPN, YOLO) based on the selected backbone and dataset.
 *
 * - chooseDetectionFramework - A function that handles the object detection framework selection process.
 * - ChooseDetectionFrameworkInput - The input type for the chooseDetectionFramework function.
 * - ChooseDetectionFrameworkOutput - The return type for the chooseDetectionFramework function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChooseDetectionFrameworkInputSchema = z.object({
  backbone: z.string().describe('The selected CNN backbone architecture (e.g., ResNet, VGG, MobileNet).'),
  dataset: z.string().describe('The dataset to be used for training the object detection model (e.g., COCO, Pascal VOC).'),
});
export type ChooseDetectionFrameworkInput = z.infer<typeof ChooseDetectionFrameworkInputSchema>;

const ChooseDetectionFrameworkOutputSchema = z.object({
  detectionFramework: z.string().describe('The recommended object detection framework (SSD, FPN, YOLO).'),
  reasoning: z.string().describe('The reasoning behind the framework selection.'),
});
export type ChooseDetectionFrameworkOutput = z.infer<typeof ChooseDetectionFrameworkOutputSchema>;

export async function chooseDetectionFramework(input: ChooseDetectionFrameworkInput): Promise<ChooseDetectionFrameworkOutput> {
  return chooseDetectionFrameworkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chooseDetectionFrameworkPrompt',
  input: {schema: ChooseDetectionFrameworkInputSchema},
  output: {schema: ChooseDetectionFrameworkOutputSchema},
  prompt: `Given the CNN backbone architecture "{{{backbone}}}" and the dataset "{{{dataset}}}", recommend an appropriate object detection framework (SSD, FPN, YOLO) and explain your reasoning.

Consider the compatibility of the detection framework with the backbone and the suitability of the framework for the dataset characteristics. For example, YOLO is suitable for real-time object detection, while FPN is good for detecting objects at different scales.

Return the recommended framework in the "detectionFramework" field and the reasoning in the "reasoning" field.
`,
});

const chooseDetectionFrameworkFlow = ai.defineFlow(
  {
    name: 'chooseDetectionFrameworkFlow',
    inputSchema: ChooseDetectionFrameworkInputSchema,
    outputSchema: ChooseDetectionFrameworkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

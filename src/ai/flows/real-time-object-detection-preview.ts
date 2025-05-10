// This file holds the real-time object detection preview flow.

'use server';

/**
 * @fileOverview Defines a Genkit flow for real-time object detection preview.
 *
 * - `realTimeObjectDetectionPreview`:  Function to initiate the object detection process.
 * - `RealTimeObjectDetectionPreviewInput`: Input type for the object detection flow.
 * - `RealTimeObjectDetectionPreviewOutput`: Output type for the object detection flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RealTimeObjectDetectionPreviewInputSchema = z.object({
  image: z
    .string()
    .describe(
      'The image to process, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type RealTimeObjectDetectionPreviewInput = z.infer<typeof RealTimeObjectDetectionPreviewInputSchema>;

const RealTimeObjectDetectionPreviewOutputSchema = z.object({
  detections: z
    .string()
    .describe('The object detection results, as a JSON string.'),
  annotatedImage: z
    .string()
    .describe(
      'An image with bounding boxes around the detected objects, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});

export type RealTimeObjectDetectionPreviewOutput = z.infer<typeof RealTimeObjectDetectionPreviewOutputSchema>;

export async function realTimeObjectDetectionPreview(input: RealTimeObjectDetectionPreviewInput): Promise<RealTimeObjectDetectionPreviewOutput> {
  return realTimeObjectDetectionPreviewFlow(input);
}

const objectDetectionPrompt = ai.definePrompt({
  name: 'objectDetectionPrompt',
  input: {schema: RealTimeObjectDetectionPreviewInputSchema},
  output: {schema: RealTimeObjectDetectionPreviewOutputSchema},
  prompt: `You are an expert object detection model.  Given the image, detect the objects in the image, 
and return the results as a JSON string, including bounding box coordinates, and include an annotated image.

Image: {{media url=image}}`,
});

const realTimeObjectDetectionPreviewFlow = ai.defineFlow(
  {
    name: 'realTimeObjectDetectionPreviewFlow',
    inputSchema: RealTimeObjectDetectionPreviewInputSchema,
    outputSchema: RealTimeObjectDetectionPreviewOutputSchema,
  },
  async input => {
    const {output} = await objectDetectionPrompt(input);
    return output!;
  }
);

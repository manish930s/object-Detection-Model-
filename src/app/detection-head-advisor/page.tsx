"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { chooseDetectionFramework, type ChooseDetectionFrameworkInput, type ChooseDetectionFrameworkOutput } from "@/ai/flows/detection-head-advisor";
import { Loader2, Wand2 } from "lucide-react";

const formSchema = z.object({
  backbone: z.string().min(1, "Backbone architecture is required."),
  dataset: z.string().min(1, "Dataset is required."),
});

type FormValues = z.infer<typeof formSchema>;

const backboneOptions = ["ResNet50", "ResNet101", "VGG16", "MobileNetV2", "EfficientNetB0", "DenseNet121", "Other"];
const datasetOptions = ["COCO", "Pascal VOC", "Open Images", "KITTI", "Custom"];

export default function DetectionHeadAdvisorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ChooseDetectionFrameworkOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      backbone: "",
      dataset: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const aiResult = await chooseDetectionFramework(data);
      setResult(aiResult);
      toast({
        title: "Recommendation Received",
        description: "AI has recommended a detection framework.",
      });
    } catch (error) {
      console.error("Error recommending detection framework:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get recommendation. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center gap-2">
            <Wand2 className="h-8 w-8" />
            Detection Head Advisor
          </CardTitle>
          <CardDescription className="text-lg">
            Get an AI-powered recommendation for the most suitable object detection framework (SSD, FPN, YOLO) based on your chosen backbone and dataset.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="backbone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selected CNN Backbone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select backbone architecture" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {backboneOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dataset</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dataset" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {datasetOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Recommendation...
                  </>
                ) : (
                  "Get Recommendation"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8 shadow-lg animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">AI Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Recommended Detection Framework:</h3>
              <p className="text-primary text-xl font-bold p-2 bg-primary/10 rounded-md">{result.detectionFramework}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Reasoning:</h3>
              <p className="text-muted-foreground p-2 border rounded-md whitespace-pre-wrap">{result.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

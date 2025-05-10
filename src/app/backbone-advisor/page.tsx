"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { suggestCNNBackboneArchitecture, type SuggestCNNBackboneArchitectureInput, type SuggestCNNBackboneArchitectureOutput } from "@/ai/flows/ai-backbone-advisor";
import { Loader2, Wand2 } from "lucide-react";

const formSchema = z.object({
  datasetType: z.string().min(1, "Dataset type is required."),
  imageSize: z.string().min(1, "Image size is required (e.g., 256x256)."),
  projectGoal: z.string().min(1, "Project goal is required."),
  performanceRequirement: z.string().min(1, "Performance requirement is required."),
});

type FormValues = z.infer<typeof formSchema>;

const datasetTypes = ["COCO", "Pascal VOC", "Open Images", "KITTI", "Custom"];
const projectGoals = ["High Accuracy", "Fast Inference", "Resource Efficiency", "Balanced"];
const performanceRequirements = ["High", "Medium", "Low"];
const imageSizes = ["128x128", "256x256", "300x300", "512x512", "600x600", "1024x1024"];


export default function BackboneAdvisorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestCNNBackboneArchitectureOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      datasetType: "",
      imageSize: "256x256",
      projectGoal: "",
      performanceRequirement: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const aiResult = await suggestCNNBackboneArchitecture(data);
      setResult(aiResult);
      toast({
        title: "Suggestion Received",
        description: "AI has suggested a backbone architecture.",
      });
    } catch (error) {
      console.error("Error suggesting backbone:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get suggestion. Please try again.",
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
            AI Backbone Advisor
          </CardTitle>
          <CardDescription className="text-lg">
            Let AI suggest the optimal CNN backbone architecture for your object detection project based on your specific requirements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="datasetType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dataset Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dataset type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {datasetTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Image Size</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select image size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {imageSizes.map(size => <SelectItem key={size} value={size}>{size}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormDescription>E.g., 256x256, 512x512</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Project Goal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         {projectGoals.map(goal => <SelectItem key={goal} value={goal}>{goal}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="performanceRequirement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Performance Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select performance level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {performanceRequirements.map(req => <SelectItem key={req} value={req}>{req}</SelectItem>)}
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
                    Getting Suggestion...
                  </>
                ) : (
                  "Get Suggestion"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8 shadow-lg animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">AI Suggestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Suggested Backbone:</h3>
              <p className="text-primary text-xl font-bold p-2 bg-primary/10 rounded-md">{result.suggestedBackbone}</p>
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

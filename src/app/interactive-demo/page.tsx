"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { realTimeObjectDetectionPreview, type RealTimeObjectDetectionPreviewInput, type RealTimeObjectDetectionPreviewOutput } from "@/ai/flows/real-time-object-detection-preview";
import Image from "next/image";
import { Loader2, Upload, Download, Camera, FileJson } from "lucide-react";

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function InteractiveDemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [result, setResult] = useState<RealTimeObjectDetectionPreviewOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 5MB." });
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast({ variant: "destructive", title: "Invalid file type", description: "Please upload a JPEG, PNG, or WEBP image." });
        return;
      }
      setSelectedFile(file);
      setResult(null); // Clear previous results
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({ variant: "destructive", title: "No file selected", description: "Please upload an image first." });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const base64Image = await toBase64(selectedFile);
      const input: RealTimeObjectDetectionPreviewInput = { image: base64Image };
      const aiResult = await realTimeObjectDetectionPreview(input);
      setResult(aiResult);
      toast({
        title: "Detection Complete",
        description: "Objects detected in the image.",
      });
    } catch (error) {
      console.error("Error during object detection:", error);
      let errorMessage = "Failed to detect objects. Please try again.";
      if (error instanceof Error && error.message.includes("size")) {
          errorMessage = "Image size might be too large for the model or there was an issue processing it. Try a smaller image."
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJson = (jsonData: string, filename: string) => {
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    downloadFile(url, filename);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center gap-2">
            <Camera className="h-8 w-8" />
            Interactive Object Detection Demo
          </CardTitle>
          <CardDescription className="text-lg">
            Upload an image and see our AI model detect objects in real-time. Download the annotated image and detection data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="image-upload" className="text-base font-medium">Upload Test Image</Label>
            <div className="mt-2 flex items-center gap-4">
              <Input
                id="image-upload"
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleFileChange}
                className="flex-grow"
              />
              <Button onClick={handleSubmit} disabled={isLoading || !selectedFile}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Detect Objects
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Supported formats: JPG, PNG, WEBP. Max size: 5MB.</p>
          </div>

          {previewImage && !result?.annotatedImage && (
            <div className="mt-4 border rounded-lg overflow-hidden shadow-sm">
              <Image src={previewImage} alt="Uploaded preview" width={600} height={400} objectFit="contain" className="mx-auto" />
              <p className="text-center p-2 bg-muted text-muted-foreground text-sm">Original Image Preview</p>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8 shadow-lg animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Detection Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.annotatedImage && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Annotated Image:</h3>
                <div className="border rounded-lg overflow-hidden shadow-sm">
                    <Image src={result.annotatedImage} alt="Annotated Image" width={600} height={400} objectFit="contain" className="mx-auto"/>
                </div>
                <Button onClick={() => downloadFile(result.annotatedImage!, "annotated_image.png")} className="mt-2 w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Annotated Image
                </Button>
              </div>
            )}
            {result.detections && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Detections (JSON):</h3>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto max-h-60">
                  {JSON.stringify(JSON.parse(result.detections), null, 2)}
                </pre>
                <Button onClick={() => downloadJson(result.detections!, "detections.json")} variant="outline" className="mt-2 w-full">
                  <FileJson className="mr-2 h-4 w-4" />
                  Download Detections JSON
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

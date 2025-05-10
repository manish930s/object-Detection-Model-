"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Database, ExternalLink } from "lucide-react";

interface DatasetInfo {
  id: string;
  name: string;
  description: string;
  url: string;
  image: string;
  aiHint: string;
  details: {
    categories?: string;
    images?: string;
    annotations?: string;
    keyFeatures?: string[];
  };
}

const datasets: DatasetInfo[] = [
  {
    id: "coco",
    name: "COCO (Common Objects in Context)",
    description: "Large-scale object detection, segmentation, and captioning dataset.",
    url: "https://cocodataset.org/",
    image: "https://picsum.photos/seed/coco/400/200",
    aiHint: "object detection",
    details: {
      categories: "80 object categories",
      images: "330K+ images (200K+ labeled)",
      annotations: "Instance segmentation, bounding boxes, keypoints, captions",
      keyFeatures: ["Rich annotations", "Diverse scenes", "Standard benchmark"],
    }
  },
  {
    id: "pascal-voc",
    name: "Pascal VOC (Visual Object Classes)",
    description: "Standardized image datasets for object class recognition.",
    url: "http://host.robots.ox.ac.uk/pascal/VOC/",
    image: "https://picsum.photos/seed/pascal/400/200",
    aiHint: "image classification",
    details: {
      categories: "20 object categories",
      images: "~11,530 images (for VOC2012)",
      annotations: "Bounding boxes, object segmentation (some versions)",
      keyFeatures: ["Well-established", "Good for benchmarking classic models"],
    }
  },
  {
    id: "open-images",
    name: "Open Images Dataset",
    description: "A large dataset of images with annotations for various tasks.",
    url: "https://storage.googleapis.com/openimages/web/index.html",
    image: "https://picsum.photos/seed/openimages/400/200",
    aiHint: "image database",
    details: {
      categories: "600+ object categories (V7)",
      images: "~9 million images",
      annotations: "Bounding boxes, instance segmentations, visual relationships, localized narratives",
      keyFeatures: ["Very large scale", "Hierarchical categories", "Diverse image sources"],
    }
  },
  {
    id: "kitti",
    name: "KITTI Vision Benchmark Suite",
    description: "Challenging real-world computer vision benchmarks for autonomous driving.",
    url: "http://www.cvlibs.net/datasets/kitti/",
    image: "https://picsum.photos/seed/kitti/400/200",
    aiHint: "autonomous driving",
    details: {
      categories: "Pedestrian, Car, Cyclist, etc.",
      images: "Various sequences with stereo, lidar, GPS data",
      annotations: "3D bounding boxes, tracking",
      keyFeatures: ["Autonomous driving focus", "Multi-modal sensor data", "Real-world scenarios"],
    }
  }
];

export default function DatasetLoaderPage() {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(datasets[0].id);

  const selectedDataset = datasets.find(ds => ds.id === selectedDatasetId);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center gap-2">
            <Database className="h-8 w-8" />
            Dataset Explorer
          </CardTitle>
          <CardDescription className="text-lg">
            Explore and learn about popular open-source object detection datasets. Select a dataset to see more details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedDatasetId ?? ""}
            onValueChange={setSelectedDatasetId}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {datasets.map((dataset) => (
              <Label
                key={dataset.id}
                htmlFor={dataset.id}
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors ${
                  selectedDatasetId === dataset.id ? "border-primary ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                   <RadioGroupItem value={dataset.id} id={dataset.id} className="sr-only" />
                  <span className="font-semibold text-lg">{dataset.name}</span>
                </div>
                <div className="relative h-24 w-full mb-2 rounded overflow-hidden">
                    <Image src={dataset.image} alt={dataset.name} layout="fill" objectFit="cover" data-ai-hint={dataset.aiHint} />
                </div>
                <p className="text-sm text-center text-muted-foreground">{dataset.description}</p>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {selectedDataset && (
        <Card className="shadow-lg animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">{selectedDataset.name}</CardTitle>
            <a
              href={selectedDataset.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              Visit Website <ExternalLink className="h-4 w-4" />
            </a>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden shadow-md">
                <Image src={selectedDataset.image.replace("/200", "/400")} alt={selectedDataset.name} layout="fill" objectFit="cover" data-ai-hint={selectedDataset.aiHint + " large"} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDataset.details.categories && (
                <div><strong className="text-foreground">Categories:</strong> <span className="text-muted-foreground">{selectedDataset.details.categories}</span></div>
              )}
              {selectedDataset.details.images && (
                <div><strong className="text-foreground">Images:</strong> <span className="text-muted-foreground">{selectedDataset.details.images}</span></div>
              )}
              {selectedDataset.details.annotations && (
                <div className="md:col-span-2"><strong className="text-foreground">Annotations:</strong> <span className="text-muted-foreground">{selectedDataset.details.annotations}</span></div>
              )}
            </div>

            {selectedDataset.details.keyFeatures && selectedDataset.details.keyFeatures.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-1 text-foreground">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {selectedDataset.details.keyFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

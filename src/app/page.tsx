import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BrainCog, Target, Database, Camera } from "lucide-react";

const features = [
  {
    title: "AI Backbone Advisor",
    description: "Get expert suggestions for the best CNN backbone architecture based on your project's needs.",
    href: "/backbone-advisor",
    icon: BrainCog,
    image: "https://picsum.photos/seed/backbone/600/400",
    aiHint: "neural network",
  },
  {
    title: "Detection Head Advisor",
    description: "Let AI choose the optimal detection framework (SSD, FPN, YOLO) for your selected backbone and dataset.",
    href: "/detection-head-advisor",
    icon: Target,
    image: "https://picsum.photos/seed/detector/600/400",
    aiHint: "target detection",
  },
  {
    title: "Dataset Loader",
    description: "Explore and select from popular open-source object detection datasets like COCO, Pascal VOC, and more.",
    href: "/dataset-loader",
    icon: Database,
    image: "https://picsum.photos/seed/dataset/600/400",
    aiHint: "data storage",
  },
  {
    title: "Interactive Demo",
    description: "Upload your images and see real-time object detection in action with our AI-powered preview.",
    href: "/interactive-demo",
    icon: Camera,
    image: "https://picsum.photos/seed/demo/600/400",
    aiHint: "live camera",
  },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary mb-4">
          Welcome to VisionCraft AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Streamline your object detection model development with AI-powered tools for backbone selection, detection head automation, dataset integration, and interactive demos.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature) => (
          <Card key={feature.href} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 w-full">
              <Image
                src={feature.image}
                alt={feature.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={feature.aiHint}
              />
            </div>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <feature.icon className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
              </div>
              <CardDescription className="text-base min-h-[3em]">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild variant="default" className="w-full group">
                <Link href={feature.href}>
                  Go to {feature.label || feature.title.split(" ")[0]}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <footer className="mt-16 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} VisionCraft AI. Built with passion and AI.</p>
      </footer>
    </div>
  );
}

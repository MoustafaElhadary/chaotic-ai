"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const images = [
  "https://placehold.co/900x800/png",
  "https://placehold.co/900x800/png",
  "https://placehold.co/900x800/png",
];

export const WebsitePreview: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="w-full h-full p-4 overflow-y-auto">
      <Carousel setApi={setApi} className="w-full h-full">
        <Card className="w-full h-full flex flex-col">
          <CardHeader>
            <CardTitle>Website Preview</CardTitle>
            <CardDescription>
              Preview of the website during testing
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <CarouselContent className="h-full">
              {images.map((image, index) => (
                <CarouselItem key={index} className="h-full">
                  <div className="p-1 h-full">
                    <Card className="h-full">
                      <CardContent className="flex items-center justify-center p-6 h-full">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </CardContent>
          <div className="flex items-center justify-center p-4">
            <CarouselPrevious className="relative mr-2" />
            <div className="text-center text-md text-muted-foreground">
              Screenshot {current} of {count}
            </div>
            <CarouselNext className="relative ml-2" />
          </div>
        </Card>
      </Carousel>
    </div>
  );
};

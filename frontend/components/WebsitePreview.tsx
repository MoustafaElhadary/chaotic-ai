'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

const images = [
  'https://placehold.co/900x800/png',
  'https://placehold.co/900x800/png',
  'https://placehold.co/900x800/png'
]

export const WebsitePreview: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className={cn('flex h-[52px] items-center justify-center')}>
        <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
          <h1 className="text-xl font-bold">Website Preview</h1>
        </div>
      </div>
      <Separator />
      <Carousel setApi={setApi} className="p-4">
        <div className="flex-grow overflow-hidden">
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
        </div>
        <div className="flex items-center justify-center p-4 mt-6">
          <CarouselPrevious className="relative mr-2" />
          <div className="text-center text-md text-muted-foreground -mt-8">
            Screenshot {current} of {count}
          </div>
          <CarouselNext className="relative ml-2" />
        </div>
      </Carousel>
    </div>
  )
}

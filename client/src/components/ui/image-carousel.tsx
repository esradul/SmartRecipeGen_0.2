import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCarouselProps {
  images: string[];
  onImageClick?: (imageUrl: string) => void;
}

export function ImageCarousel({ images, onImageClick }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative">
      <div className="flex space-x-4 overflow-x-auto pb-4 image-carousel" data-testid="image-carousel">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            className={`flex-shrink-0 relative ${index === currentIndex ? 'ring-2 ring-primary' : ''}`}
            data-testid={`image-carousel-item-${index}`}
          >
            <img
              src={imageUrl}
              alt={`Attachment ${index + 1}`}
              className="w-64 h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onImageClick?.(imageUrl)}
              data-testid={`image-carousel-image-${index}`}
            />
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/75 w-8 h-8 p-0"
              onClick={() => onImageClick?.(imageUrl)}
              data-testid={`button-expand-image-${index}`}
            >
              <Expand className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      
      {images.length > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={goToPrevious}
            data-testid="button-previous-image"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground" data-testid="text-image-counter">
            {currentIndex + 1} of {images.length}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={goToNext}
            data-testid="button-next-image"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

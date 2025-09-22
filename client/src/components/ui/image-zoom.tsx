import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageZoomProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
}

export function ImageZoom({ isOpen, onClose, imageUrl, alt }: ImageZoomProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/90" data-testid="dialog-image-zoom">
        <DialogTitle className="sr-only">Image Zoom View</DialogTitle>
        <div className="relative flex items-center justify-center h-full">
          <img
            src={imageUrl}
            alt={alt || 'Zoomed image'}
            className="max-w-full max-h-full object-contain"
            data-testid="img-zoomed-image"
          />
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/75 w-10 h-10 p-0"
            onClick={onClose}
            data-testid="button-close-zoom"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

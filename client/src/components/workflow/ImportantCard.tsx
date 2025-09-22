import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { ImageZoom } from '@/components/ui/image-zoom';
import { useToast } from '@/hooks/use-toast';
import type { N8nRecord } from '@shared/schema';

const importantSchema = z.object({
  Important_reply: z.string().min(1, 'Important reply is required'),
  human_name: z.string().optional(),
});

type ImportantFormData = z.infer<typeof importantSchema>;

interface ImportantCardProps {
  record: N8nRecord;
  onUpdate: (id: number, updates: Partial<N8nRecord>) => Promise<void>;
}

export function ImportantCard({ record, onUpdate }: ImportantCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ImportantFormData>({
    resolver: zodResolver(importantSchema),
    defaultValues: {
      Important_reply: record.Important_reply || '',
      human_name: record.human_name || '',
    },
  });

  // Parse image URLs if they exist
  const imageUrls = record.image && record.image_url ? 
    (typeof record.image_url === 'string' ? JSON.parse(record.image_url) : record.image_url) : [];

  const onSubmit = async (data: ImportantFormData) => {
    setIsSubmitting(true);
    try {
      await onUpdate(record.id, {
        Important_reply: data.Important_reply,
        human_name: data.human_name || null,
        Important_replied: true,
      });
      
      toast({
        title: 'Important reply submitted',
        description: 'Important reply has been submitted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit important reply. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    setIsSubmitting(true);
    try {
      await onUpdate(record.id, { removed: true });
      
      toast({
        title: 'Record removed',
        description: 'Record has been moved to the recovery section.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove record. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card data-testid={`card-important-${record.id}`}>
        <CardContent className="p-6 space-y-4">
          {/* Email Subject */}
          <div className="border-b border-border pb-4">
            <h3 className="text-lg font-semibold text-foreground" data-testid="text-email-subject">
              {record.email_subject || 'No Subject'}
            </h3>
          </div>

          {/* Content Fields */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Previous Emails Summary</h4>
              <div className="bg-muted rounded-lg p-4" data-testid="text-previous-emails">
                <p className="text-sm text-muted-foreground">
                  {record.Previous_Emails_Summary || 'No previous emails summary available.'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Customer Email</h4>
              <div className="bg-muted rounded-lg p-4" data-testid="text-customer-email">
                <p className="text-sm text-foreground">
                  {record.Customer_Email || 'No customer email content available.'}
                </p>
              </div>
            </div>

            {/* Images */}
            {record.image && imageUrls.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Attachments</h4>
                <ImageCarousel 
                  images={imageUrls} 
                  onImageClick={setSelectedImage}
                />
              </div>
            )}

            {/* CRM Notes Accordion */}
            <Accordion type="single" collapsible>
              <AccordionItem value="crm-notes">
                <AccordionTrigger data-testid="button-toggle-crm-notes">
                  CRM Notes
                </AccordionTrigger>
                <AccordionContent>
                  <div className="bg-muted rounded-lg p-4" data-testid="text-crm-notes">
                    <p className="text-sm text-muted-foreground">
                      {record.CRM_notes || 'No CRM notes available.'}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Important Reply Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="Important_reply"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Important Reply</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-32 resize-vertical"
                          placeholder="Enter your important reply..."
                          data-testid="textarea-important-reply"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="human_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Human Name (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Your name (optional)"
                          data-testid="input-human-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Controls */}
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleRemove}
                      disabled={isSubmitting}
                      data-testid="button-remove"
                    >
                      Remove
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      data-testid="button-submit-important"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>

      {/* Image Zoom Modal */}
      <ImageZoom
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ''}
        alt="Attachment"
      />
    </>
  );
}

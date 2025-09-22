import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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

const actionSchema = z.object({
  action: z.enum(['approval', 'objection', 'manual', 'cancel']),
  feedback: z.string().optional(),
  draft_reply: z.string().optional(),
});

type ActionFormData = z.infer<typeof actionSchema>;

interface SendGuardCardProps {
  record: N8nRecord;
  onUpdate: (id: number, updates: Partial<N8nRecord>) => Promise<void>;
}

export function SendGuardCard({ record, onUpdate }: SendGuardCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ActionFormData>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      action: undefined,
      feedback: record.feedback || '',
      draft_reply: record.draft_reply || '',
    },
  });

  const watchedAction = form.watch('action');
  const showFeedback = watchedAction === 'objection' || watchedAction === 'manual';

  // Parse image URLs if they exist
  const imageUrls = record.image && record.image_url ? 
    (typeof record.image_url === 'string' ? JSON.parse(record.image_url) : record.image_url) : [];

  const onSubmit = async (data: ActionFormData) => {
    if (showFeedback && !data.feedback?.trim()) {
      form.setError('feedback', {
        type: 'required',
        message: 'Feedback is required for Objection and Manual Handle actions',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const updates: Partial<N8nRecord> = {
        draft_reply: data.draft_reply,
      };

      switch (data.action) {
        case 'approval':
          updates.permission = 'Approval';
          updates.feedback = null;
          break;
        case 'objection':
          updates.permission = 'Objection';
          updates.feedback = data.feedback;
          updates.edited = record.edited ? Number(record.edited) + 1 : 1;
          break;
        case 'manual':
          updates.permission = 'Manual Handle';
          updates.feedback = data.feedback;
          break;
        case 'cancel':
          updates.permission = 'Cancel';
          break;
      }

      await onUpdate(record.id, updates);
      
      toast({
        title: 'Record updated',
        description: `Record has been marked as ${data.action}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update record. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card data-testid={`card-sendguard-${record.id}`}>
        <CardContent className="p-6 space-y-4">
          {/* Email Subject */}
          <div className="border-b border-border pb-4">
            <h3 className="text-lg font-semibold text-foreground" data-testid="text-email-subject">
              {record.email_subject || 'No Subject'}
            </h3>
            {record.edited && Number(record.edited) > 0 && (
              <Badge variant="secondary" className="mt-2" data-testid="badge-edited">
                Edited {record.edited} time{Number(record.edited) > 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {/* Feedback Alert */}
          {record.feedback && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4" data-testid="alert-feedback">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-foreground">Feedback from previous review:</p>
                  <p className="text-sm text-muted-foreground mt-1">{record.feedback}</p>
                </div>
              </div>
            </div>
          )}

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

            <div>
              <h4 className="font-medium text-foreground mb-2">Thought Process</h4>
              <div className="bg-muted rounded-lg p-4" data-testid="text-thought-process">
                <p className="text-sm text-muted-foreground">
                  {record.thought_process || 'No thought process available.'}
                </p>
              </div>
            </div>

            {/* Draft Reply Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="draft_reply"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Draft Reply</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-32 resize-vertical"
                          placeholder="Enter draft reply..."
                          data-testid="textarea-draft-reply"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                {/* Action Controls */}
                <div className="border-t border-border pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
                      <FormField
                        control={form.control}
                        name="action"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Action</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-48" data-testid="select-action">
                                  <SelectValue placeholder="Select action..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="approval">Approval</SelectItem>
                                <SelectItem value="objection">Objection</SelectItem>
                                <SelectItem value="manual">Manual Handle</SelectItem>
                                <SelectItem value="cancel">Cancel</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {showFeedback && (
                        <FormField
                          control={form.control}
                          name="feedback"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Feedback</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Required for Objection/Manual Handle"
                                  className="w-64"
                                  data-testid="input-feedback"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !watchedAction}
                      data-testid="button-process"
                    >
                      {isSubmitting ? 'Processing...' : 'Process'}
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

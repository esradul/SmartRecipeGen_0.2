import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/contexts/SupabaseProvider';
import { useToast } from '@/hooks/use-toast';

const configSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  key: z.string().min(1, 'API key is required'),
  tableName: z.string().min(1, 'Table name is required'),
});

type ConfigFormData = z.infer<typeof configSchema>;

interface ConfigurationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigurationDialog({ isOpen, onClose }: ConfigurationDialogProps) {
  const { config, saveConfig } = useSupabase();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      url: config?.url || '',
      key: config?.key || '',
      tableName: config?.tableName || 'n8n_to_supabase',
    },
  });

  const onSubmit = async (data: ConfigFormData) => {
    setIsSubmitting(true);
    try {
      saveConfig(data);
      toast({
        title: 'Configuration saved',
        description: 'Supabase configuration has been updated successfully.',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save configuration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-configuration">
        <DialogHeader>
          <DialogTitle>Supabase Configuration</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supabase URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://your-project.supabase.co"
                      {...field}
                      data-testid="input-supabase-url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anon Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your anon key"
                      {...field}
                      data-testid="input-anon-key"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="n8n_to_supabase"
                      {...field}
                      data-testid="input-table-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                data-testid="button-cancel-config"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
                data-testid="button-save-config"
              >
                {isSubmitting ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { N8nRecord } from '@shared/schema';

interface RecoveryCardProps {
  record: N8nRecord;
  onRestore: () => Promise<void>;
  onDeletePermanently: () => Promise<void>;
}

export function RecoveryCard({ record, onRestore, onDeletePermanently }: RecoveryCardProps) {
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await onRestore();
      toast({
        title: 'Record restored',
        description: 'The record has been restored and returned to the SendGuard queue.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to restore record. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDeletePermanently = async () => {
    setIsDeleting(true);
    try {
      await onDeletePermanently();
      toast({
        title: 'Record deleted',
        description: 'The record has been permanently deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete record. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = () => {
    if (record.permission === 'Cancel') {
      return <Badge variant="secondary" data-testid="badge-status">Canceled</Badge>;
    }
    if (record.removed) {
      return <Badge variant="outline" data-testid="badge-status">Removed</Badge>;
    }
    return null;
  };

  return (
    <Card data-testid={`card-recovery-${record.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground" data-testid="text-email-subject">
                {record.email_subject || 'No Subject'}
              </h3>
              {getStatusBadge()}
            </div>
            
            {record.created_at && (
              <p className="text-sm text-muted-foreground" data-testid="text-created-date">
                Created: {new Date(record.created_at).toLocaleDateString()}
              </p>
            )}
            
            {record.customer_name && (
              <p className="text-sm text-muted-foreground" data-testid="text-customer-name">
                Customer: {record.customer_name}
              </p>
            )}
          </div>
        </div>

        {/* Key Details */}
        <div className="space-y-3 mb-6">
          {record.Customer_Email && (
            <div>
              <h4 className="font-medium text-foreground text-sm mb-1">Customer Email</h4>
              <div className="bg-muted rounded-lg p-3" data-testid="text-customer-email">
                <p className="text-sm text-foreground line-clamp-3">
                  {record.Customer_Email}
                </p>
              </div>
            </div>
          )}

          {record.Previous_Emails_Summary && (
            <div>
              <h4 className="font-medium text-foreground text-sm mb-1">Previous Emails Summary</h4>
              <div className="bg-muted rounded-lg p-3" data-testid="text-previous-emails">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {record.Previous_Emails_Summary}
                </p>
              </div>
            </div>
          )}

          {record.feedback && (
            <div>
              <h4 className="font-medium text-foreground text-sm mb-1">Last Feedback</h4>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3" data-testid="text-feedback">
                <p className="text-sm text-foreground">
                  {record.feedback}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting || isRestoring}
                data-testid="button-delete-permanently"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Permanently
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Permanently</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the record
                  and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeletePermanently}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            onClick={handleRestore}
            disabled={isRestoring || isDeleting}
            data-testid="button-restore"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {isRestoring ? 'Restoring...' : 'Restore'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { Participant } from '../hooks/useParticipants';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ParticipantDetailsModalProps {
  participant: Participant;
}

export function ParticipantDetailsModal({ participant }: ParticipantDetailsModalProps) {
  const customFields = Object.entries(participant.additional_info || {}).filter(
    ([key]) => key !== 'payment_screenshot_url' && key !== 'transaction_id'
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-10">
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Participant Details
            <Badge variant="outline">{participant.registration_status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Base Info */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{participant.user_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{participant.user_email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{participant.user_phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">College</p>
                <p className="font-medium">{participant.user_college || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year/Sem</p>
                <p className="font-medium">{participant.user_year || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CSI Member</p>
                <p className="font-medium">{participant.is_csi_member ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Payment Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-medium">{participant.transaction_id || '-'}</p>
              </div>
              
              {participant.payment_screenshot_url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Screenshot</p>
                  <a 
                    href={participant.payment_screenshot_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={participant.payment_screenshot_url} 
                      alt="Payment Screenshot" 
                      className="max-h-64 rounded-md border object-contain bg-muted"
                    />
                    <div className="flex items-center text-xs text-blue-500 mt-2">
                      <ExternalLink className="h-3 w-3 mr-1" /> Open full image
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Custom Form Fields (additional_info) */}
          {customFields.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Additional Form Data</h3>
                <div className="grid grid-cols-2 gap-4">
                  {customFields.map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</p>
                      <p className="font-medium">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}

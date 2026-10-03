import type { CsiMembership } from '@/lib/types/memberships';
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

interface MembershipDetailsModalProps {
  membership: CsiMembership;
}

export function MembershipDetailsModal({ membership }: MembershipDetailsModalProps) {
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
            Membership Details
            <Badge variant="outline" className="capitalize">{membership.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Base Info */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{membership.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{membership.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{membership.contact || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Roll No</p>
                <p className="font-medium">{membership.roll_no || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Branch</p>
                <p className="font-medium">{membership.branch || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-medium">{membership.year || '-'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Payment Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Payment Mode</p>
                <p className="font-medium capitalize">{membership.payment_mode}</p>
              </div>
              
              {membership.payment_mode === 'online' && membership.payment_screenshot_url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Screenshot</p>
                  <a 
                    href={membership.payment_screenshot_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={membership.payment_screenshot_url} 
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

          <Separator />

          {/* Additional Details */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Additional Details</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">About</p>
                <p className="font-medium whitespace-pre-wrap">{membership.about_yourself || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Queries</p>
                <p className="font-medium whitespace-pre-wrap">{membership.queries || '-'}</p>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

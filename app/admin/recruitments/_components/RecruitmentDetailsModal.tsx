import type { Recruitment } from '@/lib/types/recruitments';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, ExternalLink, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { iconColors, translucentBgColors, borderColors } from '@/config/colors';

interface RecruitmentDetailsModalProps {
  recruitment: Recruitment;
}

export function RecruitmentDetailsModal({ recruitment }: RecruitmentDetailsModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selected': return `${translucentBgColors.green} ${iconColors.green} ${borderColors.green}`;
      case 'rejected': return `${translucentBgColors.red} ${iconColors.red} ${borderColors.red}`;
      case 'shortlisted': return `${translucentBgColors.blue} ${iconColors.blue} ${borderColors.blue}`;
      case 'interviewed': return `${translucentBgColors.purple} ${iconColors.purple} ${borderColors.purple}`;
      default: return `${translucentBgColors.yellow} ${iconColors.yellow} ${borderColors.yellow}`;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Eye className="h-4 w-4 mr-1.5" />
          <span>View Details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Application Details
            <Badge variant="outline" className={`capitalize ${getStatusColor(recruitment.status)}`}>
              {recruitment.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Base Info */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{recruitment.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{recruitment.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{recruitment.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Roll No</p>
                <p className="font-medium">{recruitment.roll_no}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Branch</p>
                <p className="font-medium">{recruitment.branch}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-medium">{recruitment.year}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Application Info */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Application Information</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Team</p>
                <p className="font-medium">{recruitment.team}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Primary Portfolio</p>
                <p className="font-medium">{recruitment.portfolio_1}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Secondary Portfolio</p>
                <p className="font-medium">{recruitment.portfolio_2 || '-'}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Resume</p>
              {recruitment.resume_url ? (
                <Button variant="secondary" asChild>
                  <a href={recruitment.resume_url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                    <FileText className={`w-4 h-4 ${iconColors.blue}`} /> 
                    View Resume
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              ) : (
                <p className="text-sm italic text-muted-foreground">No resume provided</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Additional Info */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Additional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Is CSI Member?</p>
                <div className="flex items-center gap-2 mt-1">
                  {recruitment.is_csi_member ? (
                    <Badge variant="outline" className={`${translucentBgColors.green} ${iconColors.green} ${borderColors.green}`}>Yes</Badge>
                  ) : (
                    <Badge variant="secondary">No</Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Other Clubs</p>
                <p className="font-medium">{recruitment.other_clubs || '-'}</p>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

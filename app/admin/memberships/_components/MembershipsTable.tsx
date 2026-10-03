'use client';

import { MembershipDetailsModal } from './MembershipDetailsModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, Clock, XCircle, Banknote, ExternalLink } from 'lucide-react';
import { iconColors, translucentBgColors, borderColors } from '@/config/colors';
import type { CsiMembership } from '@/lib/types/memberships';

export const MEMBERSHIP_STATUS_CONFIG = {
  pending: { icon: Clock, color: iconColors.yellow, label: 'Pending' },
  verified: { icon: CheckCircle2, color: iconColors.green, label: 'Verified' },
  rejected: { icon: XCircle, color: iconColors.red, label: 'Rejected' },
};

interface MembershipsTableProps {
  memberships: CsiMembership[];
  onStatusChange: (membershipId: string, newStatus: CsiMembership['status']) => void;
  isUpdatingStatus: boolean;
}

export function MembershipsTable({ memberships, onStatusChange, isUpdatingStatus }: MembershipsTableProps) {
  return (
    <div className="rounded-md border bg-card/50 p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Roll No</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead className="text-center">Year</TableHead>
            <TableHead className="text-center">Details</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberships.map((membership) => {
            const CurrentIcon = MEMBERSHIP_STATUS_CONFIG[membership.status].icon;
            
            return (
              <TableRow key={membership.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col gap-1">
                    <span>{membership.name}</span>
                    {membership.payment_mode === 'cash' && (
                      <Badge variant="outline" className={`w-fit text-[10px] ${borderColors.yellow} ${translucentBgColors.yellow} ${iconColors.yellow} flex items-center gap-1 px-1.5 py-0 h-4`} title="Paying in Cash">
                        <Banknote className="w-3 h-3" /> Cash
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{membership.email}</TableCell>
                <TableCell>{membership.contact || '-'}</TableCell>
                <TableCell>{membership.roll_no || '-'}</TableCell>
                <TableCell>{membership.branch || '-'}</TableCell>
                <TableCell className="text-center">{membership.year || '-'}</TableCell>
                
                <TableCell className="text-center">
                  <MembershipDetailsModal membership={membership} />
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end items-center">
                    <Select
                      defaultValue={membership.status}
                      onValueChange={(val) => onStatusChange(membership.id, val as CsiMembership['status'])}
                      disabled={isUpdatingStatus}
                    >
                     <SelectTrigger className="h-10!">
                        <div className="flex items-center gap-2">
                          <CurrentIcon className={`w-4 h-4 ${MEMBERSHIP_STATUS_CONFIG[membership.status].color}`} />
                          <span className="text-xs font-semibold">
                            {MEMBERSHIP_STATUS_CONFIG[membership.status].label}
                          </span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(MEMBERSHIP_STATUS_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <config.icon className={`w-4 h-4 ${config.color}`} />
                              <span className="text-sm">{config.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

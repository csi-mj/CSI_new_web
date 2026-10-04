import { Member } from "../_hooks/useAdminTeam";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Archive, RefreshCw } from "lucide-react";

interface TeamTableProps {
  members: Member[];
  onEdit: (m: Member) => void;
  onDelete: (m: Member) => void;
  onToggleActive: (m: Member) => void;
  disabled?: boolean;
}

export function TeamTable({ members, onEdit, onDelete, onToggleActive, disabled }: TeamTableProps) {
  return (
    <div className="rounded-md border bg-card/50 p-4 mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Portfolio</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No members found.
              </TableCell>
            </TableRow>
          ) : (
            members.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  {m.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.image_url} alt={m.name} className="h-10 w-10 rounded-full object-cover border" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  <div>{m.name}</div>
                  <div className="flex gap-2 mt-1">
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline">
                        LinkedIn
                      </a>
                    )}
                    {m.github && (
                      <a href={m.github} target="_blank" rel="noreferrer" className="text-[10px] text-muted-foreground hover:underline">
                        GitHub
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>{m.role === 'gb' ? m.gb_position || m.position : m.position}</TableCell>
                <TableCell>{m.portfolio || '—'}</TableCell>
                <TableCell>{m.team_year || '—'}</TableCell>
                <TableCell>
                  <Badge variant={m.is_active ? 'default' : 'secondary'}>
                    {m.is_active ? 'Active' : 'Archived'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onToggleActive(m)} disabled={disabled}>
                      {m.is_active ? <Archive className="w-4 h-4 mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
                      {m.is_active ? 'Archive' : 'Restore'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onEdit(m)} disabled={disabled}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(m)} disabled={disabled}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

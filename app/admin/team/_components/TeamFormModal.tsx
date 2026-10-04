import { Member } from "../_hooks/useAdminTeam";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "../../_components/ui"; 
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface TeamFormModalProps {
  editing: Partial<Member> | null;
  onClose: () => void;
  onSave: (m: Partial<Member>) => void;
  error?: string;
  isSaving?: boolean;
}

export function TeamFormModal({ editing, onClose, onSave, error, isSaving }: TeamFormModalProps) {
  const [formData, setFormData] = useState<Partial<Member> | null>(null);

  useEffect(() => {
    setFormData(editing);
  }, [editing]);

  if (!editing || !formData) return null;

  const update = (updates: Partial<Member>) => setFormData((prev) => ({ ...prev, ...updates }));

  return (
    <Dialog open={!!editing} onOpenChange={(open) => !open && onClose()} modal={false}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          // Don't close modal if clicking inside the select dropdown
          if ((e.target as Element)?.closest('[data-slot="select-content"]')) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{formData.id ? 'Edit Member' : 'Add Member'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="grid gap-2 sm:col-span-3">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={formData.name || ''} onChange={(e) => update({ name: e.target.value })} />
            </div>
            <div className="grid gap-2 sm:col-span-1">
              <Label htmlFor="sno">S.No (for sorting)</Label>
              <Input id="sno" type="number" placeholder="1" value={formData.sno || ''} onChange={(e) => update({ sno: e.target.value ? parseInt(e.target.value, 10) : null })} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Group</Label>
              <Select value={formData.role || 'gb'} onValueChange={(val: any) => update({ role: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} className="z-[9999]">
                  <SelectItem value="gb">Governing Body</SelectItem>
                  <SelectItem value="core">Core Team</SelectItem>
                  <SelectItem value="execom">Executive Committee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team_year">Team Year</Label>
              <Input id="team_year" placeholder="2025-26" value={formData.team_year || ''} onChange={(e) => update({ team_year: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Input id="position" placeholder="e.g. Tech Captain" value={formData.position || ''} onChange={(e) => update({ position: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="portfolio">Portfolio (for grouping)</Label>
              <Input id="portfolio" placeholder="e.g. TECH, MEDIA" value={formData.portfolio || ''} onChange={(e) => update({ portfolio: e.target.value })} />
            </div>
          </div>

          {formData.role === 'gb' && (
            <div className="grid gap-2">
              <Label htmlFor="gb_position">Governing Body Position</Label>
              <Input id="gb_position" placeholder="e.g. Chief Coordinator" value={formData.gb_position || ''} onChange={(e) => update({ gb_position: e.target.value })} />
            </div>
          )}

          <div className="grid gap-2">
            <Label>Photo</Label>
            <FileUpload
              folder="team"
              accept="image/*"
              label="Photo"
              currentUrl={formData.image_url || undefined}
              onUploaded={(url) => update({ image_url: url })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input id="linkedin" type="url" value={formData.linkedin || ''} onChange={(e) => update({ linkedin: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="github">GitHub URL</Label>
              <Input id="github" type="url" value={formData.github || ''} onChange={(e) => update({ github: e.target.value })} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="mail">Email</Label>
            <Input id="mail" type="email" value={formData.mail || ''} onChange={(e) => update({ mail: e.target.value })} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={() => onSave(formData)} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

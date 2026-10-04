'use client';

import { useState, useMemo } from 'react';
import { useConfirm } from '../_components/ui';
import { DataBoundary } from '@/components/ui/data-boundary';
import { useAdminTeam, Member } from './_hooks/useAdminTeam';
import { TeamTable } from './_components/TeamTable';
import { TeamFormModal } from './_components/TeamFormModal';
import { TeamHeader } from './_components/TeamHeader';
import { Tabs } from "@/components/ui/tabs";
import { toast } from 'sonner';

const empty: Partial<Member> = { role: 'gb', is_active: true };
const roleLabels = { gb: 'Governing Body', execom: 'Executive Committee', core: 'Core Team' } as const;

export default function TeamAdmin() {
  const [role, setRole] = useState<'gb' | 'core' | 'execom'>('gb');
  const [activeYear, setActiveYear] = useState<string>('');
  const [editing, setEditing] = useState<Partial<Member> | null>(null);
  const [error, setError] = useState('');
  const { confirmDlg, dialog } = useConfirm();

  const { members, isLoading, isError, saveMember, isSaving, deleteMember, isDeleting, toggleActive } = useAdminTeam();

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(members.map((m) => m.team_year).filter(Boolean) as string[]));
    return years.sort((a, b) => b.localeCompare(a));
  }, [members]);

  // Set default active year if not set
  if (availableYears.length > 0 && !activeYear) {
    setActiveYear(availableYears[0]);
  }

  const visible = members.filter(
    (m) => m.role === role && (activeYear === 'all' || m.team_year === activeYear)
  );

  const save = async (memberToSave: Partial<Member>) => {
    if (!memberToSave.name) return setError('Name is required');
    
    toast.promise(saveMember({ ...memberToSave, role: memberToSave.role || role }), {
      loading: memberToSave.id ? 'Updating member...' : 'Adding member...',
      success: () => {
        setEditing(null);
        setError('');
        return memberToSave.id ? 'Member updated successfully' : 'Member added successfully';
      },
      error: (e) => {
        setError(e.message);
        return e.message;
      }
    });
  };

  const remove = async (m: Member) => {
    if (!(await confirmDlg(`Delete ${m.name}? This cannot be undone.`))) return;
    toast.promise(deleteMember(m.id), {
      loading: 'Deleting member...',
      success: 'Member deleted successfully',
      error: (e) => e.message,
    });
  };

  const handleToggleActive = async (m: Member) => {
    toast.promise(toggleActive(m), {
      loading: m.is_active ? 'Archiving member...' : 'Restoring member...',
      success: m.is_active ? 'Member archived' : 'Member restored',
      error: (e) => e.message,
    });
  };

  return (
    <div className="flex h-full flex-col">
      <Tabs value={role} onValueChange={(v: string) => setRole(v as any)} className="flex flex-1 flex-col min-h-0">
        <TeamHeader 
          activeYear={activeYear}
          setActiveYear={setActiveYear}
          availableYears={availableYears}
          roleLabels={roleLabels}
          onAddMember={() => setEditing({ ...empty, role, team_year: activeYear !== 'all' ? activeYear : availableYears[0] })}
        />

        <div className="flex-1 min-h-0 overflow-auto">
          <DataBoundary
            isLoading={isLoading}
            isError={isError}
            isEmpty={visible.length === 0}
            emptyTitle={`No members found for ${roleLabels[role]}`}
            emptyDescription="Add a new member to see them here."
          >
            <TeamTable 
              members={visible}
              onEdit={setEditing}
              onDelete={remove}
              onToggleActive={handleToggleActive}
              disabled={isSaving || isDeleting}
            />
          </DataBoundary>
        </div>
      </Tabs>

      <TeamFormModal 
        editing={editing} 
        onClose={() => { setEditing(null); setError(''); }} 
        onSave={save} 
        error={error}
        isSaving={isSaving}
      />
      {dialog}
    </div>
  );
}

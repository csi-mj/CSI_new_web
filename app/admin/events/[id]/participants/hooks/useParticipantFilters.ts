import { useState, useMemo } from 'react';
import { Participant } from './useParticipants';

export interface ParticipantFilterState {
  searchQuery: string;
  statusFilter: string;
  statFilter: 'attended' | 'confirmed' | 'csi' | 'cash' | null;
  collegeFilter: string | null;
  branchFilter: string | null;
  yearFilter: string | null;
}

export function useParticipantFilters(participants: Participant[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [statFilter, setStatFilter] = useState<'attended' | 'confirmed' | 'csi' | 'cash' | null>(null);
  const [collegeFilter, setCollegeFilter] = useState<string | null>(null);
  const [branchFilter, setBranchFilter] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState<string | null>(null);

  const toggleStatFilter = (key: 'attended' | 'confirmed' | 'csi' | 'cash') => {
    setStatFilter((prev) => (prev === key ? null : key));
  };

  const toggleCollegeFilter = (college: string) => {
    setCollegeFilter((prev) => (prev === college ? null : college));
  };

  const toggleBranchFilter = (branch: string) => {
    setBranchFilter((prev) => (prev === branch ? null : branch));
  };

  const toggleYearFilter = (year: string) => {
    setYearFilter((prev) => (prev === year ? null : year));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setStatFilter(null);
    setCollegeFilter(null);
    setBranchFilter(null);
    setYearFilter(null);
  };

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      // 1. Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.user_name?.toLowerCase().includes(q);
        const matchesEmail = p.user_email?.toLowerCase().includes(q);
        const matchesPhone = p.user_phone?.includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone) return false;
      }

      // 2. Status Dropdown filter
      if (statusFilter !== 'all' && p.registration_status !== statusFilter) {
        return false;
      }

      // 3. Stat Card Filter (Attended, Confirmed, CSI Member, Cash)
      if (statFilter === 'attended' && !p.is_attended) return false;
      if (statFilter === 'confirmed' && p.registration_status !== 'confirmed') return false;
      if (statFilter === 'csi' && !p.is_csi_member) return false;
      if (statFilter === 'cash' && p.payment_mode !== 'cash') return false;

      // 4. College Filter
      if (collegeFilter && p.user_college !== collegeFilter) return false;

      // 5. Branch Filter (found inside additional_info)
      if (branchFilter) {
        let pBranch: string | null = null;
        if (p.additional_info && typeof p.additional_info === 'object') {
          const branchKey = Object.keys(p.additional_info).find((key) =>
            key.toLowerCase().includes('branch')
          );
          if (branchKey) {
            pBranch = p.additional_info[branchKey];
          }
        }
        if (pBranch !== branchFilter) return false;
      }

      // 6. Year Filter
      if (yearFilter && p.user_year !== yearFilter) return false;

      return true;
    });
  }, [
    participants,
    searchQuery,
    statusFilter,
    statFilter,
    collegeFilter,
    branchFilter,
    yearFilter
  ]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (statusFilter !== 'all') count++;
    if (statFilter !== null) count++;
    if (collegeFilter !== null) count++;
    if (branchFilter !== null) count++;
    if (yearFilter !== null) count++;
    return count;
  }, [
    searchQuery,
    statusFilter,
    statFilter,
    collegeFilter,
    branchFilter,
    yearFilter
  ]);

  return {
    // States
    searchQuery,
    statusFilter,
    statFilter,
    collegeFilter,
    branchFilter,
    yearFilter,
    // Filtered Output
    filteredParticipants,
    activeFilterCount,
    hasActiveFilters: activeFilterCount > 0,
    // Setters & Actions
    setSearchQuery,
    setStatusFilter,
    toggleStatFilter,
    toggleCollegeFilter,
    toggleBranchFilter,
    toggleYearFilter,
    resetFilters
  };
}

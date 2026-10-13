import { useState, useMemo } from 'react';
import type { Recruitment } from '@/lib/types/recruitments';

export type RecruitmentStatFilter = 'core' | 'execom' | 'shortlisted' | 'selected' | null;

export interface RecruitmentFilterState {
  searchQuery: string;
  statusFilter: string;
  teamFilter: string;
  statFilter: RecruitmentStatFilter;
  branchFilter: string | null;
  yearFilter: string | null;
  domainFilter: string | null;
}

export function useRecruitmentFilters(recruitments: Recruitment[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [statFilter, setStatFilter] = useState<RecruitmentStatFilter>(null);
  const [branchFilter, setBranchFilter] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<string | null>(null);

  const toggleStatFilter = (key: 'core' | 'execom' | 'shortlisted' | 'selected') => {
    setStatFilter((prev) => (prev === key ? null : key));
  };

  const toggleBranchFilter = (branch: string) => {
    setBranchFilter((prev) => (prev === branch ? null : branch));
  };

  const toggleYearFilter = (year: string) => {
    setYearFilter((prev) => (prev === year ? null : year));
  };

  const toggleDomainFilter = (domain: string) => {
    setDomainFilter((prev) => (prev === domain ? null : domain));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTeamFilter('all');
    setStatFilter(null);
    setBranchFilter(null);
    setYearFilter(null);
    setDomainFilter(null);
  };

  const filteredRecruitments = useMemo(() => {
    return recruitments.filter((r) => {
      // 1. Search Query filter (name, email, phone, roll_no, domains)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.name?.toLowerCase().includes(q);
        const matchesEmail = r.email?.toLowerCase().includes(q);
        const matchesPhone = r.phone?.toLowerCase().includes(q);
        const matchesRoll = r.roll_no?.toLowerCase().includes(q);
        const matchesDomain1 = r.portfolio_1?.toLowerCase().includes(q);
        const matchesDomain2 = r.portfolio_2?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesRoll && !matchesDomain1 && !matchesDomain2) {
          return false;
        }
      }

      // 2. Status Dropdown filter
      if (statusFilter !== 'all' && r.status?.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      // 3. Team Dropdown filter (Core / Execom)
      if (teamFilter !== 'all' && r.team?.toLowerCase() !== teamFilter.toLowerCase()) {
        return false;
      }

      // 4. Interactive Stat Card Filter (Core, Execom, Shortlisted, Selected)
      if (statFilter === 'core' && r.team?.toLowerCase() !== 'core') return false;
      if (statFilter === 'execom' && r.team?.toLowerCase() !== 'execom') return false;
      if (statFilter === 'shortlisted' && r.status?.toLowerCase() !== 'shortlisted') return false;
      if (statFilter === 'selected' && r.status?.toLowerCase() !== 'selected') return false;

      // 5. Branch Filter
      if (branchFilter && r.branch?.toLowerCase() !== branchFilter.toLowerCase()) return false;

      // 6. Year Filter
      if (yearFilter && r.year?.toLowerCase() !== yearFilter.toLowerCase()) return false;

      // 7. Domain / Portfolio Filter
      if (domainFilter && r.portfolio_1?.toLowerCase() !== domainFilter.toLowerCase() && r.portfolio_2?.toLowerCase() !== domainFilter.toLowerCase()) return false;

      return true;
    });
  }, [
    recruitments,
    searchQuery,
    statusFilter,
    teamFilter,
    statFilter,
    branchFilter,
    yearFilter,
    domainFilter
  ]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (statusFilter !== 'all') count++;
    if (teamFilter !== 'all') count++;
    if (statFilter !== null) count++;
    if (branchFilter !== null) count++;
    if (yearFilter !== null) count++;
    if (domainFilter !== null) count++;
    return count;
  }, [
    searchQuery,
    statusFilter,
    teamFilter,
    statFilter,
    branchFilter,
    yearFilter,
    domainFilter
  ]);

  return {
    // States
    searchQuery,
    statusFilter,
    teamFilter,
    statFilter,
    branchFilter,
    yearFilter,
    domainFilter,
    // Filtered Output
    filteredRecruitments,
    activeFilterCount,
    hasActiveFilters: activeFilterCount > 0,
    // Setters & Actions
    setSearchQuery,
    setStatusFilter,
    setTeamFilter,
    toggleStatFilter,
    toggleBranchFilter,
    toggleYearFilter,
    toggleDomainFilter,
    resetFilters
  };
}

import { useQuery } from "@tanstack/react-query";

export type DbMember = {
  id: string;
  sno: number | null;
  name: string;
  position: string | null;
  role: 'gb' | 'core' | 'execom';
  image_url: string | null;
  linkedin: string | null;
  github: string | null;
  mail: string | null;
  portfolio: string | null;
  gb_position: string | null;
};

const fetchTeamByRole = async (role: 'gb' | 'core' | 'execom', year: string): Promise<DbMember[]> => {
  const res = await fetch(`/api/team/${role}?year=${year}`);
  if (!res.ok) throw new Error(`Failed to fetch ${role} members`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const useTeam = (year: string) => {
  const gbQuery = useQuery({
    queryKey: ['team', 'gb', year],
    queryFn: () => fetchTeamByRole('gb', year),
    enabled: !!year,
  });

  const coreQuery = useQuery({
    queryKey: ['team', 'core', year],
    queryFn: () => fetchTeamByRole('core', year),
    enabled: !!year,
  });

  const execQuery = useQuery({
    queryKey: ['team', 'execom', year],
    queryFn: () => fetchTeamByRole('execom', year),
    enabled: !!year,
  });

  const isLoading = gbQuery.isLoading || coreQuery.isLoading || execQuery.isLoading;
  const isError = gbQuery.isError || coreQuery.isError || execQuery.isError;

  return {
    gb: gbQuery.data || [],
    core: coreQuery.data || [],
    exec: execQuery.data || [],
    isLoading,
    isError,
  };
};

export const useTeamYears = () => {
  return useQuery({
    queryKey: ['team', 'years'],
    queryFn: async () => {
      const res = await fetch('/api/team/years');
      if (!res.ok) throw new Error('Failed to fetch team years');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });
};

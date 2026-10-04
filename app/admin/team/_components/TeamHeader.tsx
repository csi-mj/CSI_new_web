import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from 'lucide-react';

interface TeamHeaderProps {
  activeYear: string;
  setActiveYear: (year: string) => void;
  availableYears: string[];
  roleLabels: Record<string, string>;
  onAddMember: () => void;
}

export function TeamHeader({
  activeYear,
  setActiveYear,
  availableYears,
  roleLabels,
  onAddMember,
}: TeamHeaderProps) {
  return (
    <div className="sticky -top-6 z-20 -mx-4 mt-6 flex flex-col gap-4 border-b border-border bg-background p-4 md:-mx-8 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Team Management
        </h1>
       
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <TabsList className="w-full sm:w-auto overflow-x-auto justify-start">
          {(Object.keys(roleLabels) as Array<keyof typeof roleLabels>).map((r) => (
            <TabsTrigger key={r} value={r} className="flex-1 sm:flex-none">
              {roleLabels[r]}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Select value={activeYear} onValueChange={(val) => { if (val) setActiveYear(val) }}>
            <SelectTrigger className="w-[140px] flex-1 sm:flex-none">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              <SelectItem value="all">All Years</SelectItem>
            </SelectContent>
          </Select>
          <Button size="lg" onClick={onAddMember} className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>
       
    </div>
  );
}

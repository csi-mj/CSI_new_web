import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { iconColors, borderColors, translucentBgColors } from '@/config/colors';
import { LucideIcon } from 'lucide-react';

interface PremiumSelectProps {
  icon?: LucideIcon;
  colorTheme?: keyof typeof iconColors;
  value?: string;
  onValueChange?: (value: string) => void;
  options?: string[];
  placeholder?: string;
  className?: string;
}

export const PremiumSelect = React.forwardRef<HTMLButtonElement, PremiumSelectProps>(
  ({ className, icon: Icon, colorTheme = 'indigo', value, onValueChange, options = [], placeholder }, ref) => {
    return (
      <div className="relative group w-full">
        <div className="relative flex items-center w-full">
          {Icon && (
            <div className="absolute left-4 z-10 flex items-center justify-center pointer-events-none">
              <div className={cn("p-1.5 rounded-md transition-colors duration-300 group-focus-within:bg-background/80", translucentBgColors[colorTheme])}>
                <Icon className={cn("w-4 h-4", iconColors[colorTheme])} />
              </div>
            </div>
          )}
          
          <Select onValueChange={(val) => onValueChange && onValueChange(val as string)} value={value}>
            <SelectTrigger
              ref={ref}
              className={cn(
                "h-14 w-full rounded-xl border-2 px-4 py-2 text-base font-medium transition-all duration-300",
                "bg-card/40 border-border/50 hover:bg-card/50",
                // Space for icon if exists
                Icon ? "pl-14" : "pl-4",
                // Focus state uses dynamic colors
                "focus:outline-none focus:ring-0",
                `group-focus-within:${borderColors[colorTheme]} group-focus-within:border-2`,
                className
              )}
            >
              {/* Added opacity logic to placeholder text to match standard inputs */}
              <div className={!value ? "text-muted-foreground/50" : ""}>
                <SelectValue placeholder={placeholder || 'Select an option'} />
              </div>
            </SelectTrigger>
            
            <SelectContent 
              alignItemWithTrigger={false}
              className="rounded-xl border-2 border-border/50  overflow-y-auto max-h-[300px] p-1"
            >
              {options.map((option) => (
                <SelectItem 
                  key={option} 
                  value={option}
                  className={cn(
                    "rounded-lg cursor-pointer py-2.5 px-3 my-0.5 font-medium transition-colors",
                    // Use the specific field color theme for hover/focus state in the dropdown!
                    `focus:${translucentBgColors[colorTheme]} focus:${iconColors[colorTheme]}`
                  )}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }
);
PremiumSelect.displayName = 'PremiumSelect';

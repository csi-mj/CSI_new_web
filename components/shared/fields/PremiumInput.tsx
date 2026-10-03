import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { iconColors, borderColors, translucentBgColors } from '@/config/colors';
import { LucideIcon } from 'lucide-react';

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  colorTheme?: keyof typeof iconColors;
}

export const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ className, icon: Icon, colorTheme = 'blue', ...props }, ref) => {
    return (
      <div className="relative group w-full">
        <div className="relative flex items-center w-full">
          {Icon && (
            <div className="absolute left-4 z-10 flex items-center justify-center">
              <div className={cn("p-1.5 rounded-md transition-colors duration-300 group-focus-within:bg-background/80")}>
                <Icon className={cn("w-4 h-4", iconColors[colorTheme])} />
              </div>
            </div>
          )}
          
          <Input
            ref={ref}
            className={cn(
              "h-14 w-full rounded-xl border-2 px-4 py-2 text-base font-medium transition-all duration-300",
              "bg-card/40 border-border/50 hover:bg-card/50",
              // Space for icon if exists
              Icon ? "pl-14" : "pl-4",
              // Focus state uses dynamic colors
              "focus-visible:outline-none focus-visible:ring-0",
              `group-focus-within:${borderColors[colorTheme]} group-focus-within:border-2`,
              "placeholder:text-muted-foreground/50",
              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);
PremiumInput.displayName = 'PremiumInput';

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { iconColors, borderColors, translucentBgColors } from '@/config/colors';
import { LucideIcon } from 'lucide-react';

interface PremiumTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?: LucideIcon;
  colorTheme?: keyof typeof iconColors;
}

export const PremiumTextarea = React.forwardRef<HTMLTextAreaElement, PremiumTextareaProps>(
  ({ className, icon: Icon, colorTheme = 'blue', ...props }, ref) => {
    return (
      <div className="relative group w-full">
        <div className="relative flex w-full">
          {Icon && (
            <div className="absolute left-4 top-3 z-10 flex items-center justify-center">
              <div className={cn("p-1.5 rounded-md transition-colors duration-300 group-focus-within:bg-background/80", translucentBgColors[colorTheme])}>
                <Icon className={cn("w-4 h-4", iconColors[colorTheme])} />
              </div>
            </div>
          )}
          
          <Textarea
            ref={ref}
            className={cn(
              "min-h-[120px] w-full rounded-xl border-2 px-4 py-3 text-base font-medium transition-all duration-300 resize-y",
              "bg-card/40 border-border/50 hover:bg-card/50",
              // Space for icon if exists
              Icon ? "pl-14 pt-4" : "",
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
PremiumTextarea.displayName = 'PremiumTextarea';

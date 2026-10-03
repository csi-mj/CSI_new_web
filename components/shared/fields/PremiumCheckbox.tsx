import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { iconColors, borderColors, translucentBgColors } from '@/config/colors';

interface PremiumCheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label: string;
  colorTheme?: keyof typeof iconColors;
}

export const PremiumCheckbox = React.forwardRef<React.ElementRef<typeof Checkbox>, PremiumCheckboxProps>(
  ({ checked, onCheckedChange, label, colorTheme = 'indigo', ...props }, ref) => {
    return (
      <FormItem>
        <FormLabel 
          className={cn(
            "mt-2 inline-flex flex-row items-center space-x-3 py-2.5 px-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
            checked 
              ? borderColors[colorTheme]
              : "border-border/50 bg-card/20 hover:bg-card/40 hover:border-border"
          )}
        >
          <FormControl>
            <Checkbox
              ref={ref}
              checked={checked}
              onCheckedChange={onCheckedChange}
              className={cn(
                "h-4 w-4 rounded-[4px] border-2 transition-all",
                checked ? `border-transparent ${iconColors[colorTheme].replace('text-', 'bg-')} text-primary-foreground` : "border-muted-foreground/50"
              )}
              {...props}
            />
          </FormControl>
          <span className={cn(
            "text-sm font-bold tracking-wide",
            checked ? "text-foreground" : "text-muted-foreground"
          )}>
            {label}
          </span>
        </FormLabel>
      </FormItem>
    );
  }
);
PremiumCheckbox.displayName = 'PremiumCheckbox';

import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { iconColors } from '@/config/colors';

interface PremiumLabelProps extends React.ComponentProps<typeof FormLabel> {
  required?: boolean;
}

export function PremiumLabel({ children, required, className, ...props }: PremiumLabelProps) {
  return (
    <FormLabel 
      className={cn(
        "text-foreground/90 font-semibold text-[15px] tracking-tight flex items-center ml-2",
        className
      )} 
      {...props}
    >
      {children}
      {required && (
        <span className={cn("ml-0.5 text-lg font-bold leading-none",iconColors.red)} >
          *
        </span>
      )}
    </FormLabel>
  );
}

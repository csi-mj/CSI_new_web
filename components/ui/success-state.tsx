import React from 'react';
import { Check } from 'lucide-react';
import { iconColors, translucentBgColors } from '@/config/colors';

export interface SuccessStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function SuccessState({
  title = "Success!",
  description = "The action was completed successfully.",
  action
}: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
      <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full border ${iconColors.green}`}>
        <Check className="h-10 w-10 stroke-[3]" />
      </div>
      <h2 className="text-foreground text-3xl font-black">{title}</h2>
      {description && (
        <p className="text-muted-foreground max-w-md text-lg">{description}</p>
      )}
      {action && <div className="pt-4">{action}</div>}
    </div>
  );
}

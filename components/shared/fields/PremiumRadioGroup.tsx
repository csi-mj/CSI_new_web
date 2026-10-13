import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { iconColors, borderColors, translucentBgColors } from '@/config/colors';

interface PremiumRadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options?: string[] | { label: string; value: string }[];
  colorTheme?: keyof typeof iconColors;
}

export const PremiumRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroup>,
  PremiumRadioGroupProps
>(
  (
    { value, onValueChange, options = [], colorTheme = 'indigo', ...props },
    ref
  ) => {
    return (
      <RadioGroup
        ref={ref}
        onValueChange={onValueChange}
        defaultValue={value}
        className="mt-2 flex flex-wrap gap-3"
        {...props}
      >
        {options.map((optionObj) => {
          const isString = typeof optionObj === 'string';
          const optValue = isString ? optionObj : optionObj.value;
          const optLabel = isString ? optionObj : optionObj.label;
          const isSelected = value === optValue;
          return (
            <FormItem key={optValue}>
              <FormLabel
                className={cn(
                  'flex cursor-pointer flex-row items-center space-x-3 rounded-xl border-2 px-4 py-2.5 transition-all duration-300',
                  isSelected
                    ? borderColors[colorTheme]
                    : 'border-border/50 bg-card/20 hover:bg-card/40 hover:border-border'
                )}
              >
                <FormControl>
                  <RadioGroupItem
                    value={optValue}
                    className={cn(
                      'h-4 w-4 border-2 transition-all',
                      isSelected
                        ? borderColors[colorTheme]
                        : 'border-muted-foreground/50'
                    )}
                  />
                </FormControl>
                <span
                  className={cn(
                    'text-sm font-bold tracking-wide',
                    isSelected ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {optLabel}
                </span>
              </FormLabel>
            </FormItem>
          );
        })}
      </RadioGroup>
    );
  }
);
PremiumRadioGroup.displayName = 'PremiumRadioGroup';

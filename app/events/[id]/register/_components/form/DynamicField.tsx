import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { RegistrationFormField } from '@/lib/types/events';
import { PremiumInput } from '@/components/shared/fields/PremiumInput';
import { PremiumTextarea } from '@/components/shared/fields/PremiumTextarea';
import { PremiumSelect } from '@/components/shared/fields/PremiumSelect';
import { PremiumFileInput } from '@/components/shared/fields/PremiumFileInput';
import { PremiumRadioGroup } from '@/components/shared/fields/PremiumRadioGroup';
import { PremiumCheckbox } from '@/components/shared/fields/PremiumCheckbox';
import { Mail, Phone, User, Link2, Type, Hash, FileUp } from 'lucide-react';
import type { IconColor } from '@/config/colors';

interface DynamicFieldProps {
  form: any;
  field: RegistrationFormField;
}

const getFieldIconAndColor = (type: string, name: string): { icon: any, colorTheme: IconColor } => {
  if (type === 'email') return { icon: Mail, colorTheme: 'blue' };
  if (type === 'tel') return { icon: Phone, colorTheme: 'green' };
  if (type === 'url') return { icon: Link2, colorTheme: 'purple' };
  if (type === 'number') return { icon: Hash, colorTheme: 'orange' };
  if (type === 'file') return { icon: FileUp, colorTheme: 'teal' };
  if (name.includes('name')) return { icon: User, colorTheme: 'rose' };
  return { icon: Type, colorTheme: 'indigo' };
};

import { PremiumLabel } from '@/components/shared/fields/PremiumLabel';

export function DynamicField({ form, field }: DynamicFieldProps) {
  const isFullWidth = field.type === 'textarea' || field.type === 'radio' || field.type === 'checkbox';

  return (
    <FormField
      key={field.name}
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={isFullWidth ? 'md:col-span-2' : 'col-span-1'}>
          {field.type !== 'checkbox' && (
            <PremiumLabel required={field.required}>
              {field.label}
            </PremiumLabel>
          )}

          <FormControl>
            {field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number' || field.type === 'url' ? (
              <PremiumInput
                type={field.type}
                placeholder={field.placeholder}
                {...getFieldIconAndColor(field.type, field.name)}
                {...formField}
                value={field.type === 'number' ? (formField.value ?? '') : String(formField.value || '')}
              />
            ) : field.type === 'file' ? (() => {
              const { value, onChange, ...restField } = formField;
              return (
                <PremiumFileInput
                  {...getFieldIconAndColor(field.type, field.name)}
                  value={value}
                  onChange={onChange}
                  {...restField}
                />
              );
            })() : field.type === 'textarea' ? (
              <PremiumTextarea
                placeholder={field.placeholder}
                colorTheme="indigo"
                {...formField}
                value={String(formField.value || '')}
              />
            ) : field.type === 'select' ? (
              <PremiumSelect
                options={field.options}
                placeholder={field.placeholder}
                {...getFieldIconAndColor(field.type, field.name)}
                value={String(formField.value || '')}
                onValueChange={formField.onChange}
              />
            ) : field.type === 'radio' ? (
              <PremiumRadioGroup
                options={field.options}
                value={String(formField.value || '')}
                onValueChange={formField.onChange}
                colorTheme={getFieldIconAndColor(field.type, field.name).colorTheme}
              />
            ) : field.type === 'checkbox' ? (
              <PremiumCheckbox
                label={field.label}
                checked={Boolean(formField.value)}
                onCheckedChange={formField.onChange}
                colorTheme={getFieldIconAndColor(field.type, field.name).colorTheme}
              />
            ) : (
              <PremiumInput {...getFieldIconAndColor('text', field.name)} {...formField} value={String(formField.value || '')} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

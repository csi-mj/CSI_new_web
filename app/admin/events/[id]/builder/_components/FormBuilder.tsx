'use client';

import { useState, useEffect } from 'react';
import { FormField, FieldType } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';

interface FormBuilderProps {
  initialFields: FormField[];
  onSave: (fields: FormField[]) => void;
  isSaving: boolean;
}

export function FormBuilder({ initialFields, onSave, isSaving }: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialFields);

  useEffect(() => {
    setFields(initialFields);
  }, [initialFields]);

  // Auto-generates a machine-readable key from the label e.g. "Full Name" → "full_name"
  const toSlug = (str: string) =>
    str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

  const addField = () => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      name: '',
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
    };
    setFields([...fields, newField]);

  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));

  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));

  };

  const addOption = (fieldId: string) => {
    setFields(fields.map(f => {
      if (f.id === fieldId) {
        return { ...f, options: [...(f.options || []), `Option ${(f.options?.length || 0) + 1}`] };
      }
      return f;
    }));

  };

  const updateOption = (fieldId: string, index: number, value: string) => {
    setFields(fields.map(f => {
      if (f.id === fieldId && f.options) {
        const newOptions = [...f.options];
        newOptions[index] = value;
        return { ...f, options: newOptions };
      }
      return f;
    }));

  };

  const removeOption = (fieldId: string, index: number) => {
    setFields(fields.map(f => {
      if (f.id === fieldId && f.options) {
        return { ...f, options: f.options.filter((_, i) => i !== index) };
      }
      return f;
    }));

  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newFields.length) return;
    [newFields[index], newFields[swapIndex]] = [newFields[swapIndex], newFields[index]];
    setFields(newFields);
  };

  const handleSave = () => {
    onSave(fields);
  };

  const hasOptions = (type: FieldType) => ['radio', 'checkbox', 'select'].includes(type);

  return (
    <div className="space-y-6">
      {fields.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center text-muted-foreground cursor-target">
          <p className="mb-4">No fields added yet. Start building your form!</p>
          <Button onClick={addField} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add First Field
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="relative transition-all cursor-target">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Controls - Order No & Field Type */}
                  <div className="flex flex-col gap-4 w-full md:w-1/3">
                    <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={index === 0}
                        onClick={() => moveField(index, 'up')}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <span className="text-xs font-bold text-muted-foreground w-5 text-center">
                        {index + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={index === fields.length - 1}
                        onClick={() => moveField(index, 'down')}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                      <Select 
                        value={field.type} 
                        onValueChange={(val) => {
                          const newType = val as FieldType;
                          updateField(field.id, { 
                            type: newType, 
                            options: hasOptions(newType) && !field.options ? ['Option 1'] : field.options 
                          });
                        }}
                        disabled={field.isBaseField}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Field Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Short Text</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="tel">Phone Number</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="url">Website URL</SelectItem>
                          <SelectItem value="textarea">Long Paragraph</SelectItem>
                          <SelectItem value="radio">Single Choice</SelectItem>
                          <SelectItem value="checkbox">Multiple Choice</SelectItem>
                          <SelectItem value="select">Dropdown</SelectItem>
                          <SelectItem value="file">File Upload</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2 pl-7 mt-auto">
                      <Switch 
                        id={`req-${field.id}`} 
                        checked={field.required}
                        onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                        disabled={field.lockedRequired}
                      />
                      <Label htmlFor={`req-${field.id}`} className="text-xs text-muted-foreground font-medium uppercase tracking-wider cursor-pointer">
                        Required
                      </Label>
                    </div>
                  </div>

                  <Separator orientation="vertical" className="hidden md:block h-auto" />

                  {/* Right Controls - Field Label & Options */}
                  <div className="flex flex-col flex-1 gap-4">
                    <div className="flex flex-col gap-1">
                       <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 block ml-2">{field.type} Label</Label>
                      <div className="flex gap-2">
                       
                        <Input 
                          value={field.label} 
                          onChange={(e) => {
                            const label = e.target.value;
                            if (field.isBaseField) {
                              updateField(field.id, { label });
                            } else {
                              updateField(field.id, { label, name: toSlug(label) });
                            }
                          }}
                          placeholder="e.g. What is your T-Shirt size?"
                        />
                        {!field.lockedRequired && (
                          <Button variant="outline" size="icon" title="delete" className="text-destructive hover:text-destructive shrink-0" onClick={() => removeField(field.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {field.name && (
                        <p className="text-xs text-muted-foreground ml-2 mt-0.5">
                          Key: <code className="font-mono">{field.name}</code>
                          {field.isBaseField && <span className="ml-2 text-[10px] uppercase opacity-50 border px-1 rounded">Base Field</span>}
                          {field.lockedRequired && <span className="ml-1 text-[10px] uppercase opacity-50 border px-1 rounded text-red-500 border-red-500/20 bg-red-500/10">Locked</span>}
                        </p>
                      )}
                    </div>

                    {/* Placeholder — hidden for radio/checkbox/select/file */}
                    {!hasOptions(field.type) && field.type !== 'file' && (
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider ml-2">Placeholder</Label>
                        <Input
                          value={field.placeholder ?? ''}
                          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                          placeholder="Hint text shown inside the input"
                        />
                      </div>
                    )}

                    {hasOptions(field.type) && (
                      <div className="pl-4 border-l-2 border-muted space-y-3 mt-2">
                        <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Options</Label>
                        {field.options?.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border border-muted-foreground/30 shrink-0" />
                            <Input 
                              value={opt}
                              onChange={(e) => updateOption(field.id, idx, e.target.value)}
                              className="h-8 text-sm"
                            />
                            <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-destructive shrink-0" onClick={() => removeOption(field.id, idx)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="link" size="sm" className="h-8 px-0 text-muted-foreground" onClick={() => addOption(field.id)}>
                          <Plus className="mr-1 h-3.5 w-3.5" /> Add Option
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <div className="flex items-center justify-between pt-6 border-t">
          <Button onClick={addField} variant="secondary">
            <Plus className="mr-2 h-4 w-4" />
            Add Field
          </Button>
          <Button onClick={handleSave} className="min-w-32" disabled={isSaving}>
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : 'Save Form'}
          </Button>
        </div>
      )}
    </div>
  );
}

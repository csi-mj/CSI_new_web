import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { iconColors, borderColors, translucentBgColors } from '@/config/colors';
import { LucideIcon, UploadCloud, X, File as FileIcon } from 'lucide-react';

interface PremiumFileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  icon?: LucideIcon;
  colorTheme?: keyof typeof iconColors;
  value?: File | string | null;
  onChange?: (file: File | null) => void;
}

export const PremiumFileInput = React.forwardRef<HTMLInputElement, PremiumFileInputProps>(
  ({ className, icon: Icon = UploadCloud, colorTheme = 'teal', value, onChange, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (onChange) onChange(file);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (inputRef.current) inputRef.current.value = '';
      if (onChange) onChange(null);
    };

    // Derived filename for display (handles both File object and existing string URL)
    const fileName = value instanceof File ? value.name : typeof value === 'string' ? value.split('/').pop() : null;
    const fileSize = value instanceof File ? `${(value.size / 1024 / 1024).toFixed(2)} MB` : null;

    return (
      <div 
        className={cn(
          "relative group w-full rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden",
          isDragging ? borderColors[colorTheme] : "border-border/50",
          "bg-card/20 hover:bg-card/40 cursor-pointer",
          className
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0] || null;
          if (onChange) onChange(file);
          if (inputRef.current && file) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            inputRef.current.files = dataTransfer.files;
          }
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref && 'current' in ref) (ref as any).current = node;
          }}
          className="hidden"
          onChange={handleFileChange}
          {...props}
        />
        
        <div className="flex flex-col items-center justify-center p-6 text-center">
          {fileName ? (
            <div className="flex items-center space-x-3 bg-background/80 p-3 rounded-lg border border-border/50 w-full max-w-sm hover:border-destructive/50 transition-colors group/file">
              <div className={cn("p-2 rounded-md", translucentBgColors[colorTheme])}>
                <FileIcon className={cn("w-5 h-5", iconColors[colorTheme])} />
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-sm font-semibold truncate text-foreground">{fileName}</p>
                {fileSize && <p className="text-xs text-muted-foreground">{fileSize}</p>}
              </div>
              <button 
                type="button" 
                onClick={handleClear}
                className="p-2 bg-destructive/10 text-destructive  rounded-md transition-all hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className={cn("p-3 rounded-full mb-3 transition-colors duration-300 group-hover:scale-110", translucentBgColors[colorTheme])}>
                <Icon className={cn("w-6 h-6", iconColors[colorTheme])} />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                Click to upload <span className="text-muted-foreground font-normal">or drag and drop</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Max file size: 5MB
              </p>
            </>
          )}
        </div>
      </div>
    );
  }
);
PremiumFileInput.displayName = 'PremiumFileInput';

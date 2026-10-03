import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingState({
  title = "Loading...",
  description,
  className,
}: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 h-full min-h-[30vh] w-full", className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
      {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
    </div>
  );
}

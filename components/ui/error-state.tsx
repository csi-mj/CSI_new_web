import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: () => void;
  actionLabel?: string;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "There was a problem processing your request.",
  action,
  actionLabel = "Try Again",
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8", className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <Button onClick={action} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

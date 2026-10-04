import React from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { ErrorState } from "./error-state";
import { EmptyState } from "./empty-state";
import { LoadingState } from "./loading-state";

interface DataBoundaryProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  error?: Error | null | unknown;
  onRetry?: () => void;
  loadingFallback?: React.ReactNode;
  loadingTitle?: string;
  loadingDescription?: string;
  errorTitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  children: React.ReactNode;
}

export function DataBoundary({
  isLoading,
  isError,
  isEmpty,
  error,
  onRetry,
  loadingFallback,
  loadingTitle,
  loadingDescription,
  errorTitle = "Unable to load data",
  emptyTitle = "No data found",
  emptyDescription = "There is nothing to display here yet.",
  emptyIcon,
  children,
}: DataBoundaryProps) {
  if (isLoading) {
    if (loadingFallback) {
      return <>{loadingFallback}</>;
    }
    return (
      <div className="p-6 flex-1 h-full flex flex-col justify-center">
        <LoadingState title={loadingTitle} description={loadingDescription} />
      </div>
    );
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : "There was a problem loading this data.";
    return (
      <div className="p-6 flex-1 h-full flex flex-col justify-center">
        <ErrorState
          title={errorTitle}
          description={errorMessage}
          action={onRetry}
          actionLabel="Try Again"
        />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="p-6 flex-1 h-full flex flex-col justify-center">
        <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />
      </div>
    );
  }

  return <>{children}</>;
}

import React from 'react';
import { Check } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { iconColors, borderColors, translucentBgColors } from '@/config/colors';
import { cn } from '@/lib/utils';

export interface SuccessStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  whatsappUrl?: string | null;
  whatsappMessage?: string;
}

export function SuccessState({
  title = "Success!",
  description = "The action was completed successfully.",
  action,
  whatsappUrl,
  whatsappMessage
}: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-5 py-12 text-center">
      <div className={cn("flex h-20 w-20 items-center justify-center rounded-full border", borderColors.green, translucentBgColors.green, iconColors.green)}>
        <Check className="h-10 w-10 stroke-[3]" />
      </div>
      <h2 className="text-foreground text-3xl font-black">{title}</h2>
      {description && (
        <p className="text-muted-foreground max-w-md text-base md:text-lg">{description}</p>
      )}

      {whatsappUrl && (
        <div className={cn("bg-muted/40 border mt-2 w-full max-w-md rounded-2xl p-5 text-center backdrop-blur-sm shadow-sm", borderColors.green)}>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              <FaWhatsapp className={cn("size-5", iconColors.green)} />
              <span className={iconColors.green}>Official WhatsApp Group</span>
            </div>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              {whatsappMessage || "Please join the WhatsApp group to receive important announcements, schedule, and live updates."}
            </p>
            <Button
              id="whatsapp-join-btn"
              asChild
              className="mt-1 font-semibold"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <FaWhatsapp className="size-4" />
                <span>Join WhatsApp Group</span>
              </a>
            </Button>
          </div>
        </div>
      )}

      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

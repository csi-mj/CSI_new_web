import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Event } from '@/lib/types/events';
import { iconColors, translucentBgColors, borderColors } from '@/config/colors';
import { Banknote, Image as ImageIcon } from 'lucide-react';
import { PremiumInput } from '@/components/shared/fields/PremiumInput';
import { PremiumLabel } from '@/components/shared/fields/PremiumLabel';
import { PremiumFileInput } from '@/components/shared/fields/PremiumFileInput';
import { PremiumRadioGroup } from '@/components/shared/fields/PremiumRadioGroup';

interface PaymentDetailsProps {
  event: Event;
  form: any;
  activeFee: number;
}

export function PaymentDetails({ event, form, activeFee }: PaymentDetailsProps) {
  if (!event.is_paid || activeFee <= 0) return null;

  const paymentMode = form.watch('payment_mode');

  return (
    <div className="mt-10 border-t border-border/50 pt-8">
      <h3 className="text-2xl font-bold text-foreground mb-6">Payment Details</h3>
      <div className="mb-8">
        <FormField
          control={form.control}
          name="payment_mode"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <PremiumLabel required>How would you like to pay?</PremiumLabel>
              <FormControl>
                <PremiumRadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  colorTheme="teal"
                  options={[
                    { label: 'Online (UPI / QR Code)', value: 'online' },
                    { label: 'Cash (Hand over to coordinator)', value: 'cash' }
                  ]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {paymentMode === 'cash' ? (
        <div className="bg-muted/30 border border-border/50 p-6 rounded-xl">
          <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary" /> Cash Payment Selected
          </h4>
          <div className="space-y-3">
            <p>To complete your registration, please hand over the registration fee of <strong>₹{activeFee}</strong> in cash to our coordinator.</p>
            <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
              <p className="text-sm font-semibold mb-1">Contact for Cash Payment:</p>
              <p className="text-base font-medium">
                Danish: <a href="tel:+918106110632" className="text-primary hover:underline font-bold">+91 81061 10632</a>
              </p>
            </div>
            <p className="text-sm opacity-80">Your ticket will remain pending until the cash payment is received and verified.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* QR Code Section */}
          <div className="bg-muted/30 p-6 rounded-xl border border-border/50 flex flex-col items-center text-center">
            <h4 className="text-lg font-semibold mb-2">Pay Entry Fee: ₹{activeFee}</h4>
            <p className="text-muted-foreground text-sm mb-4">Scan the QR code below to complete your payment.</p>
          {event.payment_qr_url ? (
            <div className="relative w-full max-w-[280px] aspect-square mb-2 overflow-hidden rounded-xl border border-border/50 shadow-sm group">
              <img 
                src={event.payment_qr_url} 
                alt="Payment QR Code" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
          ) : (
            <div className="w-48 h-48 bg-muted flex items-center justify-center rounded-xl mb-2 text-muted-foreground text-sm">
              QR not available
            </div>
          )}
        </div>

        {/* Payment Fields */}
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="payment_screenshot"
            render={({ field: { value, onChange, ...formField } }) => (
              <FormItem>
                <PremiumLabel required>Payment Screenshot</PremiumLabel>
                <FormControl>
                  <PremiumFileInput
                    icon={ImageIcon}
                    colorTheme="indigo"
                    accept="image/*"
                    value={value}
                    onChange={onChange}
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        </div>
      )}
    </div>
  );
}

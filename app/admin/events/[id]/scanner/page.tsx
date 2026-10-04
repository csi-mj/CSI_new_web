'use client';

import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { iconColors } from '@/config/colors';

import { useScanner } from './hooks/useScanner';

export default function ScannerPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('Point your camera at a participant\'s QR Code Ticket');

  const { scanTicket, isScanning } = useScanner(
    eventId,
    (name) => {
      setStatus('success');
      setMessage(`Checked In: ${name}!`);
    },
    (errorMsg) => {
      setStatus('error');
      setMessage(errorMsg);
    }
  );

  const handleScan = (result: string) => {
    if (status === 'success' || status === 'error' || scannedId === result || isScanning) return;
    
    setScannedId(result);
    setStatus('idle');
    setMessage('Verifying ticket...');
    
    // Call the react-query mutation
    scanTicket(result);
  };

  const resetScanner = () => {
    setScannedId(null);
    setStatus('idle');
    setMessage('Point your camera at a participant\'s QR Code Ticket');
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto space-y-6 pt-10">
      <div className="flex items-center justify-between w-full">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/admin/events/${eventId}/participants`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">QR Check-in</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="w-full aspect-square bg-card rounded-xl overflow-hidden border-2 border-primary/20 shadow-xl relative">
        <Scanner
          onScan={(result) => {
            if (result && result.length > 0) {
              handleScan(result[0].rawValue);
            }
          }}
          onError={(error) => console.error(error)}
          formats={['qr_code']}
          allowMultiple={true}
          scanDelay={1000}
        />
        
        {/* Overlay for status */}
        {(status !== 'idle' || isScanning) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm animate-in fade-in duration-200">
            {isScanning ? (
              <>
                <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
                <p className="text-xl font-bold text-center px-4">Verifying...</p>
              </>
            ) : (
              <>
                {status === 'success' ? (
                  <CheckCircle2 className={`h-24 w-24 ${iconColors.green} mb-4`} />
                ) : (
                  <XCircle className={`h-24 w-24 ${iconColors.rose} mb-4`} />
                )}
                <p className="text-xl font-bold text-center px-4 mb-8">{message}</p>
                <Button onClick={resetScanner} size="lg" className="w-48 font-bold">
                  Scan Next Ticket
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="w-full p-4 bg-muted/50 rounded-lg text-center">
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

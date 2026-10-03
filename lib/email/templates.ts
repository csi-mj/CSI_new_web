interface TicketTemplateParams {
  participantName: string;
  eventName: string;
  participantId: string;
  eventDate?: string;
  venue?: string;
}

export function getTicketTemplate({
  participantName,
  eventName,
  participantId,
  eventDate = 'TBA',
  venue = 'TBA'
}: TicketTemplateParams) {
  // We use quickchart.io to instantly generate a QR code from the ID
  const qrCodeUrl = `https://quickchart.io/qr?text=${participantId}&size=250&margin=2`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your Event Ticket</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; padding: 40px 20px; margin: 0;">
        <div style="max-w-400px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header / Status -->
          <div style="background-color: #22c55e; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">APPROVED</h1>
            <p style="color: #dcfce7; margin: 5px 0 0 0; font-size: 14px;">Your registration is confirmed</p>
          </div>

          <!-- Body -->
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #3f3f46; margin-top: 0;">Hi <strong>${participantName}</strong>,</p>
            <p style="font-size: 16px; color: #3f3f46; line-height: 1.5;">You are officially on the guest list for <strong>${eventName}</strong>. Please present the QR code below at the registration desk for check-in.</p>
            
            <!-- QR Code Box -->
            <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; text-align: center;">
              <img src="${qrCodeUrl}" alt="Ticket QR Code" style="width: 200px; height: 200px; border-radius: 4px;" />
              <p style="font-family: monospace; font-size: 12px; color: #64748b; margin-top: 10px;">ID: ${participantId}</p>
            </div>

            <!-- Event Details -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
              <p style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px;"><strong>Date:</strong> ${eventDate}</p>
              <p style="margin: 0; color: #0f172a; font-size: 14px;"><strong>Venue:</strong> ${venue}</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">Powered by CSI Chapter</p>
          </div>

        </div>
      </body>
    </html>
  `;
}

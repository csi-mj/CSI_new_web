export interface TicketTemplateParams {
  participantName: string;
  eventName: string;
  participantId: string;
  eventDate?: string;
  venue?: string;
  emailTemplate?: string | null;
}

export function getTicketTemplate({
  participantName,
  eventName,
  participantId,
  eventDate = 'TBA',
  venue = 'TBA',
  emailTemplate
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
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; padding: 20px 10px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Logo Banner -->
          <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #e2e8f0;">
            <img src="https://csi-mjcet.in/logos/csi_logo.png" alt="CSI MJCET" style="height: 70px; object-fit: contain;" />
          </div>

          <!-- Header / Status -->
          <div style="background-color: #22c55e; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">APPROVED</h1>
            <p style="color: #dcfce7; margin: 5px 0 0 0; font-size: 14px;">Your registration is confirmed</p>
          </div>

          <!-- Body -->
          <div style="padding: 20px 15px;">
            <p style="font-size: 16px; color: #3f3f46; margin-top: 0;">Hi <strong>${participantName}</strong>,</p>
            <p style="font-size: 16px; color: #3f3f46; line-height: 1.5;">Thank you for registering for <strong>${eventName}</strong>! Your registration has been successfully confirmed, and your seat is reserved.</p>
            
            ${emailTemplate ? `
            <!-- Custom Admin Guidelines -->
            <div style="margin: 20px 0; padding: 12px; border-left: 4px solid #22c55e; background-color: #f8fafc;">
              <p style="font-size: 14px; font-weight: bold; color: #0f172a; margin-top: 0;">Event Guidelines:</p>
              <div style="font-size: 14px; color: #3f3f46; line-height: 1.6; white-space: pre-wrap;">${emailTemplate}</div>
            </div>
            ` : ''}
            
            <!-- QR Code Box -->
            <p style="font-size: 15px; color: #3f3f46; font-weight: 500; text-align: center; margin-bottom: 5px;">Below is the QR Code:</p>
            <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; text-align: center;">
              <img src="${qrCodeUrl}" alt="Ticket QR Code" style="width: 200px; height: 200px; border-radius: 4px;" />
              <p style="font-family: monospace; font-size: 12px; color: #64748b; margin-top: 10px;">ID: ${participantId}</p>
            </div>

            <!-- Event Details -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
              <p style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px;"><strong>Date:</strong> ${eventDate}</p>
              <p style="margin: 0; color: #0f172a; font-size: 14px;"><strong>Venue:</strong> ${venue}</p>
            </div>

            <!-- Closing Message -->
            <div style="margin-top: 30px;">
              <p style="font-size: 15px; color: #3f3f46; line-height: 1.6;">We look forward to having you at <strong>${eventName}</strong> and hope you have an engaging and insightful experience! ❤️</p>
              <p style="font-size: 15px; font-weight: bold; color: #22c55e;">See you at the event!</p>
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

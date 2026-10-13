export interface InterviewTemplateParams {
  name: string;
  team: string;
  portfolio1: string;
  portfolio2?: string | null;
  time: string;
  venue: string;
}

export function getInterviewTemplate({
  name,
  team,
  portfolio1,
  portfolio2,
  time,
  venue
}: InterviewTemplateParams) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Interview Shortlisted - CSI MJCET</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; padding: 20px 10px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Logo Banner -->
          <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #e2e8f0;">
            <img src="https://csi-mjcet.in/logos/csi_logo.png" alt="CSI MJCET" style="height: 70px; object-fit: contain;" />
          </div>

          <!-- Header / Status -->
          <div style="background-color: #3b82f6; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">SHORTLISTED</h1>
            <p style="color: #dbeafe; margin: 5px 0 0 0; font-size: 14px;">Your interview has been scheduled</p>
          </div>

          <!-- Body -->
          <div style="padding: 20px 15px;">
            <p style="font-size: 16px; color: #3f3f46; margin-top: 0;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #3f3f46; line-height: 1.5;">Congratulations! Thank you for applying for the <strong>${team}</strong> team (Portfolio(s): <strong>${portfolio1}</strong>${portfolio2 ? ` & <strong>${portfolio2}</strong>` : ''}). We loved your application and are excited to inform you that you have been shortlisted for an interview.</p>
            
            <p style="font-size: 15px; color: #3f3f46; font-weight: 500; margin-bottom: 5px;">Here are your interview details:</p>
            
            <div style="margin: 20px 0; padding: 20px; background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px;">
              <p style="margin: 0 0 10px 0; color: #0f172a; font-size: 15px;"><strong>Date & Time:</strong><br/>${time}</p>
              <p style="margin: 0; color: #0f172a; font-size: 15px;"><strong>Venue / Link:</strong><br/>${venue}</p>
            </div>

            <!-- Guidelines -->
            <div style="margin: 20px 0; padding: 12px; border-left: 4px solid #3b82f6; background-color: #f8fafc;">
              <p style="font-size: 14px; font-weight: bold; color: #0f172a; margin-top: 0;">Interview Guidelines:</p>
              <ul style="font-size: 14px; color: #3f3f46; line-height: 1.6; margin: 10px 0 0 0; padding-left: 20px;">
                <li>Please arrive at least 10 minutes before your scheduled time.</li>
                <li>Bring 2 hard copies of your resume.</li>
              </ul>
            </div>

            <!-- Closing Message -->
            <div style="margin-top: 30px;">
              <p style="font-size: 15px; color: #3f3f46; line-height: 1.6;">We look forward to seeing you at the interview and hope you have an engaging and insightful experience! ❤️</p>
              <p style="font-size: 15px; font-weight: bold; color: #3b82f6;">Best of luck!</p>
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

export interface SendEmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
}

/**
 * Sends an email using the Brevo API.
 * This acts as our single reusable instance for the whole app.
 */
export async function sendEmail({ to, subject, htmlContent }: SendEmailOptions) {
  const API_KEY = process.env.BREVO_API_KEY;
  
  if (!API_KEY) {
    throw new Error('BREVO_API_KEY is missing in environment variables');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: {
        name: 'CSI Chapter',
        email: 'mdferozahmed27156@gmail.com' // Can be updated to your actual verified sender email
      },
      to,
      subject,
      htmlContent
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Brevo API Error:', errorData);
    throw new Error('Failed to send email via Brevo');
  }

  return await response.json();
}

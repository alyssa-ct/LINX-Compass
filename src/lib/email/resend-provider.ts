import { Resend } from 'resend';
import { EmailPayload, EmailProvider } from './types';

export class ResendEmailProvider implements EmailProvider {
  private client: Resend;

  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }

  async send(payload: EmailPayload) {
    const result = await this.client.emails.send({
      from: process.env.EMAIL_FROM || 'LINX Compass <noreply@linxconsulting.com>',
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });
    return { success: !result.error, messageId: result.data?.id };
  }
}

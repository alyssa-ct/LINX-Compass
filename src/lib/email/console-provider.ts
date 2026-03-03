import { EmailPayload, EmailProvider } from './types';

export class ConsoleEmailProvider implements EmailProvider {
  async send(payload: EmailPayload) {
    console.log('─── EMAIL (dev mode) ───────────────────────');
    console.log(`To: ${payload.to}`);
    console.log(`Subject: ${payload.subject}`);
    console.log(`Body:\n${payload.text || payload.html}`);
    console.log('────────────────────────────────────────────');
    return { success: true, messageId: `dev-${Date.now()}` };
  }
}

import { EmailProvider } from './types';

let _provider: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (!_provider) {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const { ResendEmailProvider } = require('./resend-provider');
      _provider = new ResendEmailProvider(apiKey);
    } else {
      const { ConsoleEmailProvider } = require('./console-provider');
      _provider = new ConsoleEmailProvider();
      console.warn('No RESEND_API_KEY found — emails will be logged to console.');
    }
  }
  return _provider!;
}

export type { EmailPayload, EmailProvider } from './types';

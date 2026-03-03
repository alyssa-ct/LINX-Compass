const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const brandHeader = `
  <div style="text-align: center; padding: 32px 0 24px;">
    <span style="font-size: 24px; font-weight: 700; color: #1B2845;">LINX </span>
    <span style="font-size: 24px; font-weight: 700; color: #DC303C;">Compass</span>
  </div>
`;

const footerText = `
  <div style="text-align: center; padding: 24px 0; border-top: 1px solid #E5E7EB; margin-top: 32px;">
    <p style="font-size: 12px; color: #737B81; margin: 0;">
      LINX Consulting &middot; linxconsulting.com
    </p>
  </div>
`;

function wrap(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #FFFCF9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 560px; margin: 0 auto; padding: 20px;">
    ${brandHeader}
    <div style="background-color: #FFFFFF; border-radius: 16px; padding: 32px; box-shadow: 0 2px 16px rgba(0,0,0,0.06);">
      ${content}
    </div>
    ${footerText}
  </div>
</body>
</html>`;
}

const ctaButton = (url: string, label: string) => `
  <div style="text-align: center; margin: 28px 0;">
    <a href="${url}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: #FFFFFF; text-decoration: none; border-radius: 9999px; font-size: 14px; font-weight: 600;">
      ${label}
    </a>
  </div>
`;

export function welcomeEmail(firstName: string) {
  const html = wrap(`
    <h1 style="font-size: 20px; color: #1B2845; margin: 0 0 16px;">Welcome, ${firstName}!</h1>
    <p style="font-size: 14px; color: #2D3436; line-height: 1.6; margin: 0 0 12px;">
      Your LINX Compass account is ready. You can now access your behavioral assessments, view your results, and explore personalized role-fit recommendations.
    </p>
    <p style="font-size: 14px; color: #2D3436; line-height: 1.6; margin: 0 0 4px;">
      Here&rsquo;s what you can do:
    </p>
    <ul style="font-size: 14px; color: #2D3436; line-height: 1.8; padding-left: 20px; margin: 0 0 8px;">
      <li>Complete your full behavioral assessment</li>
      <li>View your scores across 15 dimensions</li>
      <li>Discover your behavioral archetype</li>
      <li>Get personalized role-fit recommendations</li>
    </ul>
    ${ctaButton(`${BASE_URL}/dashboard`, 'Go to Dashboard')}
  `);

  const text = `Welcome, ${firstName}!\n\nYour LINX Compass account is ready. Visit ${BASE_URL}/dashboard to get started.\n\n— LINX Consulting`;

  return { subject: 'Welcome to LINX Compass', html, text };
}

export function passwordResetEmail(firstName: string, resetUrl: string) {
  const html = wrap(`
    <h1 style="font-size: 20px; color: #1B2845; margin: 0 0 16px;">Reset your password</h1>
    <p style="font-size: 14px; color: #2D3436; line-height: 1.6; margin: 0 0 12px;">
      Hi ${firstName}, we received a request to reset the password for your LINX Compass account.
    </p>
    <p style="font-size: 14px; color: #2D3436; line-height: 1.6; margin: 0 0 4px;">
      Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
    </p>
    ${ctaButton(resetUrl, 'Reset Password')}
    <p style="font-size: 12px; color: #737B81; line-height: 1.5; margin: 0;">
      If you didn&rsquo;t request this, you can safely ignore this email. Your password will remain unchanged.
    </p>
  `);

  const text = `Hi ${firstName},\n\nWe received a request to reset your password. Visit this link to set a new one (expires in 1 hour):\n\n${resetUrl}\n\nIf you didn't request this, ignore this email.\n\n— LINX Consulting`;

  return { subject: 'Reset your password — LINX Compass', html, text };
}

export function assignmentNotificationEmail(firstName: string, versionName: string, deadline?: string) {
  const deadlineNote = deadline
    ? `<p style="font-size: 14px; color: #2D3436; line-height: 1.6; margin: 0 0 12px;"><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>`
    : '';

  const html = wrap(`
    <h1 style="font-size: 20px; color: #1B2845; margin: 0 0 16px;">You&rsquo;ve been assigned an assessment</h1>
    <p style="font-size: 14px; color: #2D3436; line-height: 1.6; margin: 0 0 12px;">
      Hi ${firstName}, you&rsquo;ve been assigned a <strong>${versionName}</strong> LINX Compass behavioral assessment.
    </p>
    ${deadlineNote}
    <p style="font-size: 14px; color: #2D3436; line-height: 1.6; margin: 0 0 4px;">
      Log in to your dashboard to begin.
    </p>
    ${ctaButton(`${BASE_URL}/dashboard`, 'Start Assessment')}
  `);

  const deadlineText = deadline ? `Deadline: ${new Date(deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}\n` : '';
  const text = `Hi ${firstName},\n\nYou've been assigned a ${versionName} LINX Compass assessment.\n${deadlineText}\nVisit ${BASE_URL}/dashboard to begin.\n\n— LINX Consulting`;

  return { subject: "You've been assigned a LINX Compass assessment", html, text };
}

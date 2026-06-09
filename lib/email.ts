import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const fromEmail = process.env.FROM_EMAIL || 'noreply@newcanadiandrywall.com';
const adminEmail = process.env.ADMIN_EMAIL || 'info@newcanadiandrywall.com';

function isConfigured(): boolean {
  return !!resend;
}

function quoteConfirmationHtml({ name, projectType }: { name: string; projectType: string }): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f2ed;font-family:Arial,sans-serif;">
  <table style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <tr><td style="text-align:center;padding-bottom:24px;">
      <h1 style="color:#c9973a;font-size:24px;margin:0;">New Canadian Drywall</h1>
    </td></tr>
    <tr><td style="background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <h2 style="color:#1a1a1a;font-size:20px;margin:0 0 8px;">Thank you, ${name}!</h2>
      <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 16px;">
        We've received your quote request for <strong>${projectType}</strong> and will review it shortly.
      </p>
      <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 16px;">
        A member of our team will get back to you within 1–2 business days to discuss your project in detail.
      </p>
      <div style="border-top:1px solid #e8e3dc;margin:20px 0;padding-top:16px;">
        <p style="color:#888;font-size:13px;margin:0;">
          New Canadian Drywall &middot; Serving the GTA since 2023<br>
          <a href="mailto:${adminEmail}" style="color:#c9973a;">${adminEmail}</a>
        </p>
      </div>
    </td></tr>
  </table>
</body>
</html>`;
}

function careerConfirmationHtml({ name, role }: { name: string; role: string }): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f2ed;font-family:Arial,sans-serif;">
  <table style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <tr><td style="text-align:center;padding-bottom:24px;">
      <h1 style="color:#c9973a;font-size:24px;margin:0;">New Canadian Drywall</h1>
    </td></tr>
    <tr><td style="background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <h2 style="color:#1a1a1a;font-size:20px;margin:0 0 8px;">Application Received, ${name}!</h2>
      <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Thank you for applying for the <strong>${role}</strong> position at New Canadian Drywall.
      </p>
      <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 16px;">
        We'll review your application and reach out if your experience aligns with our current needs.
      </p>
      <div style="border-top:1px solid #e8e3dc;margin:20px 0;padding-top:16px;">
        <p style="color:#888;font-size:13px;margin:0;">
          New Canadian Drywall &middot; Serving the GTA since 2023<br>
          <a href="mailto:${adminEmail}" style="color:#c9973a;">${adminEmail}</a>
        </p>
      </div>
    </td></tr>
  </table>
</body>
</html>`;
}

function adminQuoteNotificationHtml({ name, email, phone, projectType, budget, message }: {
  name: string; email: string; phone?: string | null; projectType: string; budget?: string | null; message: string;
}): string {
  const rows = [
    { label: 'Name', value: name },
    { label: 'Email', value: `<a href="mailto:${email}" style="color:#c9973a;">${email}</a>` },
    { label: 'Phone', value: phone || '—' },
    { label: 'Project Type', value: projectType },
    { label: 'Budget', value: budget || '—' },
  ];
  const rowHtml = rows.map((r, i) => `
    <tr${i < rows.length - 1 ? ` style="border-bottom:1px solid #eee;"` : ''}>
      <td style="padding:10px 0;color:#888;font-size:13px;width:120px;">${r.label}</td>
      <td style="padding:10px 0;color:#1a1a1a;font-size:15px;font-weight:500;">${r.value}</td>
    </tr>`).join('');
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f2ed;font-family:Arial,sans-serif;">
  <table style="max-width:600px;margin:0 auto;padding:40px 20px;" cellpadding="0" cellspacing="0">
    <tr><td style="text-align:center;padding-bottom:24px;">
      <h1 style="color:#c9973a;font-size:24px;margin:0;">New Quote Request</h1>
    </td></tr>
    <tr><td style="background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <table style="width:100%;" cellpadding="0" cellspacing="0">${rowHtml}
        <tr><td colspan="2" style="padding:6px 0;"></td></tr>
        <tr><td colspan="2" style="padding:10px 0;color:#888;font-size:13px;">Message</td></tr>
        <tr><td colspan="2" style="padding:8px 12px;color:#1a1a1a;font-size:14px;background:#f9f8f6;border-radius:6px;line-height:1.5;">${message}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function adminCareerNotificationHtml({ name, email, phone, role, experience, availability, message }: {
  name: string; email: string; phone?: string | null; role: string; experience?: string | null; availability?: string | null; message: string;
}): string {
  const rows = [
    { label: 'Name', value: name },
    { label: 'Email', value: `<a href="mailto:${email}" style="color:#c9973a;">${email}</a>` },
    { label: 'Phone', value: phone || '—' },
    { label: 'Role', value: role },
    { label: 'Experience', value: experience ? `${experience} Years` : '—' },
    { label: 'Availability', value: availability || '—' },
  ];
  const rowHtml = rows.map((r, i) => `
    <tr${i < rows.length - 1 ? ` style="border-bottom:1px solid #eee;"` : ''}>
      <td style="padding:10px 0;color:#888;font-size:13px;width:120px;">${r.label}</td>
      <td style="padding:10px 0;color:#1a1a1a;font-size:15px;font-weight:500;">${r.value}</td>
    </tr>`).join('');
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f2ed;font-family:Arial,sans-serif;">
  <table style="max-width:600px;margin:0 auto;padding:40px 20px;" cellpadding="0" cellspacing="0">
    <tr><td style="text-align:center;padding-bottom:24px;">
      <h1 style="color:#c9973a;font-size:24px;margin:0;">New Career Application</h1>
    </td></tr>
    <tr><td style="background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <table style="width:100%;" cellpadding="0" cellspacing="0">${rowHtml}
        <tr><td colspan="2" style="padding:6px 0;"></td></tr>
        <tr><td colspan="2" style="padding:10px 0;color:#888;font-size:13px;">Message</td></tr>
        <tr><td colspan="2" style="padding:8px 12px;color:#1a1a1a;font-size:14px;background:#f9f8f6;border-radius:6px;line-height:1.5;">${message}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendQuoteConfirmation({ name, email, projectType }: {
  name: string; email: string; projectType: string;
}): Promise<void> {
  if (!isConfigured()) return;
  await resend!.emails.send({
    from: fromEmail,
    to: email,
    subject: 'We received your quote request — New Canadian Drywall',
    html: quoteConfirmationHtml({ name, projectType }),
  });
}

export async function sendCareerConfirmation({ name, email, role }: {
  name: string; email: string; role: string;
}): Promise<void> {
  if (!isConfigured()) return;
  await resend!.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Application received — New Canadian Drywall',
    html: careerConfirmationHtml({ name, role }),
  });
}

export async function sendAdminQuoteNotification(data: {
  name: string; email: string; phone?: string | null; projectType: string; budget?: string | null; message: string;
}): Promise<void> {
  if (!isConfigured()) return;
  await resend!.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `New Quote Request from ${data.name}`,
    html: adminQuoteNotificationHtml(data),
  });
}

export async function sendAdminCareerNotification(data: {
  name: string; email: string; phone?: string | null; role: string; experience?: string | null; availability?: string | null; message: string;
}): Promise<void> {
  if (!isConfigured()) return;
  await resend!.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `New Career Application from ${data.name}`,
    html: adminCareerNotificationHtml(data),
  });
}

import { formatLead, type Lead } from '@/lib/lead-schema';
import { site } from '@/lib/site';

/**
 * Server-only. Every channel is optional and independent: a channel that is not
 * configured is skipped, and a channel that fails never blocks the others. The
 * route always logs the lead as well, so nothing is lost if delivery is down.
 */

export type ChannelResult = {
  channel: 'email' | 'sms' | 'webhook';
  status: 'sent' | 'skipped' | 'failed';
  detail?: string;
};

/**
 * Reads a string variable and treats blank the same as unset.
 *
 * `??` alone would let an empty value through — a variable added in the
 * hosting dashboard with no value is `''`, not undefined — and that produces
 * `from: ''` in Resend or `To: ''` in Twilio instead of the intended default.
 * Surrounding whitespace is stripped, so a stray newline from a copy-pasted
 * value cannot corrupt a header or a phone number either.
 */
function envOr(name: string, fallback: string): string {
  return process.env[name]?.trim() || fallback;
}

async function sendEmail(lead: Lead): Promise<ChannelResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { channel: 'email', status: 'skipped' };

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: envOr('LEAD_FROM_EMAIL', 'ElectriCore Website <onboarding@resend.dev>'),
      to: envOr('LEAD_TO_EMAIL', site.email.display),
      subject: `Quote request: ${lead.service} (${lead.name})`,
      text: formatLead(lead),
    });
    if (error) return { channel: 'email', status: 'failed', detail: String(error.message) };
    return { channel: 'email', status: 'sent' };
  } catch (error) {
    return { channel: 'email', status: 'failed', detail: (error as Error).message };
  }
}

async function sendSms(lead: Lead): Promise<ChannelResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_FROM_NUMBER?.trim();
  const to = envOr('LEAD_TO_SMS', site.phone.e164);
  if (!sid || !token || !from) return { channel: 'sms', status: 'skipped' };

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: from,
          Body: `${lead.name} · ${lead.phone} · ${lead.service}\n${lead.message}`.slice(0, 1500),
        }).toString(),
      },
    );
    if (!response.ok) {
      return { channel: 'sms', status: 'failed', detail: `Twilio responded ${response.status}` };
    }
    return { channel: 'sms', status: 'sent' };
  } catch (error) {
    return { channel: 'sms', status: 'failed', detail: (error as Error).message };
  }
}

async function sendWebhook(lead: Lead): Promise<ChannelResult> {
  const url = process.env.LEAD_WEBHOOK_URL?.trim();
  if (!url) return { channel: 'webhook', status: 'skipped' };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, submittedAt: new Date().toISOString() }),
    });
    if (!response.ok) {
      return { channel: 'webhook', status: 'failed', detail: `Webhook responded ${response.status}` };
    }
    return { channel: 'webhook', status: 'sent' };
  } catch (error) {
    return { channel: 'webhook', status: 'failed', detail: (error as Error).message };
  }
}

export async function deliverLead(lead: Lead): Promise<ChannelResult[]> {
  return Promise.all([sendEmail(lead), sendSms(lead), sendWebhook(lead)]);
}

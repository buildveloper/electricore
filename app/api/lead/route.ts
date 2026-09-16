import { NextResponse } from 'next/server';
import { parseLead } from '@/lib/lead-schema';
import { deliverLead } from '@/lib/lead-delivery';

export const runtime = 'nodejs';

/**
 * Best-effort in-memory throttle. It is per server instance, which is plenty for
 * a local business contact form. Swap in a durable store if abuse gets real.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 500) {
    for (const [entryKey, times] of hits) {
      if (times.every((time) => now - time > WINDOW_MS)) hits.delete(entryKey);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

/**
 * Returns the caller's IP, or null when the platform does not tell us one.
 *
 * We deliberately do not fall back to a shared sentinel such as "unknown":
 * that would put every visitor in one bucket, and after a handful of genuine
 * submissions real leads would start being rejected. No identifier means no
 * throttling, which is the safe direction to fail.
 */
function clientKey(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  const key = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip')?.trim();
  return key ? key : null;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, message: 'We could not read that submission. Please try again.' },
      { status: 400 },
    );
  }

  const key = clientKey(request);
  if (!key) {
    console.warn('[lead] no client IP header on this request, skipping rate limit');
  }

  if (key && rateLimited(key)) {
    return NextResponse.json(
      {
        ok: false,
        message:
          'We have already received several requests from you. Please call the office directly.',
      },
      { status: 429 },
    );
  }

  const parsed = parseLead(payload);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, message: 'Please check the highlighted fields.', errors: parsed.errors },
      { status: 422 },
    );
  }

  const { lead } = parsed;

  // Honeypot filled, or submitted faster than a human could read the form.
  const tooFast = typeof lead.startedAt === 'number' && Date.now() - lead.startedAt < 1500;
  if (lead.company || tooFast) {
    console.warn('[lead] discarded as automated submission');
    // Answer with success so scripts learn nothing from the response.
    return NextResponse.json({ ok: true });
  }

  // Always recorded server-side, so a delivery outage never loses a lead.
  console.info('[lead] received', {
    name: lead.name,
    phone: lead.phone,
    service: lead.service,
    receivedAt: new Date().toISOString(),
  });

  const results = await deliverLead(lead);
  const delivered = results.filter((result) => result.status === 'sent');

  if (results.every((result) => result.status === 'skipped')) {
    console.warn(
      '[lead] no delivery channel is configured (RESEND_API_KEY, Twilio, or LEAD_WEBHOOK_URL). ' +
        'This lead exists only in the server log. See .env.example.',
    );
  }

  for (const result of results) {
    if (result.status === 'failed') {
      console.error(`[lead] ${result.channel} failed: ${result.detail ?? 'unknown error'}`);
    }
  }

  if (delivered.length === 0 && process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        ok: false,
        message:
          'Something went wrong sending your request. Please call or email us and we will take care of it right away.',
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, channels: results });
}

export function GET() {
  return NextResponse.json({ ok: false, message: 'Use POST to submit a request.' }, { status: 405 });
}

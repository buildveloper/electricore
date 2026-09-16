import { z } from 'zod';

/**
 * One schema, used by the form for instant feedback and by the API route as the
 * authority. Keeping it in a single module means the two can never disagree.
 */

export const leadSchema = z.object({
  name: z
    .string()
    .min(2, 'Please enter your name.')
    .max(120, 'That name is too long.'),
  phone: z
    .string()
    .min(1, 'Please enter a phone number so we can call you back.')
    .max(40, 'That phone number is too long.')
    .refine(
      (value) => value.replace(/\D/g, '').length >= 10,
      'Please enter a full 10 digit phone number.',
    ),
  service: z.string().min(1, 'Please choose the type of work.').max(120),
  message: z
    .string()
    .min(10, 'Please add a short description, at least a sentence.')
    .max(4000, 'Please keep the description under 4000 characters.'),
  /**
   * Honeypot. Real visitors never see or fill this field, so any value at all
   * marks the submission as automated. Deliberately accepts any string: the
   * rejection happens after parsing so a bot still receives a success reply.
   */
  company: z.string().optional(),
  /** Timestamp captured when the form rendered, used to reject instant bots. */
  startedAt: z.number().optional(),
});

export type Lead = z.infer<typeof leadSchema>;

/** Structural type so this helper does not depend on Zod's internal generics. */
type IssueList = { issues: ReadonlyArray<{ path: readonly PropertyKey[]; message: string }> };

export function fieldErrors(error: IssueList): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

export type ParseResult =
  | { ok: true; lead: Lead }
  | { ok: false; errors: Record<string, string> };

/** Trims every string field before validating so whitespace cannot pass. */
export function parseLead(input: Record<string, unknown>): ParseResult {
  const trimmed: Record<string, unknown> = { ...input };
  for (const [key, value] of Object.entries(trimmed)) {
    if (typeof value === 'string') trimmed[key] = value.trim();
  }

  const parsed = leadSchema.safeParse(trimmed);
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error) };
  }
  return { ok: true, lead: parsed.data };
}

/** Plain text version of a lead, used for email and SMS bodies. */
export function formatLead(lead: Lead): string {
  return [
    'New quote request from the ElectriCore website',
    '',
    `Name:    ${lead.name}`,
    `Phone:   ${lead.phone}`,
    `Service: ${lead.service}`,
    '',
    'Details:',
    lead.message,
  ].join('\n');
}

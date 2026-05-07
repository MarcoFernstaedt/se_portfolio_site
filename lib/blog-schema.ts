import 'server-only';
import { BlogPostRecord, BlogSection, BlogWorkflowStatus } from '@/types';

const VALID_STATUSES: BlogWorkflowStatus[] = ['draft', 'approved', 'published'];
const SLUG_PATTERN = /^[a-z0-9-]+$/;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function cleanString(value: unknown, maxLength: number, field: string): string {
  if (typeof value !== 'string') throw new Error(`${field} must be a string`);
  const trimmed = value.trim();
  if (!trimmed) throw new Error(`${field} is required`);
  return trimmed.slice(0, maxLength);
}

function cleanOptionalString(value: unknown, maxLength: number, field: string): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  return cleanString(value, maxLength, field);
}

function cleanStringArray(value: unknown, maxItems: number, maxLength: number, field: string): string[] {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  const strings = value
    .map((item, index) => cleanString(item, maxLength, `${field}[${index}]`))
    .filter(Boolean)
    .slice(0, maxItems);
  if (strings.length === 0) throw new Error(`${field} must not be empty`);
  return strings;
}

function cleanSections(value: unknown): BlogSection[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error('sections must be a non-empty array');

  return value.slice(0, 12).map((section, index) => {
    if (!isPlainObject(section)) throw new Error(`sections[${index}] must be an object`);

    const cleaned: BlogSection = {
      heading: cleanString(section.heading, 120, `sections[${index}].heading`),
    };

    if (section.content !== undefined) {
      cleaned.content = cleanStringArray(section.content, 12, 1200, `sections[${index}].content`);
    }

    if (section.bullets !== undefined) {
      cleaned.bullets = cleanStringArray(section.bullets, 20, 400, `sections[${index}].bullets`);
    }

    if (!cleaned.content && !cleaned.bullets) {
      throw new Error(`sections[${index}] must include content or bullets`);
    }

    return cleaned;
  });
}

export function normalizeBlogPostRecord(input: unknown, forcedStatus?: BlogWorkflowStatus): BlogPostRecord {
  if (!isPlainObject(input)) throw new Error('post must be an object');

  const slug = cleanString(input.slug, 90, 'slug');
  if (!SLUG_PATTERN.test(slug)) throw new Error('slug must use lowercase letters, numbers, and hyphens only');

  const publishAt = cleanString(input.publishAt, 40, 'publishAt');
  if (Number.isNaN(Date.parse(publishAt))) throw new Error('publishAt must be a valid ISO date');

  const statusValue = forcedStatus ?? input.status ?? 'draft';
  if (!VALID_STATUSES.includes(statusValue as BlogWorkflowStatus)) {
    throw new Error('status must be draft, approved, or published');
  }

  const post: BlogPostRecord = {
    slug,
    title: cleanString(input.title, 200, 'title'),
    excerpt: cleanString(input.excerpt, 300, 'excerpt'),
    publishAt,
    readTime: cleanString(input.readTime ?? '5 min read', 40, 'readTime'),
    category: cleanString(input.category, 80, 'category'),
    featured: input.featured === true,
    status: statusValue as BlogWorkflowStatus,
    engineeringSignal: Array.isArray(input.engineeringSignal)
      ? cleanStringArray(input.engineeringSignal, 5, 220, 'engineeringSignal')
      : [],
    summary: cleanString(input.summary ?? input.excerpt, 500, 'summary'),
    sections: cleanSections(input.sections),
  };

  const approvedAt = cleanOptionalString(input.approvedAt, 40, 'approvedAt');
  if (approvedAt) post.approvedAt = approvedAt;

  const approvalNotes = cleanOptionalString(input.approvalNotes, 500, 'approvalNotes');
  if (approvalNotes) post.approvalNotes = approvalNotes;

  return post;
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

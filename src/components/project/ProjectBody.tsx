import DOMPurify from 'dompurify'

// Mirrors the backend allowlist (app/core/html_sanitize.py); the API already
// sanitizes, this is defence in depth for anything rendered as HTML.
const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'a',
    'ul', 'ol', 'li', 'blockquote', 'img', 'code', 'pre', 'hr', 'span',
    'figure', 'figcaption',
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel'],
}

export function ProjectBody({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html.trim(), PURIFY_CONFIG)
  if (!clean || clean === '<p></p>') return null
  return <div className="project-prose" dangerouslySetInnerHTML={{ __html: clean }} />
}

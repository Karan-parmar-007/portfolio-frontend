/**
 * Download name for the resume: first and last name plus "resume",
 * e.g. "Karan Shailesh Parmar" -> "karan_parmar_resume".
 */
export function resumeFileName(fullName: string | null | undefined): string {
  const words = (fullName ?? '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
  const who = words.length > 1 ? [words[0], words[words.length - 1]] : words
  return [...who, 'resume'].join('_')
}

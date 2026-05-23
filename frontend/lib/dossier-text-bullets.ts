/** Turn dossier prose into scannable bullet lists for cert detail pages. */

export function dossierTextToBullets(text: string | undefined | null): string[] {
  if (!text?.trim()) return [];

  const trimmed = text.trim();

  if (trimmed.includes('→')) {
    return trimmed
      .split('→')
      .map((part) => part.replace(/^[\s,]+|[\s,]+$/g, '').trim())
      .filter(Boolean);
  }

  if (trimmed.includes(';')) {
    return trimmed
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean);
  }

  const prerequisiteOptions = splitPrerequisiteOptions(trimmed);
  if (prerequisiteOptions.length > 1) return prerequisiteOptions;

  const sentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 12);

  if (sentences.length > 1) return sentences;

  return [trimmed];
}

function splitPrerequisiteOptions(text: string): string[] {
  const withoutLead = text.replace(/^Either:\s*/i, '').trim();
  if (!/\(A\)/i.test(withoutLead)) return [];

  const parts = withoutLead.split(/\s+or\s+\(B\)\s*/i);
  if (parts.length < 2) return [];

  const bullets: string[] = [];
  const optionA = parts[0].replace(/^\(A\)\s*/i, '').trim();
  if (optionA) bullets.push(optionA);

  const optionB = parts.slice(1).join(' or (B) ').replace(/^\(B\)\s*/i, '').trim();
  if (optionB) bullets.push(optionB);

  return bullets;
}

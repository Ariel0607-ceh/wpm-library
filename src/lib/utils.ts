import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function highlightText(text: string, query: string): { text: string; isMatch: boolean }[] {
  if (!query.trim()) return [{ text, isMatch: false }];
  
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();
  const result: { text: string; isMatch: boolean }[] = [];
  
  let lastIndex = 0;
  let index = lowerText.indexOf(lowerQuery);
  
  while (index !== -1) {
    if (index > lastIndex) {
      result.push({ text: text.slice(lastIndex, index), isMatch: false });
    }
    result.push({ text: text.slice(index, index + query.length), isMatch: true });
    lastIndex = index + query.length;
    index = lowerText.indexOf(lowerQuery, lastIndex);
  }
  
  if (lastIndex < text.length) {
    result.push({ text: text.slice(lastIndex), isMatch: false });
  }
  
  return result;
}

export function extractWords(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^a-zA-Z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ms-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getCenturyFromYear(year: string): string {
  const num = parseInt(year.replace(/[^0-9]/g, ''));
  if (!num) return 'Tidak diketahui';
  const century = Math.ceil(num / 100);
  return `Abad ke-${century}`;
}

export function countWords(manuscript: { content?: string; chapters?: { content: string }[] }): number {
  let text = '';
  
  if (manuscript.chapters && manuscript.chapters.length > 0) {
    text = manuscript.chapters.map(c => c.content).join(' ');
  } else if (manuscript.content) {
    text = manuscript.content;
  }
  
  // Split by whitespace and filter out empty strings
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

export function getFullText(manuscript: { content?: string; chapters?: { title: string; content: string }[] }): string {
  if (manuscript.chapters && manuscript.chapters.length > 0) {
    return manuscript.chapters.map(c => `${c.title}\n\n${c.content}`).join('\n\n---\n\n');
  }
  return manuscript.content || '';
}

export const MANUSCRIPT_TYPES = [
  { value: 'teks prosa', label: 'Teks Prosa' },
  { value: 'risalah & manual', label: 'Risalah & Manual' },
  { value: 'surat & dokumen', label: 'Surat & Dokumen' },
  { value: 'akhbar', label: 'Akhbar' },
  { value: 'teks puisi', label: 'Teks Puisi' },
] as const;

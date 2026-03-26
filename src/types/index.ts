// Types for WPM - Wisma Pustaka Melayu

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'user' | 'admin';
}

export type ManuscriptType = 
  | 'teks prosa' 
  | 'risalah & manual' 
  | 'surat & dokumen' 
  | 'akhbar' 
  | 'teks puisi' 
  | '';

export interface ManuscriptInfo {
  title: string;
  year?: string;
  author?: string;
  origin?: string;
  type: ManuscriptType;
  description?: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Manuscript {
  id: string;
  title: string;
  content?: string;
  chapters?: Chapter[];
  hasChapters: boolean;
  displayMode: 'continuous' | 'perChapter';
  info: ManuscriptInfo;
  createdAt: string;
  updatedAt: string;
}

export interface DictionaryEntry {
  id: string;
  word: string;
  meaning: string;
  addedBy: string;
  createdAt: string;
}

export interface ReadingSettings {
  fontSize: number;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
}

export type SortOption = 'alphabet' | 'chronological' | 'type';

export interface SearchResult {
  manuscript: Manuscript;
  matches: {
    field: 'title' | 'content';
    snippet: string;
    indices: number[];
  }[];
}

export interface KannadaLetter {
  unicode: string;
  transliteration: string;
  audioUrl: string;
  strokeOrder: string[];
  points: Array<{ x: number; y: number }>;
}

export type GameMode = 'learning' | 'practice' | 'gaming';

export interface Progress {
  letter: string;
  accuracy: number;
  attempts: number;
}
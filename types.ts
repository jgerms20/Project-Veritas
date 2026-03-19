
export enum BiasCategory {
  OPINION = 'OPINION',
  EMOTIONAL = 'EMOTIONAL',
  CERTAINTY = 'CERTAINTY',
  FRAMING = 'FRAMING'
}

export enum VoiceType {
  NARRATOR = 'NARRATOR',
  QUOTE = 'QUOTE'
}

export interface BiasDimension {
  name: string;
  slug: BiasCategory | 'QUOTE_HANDLING';
  score: number; // 0-100 float
  description: string;
}

export interface Highlight {
  text: string;
  category: BiasCategory;
  voice: VoiceType;
  explanation: string;
}

export interface AnalysisResult {
  overallScore: number; // 0-100 float
  summary: string;
  dimensions: BiasDimension[];
  highlights: Highlight[];
  rewrittenText?: string; // For the "Unbias" feature
}

export interface AnalysisState {
  isLoading: boolean;
  progress: number; // 0-100 for loading bar
  error: string | null;
  result: AnalysisResult | null;
}

export interface BiasIndexEntry {
  id: string;
  name: string;
  type: string;
  avgScore: number;
  label: string;
  analyzedCount: number;
  description?: string; // AI generated description
  url?: string; // External homepage link
}

export interface DemoArticle {
  id: string;
  title: string;
  source: string;
  date: string;
  text: string;
  context: string;
}

export type NewsSentiment = 'positive' | 'negative' | 'neutral';

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  snippet: string;
  sentiment: NewsSentiment;
}

export interface TopStory {
  headline: string;
  summary: string;
  source: string; // Added source
  url: string;
  imageUrl?: string;
  biasScore: number;
  biasLabel: string;
  timestamp: string;
}

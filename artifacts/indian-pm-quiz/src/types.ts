export interface QuizOption {
  key: string;
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface Quote {
  text: string;
  translation: string | null;
  language: string;
  note: string | null;
  sourceTitle: string;
  sourceUrl: string;
  sourceType: string;
  status: string;
  show: boolean;
}

export interface PMResult {
  pm: string;
  subtitle: string;
  summary1: string;
  summary2: string;
  strengths: string[];
  gentleNote: string;
  quote: Quote;
}

export interface PortraitCredit {
  pmName: string;
  imageEnabled: boolean;
  imageTitle: string;
  imagePageUrl: string;
  sourceName: string;
  licenseName: string;
  attributionText: string;
  needsManualReview: boolean;
}

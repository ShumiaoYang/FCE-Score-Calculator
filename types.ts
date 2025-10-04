export interface RawScores {
  readingAndUseOfEnglish: {
    part1: string;
    part2: string;
    part3: string;
    part4: string;
    part5: string;
    part6: string;
    part7: string;
  };
  writing: {
    total: string;
  };
  listening: {
    part1: string;
    part2: string;
    part3: string;
    part4: string;
  };
  speaking: {
    total: string;
  };
}

export interface CalculatedScores {
  readingAndUseOfEnglish: number;
  writing: number;
  listening: number;
  speaking: number;
  overall: number;
  grade: string;
  cefr: string;
}

export interface ScoreRecord {
  id: number;
  date: string;
  rawScores: RawScores;
  results: CalculatedScores;
}

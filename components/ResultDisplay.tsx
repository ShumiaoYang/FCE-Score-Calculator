import React from 'react';
import type { CalculatedScores } from '../types';

interface ResultDisplayProps {
  scores: CalculatedScores | null;
}

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'A': return 'text-green-400';
    case 'B': return 'text-sky-400';
    case 'C': return 'text-yellow-400';
    default: return 'text-orange-400';
  }
};

// Determines the CEFR level for an individual paper's Cambridge Scale score.
const getCefrForScore = (score: number): string => {
    if (score >= 180) return 'C1';
    if (score >= 160) return 'B2';
    if (score >= 140) return 'B1';
    return 'Below B1';
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ scores }) => {
  if (!scores) {
    return (
      <div className="sticky top-10 flex items-center justify-center h-full min-h-[300px] bg-slate-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700 p-8 text-slate-500">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          <p className="mt-4 text-lg">Your results will appear here.</p>
        </div>
      </div>
    );
  }

  const scoreItems = [
    { label: 'Reading & Use of English', score: scores.readingAndUseOfEnglish },
    { label: 'Writing', score: scores.writing },
    { label: 'Listening', score: scores.listening },
    { label: 'Speaking', score: scores.speaking },
  ];

  return (
    <div className="sticky top-10 bg-slate-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700 p-6 animate-[fadeIn_0.5s_ease-in-out]">
      <h3 className="text-2xl font-bold text-center mb-4 text-sky-400">Your Estimated Score</h3>
      <div className="text-center mb-6">
        <p className="text-7xl font-bold text-white">{scores.overall}</p>
        <p className="text-slate-400">Cambridge English Scale</p>
      </div>
      <div className="text-center mb-8">
        <p className={`text-4xl font-semibold ${getGradeColor(scores.grade)}`}>{scores.grade}</p>
        <p className="text-xl text-slate-300 mt-1">{scores.cefr} Level</p>
      </div>
      <div className="border-t border-slate-700 pt-4">
        <h4 className="font-semibold text-lg mb-3 text-center">Score Breakdown</h4>
        <ul className="space-y-2 text-slate-300">
          {scoreItems.map(({ label, score }) => (
            <li key={label} className="flex justify-between items-center p-2 rounded-md bg-slate-700/50">
              <span>{label}</span>
              <span className="font-semibold text-white text-right">
                {score}
                <span className="ml-2 text-xs font-normal text-slate-400 align-middle">
                  ({getCefrForScore(score)})
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultDisplay;
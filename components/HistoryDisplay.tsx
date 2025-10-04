import React, { useState } from 'react';
import type { ScoreRecord } from '../types';
import { RUE_POINTS_PER_ITEM, MAX_SCORES } from '../constants';

interface HistoryDisplayProps {
  history: ScoreRecord[];
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (history.length === 0) {
    return null;
  }

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-center mb-6 text-sky-400">Score History</h3>
      <div className="space-y-4">
        {sortedHistory.map((record) => (
          <div key={record.id} className="bg-slate-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700 overflow-hidden">
            <button
              onClick={() => toggleExpand(record.id)}
              className="w-full text-left p-4 flex justify-between items-center hover:bg-slate-700/50 transition-colors duration-200"
              aria-expanded={expandedId === record.id}
              aria-controls={`history-details-${record.id}`}
            >
              <div className="flex-1">
                <p className="font-semibold text-white">
                  {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-sm text-slate-400">
                  {new Date(record.date).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold text-white">{record.results.overall}</span>
              </div>
              <div className="flex-1 text-right">
                <span className="font-semibold px-3 py-1 text-sm rounded-full bg-sky-500/20 text-sky-300">{record.results.grade}</span>
              </div>
              <div className="ml-4">
                 <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-slate-400 transform transition-transform duration-300 ${expandedId === record.id ? 'rotate-180' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                 >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                 </svg>
              </div>
            </button>
            {expandedId === record.id && (
              <div id={`history-details-${record.id}`} className="p-4 border-t border-slate-700 bg-slate-900/50 animate-[fadeIn_0.3s_ease-in-out]">
                <h4 className="font-semibold text-lg mb-3 text-center text-slate-300">Score Breakdown</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <p className="font-bold mb-2 text-sky-400">Reading & Use of English</p>
                        {Object.keys(record.rawScores.readingAndUseOfEnglish).map((part, index) => {
                            const partKey = part as keyof typeof record.rawScores.readingAndUseOfEnglish;
                            return <p key={part} className="text-sm text-slate-400">Part {index+1}: <span className="font-mono text-white">{record.rawScores.readingAndUseOfEnglish[partKey] || '0'} / {MAX_SCORES.readingAndUseOfEnglish[partKey]}</span></p>
                        })}
                    </div>
                     <div>
                        <p className="font-bold mb-2 text-sky-400">Writing</p>
                        <p className="text-sm text-slate-400">Total: <span className="font-mono text-white">{record.rawScores.writing.total || '0'} / {MAX_SCORES.writing.total}</span></p>
                    </div>
                     <div>
                        <p className="font-bold mb-2 text-sky-400">Listening</p>
                        {Object.keys(record.rawScores.listening).map((part, index) => {
                             const partKey = part as keyof typeof record.rawScores.listening;
                            return <p key={part} className="text-sm text-slate-400">Part {index+1}: <span className="font-mono text-white">{record.rawScores.listening[partKey] || '0'} / {MAX_SCORES.listening[partKey]}</span></p>
                        })}
                    </div>
                     <div>
                        <p className="font-bold mb-2 text-sky-400">Speaking</p>
                         <p className="text-sm text-slate-400">Total: <span className="font-mono text-white">{record.rawScores.speaking.total || '0'} / {MAX_SCORES.speaking.total}</span></p>
                    </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryDisplay;

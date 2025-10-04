import React, { useState, useCallback, useEffect } from 'react';
import type { RawScores, CalculatedScores, ScoreRecord } from './types';
import { MAX_SCORES, CONVERSION_POINTS, ICONS, TOTAL_RAW_SCORES, RUE_POINTS_PER_ITEM } from './constants';
import ScoreInput from './components/ScoreInput';
import PaperCard from './components/PaperCard';
import ResultDisplay from './components/ResultDisplay';
import AuthForm from './components/AuthForm';
import HistoryDisplay from './components/HistoryDisplay';

const initialRawScores: RawScores = {
  readingAndUseOfEnglish: { part1: '', part2: '', part3: '', part4: '', part5: '', part6: '', part7: '' },
  writing: { total: '' },
  listening: { part1: '', part2: '', part3: '', part4: '' },
  speaking: { total: '' },
};

const App: React.FC = () => {
  const [rawScores, setRawScores] = useState<RawScores>(initialRawScores);
  const [results, setResults] = useState<CalculatedScores | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [scoresHistory, setScoresHistory] = useState<ScoreRecord[]>([]);

  useEffect(() => {
    const user = sessionStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      loadScoreHistory(user);
    }
  }, []);

  const loadScoreHistory = (username: string) => {
    const allScores = JSON.parse(localStorage.getItem('fce_scores') || '{}');
    setScoresHistory(allScores[username] || []);
  };

  const handleScoreChange = useCallback(<P extends keyof RawScores, K extends keyof RawScores[P]>(paper: P, part: K, value: string) => {
    setRawScores(prev => ({
      ...prev,
      [paper]: {
        ...prev[paper],
        [part]: value,
      },
    }));
  }, []);

  const getReadingAndUseOfEnglishRawScore = (): number => {
    const p = rawScores.readingAndUseOfEnglish;
    const p1 = parseInt(p.part1, 10) || 0;
    const p2 = parseInt(p.part2, 10) || 0;
    const p3 = parseInt(p.part3, 10) || 0;
    const p4 = parseInt(p.part4, 10) || 0;
    const p5 = parseInt(p.part5, 10) || 0;
    const p6 = parseInt(p.part6, 10) || 0;
    const p7 = parseInt(p.part7, 10) || 0;
    return p1 + p2 + p3 + (p4 * 2) + (p5 * 2) + (p6 * 2) + p7;
  };

  const getListeningRawScore = (): number => {
    const p = rawScores.listening;
    return (parseInt(p.part1, 10) || 0) + (parseInt(p.part2, 10) || 0) + (parseInt(p.part3, 10) || 0) + (parseInt(p.part4, 10) || 0);
  };

  const calculateScaleScore = (rawScore: number, points: { low: number, pass: number, high: number }, totalRaw: number): number => {
      if (rawScore <= points.low) {
        return Math.round(140 - ((points.low - rawScore) / points.low) * 18);
      }
      if (rawScore < points.pass) {
        return Math.round(140 + ((rawScore - points.low) / (points.pass - points.low)) * 20);
      }
      if (rawScore <= points.high) {
        return Math.round(160 + ((rawScore - points.pass) / (points.high - points.pass)) * 20);
      }
      if (totalRaw <= points.high) {
        return 190;
      }
      return Math.round(180 + ((rawScore - points.high) / (totalRaw - points.high)) * 10);
  };
  
  const getGradeAndCefr = (overallScore: number): { grade: string, cefr: string } => {
    if (overallScore >= 180) return { grade: 'A', cefr: 'C1' };
    if (overallScore >= 173) return { grade: 'B', cefr: 'B2' };
    if (overallScore >= 160) return { grade: 'C', cefr: 'B2' };
    if (overallScore >= 140) return { grade: 'Level B1', cefr: 'B1' };
    return { grade: 'Fail', cefr: 'Below B1' };
  };

  const handleCalculate = () => {
    const readingRaw = getReadingAndUseOfEnglishRawScore();
    const writingRaw = parseInt(rawScores.writing.total, 10) || 0;
    const listeningRaw = getListeningRawScore();
    const speakingRaw = parseInt(rawScores.speaking.total, 10) || 0;

    const readingScale = calculateScaleScore(readingRaw, CONVERSION_POINTS.readingAndUseOfEnglish, TOTAL_RAW_SCORES.readingAndUseOfEnglish);
    const writingScale = calculateScaleScore(writingRaw, CONVERSION_POINTS.writing, TOTAL_RAW_SCORES.writing);
    const listeningScale = calculateScaleScore(listeningRaw, CONVERSION_POINTS.listening, TOTAL_RAW_SCORES.listening);
    const speakingScale = calculateScaleScore(speakingRaw, CONVERSION_POINTS.speaking, TOTAL_RAW_SCORES.speaking);

    const overall = Math.round((readingScale + writingScale + listeningScale + speakingScale) / 4);
    const { grade, cefr } = getGradeAndCefr(overall);
    
    setResults({
        readingAndUseOfEnglish: readingScale,
        writing: writingScale,
        listening: listeningScale,
        speaking: speakingScale,
        overall,
        grade,
        cefr,
    });
  };

  const handleReset = () => {
    setRawScores(initialRawScores);
    setResults(null);
  };

  const handleSaveScore = () => {
    if (!results || !currentUser) return;

    const allScores = JSON.parse(localStorage.getItem('fce_scores') || '{}');
    const userScores: ScoreRecord[] = allScores[currentUser] || [];
    
    const newId = userScores.length > 0 ? Math.max(...userScores.map(s => s.id)) + 1 : 1;

    const newRecord: ScoreRecord = {
      id: newId,
      date: new Date().toISOString(),
      rawScores: rawScores,
      results: results,
    };
    
    const updatedUserScores = [...userScores, newRecord];
    allScores[currentUser] = updatedUserScores;
    localStorage.setItem('fce_scores', JSON.stringify(allScores));
    setScoresHistory(updatedUserScores);
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setScoresHistory([]);
    handleReset();
  };
  
  return (
    <div className="min-h-screen bg-slate-900 bg-grid-slate-700/[0.05]">
      <main className="container mx-auto px-4 py-10">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight sm:text-5xl">Cambridge B2 First (FCE)</h1>
          <h2 className="text-2xl font-semibold text-sky-400 mt-2">Score Calculator</h2>
          {isLoggedIn && currentUser && (
            <div className="mt-4 flex items-center justify-center space-x-4">
              <p className="text-slate-300">Welcome, <span className="font-bold text-white">{currentUser}</span>!</p>
              <button onClick={handleLogout} className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300">
                Logout
              </button>
            </div>
          )}
        </header>

        {!isLoggedIn ? (
          <AuthForm onAuthSuccess={(user) => {
            setIsLoggedIn(true);
            setCurrentUser(user);
            sessionStorage.setItem('currentUser', user);
            loadScoreHistory(user);
          }} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-6">
                <PaperCard title="Reading & Use of English" icon={ICONS.reading}>
                    {Object.entries(MAX_SCORES.readingAndUseOfEnglish).map(([part, max], index) => {
                        const partKey = part as keyof typeof rawScores.readingAndUseOfEnglish;
                        const points = RUE_POINTS_PER_ITEM[partKey];
                        const labelText = `Part ${index + 1} (${max} items, ${points} ${points > 1 ? 'points' : 'point'} each)`;

                        return (
                            <ScoreInput 
                                key={part} 
                                id={`ruoe_${part}`}
                                label={labelText}
                                max={max}
                                value={rawScores.readingAndUseOfEnglish[partKey]}
                                onChange={e => handleScoreChange('readingAndUseOfEnglish', partKey, e.target.value)}
                            />
                        );
                    })}
                </PaperCard>
                <PaperCard title="Writing" icon={ICONS.writing}>
                    <ScoreInput 
                        id="writing_total"
                        label={`Estimated Score (out of ${MAX_SCORES.writing.total})`}
                        max={MAX_SCORES.writing.total}
                        value={rawScores.writing.total}
                        onChange={e => handleScoreChange('writing', 'total', e.target.value)}
                    />
                </PaperCard>
                <PaperCard title="Listening" icon={ICONS.listening}>
                    {Object.entries(MAX_SCORES.listening).map(([part, max], index) => (
                        <ScoreInput 
                            key={part} 
                            id={`listening_${part}`}
                            label={`Part ${index+1} (${max} marks)`}
                            max={max}
                            value={rawScores.listening[part as keyof typeof rawScores.listening]}
                            onChange={e => handleScoreChange('listening', part as keyof typeof rawScores.listening, e.target.value)}
                        />
                    ))}
                </PaperCard>
                <PaperCard title="Speaking" icon={ICONS.speaking}>
                    <ScoreInput 
                        id="speaking_total"
                        label={`Estimated Score (out of ${MAX_SCORES.speaking.total})`}
                        max={MAX_SCORES.speaking.total}
                        value={rawScores.speaking.total}
                        onChange={e => handleScoreChange('speaking', 'total', e.target.value)}
                    />
                </PaperCard>
              </div>
              
              <div>
                <ResultDisplay scores={results} />
              </div>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button onClick={handleCalculate} className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
                Calculate Score
              </button>
              <button 
                onClick={handleSaveScore} 
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!results}
                aria-disabled={!results}
              >
                Save Score
              </button>
              <button onClick={handleReset} className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300">
                Reset
              </button>
            </div>
            
            <HistoryDisplay history={scoresHistory} />
          </>
        )}
      </main>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { Pencil, Book, Trophy, Sparkles, Gamepad2 } from 'lucide-react';
import { LetterDisplay } from './components/LetterDisplay';
import { WritingCanvas } from './components/WritingCanvas';
import { MatchingGame } from './components/MatchingGame';
import { kannadaLetters } from './data/letters';
import type { GameMode } from './types';
import Confetti from 'react-confetti';

function App() {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [mode, setMode] = useState<GameMode>('learning');
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentLetter = kannadaLetters[currentLetterIndex];

  const handleStrokeComplete = (accuracy: number) => {
    if (accuracy > 80) {
      setScore(prev => prev + 10);
      showCelebration();
    }
  };

  const showCelebration = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const nextLetter = () => {
    setCurrentLetterIndex((prev) => 
      prev === kannadaLetters.length - 1 ? 0 : prev + 1
    );
  };

  const handleGameScore = (points: number) => {
    setScore(prev => prev + points);
    if (points > 0) {
      showCelebration();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      {showConfetti && <Confetti />}
      
      <header className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-600 flex items-center gap-2">
            <Sparkles className="text-yellow-400" />
            Kannada for Kids
          </h1>
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 px-4 py-2 rounded-full">
              <Trophy className="inline-block text-yellow-500 mr-2" />
              <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setMode('learning')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold transition-colors
              ${mode === 'learning' 
                ? 'bg-purple-500 text-white' 
                : 'bg-white text-purple-500 hover:bg-purple-50'}`}
          >
            <Book />
            Learning Mode
          </button>
          <button
            onClick={() => setMode('practice')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold transition-colors
              ${mode === 'practice' 
                ? 'bg-purple-500 text-white' 
                : 'bg-white text-purple-500 hover:bg-purple-50'}`}
          >
            <Pencil />
            Practice Mode
          </button>
          <button
            onClick={() => setMode('gaming')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold transition-colors
              ${mode === 'gaming' 
                ? 'bg-purple-500 text-white' 
                : 'bg-white text-purple-500 hover:bg-purple-50'}`}
          >
            <Gamepad2 />
            Gaming Mode
          </button>
        </div>

        {mode === 'gaming' ? (
          <MatchingGame 
            letters={kannadaLetters} 
            onScore={handleGameScore}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center gap-6">
              <LetterDisplay letter={currentLetter} />
              <p className="text-2xl text-gray-600">
                Pronunciation: "{currentLetter.transliteration}"
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-6">
              <WritingCanvas
                letter={currentLetter}
                mode={mode}
                onStrokeComplete={handleStrokeComplete}
              />
              <button
                onClick={nextLetter}
                className="px-6 py-3 bg-green-500 text-white rounded-full font-semibold
                         hover:bg-green-600 transition-colors"
              >
                Next Letter
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
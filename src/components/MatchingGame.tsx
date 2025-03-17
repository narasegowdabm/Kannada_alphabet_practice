import React, { useState, useEffect } from 'react';
import { KannadaLetter } from '../types';
import { LetterDisplay } from './LetterDisplay';
import { audioFeedback } from '../data/letters';

interface MatchingGameProps {
  letters: KannadaLetter[];
  onScore: (points: number) => void;
}

export function MatchingGame({ letters, onScore }: MatchingGameProps) {
  const [targetLetter, setTargetLetter] = useState<KannadaLetter>();
  const [options, setOptions] = useState<KannadaLetter[]>([]);

  useEffect(() => {
    generateNewRound();
  }, []);

  const generateNewRound = () => {
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const gameOptions = shuffled.slice(0, 4);
    
    setTargetLetter(target);
    setOptions(gameOptions.sort(() => Math.random() - 0.5));
  };

  const handleChoice = (letter: KannadaLetter) => {
    if (letter.unicode === targetLetter?.unicode) {
      audioFeedback.success.play();
      onScore(10);
      generateNewRound();
    } else {
      audioFeedback.error.play();
      onScore(-5);
    }
  };

  if (!targetLetter) return null;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Match the Letter</h2>
        <p className="text-lg">Find the letter that matches: 
          <span className="font-bold ml-2">{targetLetter.transliteration}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {options.map((letter, index) => (
          <button
            key={index}
            onClick={() => handleChoice(letter)}
            className="transform hover:scale-105 transition-transform"
          >
            <LetterDisplay letter={letter} size="small" />
          </button>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { KannadaLetter } from '../types';
import { Volume2 } from 'lucide-react';

interface LetterDisplayProps {
  letter: KannadaLetter;
  size?: 'small' | 'large';
}

export function LetterDisplay({ letter, size = 'large' }: LetterDisplayProps) {
  const playAudio = () => {
    const audio = new Audio(letter.audioUrl);
    audio.play();
  };

  return (
    <div className="relative group">
      <div className={`
        bg-white rounded-2xl shadow-lg p-6
        ${size === 'large' ? 'w-48 h-48' : 'w-24 h-24'}
        flex items-center justify-center
        hover:shadow-xl transition-shadow
      `}>
        <span className={`
          font-bold text-gray-800
          ${size === 'large' ? 'text-8xl' : 'text-4xl'}
        `}>
          {letter.unicode}
        </span>
      </div>
      <button
        onClick={playAudio}
        className="absolute -bottom-2 -right-2 p-2 bg-purple-500 rounded-full text-white
                 shadow-lg hover:bg-purple-600 transition-colors"
      >
        <Volume2 size={size === 'large' ? 24 : 16} />
      </button>
    </div>
  );
}
'use client';

import { useCallback } from 'react';
import { LikertResponse } from '@/lib/types';
import { colors } from '@/lib/constants';

interface QuestionCardProps {
  questionText: string;
  questionNumber: number;
  selectedResponse: LikertResponse | null;
  onResponse: (response: LikertResponse) => void;
}

// LINX brand palette: Scarlet (disagree) → Cream (neutral) → Indigo (agree)
const OPTIONS: {
  value: LikertResponse;
  color: string;
  height: number;
}[] = [
  { value: 1, color: '#DC303C', height: 40 },  // scarlet
  { value: 2, color: '#E6816A', height: 32 },  // scarlet-cream blend
  { value: 3, color: '#E6C79C', height: 24 },  // cream
  { value: 4, color: '#496A8C', height: 32 },  // indigo-cream blend
  { value: 5, color: '#1B2845', height: 40 },  // indigo
];

export default function QuestionCard({
  questionText,
  questionNumber,
  selectedResponse,
  onResponse,
}: QuestionCardProps) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const current = selectedResponse || 3;
    if (e.key === 'ArrowRight' && current < 5) {
      onResponse((current + 1) as LikertResponse);
    } else if (e.key === 'ArrowLeft' && current > 1) {
      onResponse((current - 1) as LikertResponse);
    }
  }, [selectedResponse, onResponse]);

  return (
    <div className="w-full">
      <p className="text-base leading-relaxed mb-5" style={{ color: colors.indigo }}>
        <span className="font-bold mr-2" style={{ color: colors.slate }}>{questionNumber}.</span>
        {questionText}
      </p>

      {/* Response bar */}
      <div
        className="flex items-center justify-center gap-2"
        role="radiogroup"
        aria-label="Response scale from Disagree to Agree"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <span className="text-[11px] font-medium w-16 text-right shrink-0" style={{ color: '#DC303C' }}>
          Disagree
        </span>

        <div className="flex items-center gap-1.5 flex-1 max-w-xs">
          {OPTIONS.map((opt) => {
            const isSelected = selectedResponse === opt.value;
            return (
              <button
                key={opt.value}
                role="radio"
                aria-checked={isSelected}
                aria-label={`Option ${opt.value}`}
                onClick={() => onResponse(opt.value)}
                className="flex-1 rounded-full transition-all duration-150 cursor-pointer"
                style={{
                  height: opt.height,
                  backgroundColor: isSelected ? opt.color : `${opt.color}30`,
                  border: `2px solid ${isSelected ? opt.color : 'transparent'}`,
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: isSelected ? `0 0 0 3px ${opt.color}25` : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.target as HTMLElement).style.backgroundColor = `${opt.color}50`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.target as HTMLElement).style.backgroundColor = `${opt.color}30`;
                  }
                }}
              />
            );
          })}
        </div>

        <span className="text-[11px] font-medium w-16 shrink-0" style={{ color: '#1B2845' }}>
          Agree
        </span>
      </div>
    </div>
  );
}

import React, { useMemo } from 'react';
import { Highlight, VoiceType } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface TextHighlighterProps {
  text: string;
  highlights: Highlight[];
  onHoverHighlight: (h: Highlight | null) => void;
}

const TextHighlighter: React.FC<TextHighlighterProps> = ({ text, highlights, onHoverHighlight }) => {
  const segments = useMemo(() => {
    if (!highlights || highlights.length === 0) return [{ text, highlight: null, key: 'full' }];

    const occurrences: { start: number; end: number; highlight: Highlight }[] = [];

    highlights.forEach(h => {
      let pos = text.indexOf(h.text);
      while (pos !== -1) {
        occurrences.push({ start: pos, end: pos + h.text.length, highlight: h });
        pos = text.indexOf(h.text, pos + 1);
      }
    });

    occurrences.sort((a, b) => a.start - b.start);

    // Flatten logic simplified for brevity - assumes non-overlapping largely for demo
    const uniqueOccurrences: typeof occurrences = [];
    let lastEnd = 0;
    occurrences.forEach(occ => {
      if (occ.start >= lastEnd) {
        uniqueOccurrences.push(occ);
        lastEnd = occ.end;
      }
    });

    const result = [];
    let currentIdx = 0;

    uniqueOccurrences.forEach((occ, index) => {
      if (occ.start > currentIdx) {
        result.push({ text: text.slice(currentIdx, occ.start), highlight: null, key: `plain-${index}` });
      }
      result.push({ text: text.slice(occ.start, occ.end), highlight: occ.highlight, key: `hl-${index}` });
      currentIdx = occ.end;
    });

    if (currentIdx < text.length) {
      result.push({ text: text.slice(currentIdx), highlight: null, key: `plain-end` });
    }

    return result;
  }, [text, highlights]);

  return (
    <div className="font-serif text-lg leading-loose text-slate-300">
      {segments.map((segment) => {
        if (!segment.highlight) return <span key={segment.key} className="opacity-80">{segment.text}</span>;

        const color = CATEGORY_COLORS[segment.highlight.category];
        const isQuote = segment.highlight.voice === VoiceType.QUOTE;

        return (
          <span
            key={segment.key}
            className={`
              cursor-help transition-all duration-200 rounded px-1 py-0.5 mx-0.5
              border-b-2 hover:text-white hover:bg-opacity-20
            `}
            style={{ 
              borderColor: color, 
              backgroundColor: `${color}15`,
              color: '#e2e8f0',
              borderStyle: isQuote ? 'dashed' : 'solid'
            }}
            onMouseEnter={() => onHoverHighlight(segment.highlight)}
            onMouseLeave={() => onHoverHighlight(null)}
          >
            {segment.text}
          </span>
        );
      })}
    </div>
  );
};

export default TextHighlighter;
interface ArchMotifProps {
  className?: string;
  variant?: 'single' | 'row';
}

/**
 * The signature visual device for Dama Dental: a rounded arch that reads
 * simultaneously as a dental arch (the curve of a smile / tooth row) and
 * as the rock-hewn arches of Lalibela — Ethiopia's own architectural
 * vocabulary. Used as a hero backdrop, section divider, and loading motif.
 */
export function ArchMotif({ className = '', variant = 'single' }: ArchMotifProps) {
  if (variant === 'row') {
    return (
      <svg viewBox="0 0 600 80" className={className} fill="none" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d={`M${i * 76 + 4} 78 V40 a34 34 0 0 1 68 0 V78`}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" aria-hidden="true">
      <path
        d="M40 380 V180 C40 95 113 30 200 30 C287 30 360 95 360 180 V380"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.18"
      />
      <path
        d="M90 380 V190 C90 122 138 70 200 70 C262 70 310 122 310 190 V380"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.32"
      />
      <path
        d="M140 380 V200 C140 152 165 118 200 118 C235 118 260 152 260 200 V380"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.55"
      />
    </svg>
  );
}

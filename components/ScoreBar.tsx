import { RATING_SCALE, RATING_COLORS } from '@/lib/constants';

interface ScoreBarProps {
  score: number;
  maxScore?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  showScale?: boolean;
  className?: string;
  animated?: boolean;
}

export default function ScoreBar({
  score,
  maxScore = 10,
  label,
  size = 'md',
  showValue = true,
  showScale = false,
  className = '',
  animated = true,
}: ScoreBarProps) {
  // Normalize score to 0-10 range
  const normalizedScore = Math.max(0, Math.min(maxScore, score));
  const percentage = (normalizedScore / maxScore) * 100;
  
  // Get rating category and color
  const getRatingCategory = (score: number): keyof typeof RATING_COLORS => {
    if (score >= 10) return 'excellent';
    if (score >= 8) return 'very-good';
    if (score >= 6) return 'good';
    if (score >= 4) return 'fair';
    return 'poor';
  };

  const category = getRatingCategory(normalizedScore);
  const ratingText = RATING_SCALE[Math.round(normalizedScore) as keyof typeof RATING_SCALE] || 'Sin valorar';

  // Size variants
  const sizeClasses = {
    sm: {
      bar: 'h-2',
      text: 'text-sm',
      value: 'text-lg font-semibold',
    },
    md: {
      bar: 'h-3',
      text: 'text-base',
      value: 'text-xl font-bold',
    },
    lg: {
      bar: 'h-4',
      text: 'text-lg',
      value: 'text-2xl font-bold',
    },
  };

  const currentSize = sizeClasses[size];

  // Color mapping for Tailwind classes
  const colorClasses = {
    poor: 'bg-red-500',
    fair: 'bg-orange-500', 
    good: 'bg-yellow-500',
    'very-good': 'bg-lime-500',
    excellent: 'bg-green-500',
  };

  return (
    <div 
      className={`score-bar ${className}`}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={maxScore}
      aria-valuenow={normalizedScore}
      aria-label={label || `Puntuación: ${normalizedScore} de ${maxScore}`}
    >
      {/* Label and Score */}
      <div className="flex items-center justify-between mb-2">
        {label && (
          <span className={`font-medium text-gray-700 ${currentSize.text}`}>
            {label}
          </span>
        )}
        {showValue && (
          <div className="flex items-center space-x-2">
            <span className={`${currentSize.value} text-gray-900`}>
              {normalizedScore.toFixed(1)}
            </span>
            <span className="text-gray-500 text-sm">
              / {maxScore}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative">
        {/* Background bar */}
        <div className={`w-full ${currentSize.bar} bg-gray-200 rounded-full overflow-hidden`}>
          {/* Progress fill */}
          <div
            className={`${currentSize.bar} ${colorClasses[category]} rounded-full transition-all duration-1000 ease-out ${
              animated ? 'animate-pulse' : ''
            }`}
            style={{ 
              width: `${percentage}%`,
              transition: animated ? 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            }}
            aria-hidden="true"
          />
        </div>

        {/* Score markers (optional) */}
        {showScale && (
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            {Array.from({ length: maxScore + 1 }, (_, i) => (
              <span key={i} className="w-0 text-center">
                {i}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Rating text */}
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-gray-600 ${currentSize.text}`}>
          {ratingText}
        </span>
        <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${colorClasses[category]}`}>
          {category.replace('-', ' ').toUpperCase()}
        </div>
      </div>
    </div>
  );
}

// Multi-category score display (for reviews)
interface MultiScoreProps {
  scores: {
    label: string;
    value: number;
    weight?: number;
  }[];
  showAverage?: boolean;
  className?: string;
}

export function MultiScore({ scores, showAverage = true, className = '' }: MultiScoreProps) {
  // Calculate weighted average
  const totalWeight = scores.reduce((sum, score) => sum + (score.weight || 1), 0);
  const weightedSum = scores.reduce((sum, score) => sum + score.value * (score.weight || 1), 0);
  const average = weightedSum / totalWeight;

  return (
    <div className={`multi-score ${className}`}>
      {/* Individual scores */}
      <div className="space-y-4">
        {scores.map((score, index) => (
          <ScoreBar
            key={index}
            score={score.value}
            label={score.label}
            size="sm"
            showValue={true}
            showScale={false}
            animated={true}
          />
        ))}
      </div>

      {/* Average score */}
      {showAverage && scores.length > 1 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <ScoreBar
            score={average}
            label="Puntuación media"
            size="lg"
            showValue={true}
            showScale={false}
            animated={true}
            className="bg-gray-50 p-4 rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

// Compact score display for cards
export function CompactScore({ 
  score, 
  maxScore = 10, 
  className = '' 
}: { 
  score: number; 
  maxScore?: number; 
  className?: string;
}) {
  const normalizedScore = Math.max(0, Math.min(maxScore, score));
  const category = normalizedScore >= 8 ? 'excellent' : 
                   normalizedScore >= 6 ? 'very-good' :
                   normalizedScore >= 4 ? 'good' : 
                   normalizedScore >= 2 ? 'fair' : 'poor';

  const colorClasses = {
    poor: 'bg-red-500 text-white',
    fair: 'bg-orange-500 text-white',
    good: 'bg-yellow-500 text-gray-900',
    'very-good': 'bg-lime-500 text-gray-900',
    excellent: 'bg-green-500 text-white',
  };

  return (
    <div className={`compact-score inline-flex items-center ${className}`}>
      <div className={`px-3 py-1 rounded-full text-sm font-bold ${colorClasses[category]}`}>
        {normalizedScore.toFixed(1)}
      </div>
    </div>
  );
}

// Star rating display (alternative visual)
export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  className = '' 
}: { 
  rating: number; 
  maxRating?: number; 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  // Convert 0-10 scale to 0-5 stars
  const normalizedRating = (rating / 10) * maxRating;
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating - fullStars >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div 
      className={`star-rating flex items-center ${className}`}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={maxRating}
      aria-valuenow={normalizedRating}
      aria-label={`${normalizedRating.toFixed(1)} de ${maxRating} estrellas`}
    >
      {/* Full stars */}
      {Array.from({ length: fullStars }, (_, i) => (
        <svg
          key={`full-${i}`}
          className={`${sizeClasses[size]} text-yellow-400 fill-current`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <svg
          className={`${sizeClasses[size]} text-yellow-400`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path 
            fill="url(#half-star)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" 
          />
        </svg>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }, (_, i) => (
        <svg
          key={`empty-${i}`}
          className={`${sizeClasses[size]} text-gray-300`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}

      <span className="ml-2 text-sm text-gray-600">
        {normalizedRating.toFixed(1)}
      </span>
    </div>
  );
}
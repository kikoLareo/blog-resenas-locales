interface ScoreBarProps {
  label: string;
  score: number;
  maxScore?: number;
  className?: string;
  showValue?: boolean;
}

export default function ScoreBar({ 
  label, 
  score, 
  maxScore = 10, 
  className = '',
  showValue = true 
}: ScoreBarProps) {
  const percentage = Math.min((score / maxScore) * 100, 100);
  const roundedScore = Math.round(score * 10) / 10;
  
  // Color basado en la puntuación
  const getBarColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    if (score >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {showValue && (
          <span className="text-sm font-semibold text-gray-900">
            {roundedScore}/{maxScore}
          </span>
        )}
      </div>
      
      <div className="relative">
        {/* Barra de fondo */}
        <div 
          className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={maxScore}
          aria-label={`${label}: ${roundedScore} de ${maxScore}`}
        >
          {/* Barra de progreso */}
          <div
            className={`h-full transition-all duration-500 ease-out ${getBarColor(score)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Marcadores opcionales para valores específicos */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-1 pointer-events-none">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="w-px h-1 bg-gray-400 opacity-50"
              style={{ marginLeft: i === 0 ? 0 : 'auto', marginRight: i === 4 ? 0 : 'auto' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente para mostrar múltiples scores
interface ScoreGroupProps {
  ratings: {
    food: number;
    service: number;
    ambience: number;
    value: number;
  };
  className?: string;
}

export function ScoreGroup({ ratings, className = '' }: ScoreGroupProps) {
  const avgRating = (ratings.food + ratings.service + ratings.ambience + ratings.value) / 4;
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <div className="text-3xl font-bold text-brand-600 mb-1">
          {(Math.round(avgRating * 10) / 10).toFixed(1)}
        </div>
        <div className="text-sm text-gray-600">Puntuación Media</div>
      </div>
      
      <div className="space-y-3">
        <ScoreBar label="Comida" score={ratings.food} />
        <ScoreBar label="Servicio" score={ratings.service} />
        <ScoreBar label="Ambiente" score={ratings.ambience} />
        <ScoreBar label="Relación Calidad-Precio" score={ratings.value} />
      </div>
    </div>
  );
}
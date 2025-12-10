export function calculateOverallRating(ratings: { food?: number; service?: number; ambience?: number; value?: number; overall?: number } | undefined | null): number {
  if (!ratings) return 0;
  
  if (typeof ratings.overall === 'number' && ratings.overall > 0) return ratings.overall;

  const food = ratings.food || 0;
  const service = ratings.service || 0;
  const ambience = ratings.ambience || 0;
  const value = ratings.value || 0;
  
  if (food === 0 && service === 0 && ambience === 0 && value === 0) return 0;
  
  return (food + service + ambience + value) / 4;
}

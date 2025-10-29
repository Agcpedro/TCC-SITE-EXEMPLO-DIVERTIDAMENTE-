export function getCourseEmoji(title: string): string {
  const titleLower = title.toLowerCase();
  
  // Matérias específicas
  if (titleLower.includes('matemática') || titleLower.includes('matematica')) return '🔢';
  if (titleLower.includes('português') || titleLower.includes('portugues')) return '📚';
  if (titleLower.includes('inglês') || titleLower.includes('ingles') || titleLower.includes('english')) return '🇬🇧';
  if (titleLower.includes('espanhol') || titleLower.includes('spanish')) return '🇪🇸';
  if (titleLower.includes('história') || titleLower.includes('historia')) return '📜';
  if (titleLower.includes('geografia')) return '🌍';
  if (titleLower.includes('ciências') || titleLower.includes('ciencias')) return '🔬';
  if (titleLower.includes('física') || titleLower.includes('fisica')) return '⚛️';
  if (titleLower.includes('química') || titleLower.includes('quimica')) return '🧪';
  if (titleLower.includes('biologia')) return '🧬';
  if (titleLower.includes('artes') || titleLower.includes('arte')) return '🎨';
  if (titleLower.includes('educação física') || titleLower.includes('educacao fisica')) return '⚽';
  if (titleLower.includes('música') || titleLower.includes('musica')) return '🎵';
  if (titleLower.includes('filosofia')) return '🤔';
  if (titleLower.includes('sociologia')) return '👥';
  if (titleLower.includes('literatura')) return '📖';
  if (titleLower.includes('redação') || titleLower.includes('redacao')) return '✍️';
  if (titleLower.includes('informática') || titleLower.includes('informatica') || titleLower.includes('computação') || titleLower.includes('computacao')) return '💻';
  
  // Default
  return '📘';
}


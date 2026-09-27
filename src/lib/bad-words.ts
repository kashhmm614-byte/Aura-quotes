// A simple bad word filter.
const BAD_WORDS = new Set([
  'fuck', 'fucking', 'fucked',
  'shit', 'shitty', 'bullshit',
  'bitch', 'bitches',
  'asshole', 'assholes',
  'cunt', 'cunts',
  'dick', 'dicks',
  'pussy', 'pussies',
  'bastard', 'bastards',
  'slut', 'sluts',
  'whore', 'whores',
  'nigger', 'nigga',
  'faggot', 'fag',
  'retard', 'retarded'
]);

export function containsBadWords(text: string): boolean {
  if (!text) return false;
  
  // Normalize text: lowercase and remove punctuation
  const normalized = text.toLowerCase().replace(/[.,!?;:'"()\[\]{}\-]/g, ' ');
  const words = normalized.split(/\s+/);
  
  return words.some(word => BAD_WORDS.has(word));
}

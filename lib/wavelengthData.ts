// Spectrum cards for the Wavelength party game.
// Each card is a pair of opposite ends; the clue-giver hints at a hidden point between them.

export interface SpectrumCard {
  id: string;
  left: string;
  right: string;
  category: WavelengthCategory | 'custom';
}

export type WavelengthCategory = 'everyday' | 'food' | 'people' | 'work' | 'abstract' | 'culture';

export const WAVELENGTH_CATEGORIES: { id: WavelengthCategory; label: string; emoji: string }[] = [
  { id: 'everyday', label: 'Everyday', emoji: '🏠' },
  { id: 'food', label: 'Food & Drink', emoji: '🍜' },
  { id: 'people', label: 'People & Feelings', emoji: '🧑' },
  { id: 'work', label: 'Work & Tech', emoji: '💼' },
  { id: 'abstract', label: 'Abstract', emoji: '🌀' },
  { id: 'culture', label: 'Culture & Fun', emoji: '🎬' },
];

const RAW: Record<WavelengthCategory, [string, string][]> = {
  everyday: [
    ['Cold', 'Hot'],
    ['Cheap', 'Expensive'],
    ['Small', 'Huge'],
    ['Quiet', 'Loud'],
    ['Slow', 'Fast'],
    ['Soft', 'Hard'],
    ['Light', 'Heavy'],
    ['Dirty', 'Clean'],
    ['Safe', 'Dangerous'],
    ['Easy to carry', 'Hard to carry'],
    ['Useless', 'Useful'],
    ['Rare', 'Common'],
    ['Old-fashioned', 'Modern'],
    ['Smells bad', 'Smells good'],
    ['Boring hobby', 'Exciting hobby'],
    ['Indoor activity', 'Outdoor activity'],
    ['Short-lived', 'Lasts forever'],
    ['Bad gift', 'Great gift'],
  ],
  food: [
    ['Unhealthy food', 'Healthy food'],
    ['Tasteless', 'Delicious'],
    ['Breakfast food', 'Dinner food'],
    ['Sweet', 'Salty'],
    ['Mild', 'Spicy'],
    ['Snack', 'Full meal'],
    ['Easy to cook', 'Hard to cook'],
    ['Street food', 'Fine dining'],
    ['Overrated food', 'Underrated food'],
    ['Drink', 'Food'],
  ],
  people: [
    ['Introvert', 'Extrovert'],
    ['Lazy', 'Hard-working'],
    ['Villain', 'Hero'],
    ['Sad song', 'Happy song'],
    ['Rude', 'Polite'],
    ['Unknown person', 'Famous person'],
    ['Bad habit', 'Good habit'],
    ['Nervous', 'Confident'],
    ['Weird thing to say on a date', 'Normal thing to say on a date'],
    ['Childish', 'Mature'],
    ['Annoying', 'Charming'],
    ['Bad advice', 'Good advice'],
  ],
  work: [
    ['Boring job', 'Dream job'],
    ['Low-paid job', 'High-paid job'],
    ['Easy job', 'Stressful job'],
    ['Useless app', 'Must-have app'],
    ['Bad excuse for being late', 'Good excuse for being late'],
    ['Old technology', 'Cutting-edge technology'],
    ['Waste of time', 'Productive'],
    ['Unprofessional', 'Professional'],
    ['Bad meeting', 'Great meeting'],
    ['Skill anyone can learn', 'Skill only experts have'],
  ],
  abstract: [
    ['Fantasy', 'Reality'],
    ['Nature', 'Technology'],
    ['Ugly', 'Beautiful'],
    ['Simple', 'Complicated'],
    ['Normal', 'Weird'],
    ['Overrated', 'Underrated'],
    ['Past', 'Future'],
    ['Illegal', 'Legal'],
    ['Risky', 'Safe bet'],
    ['Forgettable', 'Unforgettable'],
    ['Science', 'Art'],
    ['Luck', 'Skill'],
    ['Sounds bad', 'Sounds good'],
    ['Round', 'Pointy'],
  ],
  culture: [
    ['Bad movie', 'Great movie'],
    ['Kids’ movie', 'Adults’ movie'],
    ['Unpopular sport', 'Popular sport'],
    ['Boring superpower', 'Amazing superpower'],
    ['Worst pet', 'Best pet'],
    ['Cringe', 'Cool'],
    ['Easy game', 'Hard game'],
    ['Bad holiday destination', 'Great holiday destination'],
    ['Classic', 'Trendy'],
    ['Mainstream', 'Niche'],
    ['Scary', 'Cute'],
    ['Dog person thing', 'Cat person thing'],
  ],
};

export const BUILT_IN_CARDS: SpectrumCard[] = (Object.keys(RAW) as WavelengthCategory[]).flatMap((cat) =>
  RAW[cat].map(([left, right], i) => ({ id: `${cat}-${i}`, left, right, category: cat })),
);

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Parse "Left | Right" (also accepts "-", "/", "↔" or "," as separator), one card per line. */
export function parseCardLines(text: string): { left: string; right: string }[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s*(?:\||↔|<->|\/|,|\s-\s)\s*/).filter(Boolean);
      return parts.length >= 2 ? { left: parts[0], right: parts.slice(1).join(' ') } : null;
    })
    .filter((c): c is { left: string; right: string } => c !== null);
}

// Scoring zones — half-widths measured on a 0–100 dial.
export const DIFFICULTY = {
  easy: { label: 'Easy', bands: [5, 11, 17] },
  normal: { label: 'Normal', bands: [3.5, 8, 12.5] },
  hard: { label: 'Hard', bands: [2.5, 5.5, 8.5] },
} as const;

export type Difficulty = keyof typeof DIFFICULTY;

export function scoreGuess(target: number, guess: number, difficulty: Difficulty): number {
  const d = Math.abs(target - guess);
  const [b4, b3, b2] = DIFFICULTY[difficulty].bands;
  if (d <= b4) return 4;
  if (d <= b3) return 3;
  if (d <= b2) return 2;
  return 0;
}

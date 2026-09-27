import { openDB, type IDBPDatabase } from 'idb';
import type { Quote } from '../types';

interface AuraDBSchema {
  quotes: {
    key: string;
    value: Quote;
    indexes: { 'by-category': string };
  };
  favorites: {
    key: string;
    value: { id: string; quoteId: string; timestamp: number };
    indexes: { 'by-timestamp': number };
  };
  streaks: {
    key: string;
    value: { id: string; currentStreak: number; lastLoginDate: string }; // Date string like "YYYY-MM-DD"
  };
}

let dbPromise: Promise<IDBPDatabase<AuraDBSchema>> | null = null;

export function initDB() {
  if (!dbPromise) {
    dbPromise = openDB<AuraDBSchema>('aura-db', 3, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('quotes')) {
          const qStore = db.createObjectStore('quotes', { keyPath: 'id' });
          qStore.createIndex('by-category', 'category');
        }
        if (!db.objectStoreNames.contains('favorites')) {
          const fStore = db.createObjectStore('favorites', { keyPath: 'id' });
          fStore.createIndex('by-timestamp', 'timestamp');
        }
        if (!db.objectStoreNames.contains('streaks')) {
          db.createObjectStore('streaks', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// Seeds 50 built-in quotes for offline-first experience
const SEED_QUOTES: Quote[] = [
  { id: 's1', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'Motivation' },
  { id: 's2', text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein', category: 'Wisdom' },
  { id: 's3', text: 'To live is the rarest thing in the world. Most people exist, that is all.', author: 'Oscar Wilde', category: 'Life' },
  { id: 's4', text: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde', category: 'Life' },
  { id: 's5', text: 'Two things are infinite: the universe and human stupidity; and I\'m not sure about the universe.', author: 'Albert Einstein', category: 'Humor' },
  { id: 's6', text: 'The unexamined life is not worth living.', author: 'Socrates', category: 'Philosophy' },
  { id: 's7', text: 'Happiness is not something ready-made. It comes from your own actions.', author: 'Dalai Lama', category: 'Mindfulness' },
  { id: 's8', text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius', category: 'Motivation' },
  { id: 's9', text: 'The greatest glory in living lies not in never falling, but in rising every time we fall.', author: 'Nelson Mandela', category: 'Success' },
  { id: 's10', text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon', category: 'Life' },
  { id: 's11', text: 'In three words I can sum up everything I\'ve learned about life: it goes on.', author: 'Robert Frost', category: 'Life' },
  { id: 's12', text: 'The mind is everything. What you think you become.', author: 'Buddha', category: 'Mindfulness' },
  { id: 's13', text: 'Strive not to be a success, but rather to be of value.', author: 'Albert Einstein', category: 'Success' },
  { id: 's14', text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins', category: 'Motivation' },
  { id: 's15', text: 'Everything you\'ve ever wanted is on the other side of fear.', author: 'George Addair', category: 'Motivation' },
  { id: 's16', text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb', category: 'Wisdom' },
  { id: 's17', text: 'Your time is limited, don\'t waste it living someone else\'s life.', author: 'Steve Jobs', category: 'Life' },
  { id: 's18', text: 'If you want to lift yourself up, lift up someone else.', author: 'Booker T. Washington', category: 'Wisdom' },
  { id: 's19', text: 'The purpose of our lives is to be happy.', author: 'Dalai Lama', category: 'Mindfulness' },
  { id: 's20', text: 'Not how long, but how well you have lived is the main thing.', author: 'Seneca', category: 'Philosophy' },
  { id: 's21', text: 'Love all, trust a few, do wrong to none.', author: 'William Shakespeare', category: 'Love' },
  { id: 's22', text: 'The only thing we have to fear is fear itself.', author: 'Franklin D. Roosevelt', category: 'Motivation' },
  { id: 's23', text: 'I think, therefore I am.', author: 'René Descartes', category: 'Philosophy' },
  { id: 's24', text: 'The journey of a thousand miles begins with one step.', author: 'Lao Tzu', category: 'Wisdom' },
  { id: 's25', text: 'That which does not kill us makes us stronger.', author: 'Friedrich Nietzsche', category: 'Philosophy' },
  { id: 's26', text: 'Imagination is more important than knowledge.', author: 'Albert Einstein', category: 'Science' },
  { id: 's27', text: 'Look deep into nature, and then you will understand everything better.', author: 'Albert Einstein', category: 'Nature' },
  { id: 's28', text: 'The earth has music for those who listen.', author: 'William Shakespeare', category: 'Nature' },
  { id: 's29', text: 'In every walk with nature one receives far more than he seeks.', author: 'John Muir', category: 'Nature' },
  { id: 's30', text: 'Love is composed of a single soul inhabiting two bodies.', author: 'Aristotle', category: 'Love' },
  { id: 's31', text: 'Where there is love there is life.', author: 'Mahatma Gandhi', category: 'Love' },
  { id: 's32', text: 'The best and most beautiful things in the world cannot be seen or even touched — they must be felt with the heart.', author: 'Helen Keller', category: 'Love' },
  { id: 's33', text: 'Science is a way of thinking much more than it is a body of knowledge.', author: 'Carl Sagan', category: 'Science' },
  { id: 's34', text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', category: 'Success' },
  { id: 's35', text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', category: 'Motivation' },
  { id: 's36', text: 'Act as if what you do makes a difference. It does.', author: 'William James', category: 'Motivation' },
  { id: 's37', text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.', author: 'Ralph Waldo Emerson', category: 'Wisdom' },
  { id: 's38', text: 'The wound is the place where the Light enters you.', author: 'Rumi', category: 'Mindfulness' },
  { id: 's39', text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt', category: 'Motivation' },
  { id: 's40', text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle', category: 'Success' },
  { id: 's41', text: 'Adopt the pace of nature: her secret is patience.', author: 'Ralph Waldo Emerson', category: 'Nature' },
  { id: 's42', text: 'Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.', author: 'Rumi', category: 'Wisdom' },
  { id: 's43', text: 'The cosmos is within us. We are made of star-stuff.', author: 'Carl Sagan', category: 'Science' },
  { id: 's44', text: 'Somewhere, something incredible is waiting to be known.', author: 'Carl Sagan', category: 'Science' },
  { id: 's45', text: 'Nothing in life is to be feared, it is only to be understood.', author: 'Marie Curie', category: 'Science' },
  { id: 's46', text: 'Keep your face always toward the sunshine — and shadows will fall behind you.', author: 'Walt Whitman', category: 'Nature' },
  { id: 's47', text: 'You must be the change you wish to see in the world.', author: 'Mahatma Gandhi', category: 'Wisdom' },
  { id: 's48', text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle', category: 'Motivation' },
  { id: 's49', text: 'The only true wisdom is in knowing you know nothing.', author: 'Socrates', category: 'Philosophy' },
  { id: 's50', text: 'Spread love everywhere you go. Let no one ever come to you without leaving happier.', author: 'Mother Teresa', category: 'Love' },
];

export async function seedIfEmpty() {
  const db = await initDB();
  const count = await db.count('quotes');
  if (count === 0) {
    const tx = db.transaction('quotes', 'readwrite');
    for (const q of SEED_QUOTES) {
      await tx.store.put(q);
    }
    await tx.done;
  }
}

export async function getAllQuotes(): Promise<Quote[]> {
  const db = await initDB();
  return db.getAll('quotes');
}

export async function getQuotesByCategory(category: string): Promise<Quote[]> {
  const db = await initDB();
  if (category === 'All') return db.getAll('quotes');
  return db.getAllFromIndex('quotes', 'by-category', category);
}

export async function getRandomQuote(category?: string): Promise<Quote | null> {
  const quotes = category && category !== 'All'
    ? await getQuotesByCategory(category)
    : await getAllQuotes();
  if (quotes.length === 0) return null;
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export async function getQuoteOfTheDay(): Promise<Quote | null> {
  const quotes = await getAllQuotes();
  if (quotes.length === 0) return null;
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = Math.imul(31, hash) + today.charCodeAt(i) | 0;
  }
  return quotes[Math.abs(hash) % quotes.length];
}

export async function addQuote(quote: Quote) {
  const db = await initDB();
  await db.put('quotes', quote);
}

export async function addFavorite(quoteId: string) {
  const db = await initDB();
  await db.put('favorites', { id: quoteId, quoteId, timestamp: Date.now() });
}

export async function removeFavorite(quoteId: string) {
  const db = await initDB();
  await db.delete('favorites', quoteId);
}

export async function isFavorite(quoteId: string): Promise<boolean> {
  const db = await initDB();
  return !!(await db.get('favorites', quoteId));
}

export async function getAllFavoriteIds(): Promise<string[]> {
  const db = await initDB();
  const all = await db.getAll('favorites');
  return all.map(f => f.quoteId);
}

export async function getFavoriteQuotes(): Promise<Quote[]> {
  const ids = await getAllFavoriteIds();
  const db = await initDB();
  const quotes: Quote[] = [];
  for (const id of ids) {
    const q = await db.get('quotes', id);
    if (q) quotes.push(q);
  }
  return quotes;
}

export async function updateAndGetStreak(userId: string = 'local'): Promise<number> {
  const db = await initDB();
  const today = new Date();
  
  // Create a YYYY-MM-DD string adjusted for local timezone offset
  const tzOffset = today.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(today.getTime() - tzOffset)).toISOString().slice(0, 10);
  
  let streakData = await db.get('streaks', userId);

  if (!streakData) {
    streakData = { id: userId, currentStreak: 1, lastLoginDate: localISOTime };
    await db.put('streaks', streakData);
    return 1;
  }

  const lastDateStr = streakData.lastLoginDate;
  if (lastDateStr === localISOTime) {
    // Already logged in today, keep streak
    return streakData.currentStreak;
  }

  // Calculate days difference
  const todayDate = new Date(localISOTime);
  const lastDate = new Date(lastDateStr);
  const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Logged in yesterday, increment
    streakData.currentStreak += 1;
  } else {
    // Missed a day, reset
    streakData.currentStreak = 1;
  }

  streakData.lastLoginDate = localISOTime;
  await db.put('streaks', streakData);

  return streakData.currentStreak;
}

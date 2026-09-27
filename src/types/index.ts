// Google Identity Services Types
export interface AuraUser {
  uid: string;
  google_id: string;
  email: string;
  name: string;
  picture: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  category?: string;
  tags?: string[];
  theme?: string;
  is_custom?: boolean;
  created_by?: string;
  likes?: number;
}

export type ModalType = 'auth' | 'vault' | 'create' | 'neon' | null;

export type CategoryName =
  | 'All'
  | 'Life'
  | 'Motivation'
  | 'Love'
  | 'Wisdom'
  | 'Philosophy'
  | 'Success'
  | 'Mindfulness'
  | 'Humor'
  | 'Science'
  | 'Nature';


export interface Post {
  id: string;
  url: string;
  title: string;
  author: string;
  authorAvatar: string;
  likes: number;
  comments: number;
  isAI: boolean;
  aspectRatio: string;
  isSaved?: boolean;
}

export enum Tab {
  EXPLORE = 'explore',
  FEED = 'feed',
  AI_STUDIO = 'ai_studio',
  SAVED = 'saved',
  PROFILE = 'profile',
  SETTINGS = 'settings'
}

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';

export interface GenerationParams {
  prompt: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

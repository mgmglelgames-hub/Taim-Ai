export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export interface ChatMessage {
  author: MessageAuthor;
  text: string;
  imageUrl?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface AppData {
    chats: Chat[];
    theme: Theme;
}
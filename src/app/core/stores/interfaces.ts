export interface ChatMessage {
  id: number;
  senderId: number;
  content: string | null;
  timestamp: string;
}

export interface FullChat {
  id: number;
  isFullyLoaded?: boolean;
  unreadMessagesCount?: number;
  messages?: ChatMessage[];
  isLimitMessagesAchieved: boolean;
}

export interface ShortChat {
  id: number;
  unreadMessages: number;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  content: string | null;
  timestamp: string;
}

export interface FullChat {
  id: number;
  isFullyLoaded?: boolean;
  unreadMessages?: number;
  messages?: ChatMessage[];
  isTopMesLimitAchieved: boolean;
  isBottomMesLimitAchieved: boolean;
}

export interface ShortChat {
  id: number;
  unreadMessages: number;
}

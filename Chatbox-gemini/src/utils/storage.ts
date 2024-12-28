
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  messages: ChatMessage[];
  lastUpdated: number;
}

export class ChatStorage {
  static STORAGE_KEY = 'gemini_chat_conversations';

  static saveConversation(conversation: Conversation): void {
    const conversations = this.getConversations();
    const updated = conversations.filter(c => c.id !== conversation.id);
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify([...updated, conversation])
    );
  }

  static getConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static deleteConversation(id: string): void {
    const conversations = this.getConversations();
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(conversations.filter(c => c.id !== id))
    );
  }
}
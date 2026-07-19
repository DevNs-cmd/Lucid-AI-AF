export interface NPC {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  location: string;
  relationshipScore: number; // -100 to 100
  memories: string[];
  personality: string;
}

export interface StoryChapter {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  imageUrl?: string;
  status: "completed" | "current" | "locked";
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "failed";
  rewards: string[];
  progress: number; // 0 to 100
}

export interface InventoryItem {
  id: string;
  name: string;
  type: "weapon" | "armor" | "consumable" | "quest_item";
  description: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  imageUrl?: string;
  quantity: number;
}

export interface Message {
  id: string;
  sender: "ai" | "user" | "system";
  text: string;
  timestamp: string;
  npcId?: string; // If ai is speaking as a specific NPC
}

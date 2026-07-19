import { NPC, StoryChapter, Quest, InventoryItem, Message } from "@/types";

export const mockNPCs: NPC[] = [
  {
    id: "npc_1",
    name: "Elara Vance",
    avatarUrl: "/avatars/elara.png",
    role: "Merchant",
    location: "Ashen Wastes Outpost",
    relationshipScore: 45,
    memories: ["You bought a rare sword from her.", "You saved her caravan from bandits."],
    personality: "Pragmatic but secretly kind-hearted.",
  },
  {
    id: "npc_2",
    name: "Kaelen",
    avatarUrl: "/avatars/kaelen.png",
    role: "Mage Scholar",
    location: "Verdant Hollow Archives",
    relationshipScore: -20,
    memories: ["You accidentally burned a scroll.", "You argued about arcane theory."],
    personality: "Arrogant, highly intelligent, easily annoyed.",
  }
];

export const mockChapters: StoryChapter[] = [
  {
    id: "chap_1",
    title: "The Awakening",
    summary: "You woke up in the Ashen Wastes with no memory. Elara found you.",
    timestamp: "2026-07-10T10:00:00Z",
    status: "completed",
  },
  {
    id: "chap_2",
    title: "Shadows in the Sand",
    summary: "A bandit raid disrupted the outpost. You fought them off.",
    timestamp: "2026-07-11T14:30:00Z",
    status: "completed",
  },
  {
    id: "chap_3",
    title: "The Scholar's Request",
    summary: "Currently traveling to Verdant Hollow.",
    timestamp: "2026-07-13T09:15:00Z",
    status: "current",
  }
];

export const mockQuests: Quest[] = [
  {
    id: "q_1",
    title: "Retrieve the Sun Stone",
    description: "Kaelen needs the Sun Stone from the Obsidian Reach to translate the ancient text.",
    status: "active",
    rewards: ["500 Gold", "Spell Tome: Fireball"],
    progress: 30,
  },
  {
    id: "q_2",
    title: "Defend the Outpost",
    description: "Help Elara defend against the bandit raid.",
    status: "completed",
    rewards: ["100 Gold", "Iron Sword"],
    progress: 100,
  }
];

export const mockInventory: InventoryItem[] = [
  {
    id: "item_1",
    name: "Iron Sword",
    type: "weapon",
    description: "A standard iron sword. Reliable.",
    rarity: "common",
    quantity: 1,
  },
  {
    id: "item_2",
    name: "Health Potion",
    type: "consumable",
    description: "Restores 50 HP.",
    rarity: "uncommon",
    quantity: 3,
  },
  {
    id: "item_3",
    name: "Mystic Amulet",
    type: "armor",
    description: "Slightly increases magic resistance.",
    rarity: "rare",
    quantity: 1,
  }
];

export const mockChatHistory: Message[] = [
  {
    id: "msg_1",
    sender: "system",
    text: "You arrive at the Verdant Hollow Archives. The air smells of old parchment and ozone.",
    timestamp: "2026-07-13T09:15:00Z",
  },
  {
    id: "msg_2",
    sender: "ai",
    npcId: "npc_2",
    text: "Ah, it's you. Have you brought the Sun Stone, or are you just here to waste my time again?",
    timestamp: "2026-07-13T09:15:10Z",
  },
  {
    id: "msg_3",
    sender: "user",
    text: "Not yet, Kaelen. I need more information on its exact location.",
    timestamp: "2026-07-13T09:15:45Z",
  },
  {
    id: "msg_4",
    sender: "ai",
    npcId: "npc_2",
    text: "*sighs heavily* I suppose you couldn't be trusted to find it on your own. It's deep within the Obsidian Reach, guarded by Ash Wraiths. Be prepared.",
    timestamp: "2026-07-13T09:16:05Z",
  }
];

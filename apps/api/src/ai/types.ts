export interface StoryGenRequest {
  prompt: string;
  worldId?: string;
  characterContext?: string;
  maxTokens?: number;
}

export interface StoryGenResult {
  text: string;
  provider: string;
  model: string;
}

export interface ImageGenRequest {
  prompt: string;
  style?: string;
  width?: number;
  height?: number;
}

export interface ImageGenResult {
  url: string;
  provider: string;
}

export interface VoiceGenRequest {
  text: string;
  voiceId?: string;
  emotion?: string;
}

export interface VoiceGenResult {
  audioUrl: string;
  provider: string;
}

export interface TranscribeRequest {
  audioUrl: string;
}

export interface TranscribeResult {
  text: string;
}

export interface EmbeddingRequest {
  text: string;
}

export interface EmbeddingResult {
  vector: number[];
  provider: string;
  dimensions: number;
}

export interface ModerationRequest {
  text: string;
}

export interface ModerationResult {
  flagged: boolean;
  categories: Record<string, boolean>;
}

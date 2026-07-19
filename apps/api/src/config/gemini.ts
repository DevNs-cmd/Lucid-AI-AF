import { GoogleGenAI, Type, Schema } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

// Allow the server to boot in local dev without crashing.
// Actual Gemini calls will fail with a clearer message when invoked.
export const aiClient = apiKey
  ? new GoogleGenAI({ apiKey })
  : (new GoogleGenAI({ apiKey: "" }) as GoogleGenAI);

export function getGeminiApiKey(): string {
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Create apps/api/.env with GEMINI_API_KEY=<key> to enable Gemini calls."
    );
  }
  return apiKey;
}


export interface StoryEngineParams {
  playerName: string;
  genre: string;
  tone: string;
  choiceText?: string;
  worldName: string;
  weather: string;
  economy: string;
  politics: string;
  crimeState: number;
  npcName: string;
  npcOccupation: string;
  npcTraits: string[];
  npcTrust: number;
  npcAnger: number;
}

export interface StoryResponse {
  narrativeText: string;
  chapterTitle: string;
  updatedWorld: {
    weather: string;
    economy: string;
    politics: string;
    crimeState: number;
  };
  updatedNPC: {
    trustLevel: number;
    angerLevel: number;
  };
  choices: Array<{
    text: string;
    factionImpact: string;
    worldImpact: string;
    npcImpact: string;
  }>;
}

const storyResponseSchema: Schema = {
  type: Type.OBJECT,
  required: ["narrativeText", "chapterTitle", "updatedWorld", "updatedNPC", "choices"],
  properties: {
    narrativeText: {
      type: Type.STRING,
      description: "Compelling prose describing the immediate outcomes of user actions.",
    },
    chapterTitle: {
      type: Type.STRING,
      description: "An evocative title matching the new storyline branch.",
    },
    updatedWorld: {
      type: Type.OBJECT,
      required: ["weather", "economy", "politics", "crimeState"],
      properties: {
        weather: { type: Type.STRING },
        economy: { type: Type.STRING },
        politics: { type: Type.STRING },
        crimeState: { type: Type.INTEGER, description: "Scale of 0-100 indicating lawfulness level" },
      },
    },
    updatedNPC: {
      type: Type.OBJECT,
      required: ["trustLevel", "angerLevel"],
      properties: {
        trustLevel: { type: Type.INTEGER, description: "Scale of 0-100" },
        angerLevel: { type: Type.INTEGER, description: "Scale of 0-100" },
      },
    },
    choices: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["text", "factionImpact", "worldImpact", "npcImpact"],
        properties: {
          text: { type: Type.STRING, description: "A distinct course of action." },
          factionImpact: { type: Type.STRING, description: "Explicit narrative/numeric consequence on factions." },
          worldImpact: { type: Type.STRING, description: "Impact on structural world state metrics." },
          npcImpact: { type: Type.STRING, description: "Impact on trust and anger metrics of current NPC." },
        },
      },
    },
  },
};

export async function generateStoryBranch(params: StoryEngineParams): Promise<StoryResponse> {
  const isChoiceBased = !!params.choiceText;
  
  const userPrompt = isChoiceBased 
    ? `
      Action context: The player named ${params.playerName} chose to: "${params.choiceText}"
      
      Current Environment State:
      - World Name: ${params.worldName}
      - World Genre: ${params.genre}
      - World Tone: ${params.tone}
      - Current Weather: ${params.weather}
      - Current Economy: ${params.economy}
      - Current Politics: ${params.politics}
      - Crime Index: ${params.crimeState}/100

      Active Character Context:
      - NPC Name: ${params.npcName}
      - NPC Occupation: ${params.npcOccupation}
      - NPC Traits: ${params.npcTraits.join(", ")}
      - NPC Trust Level: ${params.npcTrust}/100
      - NPC Anger Level: ${params.npcAnger}/100

      Please advance the interactive narrative based directly on the choice made. Update world and active NPC state parameters dynamically to reflect the concrete outcomes of the choice.
    `
    : `
      Create an initial Chapter 1 for a new interactive story world.
      - Player Name: ${params.playerName}
      - World Genre: ${params.genre}
      - World Tone: ${params.tone}
      - NPC Name: ${params.npcName}
      - NPC Occupation: ${params.npcOccupation}
      - NPC Traits: ${params.npcTraits.join(", ")}

      Construct the starter narrative, world parameters, and active NPC profile indicators.
    `;

  const systemInstruction = `
    You are the LUCID AI RPG Orchestrator. You generate highly immersive, consequence-driven stories where player agency dictates the fate of nations, worlds, and characters.
    You must always adhere strictly to the JSON schema, updating metrics in logical proportion to the actions chosen. Avoid generic storytelling. Make dialogue sharp, atmospheric, and character-driven.
  `;

  const response = await aiClient.models.generateContent({
    model: "gemini-3.5-flash",
    contents: userPrompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: storyResponseSchema,
    },
  });

  if (!response.text) {
    throw new Error("LUCID AI Engine returned an empty narrative response.");
  }

  return JSON.parse(response.text) as StoryResponse;
}

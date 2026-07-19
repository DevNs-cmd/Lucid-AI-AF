import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { aiClient } from "../config/gemini";
import { Type, Schema } from "@google/genai";

const prisma = new PrismaClient();

interface ChatMessageExchange {
  sender: "player" | "npc";
  text: string;
}

const npcChatResponseSchema: Schema = {
  type: Type.OBJECT,
  required: ["npcDialogueResponse", "trustAdjustment", "angerAdjustment", "relationshipSummary"],
  properties: {
    npcDialogueResponse: {
      type: Type.STRING,
      description: "In-character spoken response representing the NPC's vocal delivery and physical action tags in brackets.",
    },
    trustAdjustment: {
      type: Type.INTEGER,
      description: "Positive or negative change to the NPC's trust metrics (e.g. +5, -12)",
    },
    angerAdjustment: {
      type: Type.INTEGER,
      description: "Positive or negative change to the NPC's anger metrics (e.g. +10, -5)",
    },
    relationshipSummary: {
      type: Type.STRING,
      description: "Episodic summary of the chat development for cognitive memory vector streams.",
    },
  },
};

/**
 * NPC Cognitive Dialogue Chat Controller
 * Incorporates active character metrics, world context, and historical conversation logs.
 */
export async function converseWithNPC(req: Request, res: Response) {
  try {
    const { npcId, worldId, playerMessage, dialogueHistory } = req.body;

    // Guard against invalid payload structures
    if (!npcId || !worldId || !playerMessage) {
       res.status(400).json({ error: "Missing required properties: npcId, worldId, and playerMessage are required." });
       return;
    }

    // Resolve structural models from persistence layer
    const npc = await prisma.nPC.findUnique({
      where: { id: npcId },
    });

    const world = await prisma.world.findUnique({
      where: { id: worldId },
    });

    if (!npc || !world) {
       res.status(404).json({ error: "Could not locate matching target world or NPC profile elements." });
       return;
    }

    // Format chat logs safely to keep track of history context
    const historyLogs = (dialogueHistory || []) as ChatMessageExchange[];
    const formattedHistory = historyLogs
      .map((entry) => `${entry.sender.toUpperCase()}: "${entry.text}"`)
      .join("\n");

    const systemPrompt = `
      You are the dynamic character AI dialogue brain for the NPC named "${npc.name}".
      
      Personality / Professional Background:
      - Occupation: ${npc.occupation}
      - Core Traits: ${npc.traits.join(", ")}
      
      Active Relationship Indicators:
      - Trust Score: ${npc.trustLevel}/100
      - Anger Level: ${npc.angerLevel}/100
      
      Environmental Reality:
      - World Environment: ${world.name}
      - Active Weather State: ${world.weather}
      - Security / Crime Level: ${world.crimeState}/100

      Conversational History Context:
      ${formattedHistory || "No prior dialogue exchanges."}

      Player's Direct Message:
      "${playerMessage}"

      Based on this direct exchange and the NPC's emotional ratios, generate a natural, in-character spoken dialogue response.
      Incorporate physical micro-actions, visual behaviors, or emotional expressions inside bracket tags (e.g., "[Narrows gaze suspicously]", "[Grins faintly while cleaning her weapon]").
      Mutate trust level and anger levels logically depending on the player message's semantic intent (e.g. threats, charm, bargains).
    `;

    // Dispatch to Gemini model with the strict structural response schema
    const modelResponse = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
      config: {
        systemInstruction: "You are the cognitive system processor inside the NPC's mind. Do not reply as a helpful AI assistant. Speak and update relationships strictly inside character limits.",
        responseMimeType: "application/json",
        responseSchema: npcChatResponseSchema,
      },
    });

    if (!modelResponse.text) {
      throw new Error("NPC cognitive model output was empty.");
    }

    const aiParsedOutput = JSON.parse(modelResponse.text);

    // Persist mutated relationships values securely to postgresql database
    const calculatedTrust = Math.min(100, Math.max(0, npc.trustLevel + (aiParsedOutput.trustAdjustment || 0)));
    const calculatedAnger = Math.min(100, Math.max(0, npc.angerLevel + (aiParsedOutput.angerAdjustment || 0)));

    const updatedNpc = await prisma.nPC.update({
      where: { id: npc.id },
      data: {
        trustLevel: calculatedTrust,
        angerLevel: calculatedAnger,
      },
    });

    res.status(200).json({
      success: true,
      npcDialogue: aiParsedOutput.npcDialogueResponse,
      trustLevel: updatedNpc.trustLevel,
      angerLevel: updatedNpc.angerLevel,
      relationshipSummary: aiParsedOutput.relationshipSummary,
      updatedNPC: updatedNpc,
    });
  } catch (error: any) {
    console.error("NPC Dialog Controller Failure:", error);
    res.status(500).json({
      error: "An error occurred inside the NPC dialogue generation subsystem.",
      details: error.message,
    });
  }
}

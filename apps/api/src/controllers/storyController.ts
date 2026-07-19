import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateStoryBranch } from "../config/gemini";

const prisma = new PrismaClient();

/**
 * Story Orchestrator Controller
 * Manages the transition pipeline of story events: reading states, calling Gemini, mutating the database, and pushing results.
 */
export async function advanceStory(req: Request, res: Response) {
  try {
    const { userId, worldId, npcId, choiceText, genre, tone } = req.body;

    // Validate inputs
    if (!userId || !worldId || !npcId) {
       res.status(400).json({ error: "Missing required properties: userId, worldId, and npcId are necessary." });
       return;
    }

    // Retrieve active context models from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const world = await prisma.world.findUnique({
      where: { id: worldId },
    });

    const npc = await prisma.nPC.findUnique({
      where: { id: npcId },
    });

    if (!user || !world || !npc) {
       res.status(404).json({ error: "One or more requested entity profiles (User, World, or NPC) could not be resolved." });
       return;
    }

    // Call live Gemini engine to obtain structured output metrics
    const aiOutput = await generateStoryBranch({
      playerName: user.name,
      genre: genre || "Cyberpunk",
      tone: tone || "Gritty",
      choiceText,
      worldName: world.name,
      weather: world.weather,
      economy: world.economy,
      politics: world.politics,
      crimeState: world.crimeState,
      npcName: npc.name,
      npcOccupation: npc.occupation,
      npcTraits: npc.traits,
      npcTrust: npc.trustLevel,
      npcAnger: npc.angerLevel,
    });

    // Execute state persistence inside an ACID atomic database transaction
    const transactionResult = await prisma.$transaction(async (tx) => {
      // 1. Update the world metrics
      const updatedWorld = await tx.world.update({
        where: { id: world.id },
        data: {
          weather: aiOutput.updatedWorld.weather,
          economy: aiOutput.updatedWorld.economy,
          politics: aiOutput.updatedWorld.politics,
          crimeState: Math.min(100, Math.max(0, aiOutput.updatedWorld.crimeState)),
        },
      });

      // 2. Update the character emotional metrics
      const updatedNpc = await tx.nPC.update({
        where: { id: npc.id },
        data: {
          trustLevel: Math.min(100, Math.max(0, aiOutput.updatedNPC.trustLevel)),
          angerLevel: Math.min(100, Math.max(0, aiOutput.updatedNPC.angerLevel)),
        },
      });

      // 3. Append to the story historical timeline logs
      const newStoryNode = await tx.storyNode.create({
        data: {
          worldId: world.id,
          userId: user.id,
          chapterTitle: aiOutput.chapterTitle,
          dynamicSummary: aiOutput.narrativeText.substring(0, 300) + "...",
          choiceHistory: choiceText ? [choiceText] : [],
        },
      });

      return {
        world: updatedWorld,
        npc: updatedNpc,
        storyNode: newStoryNode,
      };
    });

    // Send complete response output back to the consumer client
    res.status(200).json({
      success: true,
      narrativeText: aiOutput.narrativeText,
      chapterTitle: aiOutput.chapterTitle,
      choices: aiOutput.choices,
      world: transactionResult.world,
      npc: transactionResult.npc,
      storyNodeId: transactionResult.storyNode.id,
    });
  } catch (error: any) {
    console.error("Story Progression Error inside Controller:", error);
    res.status(500).json({
      error: "An internal orchestration failure occurred while progressing the story node.",
      details: error.message,
    });
  }
}

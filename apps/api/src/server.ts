import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { advanceStory } from "./controllers/storyController";
import { converseWithNPC } from "./controllers/npcController";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Prisma Client
const prisma = new PrismaClient();

// ==========================================
// ENVIRONMENT VARIABLE VALIDATION
// ==========================================
const requiredEnvVariables = ["DATABASE_URL", "GEMINI_API_KEY"];
const missingVariables = requiredEnvVariables.filter((envVar) => !process.env[envVar]);

if (missingVariables.length > 0) {
  console.error("CRITICAL CONFIGURATION ERROR: The following necessary environment variables are missing:");
  missingVariables.forEach((envVar) => console.error(`  - ${envVar}`));
  process.exit(1);
}

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors({
  origin: "*", // Adjust origins in strict production environments
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// ==========================================
// HEALTH CHECKS & DATABASE SANITY VERIFICATION
// ==========================================
app.get("/api/health", async (req, res) => {
  try {
    // Attempt database network handshake ping query
    await prisma.$executeRaw`SELECT 1;`;
    
    res.status(200).json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error: any) {
    console.error("Database connection check failed during health diagnostic request:", error);
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      timestamp: new Date().toISOString(),
      details: error.message,
    });
  }
});

// ==========================================
// ROUTE DEFINITIONS
// ==========================================

// Story loop orchestrator routes
app.post("/api/story/advance", advanceStory);

// NPC cognitive dialog chat routes
app.post("/api/npc/converse", converseWithNPC);

// Catch-all route for missing API entries
app.use((req, res) => {
  res.status(404).json({ error: "API Endpoint not found." });
});

// ==========================================
// BOOTSTRAP INITIALIZATION
// ==========================================
async function startAppServer() {
  try {
    console.log("Verifying connection to PostgreSQL cluster database via Prisma...");
    await prisma.$connect();
    console.log("Database connectivity validated successfully.");

    app.listen(PORT, () => {
      console.log(`LUCID AI production backend is actively running on port ${PORT}`);
    });
  } catch (err: any) {
    console.error("Fatal failure on starting application server:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startAppServer();

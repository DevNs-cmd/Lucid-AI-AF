"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedText = embedText;
const env_1 = require("../config/env");
/**
 * Embeddings — used to store user actions / memories / story context
 * in Qdrant (Vector DB) for later retrieval by Memory AI / Recommendation AI.
 */
async function embedText(req) {
    const provider = env_1.env.EMBEDDING_AI_PROVIDER;
    switch (provider) {
        case "openai":
            return callOpenAIEmbedding(req);
        case "jina":
            return callJinaEmbedding(req);
        default:
            throw new Error(`Unknown EMBEDDING_AI_PROVIDER: ${provider}`);
    }
}
async function callOpenAIEmbedding(req) {
    const apiKey = (0, env_1.requireKey)(env_1.env.OPENAI_API_KEY, "OPENAI_API_KEY");
    const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "text-embedding-3-small",
            input: req.text,
        }),
    });
    if (!res.ok)
        throw new Error(`OpenAI embedding failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    const vector = data.data?.[0]?.embedding ?? [];
    return { vector, provider: "openai", dimensions: vector.length };
}
async function callJinaEmbedding(req) {
    const apiKey = (0, env_1.requireKey)(env_1.env.JINA_API_KEY, "JINA_API_KEY");
    const res = await fetch("https://api.jina.ai/v1/embeddings", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "jina-embeddings-v3",
            input: [req.text],
        }),
    });
    if (!res.ok)
        throw new Error(`Jina embedding failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    const vector = data.data?.[0]?.embedding ?? [];
    return { vector, provider: "jina", dimensions: vector.length };
}

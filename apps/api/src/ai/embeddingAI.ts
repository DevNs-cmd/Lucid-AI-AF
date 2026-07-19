import { env, requireKey } from "../config/env";
import { EmbeddingRequest, EmbeddingResult } from "./types";

/**
 * Embeddings — used to store user actions / memories / story context
 * in Qdrant (Vector DB) for later retrieval by Memory AI / Recommendation AI.
 */
export async function embedText(req: EmbeddingRequest): Promise<EmbeddingResult> {
  const provider = env.EMBEDDING_AI_PROVIDER;

  switch (provider) {
    case "openai":
      return callOpenAIEmbedding(req);
    case "jina":
      return callJinaEmbedding(req);
    default:
      throw new Error(`Unknown EMBEDDING_AI_PROVIDER: ${provider}`);
  }
}

async function callOpenAIEmbedding(req: EmbeddingRequest): Promise<EmbeddingResult> {
  const apiKey = requireKey(env.OPENAI_API_KEY, "OPENAI_API_KEY");
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
  if (!res.ok) throw new Error(`OpenAI embedding failed: ${res.status} ${await res.text()}`);
  const data: any = await res.json();
  const vector: number[] = data.data?.[0]?.embedding ?? [];
  return { vector, provider: "openai", dimensions: vector.length };
}

async function callJinaEmbedding(req: EmbeddingRequest): Promise<EmbeddingResult> {
  const apiKey = requireKey(env.JINA_API_KEY, "JINA_API_KEY");
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
  if (!res.ok) throw new Error(`Jina embedding failed: ${res.status} ${await res.text()}`);
  const data: any = await res.json();
  const vector: number[] = data.data?.[0]?.embedding ?? [];
  return { vector, provider: "jina", dimensions: vector.length };
}

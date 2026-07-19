import { env, requireKey } from "../config/env";
import { ImageGenRequest, ImageGenResult } from "./types";

/**
 * Image AI — character portraits, cities, weapons, magical scenes.
 * Provider is swappable via IMAGE_AI_PROVIDER in .env.
 */
export async function generateImage(req: ImageGenRequest): Promise<ImageGenResult> {
  const provider = env.IMAGE_AI_PROVIDER;

  switch (provider) {
    case "openai":
      return { url: await callOpenAIImage(req), provider };
    case "stability":
      return { url: await callStability(req), provider };
    case "flux":
      return { url: await callFlux(req), provider };
    default:
      throw new Error(`Unknown IMAGE_AI_PROVIDER: ${provider}`);
  }
}

async function callOpenAIImage(req: ImageGenRequest): Promise<string> {
  const apiKey = requireKey(env.OPENAI_API_KEY, "OPENAI_API_KEY");
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: req.style ? `${req.prompt}, style: ${req.style}` : req.prompt,
      size: sizeFor(req),
    }),
  });
  if (!res.ok) throw new Error(`OpenAI image gen failed: ${res.status} ${await res.text()}`);
  const data: any = await res.json();
  return data.data?.[0]?.url ?? "";
}

async function callStability(req: ImageGenRequest): Promise<string> {
  const apiKey = requireKey(env.STABILITY_API_KEY, "STABILITY_API_KEY");
  const res = await fetch("https://api.stability.ai/v2beta/stable-image/generate/sd3", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      accept: "application/json",
    },
    body: toFormData({ prompt: req.prompt, style_preset: req.style }),
  });
  if (!res.ok) throw new Error(`Stability image gen failed: ${res.status} ${await res.text()}`);
  const data: any = await res.json();
  return data.image ?? ""; // base64 or URL depending on response mode configured
}

async function callFlux(req: ImageGenRequest): Promise<string> {
  const apiKey = requireKey(env.FLUX_API_KEY, "FLUX_API_KEY");
  const res = await fetch("https://api.bfl.ai/v1/flux-pro-1.1", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-key": apiKey,
    },
    body: JSON.stringify({
      prompt: req.prompt,
      width: req.width ?? 1024,
      height: req.height ?? 1024,
    }),
  });
  if (!res.ok) throw new Error(`FLUX image gen failed: ${res.status} ${await res.text()}`);
  const data: any = await res.json();
  return data.result?.sample ?? "";
}

function sizeFor(req: ImageGenRequest): string {
  const w = req.width ?? 1024;
  const h = req.height ?? 1024;
  return `${w}x${h}`;
}

function toFormData(fields: Record<string, string | undefined>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) {
    if (v) fd.append(k, v);
  }
  return fd;
}

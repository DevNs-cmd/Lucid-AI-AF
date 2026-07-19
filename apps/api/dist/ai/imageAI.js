"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImage = generateImage;
const env_1 = require("../config/env");
/**
 * Image AI — character portraits, cities, weapons, magical scenes.
 * Provider is swappable via IMAGE_AI_PROVIDER in .env.
 */
async function generateImage(req) {
    const provider = env_1.env.IMAGE_AI_PROVIDER;
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
async function callOpenAIImage(req) {
    const apiKey = (0, env_1.requireKey)(env_1.env.OPENAI_API_KEY, "OPENAI_API_KEY");
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
    if (!res.ok)
        throw new Error(`OpenAI image gen failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.data?.[0]?.url ?? "";
}
async function callStability(req) {
    const apiKey = (0, env_1.requireKey)(env_1.env.STABILITY_API_KEY, "STABILITY_API_KEY");
    const res = await fetch("https://api.stability.ai/v2beta/stable-image/generate/sd3", {
        method: "POST",
        headers: {
            authorization: `Bearer ${apiKey}`,
            accept: "application/json",
        },
        body: toFormData({ prompt: req.prompt, style_preset: req.style }),
    });
    if (!res.ok)
        throw new Error(`Stability image gen failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.image ?? ""; // base64 or URL depending on response mode configured
}
async function callFlux(req) {
    const apiKey = (0, env_1.requireKey)(env_1.env.FLUX_API_KEY, "FLUX_API_KEY");
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
    if (!res.ok)
        throw new Error(`FLUX image gen failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.result?.sample ?? "";
}
function sizeFor(req) {
    const w = req.width ?? 1024;
    const h = req.height ?? 1024;
    return `${w}x${h}`;
}
function toFormData(fields) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(fields)) {
        if (v)
            fd.append(k, v);
    }
    return fd;
}

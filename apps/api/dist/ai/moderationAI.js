"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderateText = moderateText;
const env_1 = require("../config/env");
/**
 * Moderation — checks user-generated prompts/text before they're sent
 * to story/image/voice generation, and can also be run on AI output.
 * Falls back to a lightweight custom filter if no OpenAI key is set yet,
 * so the rest of the pipeline can still be developed/tested.
 */
async function moderateText(req) {
    if (!env_1.env.OPENAI_API_KEY) {
        return customFallbackFilter(req.text);
    }
    const res = await fetch("https://api.openai.com/v1/moderations", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${(0, env_1.requireKey)(env_1.env.OPENAI_API_KEY, "OPENAI_API_KEY")}`,
        },
        body: JSON.stringify({
            model: env_1.env.OPENAI_MODERATION_MODEL,
            input: req.text,
        }),
    });
    if (!res.ok)
        throw new Error(`Moderation check failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    const result = data.results?.[0];
    return {
        flagged: result?.flagged ?? false,
        categories: result?.categories ?? {},
    };
}
// Basic keyword-based placeholder until the real API key is wired in.
// NOT a substitute for the real moderation model — dev/testing only.
const BLOCKED_TERMS = ["hate speech example", "explicit content example"];
function customFallbackFilter(text) {
    const lower = text.toLowerCase();
    const hit = BLOCKED_TERMS.some((term) => lower.includes(term));
    return { flagged: hit, categories: { fallback_filter: hit } };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStory = generateStory;
const env_1 = require("../config/env");
const promptCache_1 = require("../cache/promptCache");
/**
 * Story AI — generates story text, dialogue, twists, choices.
 * Provider is swappable via STORY_AI_PROVIDER in .env.
 * All three branches are wired to real endpoints; they'll work as soon
 * as the matching *_API_KEY is filled in.
 */
async function generateStory(req) {
    const provider = env_1.env.STORY_AI_PROVIDER;
    const model = modelForProvider(provider);
    const cached = await promptCache_1.promptCache.get(req.prompt, model);
    if (cached)
        return { text: cached, provider, model };
    let text;
    switch (provider) {
        case "anthropic":
            text = await callAnthropic(req, model);
            break;
        case "openai":
            text = await callOpenAI(req, model);
            break;
        case "google":
            text = await callGoogle(req, model);
            break;
        default:
            throw new Error(`Unknown STORY_AI_PROVIDER: ${provider}`);
    }
    await promptCache_1.promptCache.set(req.prompt, model, text);
    return { text, provider, model };
}
function modelForProvider(provider) {
    switch (provider) {
        case "anthropic":
            return "claude-sonnet-4-6";
        case "openai":
            return "gpt-5";
        case "google":
            return "gemini-2.5-pro";
        default:
            return "unknown";
    }
}
async function callAnthropic(req, model) {
    const apiKey = (0, env_1.requireKey)(env_1.env.ANTHROPIC_API_KEY, "ANTHROPIC_API_KEY");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model,
            max_tokens: req.maxTokens ?? 1024,
            messages: [
                {
                    role: "user",
                    content: req.characterContext ? `${req.characterContext}\n\n${req.prompt}` : req.prompt,
                },
            ],
        }),
    });
    if (!res.ok)
        throw new Error(`Anthropic story gen failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.content?.[0]?.text ?? "";
}
async function callOpenAI(req, model) {
    const apiKey = (0, env_1.requireKey)(env_1.env.OPENAI_API_KEY, "OPENAI_API_KEY");
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            max_tokens: req.maxTokens ?? 1024,
            messages: [
                ...(req.characterContext ? [{ role: "system", content: req.characterContext }] : []),
                { role: "user", content: req.prompt },
            ],
        }),
    });
    if (!res.ok)
        throw new Error(`OpenAI story gen failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
}
async function callGoogle(req, model) {
    const apiKey = (0, env_1.requireKey)(env_1.env.GOOGLE_AI_API_KEY, "GOOGLE_AI_API_KEY");
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: req.characterContext ? `${req.characterContext}\n\n${req.prompt}` : req.prompt }],
                },
            ],
        }),
    });
    if (!res.ok)
        throw new Error(`Google story gen failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

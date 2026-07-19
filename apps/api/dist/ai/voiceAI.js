"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVoice = generateVoice;
exports.transcribeAudio = transcribeAudio;
const env_1 = require("../config/env");
/**
 * Voice AI — NPC text-to-speech (ElevenLabs/Cartesia) and
 * speech-to-text for voice input (Whisper).
 */
async function generateVoice(req) {
    const provider = env_1.env.VOICE_AI_PROVIDER;
    switch (provider) {
        case "elevenlabs":
            return { audioUrl: await callElevenLabs(req), provider };
        case "cartesia":
            return { audioUrl: await callCartesia(req), provider };
        default:
            throw new Error(`Unknown VOICE_AI_PROVIDER for TTS: ${provider}`);
    }
}
async function transcribeAudio(req) {
    const apiKey = (0, env_1.requireKey)(env_1.env.OPENAI_API_KEY, "OPENAI_API_KEY");
    const audioRes = await fetch(req.audioUrl);
    const audioBlob = await audioRes.blob();
    const form = new FormData();
    form.append("file", audioBlob, "audio.webm");
    form.append("model", "whisper-1");
    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: { authorization: `Bearer ${apiKey}` },
        body: form,
    });
    if (!res.ok)
        throw new Error(`Whisper transcription failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return { text: data.text ?? "" };
}
async function callElevenLabs(req) {
    const apiKey = (0, env_1.requireKey)(env_1.env.ELEVENLABS_API_KEY, "ELEVENLABS_API_KEY");
    const voiceId = req.voiceId || "21m00Tcm4TlvDq8ikWAM"; // default ElevenLabs voice
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "xi-api-key": apiKey,
        },
        body: JSON.stringify({
            text: req.text,
            model_id: "eleven_multilingual_v2",
        }),
    });
    if (!res.ok)
        throw new Error(`ElevenLabs TTS failed: ${res.status} ${await res.text()}`);
    // Response is raw audio bytes — caller/storage layer is responsible for
    // uploading to Cloudflare R2 / S3 and returning a public URL.
    const buffer = await res.arrayBuffer();
    return `data:audio/mpeg;base64,${Buffer.from(buffer).toString("base64")}`;
}
async function callCartesia(req) {
    const apiKey = (0, env_1.requireKey)(env_1.env.CARTESIA_API_KEY, "CARTESIA_API_KEY");
    const res = await fetch("https://api.cartesia.ai/tts/bytes", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-api-key": apiKey,
            "cartesia-version": "2024-06-10",
        },
        body: JSON.stringify({
            transcript: req.text,
            voice: { mode: "id", id: req.voiceId || "default" },
            output_format: { container: "mp3", encoding: "mp3", sample_rate: 44100 },
        }),
    });
    if (!res.ok)
        throw new Error(`Cartesia TTS failed: ${res.status} ${await res.text()}`);
    const buffer = await res.arrayBuffer();
    return `data:audio/mpeg;base64,${Buffer.from(buffer).toString("base64")}`;
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStripe = getStripe;
const stripe_1 = __importDefault(require("stripe"));
const env_1 = require("../config/env");
let _stripe = null;
/** Lazily-created Stripe client — only errors when actually used, not at import time. */
function getStripe() {
    if (!_stripe) {
        const apiKey = (0, env_1.requireKey)(env_1.env.STRIPE_SECRET_KEY, "STRIPE_SECRET_KEY");
        _stripe = new stripe_1.default(apiKey, { apiVersion: "2024-04-10" });
    }
    return _stripe;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLANS = void 0;
const env_1 = require("../config/env");
/** Mirrors the Free / Pro plans from the revenue model doc. */
exports.PLANS = {
    free: {
        id: "free",
        name: "Free",
        priceId: null,
        features: [
            "10 chapters/day",
            "3 worlds",
            "Limited artwork",
            "Standard AI",
        ],
    },
    pro: {
        id: "pro",
        name: "Pro",
        priceIdMonthly: env_1.env.STRIPE_PRICE_ID_PRO_MONTHLY,
        priceIdYearly: env_1.env.STRIPE_PRICE_ID_PRO_YEARLY,
        features: [
            "Unlimited stories",
            "Premium AI models",
            "Voice conversations",
            "Cinematic scenes",
            "Long-term memory",
            "Early access to new worlds",
        ],
    },
};

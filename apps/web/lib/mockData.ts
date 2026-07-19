export * from "./mockPlayer";
import type {
  ManagedUser,
  World,
  ActivityLog,
  Report,
  AnalyticsPoint,
  StatSummary,
  AppSettings,
} from "@/types";

const names = [
  "Elowen", "Thorne", "Isolde", "Gideon", "Maren", "Corvin", "Sable", "Rowan",
  "Vesper", "Lyric", "Dax", "Nyra", "Kestrel", "Orin", "Wren", "Sylas",
];

export const mockUsers: ManagedUser[] = Array.from({ length: 24 }, (_, i) => ({
  id: `usr_${1000 + i}`,
  username: `${names[i % names.length]}${i}`,
  email: `${names[i % names.length].toLowerCase()}${i}@lucid.ai`,
  status: i % 11 === 0 ? "banned" : i % 7 === 0 ? "suspended" : "active",
  role: i === 0 ? "admin" : i % 5 === 0 ? "moderator" : "user",
  worldsOwned: (i * 3) % 9,
  joinedAt: `2025-${String((i % 12) + 1).padStart(2, "0")}-1${i % 9}`,
  lastActive: `2026-07-${String((i % 27) + 1).padStart(2, "0")}`,
}));

const biomes: World["biome"][] = [
  "Ashen Wastes", "Verdant Hollow", "Frostpeak", "Obsidian Reach", "Sunken Isles",
];

export const mockWorlds: World[] = Array.from({ length: 18 }, (_, i) => {
  const biome = biomes[i % biomes.length];
  const biomeImageMap: Record<string, string> = {
    "Ashen Wastes": "/gallery/ashen_wastes.png",
    "Verdant Hollow": "/gallery/verdant_hollow.png",
    "Frostpeak": "/gallery/frostpeak.png",
    "Obsidian Reach": "/gallery/obsidian_reach.png",
    "Sunken Isles": "/gallery/sunken_isles.png",
  };

  return {
    id: `wld_${2000 + i}`,
    name: `${biome.split(" ")[0]} Realm ${i + 1}`,
    owner: mockUsers[i % mockUsers.length].username,
    status: i % 6 === 0 ? "archived" : i % 3 === 0 ? "draft" : "live",
    population: (i * 47) % 500,
    createdAt: `2025-${String((i % 12) + 1).padStart(2, "0")}-0${(i % 9) + 1}`,
    biome,
    imageUrl: biomeImageMap[biome],
  };
});

const actions = [
  "Logged in", "Created world", "Banned user", "Updated settings",
  "Deleted report", "Promoted moderator", "Flagged content", "Reset password",
];

export const mockLogs: ActivityLog[] = Array.from({ length: 40 }, (_, i) => ({
  id: `log_${3000 + i}`,
  actor: mockUsers[i % mockUsers.length].username,
  action: actions[i % actions.length],
  target: i % 2 === 0 ? mockWorlds[i % mockWorlds.length].name : mockUsers[(i + 1) % mockUsers.length].username,
  severity: i % 13 === 0 ? "critical" : i % 4 === 0 ? "warning" : "info",
  timestamp: `2026-07-${String((i % 12) + 1).padStart(2, "0")}T${String((i % 23)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}:00Z`,
}));

const reasons = [
  "Harassment", "Exploiting bug", "Inappropriate world content", "Spam", "Impersonation",
];

export const mockReports: Report[] = Array.from({ length: 12 }, (_, i) => ({
  id: `rpt_${4000 + i}`,
  reporter: mockUsers[i % mockUsers.length].username,
  target: mockUsers[(i + 5) % mockUsers.length].username,
  reason: reasons[i % reasons.length],
  status: i % 4 === 0 ? "resolved" : i % 3 === 0 ? "reviewing" : i % 5 === 0 ? "dismissed" : "open",
  createdAt: `2026-07-${String((i % 12) + 1).padStart(2, "0")}`,
}));

export const mockAnalytics: AnalyticsPoint[] = [
  "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
].map((label, i) => ({
  label,
  users: 200 + i * 34 + (i % 2 === 0 ? 40 : -10),
  worlds: 40 + i * 6,
  sessions: 600 + i * 55 + (i % 3 === 0 ? 80 : 0),
}));

export const mockStats: StatSummary = {
  totalUsers: mockUsers.length * 187,
  activeWorlds: mockWorlds.filter((w) => w.status === "live").length * 42,
  dailySessions: 4821,
  openReports: mockReports.filter((r) => r.status === "open").length,
  userDelta: 8.4,
  worldDelta: 3.1,
  sessionDelta: -2.6,
  reportDelta: 12.0,
};

export const mockSettings: AppSettings = {
  siteName: "LUCID AI",
  maintenanceMode: false,
  registrationOpen: true,
  maxWorldsPerUser: 5,
  autoModeration: true,
  supportEmail: "support@lucid.ai",
};

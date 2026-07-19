export * from "./player";
export type Role = "admin" | "moderator" | "user";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type UserStatus = "active" | "suspended" | "banned";

export interface ManagedUser {
  id: string;
  username: string;
  email: string;
  status: UserStatus;
  role: Role;
  worldsOwned: number;
  joinedAt: string;
  lastActive: string;
}

export type WorldStatus = "live" | "draft" | "archived";

export interface World {
  id: string;
  name: string;
  owner: string;
  status: WorldStatus;
  population: number;
  createdAt: string;
  biome: "Ashen Wastes" | "Verdant Hollow" | "Frostpeak" | "Obsidian Reach" | "Sunken Isles";
  imageUrl?: string;
}

export type LogSeverity = "info" | "warning" | "critical";

export interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  severity: LogSeverity;
  timestamp: string;
}

export interface Report {
  id: string;
  reporter: string;
  target: string;
  reason: string;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  createdAt: string;
}

export interface AnalyticsPoint {
  label: string;
  users: number;
  worlds: number;
  sessions: number;
}

export interface StatSummary {
  totalUsers: number;
  activeWorlds: number;
  dailySessions: number;
  openReports: number;
  userDelta: number;
  worldDelta: number;
  sessionDelta: number;
  reportDelta: number;
}

export interface AppSettings {
  siteName: string;
  maintenanceMode: boolean;
  registrationOpen: boolean;
  maxWorldsPerUser: number;
  autoModeration: boolean;
  supportEmail: string;
}

import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Prompts table - stores all 50 video marketing prompts
 */
export const prompts = mysqlTable("prompts", {
  id: int("id").autoincrement().primaryKey(),
  promptNumber: int("promptNumber").notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  scenarioType: varchar("scenarioType", { length: 100 }).notNull(),
  industrySector: varchar("industrySector", { length: 100 }).notNull(),
  visualStyle: varchar("visualStyle", { length: 100 }).notNull(),
  durationSeconds: int("durationSeconds").notNull(),
  originalDuration: int("originalDuration").notNull(),
  promptJson: text("promptJson").notNull(), // Stores the full JSON prompt (MEDIUMTEXT)
  qualityScore: int("qualityScore"), // Coherence score from 0-10 (null if not yet evaluated)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Prompt = typeof prompts.$inferSelect;
export type InsertPrompt = typeof prompts.$inferInsert;

/**
 * Favorites table - allows users to save their favorite prompts
 */
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  promptId: int("promptId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;
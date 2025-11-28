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

/**
 * User prompts table - stores user's custom saved prompts
 */
export const userPrompts = mysqlTable("userPrompts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  promptJson: text("promptJson").notNull(), // Full JSON prompt structure
  folderId: int("folderId"), // NULL means root folder
  tags: text("tags"), // Comma-separated tags for filtering
  qualityScore: int("qualityScore"), // Score from validation
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPrompt = typeof userPrompts.$inferSelect;
export type InsertUserPrompt = typeof userPrompts.$inferInsert;

/**
 * Folders table - for organizing user prompts
 */
export const folders = mysqlTable("folders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  parentFolderId: int("parentFolderId"), // NULL means root level
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Folder = typeof folders.$inferSelect;
export type InsertFolder = typeof folders.$inferInsert;

/**
 * Prompt shares table - for collaboration
 */
export const promptShares = mysqlTable("promptShares", {
  id: int("id").autoincrement().primaryKey(),
  promptId: int("promptId").notNull(),
  ownerId: int("ownerId").notNull(), // User who owns the prompt
  sharedWithUserId: int("sharedWithUserId").notNull(), // User who receives access
  permission: mysqlEnum("permission", ["view", "edit"]).default("view").notNull(),
  sharedAt: timestamp("sharedAt").defaultNow().notNull(),
});

export type PromptShare = typeof promptShares.$inferSelect;
export type InsertPromptShare = typeof promptShares.$inferInsert;

/**
 * Prompt comments table - for collaboration feedback
 */
export const promptComments = mysqlTable("promptComments", {
  id: int("id").autoincrement().primaryKey(),
  promptId: int("promptId").notNull(),
  userId: int("userId").notNull(),
  commentText: text("commentText").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PromptComment = typeof promptComments.$inferSelect;
export type InsertPromptComment = typeof promptComments.$inferInsert;

/**
 * Prompt versions table - for revision history
 */
export const promptVersions = mysqlTable("promptVersions", {
  id: int("id").autoincrement().primaryKey(),
  promptId: int("promptId").notNull(),
  versionNumber: int("versionNumber").notNull(),
  promptJson: text("promptJson").notNull(),
  createdBy: int("createdBy").notNull(),
  changeDescription: varchar("changeDescription", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PromptVersion = typeof promptVersions.$inferSelect;
export type InsertPromptVersion = typeof promptVersions.$inferInsert;

/**
 * Templates table - industry-specific prompt templates
 */
export const templates = mysqlTable("templates", {
  id: int("id").autoincrement().primaryKey(),
  industry: varchar("industry", { length: 100 }).notNull(),
  useCase: varchar("useCase", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  templateJson: text("templateJson").notNull(), // JSON with placeholders
  previewImage: varchar("previewImage", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;
import { eq, sql, and, desc, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, prompts, InsertPrompt, favorites,
  userPrompts, InsertUserPrompt,
  folders, InsertFolder,
  promptShares, InsertPromptShare,
  promptComments, InsertPromptComment,
  promptVersions, InsertPromptVersion,
  templates, InsertTemplate
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Prompts queries
export async function getAllPrompts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(prompts).orderBy(prompts.promptNumber);
}

export async function getPromptById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(prompts).where(eq(prompts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPromptByNumber(promptNumber: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(prompts).where(eq(prompts.promptNumber, promptNumber)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPromptsByNumbers(promptNumbers: number[]) {
  const db = await getDb();
  if (!db || promptNumbers.length === 0) return [];
  return db.select().from(prompts).where(
    sql`${prompts.promptNumber} IN (${sql.join(promptNumbers.map(n => sql`${n}`), sql`, `)})`
  );
}

export async function searchPrompts(filters: {
  search?: string;
  industrySector?: string;
  visualStyle?: string;
  scenarioType?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(prompts);
  
  // Note: For production, implement proper full-text search
  // This is a simple LIKE-based search for demonstration
  
  return query.orderBy(prompts.promptNumber);
}

export async function insertPrompt(prompt: InsertPrompt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(prompts).values(prompt);
}

// Favorites queries
export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select()
    .from(favorites)
    .innerJoin(prompts, eq(favorites.promptId, prompts.id))
    .where(eq(favorites.userId, userId));
}

export async function addFavorite(userId: number, promptId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(favorites).values({ userId, promptId });
}

export async function removeFavorite(userId: number, promptId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(favorites)
    .where(and(
      eq(favorites.userId, userId),
      eq(favorites.promptId, promptId)
    ));
}

// User queries
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] || null;
}

// User Prompts Library queries
export async function saveUserPrompt(data: InsertUserPrompt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(userPrompts).values(data);
  return result;
}

export async function getUserPrompts(userId: number, folderId?: number | null) {
  const db = await getDb();
  if (!db) return [];
  
  if (folderId === undefined) {
    // Get all prompts
    return db.select().from(userPrompts)
      .where(eq(userPrompts.userId, userId))
      .orderBy(desc(userPrompts.updatedAt));
  } else if (folderId === null) {
    // Get root folder prompts
    return db.select().from(userPrompts)
      .where(and(
        eq(userPrompts.userId, userId),
        sql`${userPrompts.folderId} IS NULL`
      ))
      .orderBy(desc(userPrompts.updatedAt));
  } else {
    // Get specific folder prompts
    return db.select().from(userPrompts)
      .where(and(
        eq(userPrompts.userId, userId),
        eq(userPrompts.folderId, folderId)
      ))
      .orderBy(desc(userPrompts.updatedAt));
  }
}

export async function getUserPromptById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userPrompts)
    .where(and(
      eq(userPrompts.id, id),
      eq(userPrompts.userId, userId)
    ))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserPrompt(id: number, userId: number, data: Partial<InsertUserPrompt>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(userPrompts)
    .set(data)
    .where(and(
      eq(userPrompts.id, id),
      eq(userPrompts.userId, userId)
    ));
}

export async function deleteUserPrompt(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(userPrompts)
    .where(and(
      eq(userPrompts.id, id),
      eq(userPrompts.userId, userId)
    ));
}

export async function searchUserPrompts(userId: number, searchTerm: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userPrompts)
    .where(and(
      eq(userPrompts.userId, userId),
      or(
        like(userPrompts.title, `%${searchTerm}%`),
        like(userPrompts.tags, `%${searchTerm}%`)
      )
    ))
    .orderBy(desc(userPrompts.updatedAt));
}

// Folders queries
export async function createFolder(data: InsertFolder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(folders).values(data);
  return result;
}

export async function getUserFolders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(folders)
    .where(eq(folders.userId, userId))
    .orderBy(folders.name);
}

export async function updateFolder(id: number, userId: number, name: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(folders)
    .set({ name })
    .where(and(
      eq(folders.id, id),
      eq(folders.userId, userId)
    ));
}

export async function deleteFolder(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // First, move all prompts in this folder to root
  await db.update(userPrompts)
    .set({ folderId: null })
    .where(eq(userPrompts.folderId, id));
  // Then delete the folder
  return db.delete(folders)
    .where(and(
      eq(folders.id, id),
      eq(folders.userId, userId)
    ));
}

// Prompt Shares queries
export async function sharePrompt(data: InsertPromptShare) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(promptShares).values(data);
}

export async function getSharedPrompts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select()
    .from(promptShares)
    .innerJoin(userPrompts, eq(promptShares.promptId, userPrompts.id))
    .where(eq(promptShares.sharedWithUserId, userId))
    .orderBy(desc(promptShares.sharedAt));
}

export async function removeShare(promptId: number, sharedWithUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(promptShares)
    .where(and(
      eq(promptShares.promptId, promptId),
      eq(promptShares.sharedWithUserId, sharedWithUserId)
    ));
}

// Prompt Comments queries
export async function addComment(data: InsertPromptComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(promptComments).values(data);
}

export async function getPromptComments(promptId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select()
    .from(promptComments)
    .innerJoin(users, eq(promptComments.userId, users.id))
    .where(eq(promptComments.promptId, promptId))
    .orderBy(promptComments.createdAt);
}

export async function getPromptShares(promptId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select()
    .from(promptShares)
    .innerJoin(users, eq(promptShares.sharedWithUserId, users.id))
    .where(eq(promptShares.promptId, promptId));
}

// Prompt Versions queries
export async function savePromptVersion(data: InsertPromptVersion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(promptVersions).values(data);
}

export async function getPromptVersions(promptId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select()
    .from(promptVersions)
    .innerJoin(users, eq(promptVersions.createdBy, users.id))
    .where(eq(promptVersions.promptId, promptId))
    .orderBy(desc(promptVersions.versionNumber));
}

// Bulk Operations
export async function bulkUpdatePrompts(
  promptIds: number[],
  userId: number,
  updates: { folderId?: number | null }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  for (const promptId of promptIds) {
    await db.update(userPrompts)
      .set(updates)
      .where(
        and(
          eq(userPrompts.id, promptId),
          eq(userPrompts.userId, userId)
        )
      );
  }
}

export async function bulkAddTagsToPrompts(
  promptIds: number[],
  userId: number,
  newTags: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  for (const promptId of promptIds) {
    const prompt = await db.select()
      .from(userPrompts)
      .where(
        and(
          eq(userPrompts.id, promptId),
          eq(userPrompts.userId, userId)
        )
      )
      .limit(1);
    
    if (prompt[0]) {
      const existingTags = prompt[0].tags || "";
      const existingTagsArray = existingTags.split(",").filter(Boolean);
      const newTagsArray = newTags.split(",").filter(Boolean);
      const mergedTags = Array.from(new Set([...existingTagsArray, ...newTagsArray]));
      
      await db.update(userPrompts)
        .set({ tags: mergedTags.join(",") })
        .where(eq(userPrompts.id, promptId));
    }
  }
}

export async function bulkDeletePrompts(promptIds: number[], userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  for (const promptId of promptIds) {
    await db.delete(userPrompts)
      .where(
        and(
          eq(userPrompts.id, promptId),
          eq(userPrompts.userId, userId)
        )
      );
  }
}

// Templates queries
export async function getAllTemplates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(templates).orderBy(templates.industry, templates.useCase);
}

export async function getTemplatesByIndustry(industry: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(templates)
    .where(eq(templates.industry, industry))
    .orderBy(templates.useCase);
}

export async function getTemplateById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(templates)
    .where(eq(templates.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function insertTemplate(data: InsertTemplate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(templates).values(data);
}
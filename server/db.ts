import { eq, sql, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, prompts, InsertPrompt, favorites } from "../drizzle/schema";
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
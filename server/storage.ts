import {
  users,
  investments,
  type User,
  type UpsertUser,
  type Investment,
  type InsertInvestment,
  type UpdateInvestmentData,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Investment operations
  getInvestmentsByUserId(userId: string): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestment(id: string, userId: string, data: UpdateInvestmentData): Promise<Investment>;
  deleteInvestment(id: string, userId: string): Promise<void>;
  getInvestment(id: string, userId: string): Promise<Investment | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Investment operations
  async getInvestmentsByUserId(userId: string): Promise<Investment[]> {
    return await db
      .select()
      .from(investments)
      .where(eq(investments.userId, userId))
      .orderBy(investments.createdAt);
  }

  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const [newInvestment] = await db
      .insert(investments)
      .values(investment)
      .returning();
    return newInvestment;
  }

  async updateInvestment(id: string, userId: string, data: UpdateInvestmentData): Promise<Investment> {
    const [updatedInvestment] = await db
      .update(investments)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(investments.id, id), eq(investments.userId, userId)))
      .returning();
    
    if (!updatedInvestment) {
      throw new Error('Investment not found');
    }
    
    return updatedInvestment;
  }

  async deleteInvestment(id: string, userId: string): Promise<void> {
    await db
      .delete(investments)
      .where(and(eq(investments.id, id), eq(investments.userId, userId)));
  }

  async getInvestment(id: string, userId: string): Promise<Investment | undefined> {
    const [investment] = await db
      .select()
      .from(investments)
      .where(and(eq(investments.id, id), eq(investments.userId, userId)));
    return investment;
  }
}

export const storage = new DatabaseStorage();

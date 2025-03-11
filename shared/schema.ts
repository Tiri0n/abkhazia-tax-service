import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  taxId: text("tax_id").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const taxObligations = pgTable("tax_obligations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  amount: text("amount").notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull(), // "pending", "paid", "overdue"
  category: text("category").notNull(), // "income", "property", "vehicle", etc.
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  obligationId: integer("obligation_id").references(() => taxObligations.id),
  amount: text("amount").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  method: text("method").notNull(), // "credit_card", "bank_transfer", etc.
  status: text("status").notNull(), // "processing", "completed", "failed"
  reference: text("reference").notNull(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  type: text("type").notNull(), // "tax_return", "receipt", "assessment", etc.
  fileUrl: text("file_url").notNull(),
  uploadDate: timestamp("upload_date").defaultNow().notNull(),
  year: integer("year"),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // "deadline", "payment", "assessment", etc.
  date: timestamp("date").defaultNow().notNull(),
  read: boolean("read").default(false).notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull(), // "open", "in_progress", "resolved"
  date: timestamp("date").defaultNow().notNull(),
  supportDocuments: json("support_documents").default([]),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true, 
  lastName: true,
  taxId: true,
  phone: true,
  address: true,
});

export const insertTaxObligationSchema = createInsertSchema(taxObligations).omit({ id: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true });
export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTaxObligation = z.infer<typeof insertTaxObligationSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type User = typeof users.$inferSelect;
export type TaxObligation = typeof taxObligations.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;

export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
});

export type LoginData = z.infer<typeof loginSchema>;

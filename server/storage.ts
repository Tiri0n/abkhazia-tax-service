import { users, taxObligations, payments, documents, notifications, inquiries } from "@shared/schema";
import type { 
  User, InsertUser, 
  TaxObligation, InsertTaxObligation, 
  Payment, InsertPayment, 
  Document, InsertDocument, 
  Notification, InsertNotification,
  Inquiry, InsertInquiry
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;

  // Tax obligations operations
  getTaxObligationsForUser(userId: number): Promise<TaxObligation[]>;
  getUpcomingTaxObligations(userId: number): Promise<TaxObligation[]>;
  createTaxObligation(taxObligation: InsertTaxObligation): Promise<TaxObligation>;
  updateTaxObligation(id: number, taxObligationData: Partial<TaxObligation>): Promise<TaxObligation | undefined>;

  // Payments operations
  getPaymentsForUser(userId: number): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  
  // Documents operations
  getDocumentsForUser(userId: number): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  
  // Notifications operations
  getNotificationsForUser(userId: number): Promise<Notification[]>;
  getUnreadNotificationsForUser(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  
  // Inquiries operations
  getInquiriesForUser(userId: number): Promise<Inquiry[]>;
  getInquiry(id: number): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined>;

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private taxObligations: Map<number, TaxObligation>;
  private payments: Map<number, Payment>;
  private documents: Map<number, Document>;
  private notifications: Map<number, Notification>;
  private inquiries: Map<number, Inquiry>;
  sessionStore: session.SessionStore;
  
  private userId: number;
  private taxObligationId: number;
  private paymentId: number;
  private documentId: number;
  private notificationId: number;
  private inquiryId: number;

  constructor() {
    this.users = new Map();
    this.taxObligations = new Map();
    this.payments = new Map();
    this.documents = new Map();
    this.notifications = new Map();
    this.inquiries = new Map();
    
    this.userId = 1;
    this.taxObligationId = 1;
    this.paymentId = 1;
    this.documentId = 1;
    this.notificationId = 1;
    this.inquiryId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Tax obligations operations
  async getTaxObligationsForUser(userId: number): Promise<TaxObligation[]> {
    return Array.from(this.taxObligations.values()).filter(
      (obligation) => obligation.userId === userId,
    );
  }

  async getUpcomingTaxObligations(userId: number): Promise<TaxObligation[]> {
    const now = new Date();
    return Array.from(this.taxObligations.values()).filter(
      (obligation) => obligation.userId === userId && obligation.dueDate > now && obligation.status === "pending",
    ).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  async createTaxObligation(taxObligation: InsertTaxObligation): Promise<TaxObligation> {
    const id = this.taxObligationId++;
    const obligation: TaxObligation = { ...taxObligation, id };
    this.taxObligations.set(id, obligation);
    return obligation;
  }

  async updateTaxObligation(id: number, taxObligationData: Partial<TaxObligation>): Promise<TaxObligation | undefined> {
    const obligation = this.taxObligations.get(id);
    if (!obligation) return undefined;
    
    const updatedObligation = { ...obligation, ...taxObligationData };
    this.taxObligations.set(id, updatedObligation);
    return updatedObligation;
  }

  // Payments operations
  async getPaymentsForUser(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter((payment) => payment.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = this.paymentId++;
    const newPayment: Payment = { ...payment, id };
    this.payments.set(id, newPayment);
    return newPayment;
  }

  // Documents operations
  async getDocumentsForUser(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter((document) => document.userId === userId)
      .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.documentId++;
    const newDocument: Document = { ...document, id };
    this.documents.set(id, newDocument);
    return newDocument;
  }

  // Notifications operations
  async getNotificationsForUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getUnreadNotificationsForUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((notification) => notification.userId === userId && !notification.read)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.notificationId++;
    const newNotification: Notification = { ...notification, id };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updatedNotification = { ...notification, read: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  // Inquiries operations
  async getInquiriesForUser(userId: number): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values())
      .filter((inquiry) => inquiry.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getInquiry(id: number): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.inquiryId++;
    const newInquiry: Inquiry = { ...inquiry, id };
    this.inquiries.set(id, newInquiry);
    return newInquiry;
  }

  async updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) return undefined;
    
    const updatedInquiry = { ...inquiry, status };
    this.inquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }
}

export const storage = new MemStorage();

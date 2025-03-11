import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertTaxObligationSchema, 
  insertPaymentSchema, 
  insertDocumentSchema, 
  insertNotificationSchema, 
  insertInquirySchema 
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Authentication middleware
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Tax Obligations routes
  app.get("/api/tax-obligations", isAuthenticated, async (req, res) => {
    try {
      const obligations = await storage.getTaxObligationsForUser(req.user.id);
      res.json(obligations);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve tax obligations" });
    }
  });

  app.get("/api/tax-obligations/upcoming", isAuthenticated, async (req, res) => {
    try {
      const obligations = await storage.getUpcomingTaxObligations(req.user.id);
      res.json(obligations);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve upcoming tax obligations" });
    }
  });

  app.post("/api/tax-obligations", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertTaxObligationSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const obligation = await storage.createTaxObligation(validatedData);
      res.status(201).json(obligation);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  // Payments routes
  app.get("/api/payments", isAuthenticated, async (req, res) => {
    try {
      const payments = await storage.getPaymentsForUser(req.user.id);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve payments" });
    }
  });

  app.get("/api/payments/:id", isAuthenticated, async (req, res) => {
    try {
      const payment = await storage.getPayment(Number(req.params.id));
      
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      // Check that the payment belongs to the authenticated user
      if (payment.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve payment" });
    }
  });

  app.post("/api/payments", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertPaymentSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const payment = await storage.createPayment(validatedData);
      
      // If payment is for a tax obligation, update its status
      if (payment.obligationId) {
        await storage.updateTaxObligation(payment.obligationId, { 
          status: "paid" 
        });
      }
      
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  // Documents routes
  app.get("/api/documents", isAuthenticated, async (req, res) => {
    try {
      const documents = await storage.getDocumentsForUser(req.user.id);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve documents" });
    }
  });

  app.get("/api/documents/:id", isAuthenticated, async (req, res) => {
    try {
      const document = await storage.getDocument(Number(req.params.id));
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Check that the document belongs to the authenticated user
      if (document.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve document" });
    }
  });

  app.post("/api/documents", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertDocumentSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const document = await storage.createDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  // Notifications routes
  app.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const notifications = await storage.getNotificationsForUser(req.user.id);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve notifications" });
    }
  });

  app.get("/api/notifications/unread", isAuthenticated, async (req, res) => {
    try {
      const notifications = await storage.getUnreadNotificationsForUser(req.user.id);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve unread notifications" });
    }
  });

  app.post("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      const notification = await storage.markNotificationAsRead(Number(req.params.id));
      
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.post("/api/notifications", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertNotificationSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const notification = await storage.createNotification(validatedData);
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  // Inquiries routes
  app.get("/api/inquiries", isAuthenticated, async (req, res) => {
    try {
      const inquiries = await storage.getInquiriesForUser(req.user.id);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve inquiries" });
    }
  });

  app.get("/api/inquiries/:id", isAuthenticated, async (req, res) => {
    try {
      const inquiry = await storage.getInquiry(Number(req.params.id));
      
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      
      // Check that the inquiry belongs to the authenticated user
      if (inquiry.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve inquiry" });
    }
  });

  app.post("/api/inquiries", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertInquirySchema.parse({
        ...req.body,
        userId: req.user.id,
        status: "open"
      });
      
      const inquiry = await storage.createInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

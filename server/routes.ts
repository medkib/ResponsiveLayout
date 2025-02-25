import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertShipmentSchema, insertFacilitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Diagnostic endpoint
  app.get("/api/ping", (_, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Shipment routes
  app.get("/api/shipments", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const shipments = await storage.getShipments(req.user.id);
    res.json(shipments);
  });

  app.post("/api/shipments", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const validated = insertShipmentSchema.parse(req.body);
    const shipment = await storage.createShipment({
      ...validated,
      userId: req.user.id,
    });
    res.json(shipment);
  });

  app.patch("/api/shipments/:id", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const shipment = await storage.getShipment(Number(req.params.id));
    if (!shipment || shipment.userId !== req.user.id) {
      return res.sendStatus(404);
    }
    const updated = await storage.updateShipment(shipment.id, req.body);
    res.json(updated);
  });

  // Facility routes
  app.get("/api/facilities", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const facilities = await storage.getFacilities();
    res.json(facilities);
  });

  app.post("/api/facilities", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const validated = insertFacilitySchema.parse(req.body);
    const facility = await storage.createFacility(validated);
    res.json(facility);
  });

  const httpServer = createServer(app);
  return httpServer;
}
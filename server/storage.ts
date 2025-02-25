import { User, InsertUser, Shipment, InsertShipment, Facility, InsertFacility } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Shipment methods
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  getShipments(userId: number): Promise<Shipment[]>;
  getShipment(id: number): Promise<Shipment | undefined>;
  updateShipment(id: number, shipment: Partial<InsertShipment>): Promise<Shipment>;
  
  // Facility methods
  createFacility(facility: InsertFacility): Promise<Facility>;
  getFacilities(): Promise<Facility[]>;
  getFacility(id: number): Promise<Facility | undefined>;
  updateFacility(id: number, facility: Partial<InsertFacility>): Promise<Facility>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private shipments: Map<number, Shipment>;
  private facilities: Map<number, Facility>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.shipments = new Map();
    this.facilities = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createShipment(insertShipment: InsertShipment): Promise<Shipment> {
    const id = this.currentId++;
    const shipment: Shipment = {
      ...insertShipment,
      id,
      createdAt: new Date(),
    };
    this.shipments.set(id, shipment);
    return shipment;
  }

  async getShipments(userId: number): Promise<Shipment[]> {
    return Array.from(this.shipments.values()).filter(
      (shipment) => shipment.userId === userId,
    );
  }

  async getShipment(id: number): Promise<Shipment | undefined> {
    return this.shipments.get(id);
  }

  async updateShipment(
    id: number,
    shipment: Partial<InsertShipment>,
  ): Promise<Shipment> {
    const existing = await this.getShipment(id);
    if (!existing) throw new Error("Shipment not found");
    
    const updated: Shipment = {
      ...existing,
      ...shipment,
    };
    this.shipments.set(id, updated);
    return updated;
  }

  async createFacility(insertFacility: InsertFacility): Promise<Facility> {
    const id = this.currentId++;
    const facility: Facility = { ...insertFacility, id };
    this.facilities.set(id, facility);
    return facility;
  }

  async getFacilities(): Promise<Facility[]> {
    return Array.from(this.facilities.values());
  }

  async getFacility(id: number): Promise<Facility | undefined> {
    return this.facilities.get(id);
  }

  async updateFacility(
    id: number,
    facility: Partial<InsertFacility>,
  ): Promise<Facility> {
    const existing = await this.getFacility(id);
    if (!existing) throw new Error("Facility not found");
    
    const updated: Facility = {
      ...existing,
      ...facility,
    };
    this.facilities.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();

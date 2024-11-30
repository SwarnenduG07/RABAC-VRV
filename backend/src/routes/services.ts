import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { checkPermission } from "../middleware/permissionAuth";
import { Permission } from "../types/types";
import { checkRole } from "../middleware/roleAuth";

const router = Router();

// Admin Only Routes
router.get("/cctv", authenticateToken, checkRole(["ADMIN"]), async (req: Request, res: Response) => {
  return res.json({
    message: "CCTV Footage Access Granted",
    cameras: [
      { id: 1, location: "Main Entrance", status: "Active" },
      { id: 2, location: "Parking Lot", status: "Active" },
      { id: 3, location: "Back Door", status: "Maintenance" }
    ]
  });
});

router.get("/security-logs", authenticateToken, checkRole(["ADMIN"]), async (req: Request, res: Response) => {
  return res.json({
    message: "Security Logs Access Granted",
    logs: [
      { id: 1, event: "Door Access", timestamp: new Date() },
      { id: 2, event: "Alarm Triggered", timestamp: new Date() }
    ]
  });
});

// Moderator Routes
router.get("/electrical-panel", authenticateToken, checkRole(["MODERATOR"]), async (req: Request, res: Response) => {
  return res.json({
    message: "Electrical Panel Status",
    panels: [
      { id: 1, zone: "Zone A", status: "Normal", power_consumption: "5.5 kW" },
      { id: 2, zone: "Zone B", status: "High Load", power_consumption: "8.2 kW" }
    ]
  });
});

router.get("/maintenance-schedule", authenticateToken, checkRole(["MODERATOR"]), async (req: Request, res: Response) => {
  return res.json({
    message: "Maintenance Schedule Access",
    schedule: [
      { id: 1, task: "AC Maintenance", date: "2024-03-20" },
      { id: 2, task: "Generator Check", date: "2024-03-25" }
    ]
  });
});

// Regular User Routes
router.get("/amenities", authenticateToken, async (req: Request, res: Response) => {
  return res.json({
    message: "Available Amenities",
    amenities: [
      { id: 1, name: "Gym", status: "Open", timing: "6 AM - 10 PM" },
      { id: 2, name: "Swimming Pool", status: "Maintenance", timing: "7 AM - 8 PM" },
      { id: 3, name: "Park", status: "Open", timing: "24/7" }
    ]
  });
});

router.get("/notices", authenticateToken, async (req: Request, res: Response) => {
  return res.json({
    message: "Community Notices",
    notices: [
      { id: 1, title: "Monthly Meeting", date: "2024-03-15", priority: "High" },
      { id: 2, title: "Water Supply Maintenance", date: "2024-03-18", priority: "Medium" }
    ]
  });
});

export const servicesRouter = router; 
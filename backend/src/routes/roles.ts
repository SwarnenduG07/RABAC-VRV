import { Router, Request, Response } from "express";
import prisma from "../database/db";
import { authenticateToken } from "../middleware/auth";
import { checkRole } from "../middleware/roleAuth";

const router = Router();

// Get all roles (Admin only)
router.get("/", authenticateToken, checkRole(["ADMIN"]), async (req: Request, res: Response) => {
  const roles = await prisma.user.findMany({
    select: {
      id: true,
      role: true,
      userPermissions: {
        include: {
          permission: true
        }
      }
    }
  });
  return res.json(roles);
});

// Assign role to user (Admin only)
router.post("/assign", authenticateToken, checkRole(["ADMIN"]), async (req: Request, res: Response) => {
  const { userId, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    return res.json({ message: "Role updated successfully", user: updatedUser });
  } catch (error) {
    return res.status(400).json({ message: "Failed to update role" });
  }
});



export const rolesRouter = router;
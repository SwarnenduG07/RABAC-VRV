import { Request, Response, NextFunction } from "express";
import { Permission } from "../types/types";
import prisma from "../database/db";

export const checkPermission = (requiredPermissions: Permission[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userPermissions = await prisma.userPermission.findMany({
        where: { userId: req.user.id },
        include: { permission: true }
      });

      const hasPermission = requiredPermissions.every(required =>
        userPermissions.some(up => up.permission.name === required)
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          message: "Forbidden: Insufficient permissions",
          required: requiredPermissions
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Error checking permissions" });
    }
  };
}; 
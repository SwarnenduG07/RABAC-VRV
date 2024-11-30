import prisma from "./db";
import { Permission } from "../types/types";

async function seedPermissions() {
  try {
    // Create all permissions
    for (const permission of Object.values(Permission)) {
      await prisma.permission.upsert({
        where: { name: permission },
        update: {},
        create: {
          name: permission,
          description: `Permission to ${permission.toLowerCase().replace(/_/g, ' ')}`
        }
      });
    }

    console.log("Permissions seeded successfully");
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
}

// Run this script during initial setup
seedPermissions(); 
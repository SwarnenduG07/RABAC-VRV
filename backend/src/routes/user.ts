import { Router, Request, Response } from "express";
import { signinSchema, signupSchima } from "../types/types";
import prisma from "../database/db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/auth";
import { JWT_SECRET } from "../config";
const router = Router();

const generateToken = () =>  crypto.randomBytes(32).toString("hex");

const sendEmail = async (email: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html,
  });
};


router.post("/register", async (req: Request, res: Response) => {
  const body = req.body;
  const parsedData = signupSchima.safeParse(body);

  if (!parsedData.success) {
    return res.status(400).json({ message: "Invalid Inputs" });
  }

  try {
    const userExists = await prisma.user.findFirst({
      where: { email: parsedData.data.email },
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    
    // Allow setting role from request body, but default to USER if not provided
    const role = parsedData.data.role || 'USER';

    const user = await prisma.user.create({
      data: {
        email: parsedData.data.email,
        username: parsedData.data.username,
        password: hashedPassword,
        firstname: parsedData.data.firstname,
        lastname: parsedData.data.lastname,
        role: role,
        isEmailVerified: true,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      role: user.role
    });
  } catch (error) {
    console.error("User registration error:", error);
    return res.status(500).json({ message: "Failed to register user" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const body = req.body;
  const parsedData = signinSchema.safeParse(body);

  if (!parsedData.success) {
    return res.status(400).json({ message: "Invalid Inputs" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email: parsedData.data.email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      parsedData.data.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Update user with refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Return user data along with tokens
    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



router.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = generateToken();
  const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendEmail(
    email,
    "Reset your password",
    `Please click this link to reset your password: ${resetUrl}`
  );

  return res.status(200).json({ message: "Password reset email sent" });
});

router.post("/reset-password", async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  return res.status(200).json({ message: "Password reset successfully" });
});

router.post("/change-password", authenticateToken, async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id; // Assuming you have authentication middleware

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return res.status(200).json({ message: "Password changed successfully" });
});

router.post("/refresh-token", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { userId: number };

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        refreshToken: refreshToken,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    return res.json({ accessToken });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

router.post("/logout", authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    
    return res.status(200).json({ 
      message: "Logged out successfully",
      clearTokens: true
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error during logout" });
  }
});

export const userRouter = router;

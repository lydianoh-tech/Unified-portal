// Explanation: the next line is part of program logic.
import bcrypt from "bcryptjs";
// Explanation: the next line is part of program logic.
import prisma from "../models/prisma.js";
// Explanation: the next line is part of program logic.
import { SecurityLog } from "../models/mongoose/index.js";
// Explanation: the next line is part of program logic.
import { connectDatabases, disconnectDatabases } from "../config/database.js";

// Explanation: the next line is part of program logic.
async function seedMongoSecurityLogs(adminId) {
  // Explanation: the next line is part of program logic.
  const count = await SecurityLog.countDocuments();
  // Explanation: the next line is part of program logic.
  if (count > 0) {
    // Explanation: the next line is part of program logic.
    console.log("MongoDB security logs already seeded, skipping.");
    // Explanation: the next line is part of program logic.
    return;
    // Explanation: the next line is part of program logic.
  }

  // Explanation: the next line is part of program logic.
  await SecurityLog.insertMany([
    // Explanation: the next line is part of program logic.
    {
      // Explanation: the next line is part of program logic.
      event: "Failed login attempt",
      // Explanation: the next line is part of program logic.
      source: "auth",
      // Explanation: the next line is part of program logic.
      severity: "WARNING",
      // Explanation: the next line is part of program logic.
      ipAddress: "192.168.1.105",
      // Explanation: the next line is part of program logic.
      metadata: { attempts: 3, email: "unknown@test.com" },
      // Explanation: the next line is part of program logic.
    },
    // Explanation: the next line is part of program logic.
    {
      // Explanation: the next line is part of program logic.
      event: "Suspicious API rate spike",
      // Explanation: the next line is part of program logic.
      source: "api-gateway",
      // Explanation: the next line is part of program logic.
      severity: "ERROR",
      // Explanation: the next line is part of program logic.
      ipAddress: "10.0.0.44",
      // Explanation: the next line is part of program logic.
      metadata: { endpoint: "/api/auth/login", count: 120 },
      // Explanation: the next line is part of program logic.
    },
    // Explanation: the next line is part of program logic.
    {
      // Explanation: the next line is part of program logic.
      event: "Admin dashboard accessed",
      // Explanation: the next line is part of program logic.
      source: "dashboard",
      // Explanation: the next line is part of program logic.
      severity: "INFO",
      // Explanation: the next line is part of program logic.
      userId: adminId,
      // Explanation: the next line is part of program logic.
      ipAddress: "127.0.0.1",
      // Explanation: the next line is part of program logic.
    },
    // Explanation: the next line is part of program logic.
  ]);
  // Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
async function main() {
  // Explanation: the next line is part of program logic.
  await connectDatabases();

  // Explanation: the next line is part of program logic.
  const passwordHash = await bcrypt.hash("Admin123!", 12);

  // Explanation: the next line is part of program logic.
  const admin = await prisma.user.upsert({
    // Explanation: the next line is part of program logic.
    where: { email: "admin@portal.local" },
    // Explanation: the next line is part of program logic.
    update: {},
    // Explanation: the next line is part of program logic.
    create: {
      // Explanation: the next line is part of program logic.
      email: "admin@portal.local",
      // Explanation: the next line is part of program logic.
      passwordHash,
      // Explanation: the next line is part of program logic.
      name: "Portal Admin",
      // Explanation: the next line is part of program logic.
      role: "ADMIN",
      // Explanation: the next line is part of program logic.
    },
    // Explanation: the next line is part of program logic.
  });

  // Explanation: the next line is part of program logic.
  const userHash = await bcrypt.hash("User123!", 12);
  // Explanation: the next line is part of program logic.
  const user = await prisma.user.upsert({
    // Explanation: the next line is part of program logic.
    where: { email: "user@portal.local" },
    // Explanation: the next line is part of program logic.
    update: {},
    // Explanation: the next line is part of program logic.
    create: {
      // Explanation: the next line is part of program logic.
      email: "user@portal.local",
      // Explanation: the next line is part of program logic.
      passwordHash: userHash,
      // Explanation: the next line is part of program logic.
      name: "Demo User",
      // Explanation: the next line is part of program logic.
      role: "USER",
      // Explanation: the next line is part of program logic.
    },
    // Explanation: the next line is part of program logic.
  });

  // Explanation: the next line is part of program logic.
  const services = [
    // Explanation: the next line is part of program logic.
    {
      department: "HAIRSTYLIST",
      // Explanation: the next line is part of program logic.
      name: "Home Security Audit",
      // Explanation: the next line is part of program logic.
      description:
        "Comprehensive review of your home network and device security posture.",
      // Explanation: the next line is part of program logic.
      category: "Security",
      // Explanation: the next line is part of program logic.
      tags: ["network", "audit", "home"],
      // Explanation: the next line is part of program logic.
      price: 149.99,
      // Explanation: the next line is part of program logic.
      durationMin: 90,
      // Explanation: the next line is part of program logic.
      providerId: user.id,
      // Explanation: the next line is part of program logic.
    },
    // Explanation: the next line is part of program logic.
    {
      department: "DESIGNER",
      // Explanation: the next line is part of program logic.
      name: "PC Tune-up & Malware Scan",
      // Explanation: the next line is part of program logic.
      description:
        "Performance optimization with full malware and vulnerability scan.",
      // Explanation: the next line is part of program logic.
      category: "Device Care",
      // Explanation: the next line is part of program logic.
      tags: ["pc", "malware", "tune-up"],
      // Explanation: the next line is part of program logic.
      price: 79.99,
      // Explanation: the next line is part of program logic.
      durationMin: 60,
      // Explanation: the next line is part of program logic.
      providerId: user.id,
      // Explanation: the next line is part of program logic.
    },
    // Explanation: the next line is part of program logic.
    {
      department: "STYLIST",
      // Explanation: the next line is part of program logic.
      name: "Cloud Backup Setup",
      // Explanation: the next line is part of program logic.
      description: "Configure encrypted automated backups for critical files.",
      // Explanation: the next line is part of program logic.
      category: "Backup",
      // Explanation: the next line is part of program logic.
      tags: ["cloud", "backup", "encryption"],
      // Explanation: the next line is part of program logic.
      price: 59.99,
      // Explanation: the next line is part of program logic.
      durationMin: 45,
      // Explanation: the next line is part of program logic.
      providerId: user.id,
      // Explanation: the next line is part of program logic.
    },
    // Explanation: the next line is part of program logic.
  ];

  // Explanation: the next line is part of program logic.
  for (const service of services) {
    // Explanation: the next line is part of program logic.
    const existing = await prisma.service.findFirst({
      where: { name: service.name },
    });
    // Explanation: the next line is part of program logic.
    if (!existing) {
      // Explanation: the next line is part of program logic.
      await prisma.service.create({ data: service });
      // Explanation: the next line is part of program logic.
    } else if (!existing.providerId) {
      // Explanation: the next line is part of program logic.
      await prisma.service.update({
        // Explanation: the next line is part of program logic.
        where: { id: existing.id },
        // Explanation: the next line is part of program logic.
        data: {
          providerId: user.id,
          department: existing.department ?? service.department,
          category: existing.category ?? service.category,
          tags: existing.tags.length > 0 ? existing.tags : service.tags,
        },
        // Explanation: the next line is part of program logic.
      });
      // Explanation: the next line is part of program logic.
    }
    // Explanation: the next line is part of program logic.
  }

  // Explanation: the next line is part of program logic.
  await seedMongoSecurityLogs(admin.id);

  // Explanation: the next line is part of program logic.
  console.log("Seed complete:", { admin: admin.email, user: user.email });
  // Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
main()
  // Explanation: the next line is part of program logic.
  .catch(console.error)
  // Explanation: the next line is part of program logic.
  .finally(() => disconnectDatabases());

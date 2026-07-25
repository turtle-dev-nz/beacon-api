import express, { type Request, type Response } from "express";
import { ContactSource, type ContactCard } from "@prisma/client";
import prisma from "../config/prisma.js";

const router = express.Router();

type ContactPayload = {
  firstName?: string | null;
  lastName?: string | null;
  title?: string | null;
  company?: string | null;
  department?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  linkedIn?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  github?: string | null;
  notes?: string | null;
  tags?: string[];
  imageUrl?: string | null;
  cardColors?: string[];
  rawOcrText?: string | null;
};

// Resolve the dev user from the environment. In a future auth implementation
// this will be replaced by reading from the request token.
function getUserId(): string | undefined {
  return process.env.DEV_USER_ID;
}

function toApiContact(contact: ContactCard) {
  const nameParts = contact.scannedName.trim().split(/\s+/);
  return {
    id: contact.id,
    firstName: nameParts[0] ?? null,
    lastName: nameParts.length > 1 ? nameParts.slice(1).join(" ") : null,
    title: contact.scannedTitle,
    company: contact.scannedCompany,
    department: null,
    email: contact.scannedEmail,
    phone: contact.scannedPhone,
    mobile: null,
    website: contact.scannedWebsite,
    address: contact.scannedAddress,
    city: null,
    state: null,
    country: null,
    postalCode: null,
    linkedIn: contact.scannedLinkedin,
    twitter: contact.scannedTwitter,
    instagram: contact.scannedInstagram,
    facebook: null,
    github: null,
    notes: null,
    tags: [],
    imageUrl: null,
    cardColors: [],
    rawOcrText: contact.rawOcrText,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
  };
}

function toScannedAddress(payload: ContactPayload): string | null {
  const value = payload.address?.trim();
  return value && value.length > 0 ? value : null;
}

function toScannedName(payload: ContactPayload): string {
  const name = `${payload.firstName ?? ""} ${payload.lastName ?? ""}`.trim();
  if (name.length > 0) {
    return name;
  }
  return payload.company?.trim() || "Unknown";
}

// GET /api/contacts
router.get("/", async (req: Request, res: Response) => {
  const userId = getUserId();
  if (!userId) {
    return res.status(500).json({ error: "DEV_USER_ID is not configured" });
  }

  try {
    const contacts = await prisma.contactCard.findMany({
      where: { ownerUserId: userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(contacts.map(toApiContact));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve contacts" });
  }
});

// GET /api/contacts/:id
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const userId = getUserId();
  if (!userId) {
    return res.status(500).json({ error: "DEV_USER_ID is not configured" });
  }

  try {
    const contact = await prisma.contactCard.findFirst({
      where: { id: req.params.id, ownerUserId: userId },
    });

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.json(toApiContact(contact));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve contact" });
  }
});

// POST /api/contacts
router.post("/", async (req: Request<unknown, unknown, ContactPayload>, res: Response) => {
  const userId = getUserId();
  if (!userId) {
    return res.status(500).json({ error: "DEV_USER_ID is not configured" });
  }

  const {
    firstName,
    lastName,
    title,
    company,
    department,
    email,
    phone,
    mobile,
    website,
    address,
    city,
    state,
    country,
    postalCode,
    linkedIn,
    twitter,
    instagram,
    facebook,
    github,
    notes,
    tags,
    imageUrl,
    cardColors,
    rawOcrText,
  } = req.body;

  try {
    const contact = await prisma.contactCard.create({
      data: {
        ownerUserId: userId,
        source: rawOcrText ? ContactSource.SCAN : ContactSource.MANUAL,
        scannedName: toScannedName(req.body),
        scannedTitle: title,
        scannedCompany: company,
        scannedEmail: email,
        scannedPhone: mobile ?? phone,
        scannedWebsite: website,
        scannedAddress: toScannedAddress(req.body),
        scannedInstagram: instagram,
        scannedTwitter: twitter,
        scannedLinkedin: linkedIn,
        rawOcrText,
      },
    });

    res.status(201).json(toApiContact(contact));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create contact" });
  }
});

// PUT /api/contacts/:id
router.put("/:id", async (req: Request<{ id: string }, unknown, ContactPayload>, res: Response) => {
  const userId = getUserId();
  if (!userId) {
    return res.status(500).json({ error: "DEV_USER_ID is not configured" });
  }

  const existing = await prisma.contactCard.findFirst({
    where: { id: req.params.id, ownerUserId: userId },
  });

  if (!existing) {
    return res.status(404).json({ error: "Contact not found" });
  }

  const {
    firstName,
    lastName,
    title,
    company,
    department,
    email,
    phone,
    mobile,
    website,
    address,
    city,
    state,
    country,
    postalCode,
    linkedIn,
    twitter,
    instagram,
    facebook,
    github,
    notes,
    tags,
    imageUrl,
    cardColors,
    rawOcrText,
  } = req.body;

  try {
    const updated = await prisma.contactCard.update({
      where: { id: req.params.id },
      data: {
        scannedName: toScannedName(req.body),
        scannedTitle: title,
        scannedCompany: company,
        scannedEmail: email,
        scannedPhone: mobile ?? phone,
        scannedWebsite: website,
        scannedAddress: toScannedAddress(req.body),
        scannedInstagram: instagram,
        scannedTwitter: twitter,
        scannedLinkedin: linkedIn,
        rawOcrText,
      },
    });

    res.json(toApiContact(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update contact" });
  }
});

// DELETE /api/contacts/:id
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const userId = getUserId();
  if (!userId) {
    return res.status(500).json({ error: "DEV_USER_ID is not configured" });
  }

  const existing = await prisma.contactCard.findFirst({
    where: { id: req.params.id, ownerUserId: userId },
  });

  if (!existing) {
    return res.status(404).json({ error: "Contact not found" });
  }

  try {
    await prisma.contactCard.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

export default router;

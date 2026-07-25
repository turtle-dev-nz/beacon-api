const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

// Resolve the dev user from the environment. In a future auth implementation
// this will be replaced by reading from the request token.
function getUserId(req) {
  return process.env.DEV_USER_ID;
}

// GET /api/contacts
router.get("/", async (req, res) => {
  const userId = getUserId(req);

  try {
    const contacts = await prisma.card.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve contacts" });
  }
});

// GET /api/contacts/:id
router.get("/:id", async (req, res) => {
  const userId = getUserId(req);

  try {
    const contact = await prisma.card.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve contact" });
  }
});

// POST /api/contacts
router.post("/", async (req, res) => {
  const userId = getUserId(req);

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
    const contact = await prisma.card.create({
      data: {
        userId,
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
        tags: tags ?? [],
        imageUrl,
        cardColors: cardColors ?? [],
        rawOcrText,
      },
    });

    res.status(201).json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create contact" });
  }
});

// PUT /api/contacts/:id
router.put("/:id", async (req, res) => {
  const userId = getUserId(req);

  const existing = await prisma.card.findFirst({
    where: { id: req.params.id, userId },
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
    const updated = await prisma.card.update({
      where: { id: req.params.id },
      data: {
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
        ...(tags !== undefined && { tags }),
        imageUrl,
        ...(cardColors !== undefined && { cardColors }),
        rawOcrText,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update contact" });
  }
});

// DELETE /api/contacts/:id
router.delete("/:id", async (req, res) => {
  const userId = getUserId(req);

  const existing = await prisma.card.findFirst({
    where: { id: req.params.id, userId },
  });

  if (!existing) {
    return res.status(404).json({ error: "Contact not found" });
  }

  try {
    await prisma.card.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

module.exports = router;

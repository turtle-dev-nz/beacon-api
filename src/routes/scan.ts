import express, { type Request, type Response } from "express";
import fs from "fs";
import multer from "multer";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ScanRequestBody = {
  ocrText?: string;
};

function isOpenAIRateLimitError(err: unknown): boolean {
  const maybeErr = err as { status?: number; constructor?: { name?: string } };
  return maybeErr?.status === 429 || maybeErr?.constructor?.name === "RateLimitError";
}

function parseJsonObject(input: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(input);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Model response was not a JSON object");
  }
  return parsed as Record<string, unknown>;
}

function buildTextPromptMessage(ocrText: string): ChatCompletionMessageParam {
  return { role: "user", content: `${TEXT_PROMPT}\n${ocrText}` };
}

function buildVisionPromptMessage(imageMimeType: string, imageBase64: string): ChatCompletionMessageParam {
  return {
    role: "user",
    content: [
      { type: "text", text: VISION_PROMPT },
      {
        type: "image_url",
        image_url: {
          url: `data:${imageMimeType};base64,${imageBase64}`,
          detail: "low",
        },
      },
    ],
  };
}

// --- Storage ---
const uploadsDir = path.resolve(__dirname, "../../", process.env.UPLOADS_DIR || "uploads");

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const scanId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const dir = path.join(uploadsDir, scanId);
    fs.mkdirSync(dir, { recursive: true });
    req.scanId = scanId;
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `image${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are accepted"));
    }
    cb(null, true);
  },
});

const CARD_SCHEMA = `{
  "firstName": string | null,
  "lastName": string | null,
  "title": string | null,
  "company": string | null,
  "department": string | null,
  "email": string | null,
  "phone": string | null,
  "mobile": string | null,
  "website": string | null,
  "address": string | null,
  "city": string | null,
  "state": string | null,
  "country": string | null,
  "postalCode": string | null,
  "linkedIn": string | null,
  "twitter": string | null,
  "instagram": string | null,
  "facebook": string | null,
  "github": string | null,
  "notes": string | null,
  "tags": string[],
  "colors": {hex: string, name: string}[]
}`;

const VISION_PROMPT = `Extract contact information from this business card image into a JSON object.
Return ONLY the JSON - no markdown, no explanation.

Rules:
- Only extract data that appears as printed text on the card. Set absent fields to null.
- Never infer data from visual elements, graphics, logos, or decorations - only from text.
- You may derive missing fields from other text (e.g. country from a phone prefix or email domain).
- Format phone numbers consistently. Lowercase emails and social handles.
- For "colors": identify the card's intended design colors (2-4 max). Ignore lighting, shadows, and photo artifacts - report the colors the designer chose, not what the camera captured.
- For "tags": suggest 1-5 short lowercase tags for the person's industry or role (e.g. "design", "finance", "engineering"). Only use what the card text supports.

Schema:
${CARD_SCHEMA}`;

const TEXT_PROMPT = `Structure the following business card text into a JSON object.
Return ONLY the JSON - no markdown, no explanation.

Rules:
- Only use the provided text. Set absent fields to null.
- You may derive missing fields from other text (e.g. country from a phone prefix or email domain).
- Format phone numbers consistently. Lowercase emails and social handles.
- Set "colors" to [] since no image is available.
- For "tags": suggest 1-5 short lowercase tags for the person's industry or role. Only use what the text supports.

Schema:
${CARD_SCHEMA}

Card text:`;

router.post("/", upload.single("image"), async (req: Request<unknown, unknown, ScanRequestBody>, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image provided" });
  }

  if (!process.env.OPEN_AI_API_KEY) {
    return res.status(500).json({
      error: "OpenAI API key is not configured",
      detail: "Set OPEN_AI_API_KEY in api/.env and restart the API server.",
    });
  }

  const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });
  const ocrText = req.body.ocrText || null;

  let extracted: Record<string, unknown>;

  try {
    let llmResponse;

    if (ocrText) {
      console.log(`[scan] using on-device OCR text (${ocrText.length} chars)`);
      llmResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [buildTextPromptMessage(ocrText)],
        max_tokens: 512,
      });
    } else {
      console.log("[scan] no OCR text, falling back to vision");
      const imageBase64 = fs.readFileSync(req.file.path).toString("base64");
      llmResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [buildVisionPromptMessage(req.file.mimetype, imageBase64)],
        max_tokens: 512,
      });
    }

    const text = llmResponse.choices[0]?.message?.content?.trim() || "";
    extracted = parseJsonObject(text);

    const scanId = req.scanId;
    if (!scanId) {
      throw new Error("Scan id was not generated");
    }

    const scanDir = path.join(uploadsDir, scanId);
    fs.writeFileSync(path.join(scanDir, "data.json"), JSON.stringify(extracted, null, 2));
  } catch (err) {
    console.error("OpenAI extraction failed:", err);

    if (isOpenAIRateLimitError(err)) {
      return res.status(429).json({
        error: "OpenAI rate limit exceeded",
        detail: "Too many requests. Please wait a moment and try again.",
      });
    }

    return res.status(502).json({
      error: "Failed to extract card data from image",
      detail: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }

  const scanId = req.scanId;
  if (!scanId) {
    return res.status(500).json({ error: "Scan id was not generated" });
  }

  const imageUrl = `/uploads/${scanId}/${req.file.filename}`;

  return res.json({ extracted, imageUrl, rawOcrText: ocrText });
});

export default router;

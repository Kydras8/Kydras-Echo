// apps/web/src/app/api/storage/sign/route.ts
// ✅ Force this API route to Node.js (Edge can't use `node:crypto`)
export const runtime = 'nodejs';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

// Build an S3 client for Cloudflare R2 using env vars set in Pages
function s3() {
  const endpoint = process.env.S3_ENDPOINT!;
  const region = process.env.S3_REGION || "auto";
  const forcePathStyle = String(process.env.S3_USE_PATH_STYLE) === "true";
  const credentials = {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  };
  return new S3Client({ endpoint, region, forcePathStyle, credentials });
}

// POST creates a zero-byte placeholder object and returns the key
export async function POST(req: Request) {
  try {
    const { contentType, ext } = (await req.json()) as { contentType: string; ext?: string };

    // e.g., uploads/2025-10-10/8c8d6a6e-... .png
    const key = `uploads/${new Date().toISOString().slice(0, 10)}/${randomUUID()}${
      ext ? `.${String(ext).replace(/^\./, "")}` : ""
    }`;

    const bucket = process.env.S3_BUCKET!;
    const client = s3();

    // Create an empty object so the key exists (adjust to your flow as needed)
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
        Body: new Uint8Array(),
      })
    );

    return new Response(JSON.stringify({ ok: true, key }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message ?? String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

// Simple health check for this route
export async function GET() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
}


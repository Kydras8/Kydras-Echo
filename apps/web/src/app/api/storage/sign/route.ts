// apps/web/src/app/api/storage/sign/route.ts
// ✅ Must be Edge runtime for Cloudflare Pages + next-on-pages
export const runtime = 'edge';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Build an S3 client for Cloudflare R2 using env vars set in Pages
function s3() {
  const endpoint = process.env.S3_ENDPOINT!;
  if (!endpoint) throw new Error("S3_ENDPOINT missing");

  const region = process.env.S3_REGION || "auto";
  const forcePathStyle = String(process.env.S3_USE_PATH_STYLE) === "true";
  const credentials = {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  };

  return new S3Client({ endpoint, region, forcePathStyle, credentials });
}

function makeKey(ext?: string) {
  const cleanExt = ext ? `.${String(ext).replace(/^\./, "")}` : "";
  // ✅ use Web Crypto (Edge-safe), not `node:crypto`
  const id = crypto.randomUUID();
  return `uploads/${new Date().toISOString().slice(0, 10)}/${id}${cleanExt}`;
}

export async function POST(req: Request) {
  try {
    const { contentType, ext } = (await req.json()) as { contentType: string; ext?: string };

    const key = makeKey(ext);
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

export async function GET() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
}


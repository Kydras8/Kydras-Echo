import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
export const runtime = 'edge';

function cfg() {
  const endpoint = process.env.S3_ENDPOINT;
  if (!endpoint) throw new Error("S3_ENDPOINT missing");
  return {
    region: process.env.S3_REGION || "auto",
    endpoint,
    forcePathStyle: process.env.S3_USE_PATH_STYLE === "true",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || "",
      secretAccessKey: process.env.S3_SECRET_KEY || ""
    }
  };
}
export async function POST(req: Request) {
  try {
    const { contentType, ext } = await req.json() as { contentType: string; ext?: string };
    const key = `uploads/${new Date().toISOString().slice(0,10)}/${randomUUID()}${ext ? '.'+ext : ''}`;
    const bucket = process.env.S3_BUCKET!;
    const client = new S3Client(cfg());
    await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType, Body: new Uint8Array() }));
    return Response.json({ ok: true, key });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 });
  }
}

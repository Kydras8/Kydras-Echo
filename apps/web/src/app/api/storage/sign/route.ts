// apps/web/src/app/api/storage/sign/route.ts
// Edge-safe: no Node APIs, no aws-sdk (avoids DOMParser).
export const runtime = 'edge';

function makeKey(ext?: string) {
  const cleanExt = ext ? `.${String(ext).replace(/^\./, '')}` : '';
  const id = crypto.randomUUID();
  return `uploads/${new Date().toISOString().slice(0, 10)}/${id}${cleanExt}`;
}

export async function POST(req: Request) {
  try {
    const { contentType, ext } = (await req.json()) as {
      contentType?: string;
      ext?: string;
    };

    // For now we just allocate a unique key. Client can upload later once we add presigning.
    const key = makeKey(ext);

    return new Response(JSON.stringify({ ok: true, key, contentType: contentType ?? null }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message ?? String(e) }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json' },
  });
}


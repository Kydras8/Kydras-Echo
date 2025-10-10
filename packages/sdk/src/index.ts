export type EchoClientOptions = { baseUrl?: string; token?: string };
export class EchoClient {
  baseUrl: string; token?: string;
  constructor(opts: EchoClientOptions = {}) {
    this.baseUrl = opts.baseUrl ?? (typeof window !== "undefined" ? "" : "http://localhost:3000");
    this.token = opts.token;
  }
  async health(): Promise<{ ok: boolean }> {
    const r = await fetch(`${this.baseUrl}/api/health`, { headers: this.headers() });
    if (!r.ok) throw new Error(`Health failed: ${r.status}`);
    return r.json();
  }
  headers() { const h: Record<string,string> = { "content-type":"application/json" };
    if (this.token) h.Authorization = `Bearer ${this.token}`; return h; }
}

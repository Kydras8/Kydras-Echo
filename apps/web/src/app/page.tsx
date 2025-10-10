'use client';
import { useEffect, useState } from 'react';
export default function Home() {
  const [health, setHealth] = useState('checking…');
  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(j => setHealth(JSON.stringify(j))).catch(e => setHealth('error: '+e.message));
  }, []);
  return (
    <main>
      <h2>Welcome</h2>
      <p>Cloudflare Pages/Workers-ready Next.js app for Kydras Echo.</p>
      <pre style={{background:'#111',padding:'12px',borderRadius:8}}>{health}</pre>
    </main>
  );
}

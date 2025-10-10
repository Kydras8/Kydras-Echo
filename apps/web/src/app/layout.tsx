export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{background:'#0b0b0d',color:'#f6f6f6',fontFamily:'system-ui'}}>
        <div style={{maxWidth:960,margin:'0 auto',padding:'24px'}}>
          <header style={{display:'flex',justifyContent:'space-between',alignItems:'center', marginBottom:24}}>
            <h1 style={{fontWeight:800}}>🦅 Kydras Echo</h1>
            <nav style={{opacity:.8}}>Cloudflare + R2 + Neon</nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}

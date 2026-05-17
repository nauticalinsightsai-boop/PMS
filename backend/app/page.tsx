export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem' }}>
      <h1>PMS Backend API</h1>
      <p>REST routes under <code>/api</code></p>
      <ul>
        <li><a href="/api/health">GET /api/health</a></li>
        <li>POST /api/interactions</li>
      </ul>
    </main>
  );
}

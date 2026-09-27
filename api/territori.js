import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const sql = neon(process.env.DATABASE_URL);
  const q = (req.query.q || '').trim();
  if (q.length < 2) {
    return res.status(200).json([]);
  }
  try {
    const rows = await sql`
      SELECT nome, livello FROM dim_territorio
      WHERE nome ILIKE ${'%' + q + '%'}
      ORDER BY (livello = 'regione') DESC, nome
      LIMIT 20
    `;
    res.status(200).json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

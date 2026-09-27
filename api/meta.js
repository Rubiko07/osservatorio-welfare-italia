import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const sql = neon(process.env.DATABASE_URL);
  try {
    const indicatori = await sql`
      SELECT di.codice, di.descrizione, di.unita_misura,
             count(*) AS n_record,
             min(fi.anno) AS anno_min, max(fi.anno) AS anno_max,
             array_agg(DISTINCT t.livello) AS livelli
      FROM dim_indicatore di
      JOIN fatti_indicatore fi ON fi.indicatore_id = di.id
      JOIN dim_territorio t ON t.id = fi.territorio_id
      GROUP BY di.codice, di.descrizione, di.unita_misura
      ORDER BY n_record DESC
    `;
    const regioni = await sql`SELECT nome FROM dim_territorio WHERE livello = 'regione' ORDER BY nome`;
    res.status(200).json({
      indicatori,
      regioni: regioni.map(r => r.nome),
      generato: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

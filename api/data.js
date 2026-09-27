import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const sql = neon(process.env.DATABASE_URL);

  const indicatore = req.query.indicatore || null;
  const territorio = req.query.territorio || null;
  const anno = req.query.anno ? parseInt(req.query.anno) : null;
  const limit = Math.min(parseInt(req.query.limit) || 500, 3000);
  const offset = parseInt(req.query.offset) || 0;

  if (!indicatore) {
    return res.status(400).json({ error: 'Parametro "indicatore" obbligatorio (usa il codice, es. posti_letto_presidi_per_tipo_utenza)' });
  }

  try {
    const rows = await sql`
      SELECT fi.anno,
             t.nome AS territorio, t.livello,
             ds.nome AS settore, tu.nome AS tipologia,
             fi.valore, fi.dettaglio
      FROM fatti_indicatore fi
      JOIN dim_indicatore di ON di.id = fi.indicatore_id
      JOIN dim_territorio t ON t.id = fi.territorio_id
      LEFT JOIN dim_settore ds ON ds.id = fi.settore_id
      LEFT JOIN dim_tipologia_utenza tu ON tu.id = fi.tipologia_utenza_id
      WHERE di.codice = ${indicatore}
        AND (${territorio}::text IS NULL OR t.nome ILIKE ${territorio ? '%' + territorio + '%' : null})
        AND (${anno}::int IS NULL OR fi.anno = ${anno})
      ORDER BY fi.anno DESC, t.nome
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [{ totale }] = await sql`
      SELECT count(*)::int AS totale
      FROM fatti_indicatore fi
      JOIN dim_indicatore di ON di.id = fi.indicatore_id
      JOIN dim_territorio t ON t.id = fi.territorio_id
      WHERE di.codice = ${indicatore}
        AND (${territorio}::text IS NULL OR t.nome ILIKE ${territorio ? '%' + territorio + '%' : null})
        AND (${anno}::int IS NULL OR fi.anno = ${anno})
    `;

    res.status(200).json({ totale, righe: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

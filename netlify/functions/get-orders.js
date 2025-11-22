import { neon } from '@netlify/neon';

export const handler = async () => {
  try {
    const sql = neon();

    const rows = await sql`
      SELECT * FROM orders
      ORDER BY created_at DESC;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };

  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};

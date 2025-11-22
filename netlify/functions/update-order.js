import { neon } from '@netlify/neon';

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { order_id, status } = JSON.parse(event.body);

  try {
    const sql = neon();

    await sql`
      UPDATE orders
      SET status = ${status},
          updated_at = NOW()
      WHERE id = ${order_id};
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };

  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};

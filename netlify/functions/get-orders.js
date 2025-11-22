import { neon } from '@netlify/neon';

export const handler = async () => {
  try {
    const sql = neon();

    // Fetch all orders sorted by newest
    const orders = await sql`
      SELECT *
      FROM orders
      ORDER BY created_at DESC;
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        orders: orders
      }),
    };

  } catch (err) {
    console.error("GET-ORDERS ERROR:", err);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        message: "Failed to load orders.",
        error: err.message
      }),
    };
  }
};

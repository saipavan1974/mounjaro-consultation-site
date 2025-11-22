import { neon } from '@netlify/neon';

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const data = JSON.parse(event.body);

  const required = ["full_name", "email", "address", "medication", "answers"];
  for (let r of required) {
    if (!data[r]) {
      return { statusCode: 400, body: `Missing field: ${r}` };
    }
  }

  try {
    const sql = neon();

    const result = await sql`
      INSERT INTO orders (full_name, email, phone, address, medication, price, answers)
      VALUES (
        ${data.full_name},
        ${data.email},
        ${data.phone || ""},
        ${data.address},
        ${data.medication},
        ${data.price || 0},
        ${JSON.stringify(data.answers)}
      )
      RETURNING id;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        order_id: result[0].id,
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString(),
    };
  }
};

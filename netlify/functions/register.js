import { neon } from "@netlify/neon";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { full_name, email, password } = JSON.parse(event.body);

    if (!full_name || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing fields" })
      };
    }

    const sql = neon();

    // Check if user already exists
    const existing = await sql`
      SELECT * FROM customers WHERE email = ${email}
    `;

    if (existing.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          success: false,
          message: "Email already registered"
        }),
      };
    }

    // Insert new user
    const result = await sql`
      INSERT INTO customers (full_name, email, password)
      VALUES (${full_name}, ${email}, ${password})
      RETURNING id;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user_id: result[0].id,
        message: "Registration successful"
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
}

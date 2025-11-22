import { neon } from "@netlify/neon";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    const sql = neon();

    const user = await sql`
      SELECT * FROM customers WHERE email = ${email} AND password = ${password}
    `;

    if (user.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: "Invalid credentials" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: user[0],
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: err.message }),
    };
  }
}

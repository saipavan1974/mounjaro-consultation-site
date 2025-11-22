import { neon } from "@netlify/neon";
import bcrypt from "bcryptjs";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing credentials" })
      };
    }

    const sql = neon();

    // Get user by email
    const rows = await sql`
      SELECT id, password_hash FROM customers WHERE email = ${email}
    `;

    if (rows.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Account not found" })
      };
    }

    const user = rows[0];

    // Compare passwords
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: "Incorrect password" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, customer_id: user.id })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
};

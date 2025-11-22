import { neon } from "@netlify/neon";
import bcrypt from "bcryptjs";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { full_name, email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Email and password required" })
      };
    }

    const sql = neon();

    // Check if email exists
    const existing = await sql`
      SELECT id FROM customers WHERE email = ${email}
    `;

    if (existing.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Email already registered" })
      };
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert new customer
    const result = await sql`
      INSERT INTO customers (full_name, email, password_hash)
      VALUES (${full_name}, ${email}, ${password_hash})
      RETURNING id;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, customer_id: result[0].id })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
};

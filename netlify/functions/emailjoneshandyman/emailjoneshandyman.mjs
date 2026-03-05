import nodemailer from "nodemailer";

export default async (req, context) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { name, email, message } = await req.json();

const transporter = nodemailer.createTransport({
  host: "smtp0001.neo.space",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: Netlify.env.get("NEO_EMAIL"),
    pass: Netlify.env.get("NEO_PASSWORD"),
  },
});

  try {
    await transporter.sendMail({
      from: `"Jones Handyman Contact Form" <${Netlify.env.get("NEO_EMAIL")}>`,
      to: Netlify.env.get("NEO_EMAIL"),
      subject: `New message from ${name}`,
      replyTo: email,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};

export const config = {
  path: "/api/contact",
};

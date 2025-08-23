import { NextResponse } from "next/server";
import { transporter } from "@/lib/nodemailer";

export async function POST(req) {
  try {
    const { challengerEmail, opponentEmail, topic, joinLink } =
      await req.json();

    if (!challengerEmail || !opponentEmail || !topic || !joinLink) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields",
      });
    }

    const htmlContent = `
  <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 25px;">

      <h2 style="text-align: center; color: #1d4ed8; margin-bottom: 20px;">
        ⚡ New Challenge Awaits!
      </h2>
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/dlvbaulyy/image/upload/v1755967633/ofqm1fxbuhyf3wftat9z.png" alt="Challenge" style="max-width: 250px; border-radius: 8px;" />
      </div>
      <p style="font-size: 15px; color: #374151; text-align: center; margin-bottom: 20px;">
        <strong style="color:#111827;">${challengerEmail}</strong> has challenged you to a quiz! 🔥
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Topic</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">${topic}</td>
        </tr>
      </table>

      <div style="text-align: center; margin: 20px 0;">
        <a href="${joinLink}" style="display: inline-block; padding: 12px 20px; background: #1d4ed8; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
          🚀 Join Challenge
        </a>
      </div>

      <p style="margin-top: 20px; font-size: 14px; color: #374151; text-align: center;">
        Good luck & give it your best shot! 👍
      </p>

      <p style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">
        You are receiving this email because you’re part of our quiz platform.<br/>
        If this wasn’t meant for you, feel free to ignore.
      </p>
       <div style="text-align: center; margin-top: 20px;">
        <img src="https://res.cloudinary.com/dlvbaulyy/image/upload/v1755967341/x8sbqswvx4swpbbs48ou.png" alt="Quiz Challenge" style="max-width: 100%; border-radius: 8px;" />
      </div>
    </div>
  </div>
`;

    await transporter.sendMail({
      from: `"Eduprobe-Challenge" <${process.env.SMTP_USER}>`,
      to: opponentEmail,
      subject: `You have been challenged by ${challengerEmail}`,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: "Challenge email sent!",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

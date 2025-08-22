import { NextResponse } from 'next/server';
import { transporter } from '@/lib/nodemailer';

export async function POST(req) {
  try {
    const { challengerEmail, opponentEmail, topic, joinLink } = await req.json();

    if (!challengerEmail || !opponentEmail || !topic || !joinLink) {
      return NextResponse.json({ success: false, error: 'Missing required fields' });
    }

    const htmlContent = `
      <h2>New Challenge!</h2>
      <p><strong>${challengerEmail}</strong> has challenged you to a quiz!</p>
      <p><strong>Topic:</strong> ${topic}</p>
      <p>Click below to join the challenge:</p>
      <a href="${joinLink}" style="padding: 10px 15px; background: #1d4ed8; color: #fff; text-decoration: none; border-radius: 5px;">Join Challenge🔥</a>
      <p>Good luck!👍</p>
    `;

    await transporter.sendMail({
      from: `"Eduprobe-Challenge" <${process.env.SMTP_USER}>`,
      to: opponentEmail,
      subject: `You have been challenged by ${challengerEmail}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: 'Challenge email sent!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

import { transporter } from '@/lib/nodemailer';
import { NextResponse } from 'next/server';


export async function POST(req) {
  try {
    const { to, subject, text, html } = await req.json();

    await transporter.sendMail({
      from: `"Your App Name" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    return NextResponse.json({ success: true, message: 'Email sent!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

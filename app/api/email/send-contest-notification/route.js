import { NextResponse } from 'next/server';
import { transporter } from '@/lib/nodemailer';
import User from '@/db/schema/User';


export async function POST(req) {
  try {
    const { contestType, noOfQuestions, time, difficulty, joinLink } = await req.json();

    if (!contestType || !noOfQuestions || !time || !difficulty || !joinLink) {
      return NextResponse.json({ success: false, error: 'Missing required fields' });
    }

    // Fetch all users' emails from DB
    const users = await User.find({}, 'email'); // returns array of { email }
    const emails = users.map(u => u.email);

    // Prepare HTML content
    const htmlContent = `
      <h2>New Contest Available!</h2>
      <p>A new <strong>${contestType}</strong> contest has been created.</p>
      <ul>
        <li><strong>Number of Questions:</strong> ${noOfQuestions}</li>
        <li><strong>Time:</strong> ${time} minutes</li>
        <li><strong>Difficulty:</strong> ${difficulty}</li>
      </ul>
      <p>Click below to join:</p>
      <a href="${joinLink}" style="padding: 10px 15px; background: #1d4ed8; color: #fff; text-decoration: none; border-radius: 5px;">Join Contest</a>
    `;

    // Send email to all users (can use BCC to avoid exposing emails)
    await transporter.sendMail({
      from: `"Quiz App" <${process.env.SMTP_USER}>`,
      bcc: emails.join(','), // send to all users without exposing emails
      subject: `New ${contestType} Contest Available!`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: 'Contest notification sent to all users!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

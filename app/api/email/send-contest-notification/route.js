import { NextResponse } from 'next/server';
import { transporter } from '@/lib/nodemailer';
import User from '@/db/schema/User';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/db/dbConnect';

export async function POST(req) {
  try {
    const { contestType, noOfQuestions, time, difficulty, joinLink } = await req.json();

    await dbConnect();
    
    if (!contestType || !noOfQuestions || !time || !difficulty || !joinLink) {
      return NextResponse.json({ success: false, error: 'Missing required fields' });
    }

    // Fetch only subscribed users
    const users = await User.find({ subscribed: true }, 'email');
    
    if (!users.length) {
      return NextResponse.json({ success: false, message: 'No subscribed users found' });
    }

    // Prepare all sendMail promises
    const sendMailPromises = users.map((u) => {
      const token = jwt.sign(
        { email: u.email },
        process.env.JWT_SECRET_2,
        { expiresIn: '7d' }
      );

      const unsubscribeLink = `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?token=${token}`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #111827;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <h2 style="color: #1d4ed8; text-align: center; margin-bottom: 10px;">🚀 New Contest Available!</h2>
            <p style="text-align: center; color: #4b5563; margin-bottom: 25px;">
              A new <strong style="color: #111827;">${contestType}</strong> contest has been created.  
            </p>
            
            <!-- Contest Details -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #374151;">Number of Questions:</td>
                <td style="padding: 8px; color: #111827;">${noOfQuestions}</td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 8px; font-weight: bold; color: #374151;">Time:</td>
                <td style="padding: 8px; color: #111827;">${time} minutes</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #374151;">Difficulty:</td>
                <td style="padding: 8px; color: #111827;">${difficulty}</td>
              </tr>
            </table>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${joinLink}" 
                style="display: inline-block; padding: 12px 24px; background-color: #1d4ed8; 
                      color: #ffffff; text-decoration: none; border-radius: 8px; 
                      font-weight: bold; font-size: 16px;">
                Join Contest
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            
            <!-- Footer -->
            <p style="font-size: 12px; color: #6b7280; text-align: center;">
              You are receiving this email because you’re subscribed to contest notifications.<br/>
              <a href="${unsubscribeLink}" style="color: #ef4444; text-decoration: underline;">
                Unsubscribe from future emails
              </a>
            </p>
          </div>
        </div>
      `;

      return transporter.sendMail({
        from: `"Quiz App" <${process.env.SMTP_USER}>`,
        to: u.email, // ✅ personal email
        subject: `New ${contestType} Contest Available!`,
        html: htmlContent,
      });
    });

    // Run all in parallel & handle errors gracefully
    const results = await Promise.allSettled(sendMailPromises);

    const successCount = results.filter(r => r.status === "fulfilled").length;
    const failureCount = results.filter(r => r.status === "rejected").length;

    return NextResponse.json({ 
      success: true, 
      message: `Contest notification sent! ✅ ${successCount} succeeded, ❌ ${failureCount} failed.` 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

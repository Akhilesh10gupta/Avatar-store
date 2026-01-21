import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { to, type, subject, html } = await req.json();

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let finalSubject = subject;
        let finalHtml = html;

        // Pre-defined templates
        if (type === 'welcome') {
            finalSubject = "Welcome to Avatar Play 🎮";
            finalHtml = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
             <!-- Replace with your actual live website URL -->
             <img src="https://avatarplay.in/logo.png" alt="Avatar Play" style="width: 60px; height: 60px; border-radius: 10px;">
          </div>
          <p>Hi there 👋,</p>
          <p>Welcome to <strong>Avatar Play</strong> — the ultimate hub for gamers and creators!</p>
          
          <p>Whether you're here to <strong>discover the next big hit</strong> or <strong>share your own creation</strong> with the world, we’re thrilled to have you.</p>

          <p>As a community member, you can now:</p>
          <ul style="list-style: none; padding-left: 0;">
            <li style="margin-bottom: 8px;">🎮 <strong>Play & Review</strong>: Access exclusive drops and early access games.</li>
            <li style="margin-bottom: 8px;">🚀 <strong>Create & Upload</strong>: Share your games and build your following.</li>
            <li style="margin-bottom: 8px;">🔥 <strong>Connect</strong>: Join a passionate community of developers and players.</li>
          </ul>

          <p>We’re building the future of gaming together, and you’re now a key part of that journey.</p>
          <p>👉 Stay tuned — exciting things are coming soon.</p>
          
          <p>If you ever have questions or feedback, feel free to reach out through our Help Center. We’d love to hear from you.</p>
          <p>Happy gaming & creating,<br>
          The Avatar Play Team 🚀</p>
          <p style="font-size: 12px; color: #888; margin-top: 20px; text-align: center;">© 2026 Avatar Play</p>
        </div>
      `;
        }

        const mailOptions = {
            from: '"Avatar Play" <avatarplay.in@gmail.com>',
            to,
            subject: finalSubject,
            html: finalHtml,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send email', error: error.message },
            { status: 500 }
        );
    }
}

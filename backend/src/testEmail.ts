import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE_HOST,
    port: Number(process.env.EMAIL_SERVICE_PORT || 587),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Hardware Shop" <${process.env.EMAIL_USER}>`,
      to: 'mohamedaflal154@gmail.com', // Replace with your own email
      subject: 'Test Email from Node.js',
      text: 'This is a test email to verify SMTP connection.',
    });

    console.log('✅ Test email sent successfully:', info.response);
  } catch (err) {
    console.error('❌ Test email failed:', err);
  }
}

testEmail();

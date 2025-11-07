// src/services/EmailService.ts
import nodemailer, { Transporter } from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: Transporter;

  constructor() {
    const { EMAIL_SERVICE_HOST, EMAIL_SERVICE_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

    if (!EMAIL_SERVICE_HOST || !EMAIL_SERVICE_PORT || !EMAIL_USER || !EMAIL_PASS) {
      throw new Error('EmailService: Missing environment variables. Please check your .env file.');
    }

    // Create the transporter (the "postman")
    this.transporter = nodemailer.createTransport({
      host: EMAIL_SERVICE_HOST,
      port: Number(EMAIL_SERVICE_PORT),
      secure: Number(EMAIL_SERVICE_PORT) === 465, // true for 465, false for 587
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS, // Gmail App Password if 2FA enabled
      },
    });

    console.log('EmailService: Transporter initialized.');
  }

  // Generic send email function
  public async sendEmail({ to, subject, html }: SendEmailOptions) {
    try {
      const info = await this.transporter.sendMail({
        from: `"WhoaleSale" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });
      console.log(`Email sent to ${to} | Message ID: ${info.messageId}`);
      return info;
    } catch (err) {
      console.error('Error sending email:', err);
      throw err;
    }
  }

  // Activation email helper
  public async sendActivationEmail(to: string, activationToken: string) {
    const activationLink = `${process.env.HOST}/api/auth/activate/${activationToken}`;
    const html = `
      <h1>Welcome to Our Whaolesale Shop!</h1>
      <p>Thank you for registering. Click the button below to activate your account:</p>
      <a href="${activationLink}" style="
        padding: 10px 15px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      ">Activate Account</a>
      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p>${activationLink}</p>
    `;
    return this.sendEmail({ to, subject: 'Welcome! Activate Your Account', html });
  }
  // --- 3. Password Reset Email அனுப்பும் Method ---
  public async sendPasswordResetEmail(to: string, resetToken: string) {
    // Frontend-ல் நாம் உருவாக்கப்போகும் பக்கத்தின் URL
    // (இது activation link-லிருந்து வேறுபட்டது)
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"Whaolesale Shop" <${process.env.EMAIL_USER}>`, // அனுப்புநர்
      to: to, // பெறுநர் (பயனரின் email)
      subject: 'Password Reset Request', // Email தலைப்பு
      html: `
        <h1>WhoaleSale Shop Password Reset</h1>
        <p>You requested a password reset. Please click the link below to set a new password:</p>
        <a href="${resetLink}" style="padding: 10px 15px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <br>
        <p>This link is valid for **10 minutes** only.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}


// Export a singleton instance
export default new EmailService();

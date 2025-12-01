import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      requireTLS: true,

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: to,
      subject,
      html
    });

    // Check if email was accepted by MailerSend
    if (!info.accepted || info.accepted.length === 0) {
      return false;
    }

    return true;

  } catch (error) {
    console.error("EMAIL SEND ERROR:", error);
    return false;
  }
};

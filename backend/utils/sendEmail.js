import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,   
      port: Number(process.env.SMTP_PORT), 
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM, 
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
    return true;

  } catch (error) {
    console.error("EMAIL SEND ERROR:", error);
    return false;
  }
};

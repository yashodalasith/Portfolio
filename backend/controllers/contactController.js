import nodemailer from "nodemailer";
import Profile from "../models/Profile.js";

export async function sendContactMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({
        error: "Name, email, subject, and message are required.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        error: "Please enter a valid email address.",
      });
    }

    const profile = await Profile.findOne();
    const recipientEmail =
      profile?.email || process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;

    if (!recipientEmail) {
      return res.status(500).json({
        error:
          "No contact destination is configured. Add your email to the profile or set CONTACT_TO_EMAIL.",
      });
    }

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      return res.status(500).json({
        error:
          "Email delivery is not configured on this server. Add SMTP credentials to the backend environment.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const senderName = name?.trim() || "Portfolio visitor";

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipientEmail,
      replyTo: email,
      subject: subject.trim(),
      text: `Name: ${senderName}\nEmail: ${email}\nSubject: ${subject.trim()}\n\n${message.trim()}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <p><strong>Name:</strong> ${senderName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject.trim()}</p>
          <div style="margin-top: 16px;">
            <p><strong>Message:</strong></p>
            <p>${message.trim().replace(/\n/g, "<br />")}</p>
          </div>
        </div>
      `,
    });

    res.json({
      ok: true,
      message: "Your message was sent successfully.",
    });
  } catch (err) {
    next(err);
  }
}

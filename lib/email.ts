import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendPasswordResetEmail(to: string, resetCode: string) {
  await transporter.sendMail({
    from: `"EnglishUp" <${process.env.SMTP_FROM}>`,
    to,
    subject: 'Reset your password',
    html: `
      <p>You requested a password reset.</p>
      <p>Your reset code is: <strong>${resetCode}</strong></p>
      <p>This code expires in 1 hour.</p>
      <p>If you did not request this, ignore this email.</p>
    `,
  })
}

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendPasswordResetEmail = async (email, resetUrl) => {
    try {
        await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: "Password Reset Request",
            html: `
                <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
                    <div style="background:linear-gradient(135deg,#d4a853,#b8892f);padding:30px;text-align:center;">
                        <h1 style="color:#fff;margin:0;font-size:24px;">Password Reset</h1>
                    </div>
                    <div style="padding:30px;background:#f9f9f9;">
                        <p style="font-size:16px;color:#333;">You requested a password reset. Click the button below to reset your password:</p>
                        <div style="text-align:center;margin:30px 0;">
                            <a href="${resetUrl}" style="background:linear-gradient(135deg,#d4a853,#b8892f);color:#fff;padding:14px 40px;text-decoration:none;border-radius:8px;font-size:16px;font-weight:bold;display:inline-block;">Reset Password</a>
                        </div>
                        <p style="font-size:14px;color:#666;">This link will expire in 15 minutes.</p>
                        <p style="font-size:14px;color:#666;">If you didn't request this, please ignore this email.</p>
                        <hr style="border:none;border-top:1px solid #e0e0e0;margin:30px 0;">
                        <p style="font-size:12px;color:#999;">If the button doesn't work, copy and paste this URL into your browser:</p>
                        <p style="font-size:12px;color:#999;word-break:break-all;">${resetUrl}</p>
                    </div>
                </div>
            `,
        });
        return true;
    } catch (error) {
        console.error("Error sending password reset email:", error);
        return false;
    }
};

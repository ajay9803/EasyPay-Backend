import nodemailer from "nodemailer";
import config from "../config";

const userEmail = config.emailService.USER_EMAIL!;
const userEmailPass = config.emailService.USER_EMAIL_PASS;

export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

export const sendSignupOtp = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: userEmail,
      pass: userEmailPass,
    },
  });

  const mailOptions = {
    from: {
      name: "Easy Pay",
      address: userEmail,
    },
    to: email,
    subject: "Password Reset",
    html: `<p>Hello User,</p><p>To reset your password, please use the following OTP: <strong>${otp}</strong></p><p>From Easy Pay</p>`,
  };

  return transporter.sendMail(mailOptions);
};

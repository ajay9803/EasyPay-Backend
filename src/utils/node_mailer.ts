import nodemailer from "nodemailer";
import config from "../config";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const userEmail = config.emailService.USER_EMAIL!;
const userEmailPass = config.emailService.USER_EMAIL_PASS;

/**
 * Generates a random six-digit one-time password (OTP) for authentication purposes.
 *
 * @return {string} A string representing the generated OTP.
 */
export const generateOtp: () => string = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

/**
 * Sends a signup OTP to the specified email address.
 *
 * @param {string} email - The email address to send the OTP to.
 * @param {string} otp - The OTP to include in the email.
 * @return {Promise<any>} A promise that resolves when the email is sent successfully.
 */
export const sendSignupOtp: (
  email: string,
  otp: string
) => Promise<SMTPTransport.SentMessageInfo> = async (
  email: string,
  otp: string
) => {
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
    subject: "Sign Up OTP",
    html: `<p>Hello User,</p><p>To create your account, please use the following OTP: <strong>${otp}</strong></p><p>From Easy Pay</p>`,
  };

  return transporter.sendMail(mailOptions);
};

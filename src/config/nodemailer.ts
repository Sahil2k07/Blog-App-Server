import nodemailer from "nodemailer";

export const mailSender = async (
  email: string,
  title: string,
  body: string
) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "Blog-App with Auth",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    return info;
  } catch (error) {
    console.log("Something went wrong while sending mail.");
    console.error(error);
  }
};
import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  auth: {
    user: "project.1",
    pass: "secret.1",
  },
});

import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
  host: "smtp.rosti.cz",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//export const transporter = nodemailer.createTransport({
//  host: "localhost",
//   port: 1025,
//   auth: {
//   user: "project.1",
//  pass: "secret.1",
//   },
//  });

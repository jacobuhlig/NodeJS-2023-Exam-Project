import dotenv from "dotenv";
dotenv.config();
// dotenv.config({ path: '../../.env' });

import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

export async function sendResetPassword(email, username, url) {
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  // const htmlTemplate = fs.readFileSync('./util/nodemailer/resetPasswordTemplate.hbs',  'utf8');
  const htmlTemplate = fs.readFileSync('./util/nodemailer/compiled-template.html',  'utf8');
  
  const template = handlebars.compile(htmlTemplate);
  
  console.log(process.env.RESET_PASSWORD_TEMPLATE);
  const templateData = {
    resetLink: process.env.RESET_PASSWORD_TEMPLATE + url,
    name: username
  };

  const headers = {
    "List-Unsubscribe": "`<mailto:${process.env.EMAIL_ADDRESS}>, <${process.env.RESET_PASSWORD_TEMPLATE}>`"
  };
  
  console.log(process.env.RESET_PASSWORD_TEMPLATE);

  const html = template(templateData);
  console.log(html);
  
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: `Reset password`,
    html: html,
    headers: headers
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Response-code: ${info.response}`);
    return { ok: true, message: info.response };
  } catch (error) {
    console.log(error);
    return { ok: false, message: error.message };
  }
}
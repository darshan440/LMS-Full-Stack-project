require("dotenv").config();
import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

interface EmailOption {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (option: EmailOption): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    secure: true, // Use true for port 465, false for other ports
    logger: true,

    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = option;

  // Get the path to the email template file
  const templatePath = path.join(__dirname, "../mails", template);

  // Render the email template with ejs
  const html: string = await ejs.renderFile(templatePath, data);

  const mailOption = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOption);
};

export default sendMail;

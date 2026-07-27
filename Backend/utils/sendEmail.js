const nodeMailer = require("nodemailer");


const sendMail = async (to, subject, msg) => {
  try {
    const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOption = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: msg
  };

  await transporter.sendMail(mailOption);

  }catch(err){
    console.log(err);
  }
}
module.exports = sendMail;
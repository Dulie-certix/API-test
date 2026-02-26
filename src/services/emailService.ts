import transporter from "../config/email.ts";

export const sendConfirmationEmail = async (userEmail: string, userName: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Complaint Received",
    text: `Dear ${userName},\n\nYour complaint has been successfully received. We will review it and get back to you soon.\n\nThank you for contacting us.`
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordEmail = async (userEmail: string, userName: string, password: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Your Account Password",
    html: `
      <h1>Welcome ${userName}!</h1>
      <p>Your account has been created successfully.</p>
      <p>Email : ${userEmail}</p>
      <p>Password :<b>${password}</b></p>
      <p>Please keep this password secure and change it after your first login.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendReplyEmail = async (userEmail: string, replyMessage: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Complaint Reply",
    text: replyMessage
  };

  await transporter.sendMail(mailOptions);
};

export const sendAdminNotification = async (userName: string, userEmail: string, subject: string, message: string) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!adminEmail) {
    throw new Error("ADMIN_EMAIL not configured in environment variables");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: "New Complaint Received",
    html: `
      <h3>New Complaint Submitted</h3>
      <p><b>User Name:</b> ${userName}</p>
      <p><b>User Email:</b> ${userEmail}</p>
      <p><b>Subject:</b> ${subject}</p>
      <p><b>Message:</b> ${message}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

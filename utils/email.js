const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send notification about new registration
exports.sendRegistrationNotification = async (registration, event) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Registration: ${event.title}`,
    html: `
      <h2>New Event Registration</h2>
      <p><strong>Event:</strong> ${event.title}</p>
      <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Name:</strong> ${registration.name}</p>
      <p><strong>Email:</strong> ${registration.email}</p>
      <p><strong>Phone:</strong> ${registration.phone}</p>
      <p><strong>Registered at:</strong> ${new Date(registration.registeredAt).toLocaleString()}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Registration notification email sent');
  } catch (error) {
    console.error('Email error:', error);
  }
};

// Send notification about contact form submission
exports.sendContactNotification = async (message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Message: ${message.subject}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${message.name}</p>
      <p><strong>Email:</strong> ${message.email}</p>
      <p><strong>Subject:</strong> ${message.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.message}</p>
      <p><strong>Sent at:</strong> ${new Date(message.createdAt).toLocaleString()}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent');
  } catch (error) {
    console.error('Email error:', error);
  }
};
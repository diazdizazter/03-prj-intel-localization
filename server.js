const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createTransport() {
  return nodemailer.createTransport({
    host: requireEnv('SMTP_HOST'),
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user: requireEnv('SMTP_USER'),
      pass: requireEnv('SMTP_PASS')
    }
  });
}

app.post('/api/subscribe', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  let transporter;
  try {
    transporter = createTransport();
  } catch (error) {
    return res.status(500).json({
      message: 'Server email configuration is missing. Set SMTP environment variables first.'
    });
  }

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: email,
      subject: 'Subscription Confirmed — Intel Sustainability Updates',
      text: `Thanks for subscribing, ${email}!\n\nYou are now signed up for updates on Intel sustainability milestones.`,
      html: `
        <p>Thanks for subscribing, <strong>${email}</strong>!</p>
        <p>You are now signed up for updates on Intel sustainability milestones.</p>
      `
    });

    return res.status(200).json({ message: 'Confirmation email sent successfully.' });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not send confirmation email. Verify your SMTP settings.'
    });
  }
});

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

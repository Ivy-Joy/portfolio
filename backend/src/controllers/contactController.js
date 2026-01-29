// import Contact from '../models/Contact.js';
// import nodemailer from 'nodemailer';

// console.log('EMAIL USER:', process.env.CONTACT_EMAIL_USER);
// console.log('EMAIL PASS:', process.env.CONTACT_EMAIL_PASS ? 'SET' : 'MISSING');

// const transporter = nodemailer.createTransport({
//   // host: process.env.CONTACT_EMAIL_SMTP_HOST,
//   // port: Number(process.env.CONTACT_EMAIL_SMTP_PORT),
//   service: 'gmail',
//   secure: false, //use TLS
//   auth: {
//     user: process.env.CONTACT_EMAIL_USER,
//     pass: process.env.CONTACT_EMAIL_PASS
//   }
// });

// // Test connection once on server start
// transporter.verify((err, success) => {
//   if (err) {
//     console.error('Email transporter error:', err);
//   } else {
//     console.log('Email transporter ready');
//   }
// });

// export const create = async (req, res) => {
//   const { name, email, message } = req.body;
//   if (!email || !message) return res.status(400).json({ error: 'Missing required fields' });

//   try {
//     //Save to database
//     const doc = new Contact({ name, email, message });
//     await doc.save();

//     // send notification email to my gmail
//     const mailOptions = {
//       from: `"${name || 'Portfolio Visitor'}" <${process.env.CONTACT_EMAIL_USER}>`,
//       to: process.env.CONTACT_EMAIL_TO,
//       subject: `New message from ${name || email}`,
//       text: `Name: ${name || 'Not provided'}\nEmail: ${email}\n\n${message}`
//     };

//     transporter.sendMail(mailOptions).catch((err) => {
//       // log email errors but don't fail the request
//       if (err) {
//         console.error('Email send error:', err);
//       } else {
//         console.log('Email sent:', info.messageId);
//       }
//     });

//     //res.json({ success: true, saved: true });
//     res.json({ success: true, message: 'Message sent successfully' });
//   } catch (err) {
//     console.error('Contact form error:', err);
//     res.status(500).json({ error: 'Failed to send message' });
//   }
// };

import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

// Helper to get transporter only when variables are ready
const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CONTACT_EMAIL_USER,
      pass: process.env.CONTACT_EMAIL_PASS
    }
  });
};

export const create = async (req, res) => {
  const { name, email, message } = req.body;
  if (!email || !message) return res.status(400).json({ error: 'Missing required fields' });

  try {
    // Save to database
    const doc = new Contact({ name, email, message });
    await doc.save();

    // Initialize transporter HERE, not at the top of the file
    const transporter = getTransporter();

    const mailOptions = {
      // Keep 'from' as your authenticated email so Gmail doesn't block it
      //from: `"${name || 'Portfolio Visitor'}" <${process.env.CONTACT_EMAIL_USER}>`,

      // 1. DISPLAY NAME trick: Put their name and email inside the "quotes"
      // This makes your inbox show: "Jia (teacherjia@gmail.com) via Portfolio"
      from: `"${name} (${email}) via Portfolio" <${process.env.CONTACT_EMAIL_USER}>`,

      // 2. The real destination for replies. This ensures clicking "Reply" goes to the person who filled out the form
      replyTo: email,
  
      to: process.env.CONTACT_EMAIL_TO,
      subject: `New message from ${name || email}`,
      text: `Name: ${name || 'Not provided'}\nEmail: ${email}\n\n${message}`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};
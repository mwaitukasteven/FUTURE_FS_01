const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please fill all fields' 
        });
    }
    
    try {
        // Email to you
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `📬 Portfolio Message from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        });
        
        // Auto-reply
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Thanks for contacting me!",
            html: `
                <h2>Thank you, ${name}!</h2>
                <p>I've received your message and will respond within 24 hours.</p>
                <p>Best regards,<br>Your Name</p>
            `
        });
        
        res.json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Contact form active\n`);
});
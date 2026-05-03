const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serves your HTML/CSS/JS

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test email connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Email configuration error:', error);
    } else {
        console.log('✅ Email ready to send messages');
    }
});

// API Route: Handle contact form
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please fill all fields' 
        });
    }
    
    try {
        // Email to YOU (the portfolio owner)
        const adminMail = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `📬 New Portfolio Message from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p>Reply to: ${email}</p>
            `
        };
        
        // Auto-reply to the person who contacted you
        const userReply = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Thanks for contacting me!",
            html: `
                <h2>Thank you for reaching out, ${name}!</h2>
                <p>I've received your message and will get back to you within 24 hours.</p>
                <p>Here's a copy of your message:</p>
                <p><em>${message}</em></p>
                <br>
                <p>Best regards,</p>
                <p><strong>Your Name</strong></p>
                <p><a href="https://your-portfolio.com">your-portfolio.com</a></p>
            `
        };
        
        // Send both emails
        await transporter.sendMail(adminMail);
        await transporter.sendMail(userReply);
        
        console.log(`📧 Message from ${name} (${email})`);
        
        res.json({ 
            success: true, 
            message: "Message sent! I'll respond within 24 hours." 
        });
        
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Server error. Please try again or email me directly." 
        });
    }
});

// API Route: Get portfolio stats (optional)
app.get('/api/stats', (req, res) => {
    res.json({
        messageCount: 0, // You can add database later
        lastMessage: null
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Contact form will send emails to: ${process.env.EMAIL_USER}`);
    console.log(`📁 Open your portfolio at: http://localhost:${PORT}\n`);
});
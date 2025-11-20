const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const port = 8081;

// Middleware - IMPORTANT
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS Fix
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST, GET');
    next();
});

// Serve static files
app.use(express.static(__dirname));

// Serve Feedback Form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Feedbackform.html'));
});

// Email transporter setup - WITH YOUR APP PASSWORD
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'amalap11413@gmail.com',
        pass: 'bprs zrjz oheb ewhx' // YOUR APP PASSWORD
    }
});

// Feedback API - UPDATED WITH EMAIL
app.post('/api/feedback', async (req, res) => {
    try {
        const { name, email, mobile, type, comments } = req.body;
        
        console.log('🎯 FEEDBACK RECEIVED!');
        console.log('📧 Name:', name);
        console.log('📧 Email:', email);
        console.log('📧 Mobile:', mobile);
        console.log('📧 Type:', type);
        console.log('📧 Comments:', comments);

        // Send confirmation email to user
        const mailOptions = {
            from: 'amalap11413@gmail.com',
            to: email, // User's email from form
            subject: 'Thank You for Your Feedback!',
            html: `
                <h3>Dear ${name},</h3>
                <p>Thank you for submitting your feedback!</p>
                <p><strong>Your Details:</strong></p>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Mobile:</strong> ${mobile}</li>
                    <li><strong>Feedback Type:</strong> ${type}</li>
                    <li><strong>Comments:</strong> ${comments}</li>
                </ul>
                <p>We appreciate your input and will get back to you soon.</p>
                <br>
                <p>Best regards,<br>Feedback Team</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('✅ Confirmation email sent to:', email);

        res.json({ 
            success: true, 
            message: 'Thank you! Your feedback has been submitted successfully.' 
        });

    } catch (error) {
        console.log('❌ Email error:', error);
        res.json({ 
            success: false, 
            message: 'Feedback received but email failed.' 
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log('✅ Ready to receive feedback!');
});
require('dotenv').config();
const express = require('express');
const emailjs = require('@emailjs/nodejs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
    origin: ['https://kamal-singh-01.github.io', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
};

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// API endpoint for sending emails
app.post('/send-email', async (req, res) => {
    const { from_name, from_email, message, phone } = req.body;

    if (!from_name || !from_email || !message) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const templateParams = {
        from_name: from_name,
        from_email: from_email,
        message: message,
        phone: phone,
        to_name: 'Your Name',
    };

    try {
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            templateParams,
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY,
            }
        );

        console.log('Email sent successfully');
        res.status(200).json({ message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
});

// Catch-all route to serve index.html for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
}); 
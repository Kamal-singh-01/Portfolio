require('dotenv').config();
const express = require('express');
const emailjs = require('@emailjs/nodejs');
const cors = require('cors'); // Import cors package

const app = express();
const port = process.env.PORT || 3000; // Use port 3000 or environment variable

// Use cors middleware to allow cross-origin requests from your frontend
// In production, you should restrict this to your frontend's domain
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to receive contact form data
app.post('/send-email', async (req, res) => {
    const { from_name, from_email, message, phone } = req.body; // Get data from request body

    // Basic server-side validation (optional but recommended)
    if (!from_name || !from_email || !message) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // Prepare template parameters
    const templateParams = {
        from_name: from_name,
        from_email: from_email,
        message: message,
        phone: phone, // Include phone number if sent
        to_name: 'Your Name', // Replace with your name
    };

    try {
        // Send email using EmailJS with your private key
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            templateParams,
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY, // Public key is sometimes needed even server-side depending on EmailJS setup/version
                privateKey: process.env.EMAILJS_PRIVATE_KEY, // Use your private key
            }
        );

        console.log('Email sent successfully');
        res.status(200).json({ message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
}); 
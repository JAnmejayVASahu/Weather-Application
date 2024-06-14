const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const path = require('path');

const app = express();
const port = 6000;

// Parse JSON bodies for this app
app.use(bodyParser.json());

// Replace with your VAPID keys
const publicKey = 'BHVyHC_cr-SxVui5s3QRBZ_5kzCS2yEc-KdkScgTM6Kcxf9f0jyLcGXRjDZ2R0dw6GdqcjZxHVu8k1SGZ00NEzo';
const privateKey = '4_oLrsYyur5SbJQCNFXVrMWQwAgAaphLWlSsyf7oH-0';
const subject = 'mailto:chikunsahu73@gmail.com';

// Set VAPID keys for webpush
webpush.setVapidDetails(subject, publicKey, privateKey);

// Store subscriptions in memory (use a database in production)
let subscriptions = [];

// Endpoint to receive subscription data from clients
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription); // Store the subscription in memory or database
    res.status(201).json({ message: 'Subscription stored successfully' });
});

// Example endpoint to trigger push notifications
app.post('/send-notification', async (req, res) => {
    const { title, body } = req.body;

    Promise.all(subscriptions.map(sub => {
        return webpush.sendNotification(sub, JSON.stringify({ title, body }));
    }))
    .then(() => res.status(200).json({ message: 'Push notifications sent successfully' }))
    .catch(err => {
        console.error('Error sending push notifications:', err);
        res.sendStatus(500);
    });
});

// Serve static files from the 'Script' directory
app.use(express.static(path.join(__dirname, 'Script')));

// Example route for serving index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

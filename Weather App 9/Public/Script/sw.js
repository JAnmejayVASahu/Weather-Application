// Event listener for the 'push' event
self.addEventListener('push', event => {
    // Parse the incoming data from the push message as JSON
    const data = event.data.json();
    const { title, body } = data; // Extract 'title' and 'body' from the data

    // Show the notification to the user
    event.waitUntil(
        self.registration.showNotification(title, {
            body, // Set the body of the notification
            icon: '/Public/images/notification-bell.png', // Replace with your notification icon path
            badge: '/Public/images/notification.png' // Replace with your notification badge path
        })
    );
});

self.addEventListener("push", (event) => {
    let payload;
    try {
        payload = event.data.json();
    } catch (e) {
        payload = {
            title: 'GECO',
            body: event.data.text(),
            icon: '/icon-192x192.png'
        };
    }
    
    const { title, body, icon, image, badge, data } = payload;

    console.log('Received push notification with payload:', payload);

    const notificationOptions = {
        body,
        image,
        icon: icon || '/icon-192x192.png', 
        badge,
        // Make sure data is properly structured
        data: {
            url: data?.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(title || 'GECO', notificationOptions)
    );
});

self.addEventListener("notificationclick", (event) => {
    console.log('Notification clicked:', event.notification);
    console.log('Notification data:', event.notification.data);
    
    event.notification.close();
    
    // Get the URL from the notification data
    const targetUrl = event.notification.data?.url || '/';
    console.log('Attempting to open URL:', targetUrl);
    
    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true })
            .then((clientList) => {
                // Check if a window/tab is already open with the URL
                for (const client of clientList) {
                    if (client.url.includes(targetUrl) && 'focus' in client) {
                        console.log('Found existing client, focusing');
                        return client.focus();
                    }
                }
                
                // If no existing window/tab, open a new one
                console.log('Opening new window with URL:', targetUrl);
                return self.clients.openWindow(targetUrl);
            })
            .catch(err => {
                console.error('Error handling notification click:', err);
            })
    );
});
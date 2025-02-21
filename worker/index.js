self.addEventListener("push", (event) => {
    const payload = event.data.json();
    const { body, icon, image, badge, url, title } = payload;

    const notificationOptions = {
        body,
        image,
        data: {
            url,
        },
        badge,
    };


  event.waitUntil(
    self.registration.showNotification(title ?? 'GECO', {
      body: event.data.text(),
      icon: '/icon-192x192.png',
      ...notificationOptions,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return self.clients.openWindow("/");
      })
  );
});
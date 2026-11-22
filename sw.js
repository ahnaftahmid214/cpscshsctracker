self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// নোটিফিকেশনে ক্লিক করলে সরাসরি ongoing.html পেজ ওপেন হবে
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes('ongoing.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('ongoing.html');
            }
        })
    );
});


// ইউজার ভুলে হাত দিয়ে নোটিফিকেশন মুছে দিলে আবার ফিরিয়ে আনবে
self.addEventListener('notificationclose', (event) => {
    const n = event.notification;
    if (n.data && n.data.sticky) {
        event.waitUntil(
            self.registration.showNotification(n.title, {
                body: n.body,
                icon: n.icon,
                tag: n.tag,
                renotify: false,
                silent: false,
                requireInteraction: true,
                data: n.data
            })
        );
    }
});

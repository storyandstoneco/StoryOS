// StoryOS service worker — only used to show chat notifications (works on Android
// Chrome, where page-created notifications aren't allowed) and to focus StoryOS
// when one is clicked. It does NOT cache anything, so updates are never stale.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const channel = (e.notification.data && e.notification.data.channel) || '';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const tab = list.find(c => new URL(c.url).pathname.startsWith(new URL(self.registration.scope).pathname));
    if (tab) { tab.postMessage({ type: 'open-chat', channel }); return tab.focus(); }
    return self.clients.openWindow(self.registration.scope + (channel ? '#chat=' + encodeURIComponent(channel) : ''));
  }));
});

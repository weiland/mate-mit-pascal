/* eslint-env browser, serviceworker, es6 */

'use strict';

/* eslint-disable max-len */

const applicationServerPublicKey =
	'BNNgw7qhfBReZAmMtBaFSWWvG8NsytPFJvNnSsz3I31xg10hjDYvN7UkV4RY-cyOi8JLfraAEH78PuGBF7zkfRA';

/* eslint-enable max-len */

function urlB64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

	const rawData = self.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

self.addEventListener('push', function (event) {
	console.log('[Service Worker] Push Received.');
	const text = event.data.text();
	console.log(`[Service Worker] Push had this data: "${text}"`);

	const [name, url] = text.split(' ');

	const title = `🧉 Meeting with ${name}`;
	const options = {
		body: `New Meeting with "${name}". ${url}`,
		icon: '/icon.png',
		badge: '/badge.png',
	};

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
	console.log('[Service Worker] Notification click Received.');

	event.notification.close();

	event.waitUntil(
		clients.openWindow('https://drink-mate-with.keinehobbi.es/overview/'),
	);
});

self.addEventListener('pushsubscriptionchange', function (event) {
	console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
	const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
	event.waitUntil(
		self.registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: applicationServerKey,
		})
			.then(function (newSubscription) {
				// TODO: Send to application server
				console.log(
					'[Service Worker] New subscription: ',
					newSubscription,
				);
			}),
	);
});

/// <reference lib="deno.unstable" />
// import webpush from 'npm:web-push'; // Deno Deploy does not support it (also it does not work in Deno)

export interface PushSubscription {
	userId?: string;
	endpoint: string;
	keys: {
		auth: string;
		p256dh: string;
	};
}

// VAPID
const subject = 'https://drink-mate-with.keinehobbi.es/';
const publicKey = Deno.env.get('VITE_PUSH_PUBLIC_KEY');
const privateKey = Deno.env.get('PUSH_PRIVATE_KEY');

const KEY_NAME = 'push';
const PUSH_USER = 'pascal';

const kv = await Deno.openKv();

/**
 * Get push subscription.
 */
export async function getPushSubscription(): Promise<PushSubscription> {
	const pushKey = [KEY_NAME, PUSH_USER];
	const response = await kv.get(pushKey);
	if (!response || !response.value) {
		throw new Error(
			`Something went wrong when receiving the push subscription db entry with the user '${PUSH_USER}'.`,
		);
	}
	return JSON.parse(response.value as string) as PushSubscription;
}

/**
 * Set push subscription.
 * @param PushSubscription
 */
export async function setPushSubscription(
	subscription: PushSubscription,
): Promise<PushSubscription> {
	const pushKey = [KEY_NAME, PUSH_USER];
	const response = await kv.set(pushKey, subscription);
	if (!response) {
		throw new Error(
			'Something went wrong when creating the subscription db entry.',
		);
	}
	return subscription;
}
// TODO: move out push part to separate file

// Temporarely, use other service since web-push does not work in Deno. :c
async function fakePush(subscription: PushSubscription, message: string) {
	const otherHost = Deno.env.get('OTHER_HOST');
	const options = {
		credentials: 'omit',
		'headers': {
			'User-Agent':
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/116.0',
			'Accept': '*/*',
			'Accept-Language': 'en-US,en;q=0.5',
			'Content-Type': 'application/json',
			'Sec-Fetch-Dest': 'empty',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Site': 'same-origin',
			'Pragma': 'no-cache',
			'Cache-Control': 'no-cache',
		},
		'referrer': otherHost,
		'body': `{"subscription":${
			JSON.stringify(subscription)
		},"data":"${message}","applicationKeys":{"public":"${publicKey}","private":"${privateKey}"}}`,
		method: 'POST',
		mode: 'cors',
	};
	console.log('options', options);
	return await fetch(`${otherHost}api/send-push-msg`, options);
}

function sendPushToUser(
	subscription: PushSubscription,
	payload: string,
): Promise<{ statusCode: number; body: string; headers: string }> {
	const options = {
		vapidDetails: {
			subject,
			publicKey,
			privateKey,
		},
		// 1 hour in seconds.
		TTL: 60 * 60,
	};

	console.log('options', options);

	// const notification = JSON.stringify({
	// 	title: 'Hello Notifications',
	// 	options: {
	// 		body: `ID: ${Math.floor(Math.random() * 1000)}`,
	// 	},
	// });

	// return webpush.sendNotification(
	// 	subscription,
	// 	payload, // || notification,
	// 	options,
	// );
	// .catch((e: Error) => console.error('web-push err', e));
}

export async function sendPush(name: string, id: string) {
	const subscription = await getPushSubscription();
	const message =
		`${name} https://drink-mate-with.keinehobbi.es/meetings/${id}`;

	return fakePush(subscription, message);
	// return sendPushToUser(subscription, message);
}

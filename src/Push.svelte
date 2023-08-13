<script lang="ts">
	import { onMount } from "svelte";
	import { API_BASE_URL, PUBLIC_KEY } from "./config";

	// let loggedIn = false;
	let error: false | string = false;

	let isSubscribed = false;

	let pushButtonText = "Enable Push Messaging (init)";
	let pushButtonDisabled = true;

	let subscriptionJson = "";
	let subscriptionDetailsHidden = false;

	console.log("push key", PUBLIC_KEY);

	let swRegistration: ServiceWorkerRegistration;

	const updateBtn = () => {
		if (Notification.permission === "denied") {
			pushButtonText = "Push Messaging Blocked";
			pushButtonDisabled = true;
			updateSubscriptionOnServer(null);
			error = "permissions are denied";
			return;
		}

		if (isSubscribed) {
			pushButtonText = "Disable Push Messaging";
		} else {
			pushButtonText = "Enable Push Messaging";
		}

		pushButtonDisabled = false;
	};

	const initializeUI = () => {
		swRegistration.pushManager
			.getSubscription()
			.then((subscription: PushSubscription | null) => {
				isSubscribed = !(subscription === null);

				if (isSubscribed) {
					console.log("User IS subscribed.");
				} else {
					console.log("User is NOT subscribed.");
					error = "user is not subscribed";

				}

				updateBtn();
			});
	};

	const handlePushNotifications = () => {
		if ("serviceWorker" in navigator && "PushManager" in window) {
			console.log("Service Worker and Push are supported");

			navigator.serviceWorker
				.register("/sw.js")
				.then((swReg) => {
					console.log(
						"Service Worker is registered",
						swReg
					);

					swRegistration = swReg;
					initializeUI();
				})
				.catch((error) => {
					error = "service worker error"
					console.error(
						"Service Worker Error",
						error
					);
				});
		} else {
			console.warn("Push messaging is not supported");
			pushButtonText = "Push Not Supported";
		}
	};

	const updateSubscriptionOnServer = (
		subscription: PushSubscription | null
	) => {
		if (subscription) {
			subscriptionJson = JSON.stringify(subscription);
			fetch(`${API_BASE_URL}/push`, {
				method: "POST",
				body: subscriptionJson,
			})
				.then((res) =>
					console.log(
						"sent to backend.",
						res.status
					)
				)
				.catch((err) =>
					console.error(
						"Error during push user creation",
						err
					)
				);
			subscriptionDetailsHidden = false;
		} else {
			subscriptionDetailsHidden = true;
		}
	};

	const unsubscribeUser = () => {
		swRegistration.pushManager
			.getSubscription()
			.then((subscription: PushSubscription | null) => {
				if (subscription) {
					return subscription.unsubscribe();
				}
			})
			.catch((error: Error) => {
				console.log("Error unsubscribing", error);
			})
			.then(() => {
				updateSubscriptionOnServer(null);

				console.log("User is unsubscribed.");
				isSubscribed = false;

				updateBtn();
			});
	};

	const subscribeUser = () => {
		const applicationServerKey = urlB64ToUint8Array(PUBLIC_KEY);
		swRegistration.pushManager
			.subscribe({
				userVisibleOnly: true,
				applicationServerKey: applicationServerKey,
			})
			.then((subscription: PushSubscription) => {
				console.log("User is subscribed.");

				updateSubscriptionOnServer(subscription);

				isSubscribed = true;

				updateBtn();
			})
			.catch((error: Error) => {
				console.error(
					"Failed to subscribe the user: ",
					error
				);
				updateBtn();
			});
	};

	const handlePushButtonClick = (event: MouseEvent) => {
		console.log(event);
		pushButtonDisabled = true;
		if (isSubscribed) {
			unsubscribeUser();
		} else {
			subscribeUser();
		}
	};

	onMount(async () => {
		handlePushNotifications();
	});

	function urlB64ToUint8Array(base64String: string): Uint8Array {
		const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding)
			.replace(/\-/g, "+")
			.replace(/_/g, "/");

		const rawData = self.atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	}
</script>

<div>
	{#if error}
		<p>
			Push Error:
			{error}
		</p>
	{/if}
	<section
		hidden={subscriptionDetailsHidden}
		class="subscription-details js-subscription-details"
	>
		<pre><code
				class="js-subscription-json"
			/>{subscriptionJson}</pre>
	</section>
	<button disabled={pushButtonDisabled} on:click={handlePushButtonClick}
		>{pushButtonText}</button
	>
</div>

<style>
</style>

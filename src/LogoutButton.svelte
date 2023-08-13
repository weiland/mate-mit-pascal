<script lang="ts">
	import { isLoggedIn } from "./stores";
	import { API_BASE_URL } from "./config";

	let loggedIn = false;

	isLoggedIn?.subscribe((value: boolean) => {
		console.log("login update (in footer) to:", value);
		loggedIn = value;
	});

	const logout = async (): Promise<void> => {
		await fetch(`${API_BASE_URL}/logout`).then((res) => {
			console.log(`logged out, ${res.status}`);
			if (res.status === 200) {
				isLoggedIn?.set(false);
			}
		});
	};
</script>

{#if loggedIn}
	| <button on:click|preventDefault={logout}>Logout</button>
	| <a href="/overview">Overview</a>
{/if}

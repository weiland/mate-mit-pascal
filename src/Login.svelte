<script lang="ts">
	import { isLoggedIn } from "./stores";
	import { API_BASE_URL } from "./config";

	let error = "";
	let loggedIn = false;

	isLoggedIn?.subscribe((value: boolean) => {
		console.log("login update (in login comp) to:", value);
		loggedIn = value;
	});

	// TODO(pascal): move out to Login component
	const handleLogin = async (event: SubmitEvent) => {
		const form = event.target as HTMLFormElement;
		const body = new FormData(form);
		error = "";

		return await fetch(`${API_BASE_URL}/login`, {
			method: "post",
			body,
		})
			.then(async (res) => {
				const { status } = res;
				if (status >= 400) {
					throw new Error(`Status is ${status} (${res.statusText})`);
				}
				const json = await res.json();
				if (json.error) {
					throw new Error(
						`Backend Error during login: ${json.error}.`
					);
				}

				console.log("login was successful");
				isLoggedIn?.set(true);
				form.reset();
			})
			.catch((e) => {
				error = "login failed :c";
				console.error("login failed with", e);
			});
	};
</script>

{#if !loggedIn}
	{#if error}
		<p>
			Login Error:
			{error}
		</p>
	{/if}
	<form
		on:submit|preventDefault={handleLogin}
		action="/api/login"
		method="POST"
	>
		<input type="password" name="password" />
		<input type="submit" value="Login" />
	</form>
{/if}

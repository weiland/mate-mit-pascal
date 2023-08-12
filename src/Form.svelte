<script lang="ts">
	import { onMount } from "svelte";
	import {
		DRINKS,
		OTHER_DRINK,
		getDefaultDrink,
		namesMap,
		DEFAULT_STATE,
		MEETINGS_API_URL,
	} from "./config.ts";

	export let state: string = "";
	let drink = getDefaultDrink();
	let other_drink = "";
	export let name = "";
	let inProgress = false;
	let error: string | false = false;

	function updateFocus(event: FocusEvent) {
		const name = (event.target as HTMLInputElement)?.name;
		if (!name || !(name in namesMap)) {
			return;
		}
		state = namesMap[name];
	}
	const resetFocus = () => (state = namesMap[DEFAULT_STATE]);

	function startsWithVowel(name: string) {
		return name.length > 0 && name[0].match("a|e|i|o|u/i");
	}

	async function addMeeting(event: SubmitEvent) {
		const target = event.target as HTMLFormElement;

		inProgress = true;
		error = false;

		const form = new FormData(target);
		return await fetch(MEETINGS_API_URL, {
			method: "post",
			body: form,
		})
			.then(async (res) => {
				const { status } = res;
				if (status >= 400) {
					console.error(
						`Status is ${status} (${res.statusText})`
					);
					error =
						status >= 500
							? "I'm sorry, but a server error occurred. Please try again, later."
							: "There was someting wrong with storing the data. :c";
					return;
				}

				const json = await res.json();

				// should be existing, usually.
				const { id } = json;
				if (!id) {
					throw new Error(
						`Could not extract the id from the server response.`,
						json
					);
				}

				target.reset();

				window.location.href = `/meetings/${id}`;
			})
			.catch((err) => {
				error = "An unexpected error occurred. :c";
				console.error("error during fetch", err);
			})
			.finally(() => {
				inProgress = false;
			});
	}

	onMount(() => {
		resetFocus();
	});
</script>

<form
	action="/api/meetings"
	method="POST"
	on:submit|preventDefault={addMeeting}
	class="form"
>
	{#if error}
		<h2>🚨 Oh no! An error occurred</h2>
		<p class="error">
			{error}
		</p>
	{/if}
	<p>
		<label for="drink" aria-label="Choose a drink"
			>Let's drink a{startsWithVowel(drink) ? "n" : ""}</label
		>
		<!-- <input -->
		<!-- 	type="number" -->
		<!-- 	name="amount" -->
		<!-- 	id="amount" -->
		<!-- 	class="input" -->
		<!-- 	value="1" -->
		<!-- 	min="-1" -->
		<!-- 	size="4" -->
		<!-- 	on:focus={updateFocus} -->
		<!-- 	on:blur={resetFocus} -->
		<!-- 	max="1337" -->
		<!-- /> -->
		<select
			bind:value={drink}
			name="drink"
			id="drink"
			class="input"
			on:focus={updateFocus}
			on:blur={resetFocus}
		>
			{#each DRINKS as drinkit}
				<option
					value={drinkit}
					selected={drink === drinkit}
					>{drinkit}</option
				>
			{/each}
		</select>
		<input
			aria-label="Enter other drink name."
			bind:value={other_drink}
			name="other_drink"
			aria-hidden={drink !== OTHER_DRINK}
			id="other_drink"
			type="text"
			class="input"
			on:focus={updateFocus}
			on:blur={resetFocus}
			placeholder="1337-Mate"
		/>
		together!
	</p>
	<div>
		<label for="name">🫵 name (required):</label>
		<input
			bind:value={name}
			name="name"
			id="name"
			type="text"
			class="input"
			required
			on:focus={updateFocus}
			on:blur={resetFocus}
			placeholder="drinker@ma.te (they/them)"
		/>
	</div>
	<div>
		<label for="when">⌚️ When:</label>
		<input
			name="when"
			id="when"
			type="text"
			class="input"
			on:focus={updateFocus}
			on:blur={resetFocus}
			placeholder="today at 13:37 CET"
		/>
	</div>
	<div>
		<label for="where">📍 Where:</label>
		<input
			name="where"
			id="where"
			class="input"
			type="text"
			on:focus={updateFocus}
			on:blur={resetFocus}
			placeholder="on the hill"
		/>
	</div>
	<div>
		<label for="extra">✏️ Additional note/message:</label>
		<textarea
			name="extra"
			id="extra"
			class="input"
			on:focus={updateFocus}
			on:blur={resetFocus}
			placeholder="take two Blåhajar and sunscreen with you"
		/>
	</div>
	<div>
		<button disabled={inProgress} class="btn"
			>👉 Let's drink a {(drink === OTHER_DRINK
				? other_drink
				: drink) || "mate"}
			together! (send)</button
		>
	</div>
</form>

<style>
	.form {
		display: grid;
		gap: 0.5rem;
		line-height: 1.3;
	}
	p {
		grid-template-columns: repeat(1fr 1fr);
	}

	[aria-hidden="true"] {
		display: none;
		pointer-events: none;
	}

	label {
		display: inline-block;
		margin: 1rem auto 0.25rem;
		text-shadow: 0 0 1rem rgba(255, 255, 255, 0.75);
	}

	textarea {
		width: 74%;
	}

	.input:hover {
		background: rgba(255, 255, 255, 0.97);
		box-shadow: 0 0.375rem 1.25rem 0 rgba(251, 237, 156, 0.9);
	}

	.input:focus,
	.input:focus-visible {
		background: var(--white);
		outline: none;
		transition: none;
		box-shadow: 0 0 0 0.125rem var(--cm-yellow-bright),
			0 0 0 0.4rem var(--cm-blue);
	}
	.error {
		padding: 0.75rem;
		border-radius: 0.25rem;
		color: var(--cm-red);
		box-shadow: 0 0 0 0.3rem var(--cm-red);
	}
</style>

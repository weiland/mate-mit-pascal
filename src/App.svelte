<script lang="ts">
	import { onMount } from "svelte";

	const DEFAULT_NAME = import.meta.env.NAME ?? "Pasci";
	const DRINKS = [
		"Traditional Mate 🧉",
		"Flora Power",
		"Club-Mate",
		// 'Sperma',
		"Premium Cola",
		"Tschunk",
		"Virgin Tschunk",
		"Cocktail",
		"Water (laut)",
		"Water (leise)",
		"🚬-Wasser", // :c
		"other",
	];

	function getDefaultDrink(): string {
		// TOOD(pascal): first check caffeine hour
		// TODO(pascal): then check temperature

		return DRINKS[0];
	}

	let state = "";
	let drink = getDefaultDrink();
	let other_drink = "";
	let name = "";

	let drinks = (otherDrink: string) => [
		...DRINKS,
		// `other${otherDrink ? ` (${otherDrink})` : ""}`,
	];

	const namesMap: Record<string, string> = {
		amount: "🔄",
		name: "🫵",
		drink: "🧉",
		when: "⌚️",
		where: "📍",
		extra: "✏️",
		horny: "🍆",
	};
	function updateFocus(event: FocusEvent) {
		const name = (event.target as HTMLInputElement)?.name;
		if (!name || !(name in namesMap)) {
			return;
		}
		state = namesMap[name];
	}
	const resetFocus = () => (state = namesMap["drink"]);

	function startsWithVowel(name: string) {
		return name[0].match("a|e|i|o|u/i");
	}

	async function sendForm(event: SubmitEvent) {
		const form = new FormData(event.target as HTMLFormElement);
		console.log("from", form);
		return await fetch("/api/meetings", {
			method: 'post',
			body: form,
		}).catch((error) => {
			console.error("error during fetch", error);
		});
	}

	onMount(() => {
		resetFocus();
	});
</script>

<main class="la-✋">
	<h1 class="font--mate">
		{state} Mate with <span>{name || DEFAULT_NAME}</span>
	</h1>

	<div class="card">
		<div class="card-content">
			<form
				action="/api"
				method="POST"
				on:submit|preventDefault={sendForm}
			>
				<p>
					<label
						for="drink"
						aria-label="Choose a drink"
						>Let's drink a{startsWithVowel(
							drink
						)
							? "n"
							: ""}</label
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
						{#each drinks(other_drink) as drinkit}
							<option
								value={drinkit}
								selected={drink ===
									drinkit}
								>{drinkit}</option
							>
						{/each}
					</select>
					<input
						bind:value={other_drink}
						name="other_drink"
						aria-hidden={drink !==
							drinks(
								other_drink
							).reverse()[0]}
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
					<label for="name"
						>🫵 name (required):</label
					>
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
					<label for="extra"
						>✏️ Additional note/message:</label
					>
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
					<button class="btn"
						>👉 Let's drink a {drink ||
							"mate"}
						together! (send)</button
					>
				</div>
			</form>
		</div>
	</div>
</main>

<footer class="footer">
	🧉 | created by <a
		href="https://chaos.social/@pascal"
		rel="noopener"
		target="_blank">@pascal@chaos.social</a
	>
	| code @
	<a
		href="https://github.com/weiland/mate-mit-pascal/"
		rel="noreferrer noopener"
		target="_blank">github.com/mate-mit-pascal</a
	>
</footer>

<style>
	h1 span {
		word-break: break-all;
	}

	.card-content {
		display: grid;
		gap: 0.5rem;
		line-height: 1.3;
	}
	.card-content form {
		display: contents;
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

	.input,
	.btn {
		padding: 1rem 2rem;
		border: 0;
		border-radius: 0.5rem;
		font-size: 1.2rem;
		line-height: 1.5;
		background: rgba(255, 255, 255, 0.86);
		box-shadow: 0 0.25rem 0.875rem 0 rgba(253, 196, 0, 0.9);
		color: var(--cm-blue);
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
	.btn {
		margin: 0.8rem;
		border: 0.2rem solid var(--cm-blue);
		background: rgba(255, 255, 255, 0.86);
		box-shadow: 0 0.25rem 0.875rem 0 rgba(253, 196, 0, 0.9);
		color: var(--cm-blue);
	}
	.btn:hover {
		background: var(--cm-blue);
		color: var(--white);
		cursor: pointer;
	}
	.btn:active {
		background-color: #0c2462;
		color: var(--white);
	}
	.btn:focus-visible {
		outline: none;
		background: var(--cm-blue);
		color: var(--white);
		box-shadow: 0 0 0 0.0625rem var(--cm-yellow-bright),
			0 0 0 0.3rem var(--cm-red);
	}
</style>

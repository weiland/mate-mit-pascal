<script lang="ts">
	export let active: boolean = false;

	let width: number;
	let amount: number; // width / 5

	const rnd = (m: number, n: number): number =>
		Math.floor(Math.random() * (n - m + 1)) + m;

	const sizes = (amount: number): number[] =>
		new Array(amount || 0).fill(4).map(() => rnd(4, 8));

	const createStyle = (size: number): string => `
		top: ${rnd(20, 80)}%;
		left: ${rnd(0, 95)}%;
		width: ${size}px;
		height: ${size}px;
		animation-delay: ${rnd(0, 30) / 10}s;
	`;

	$: amount = Math.floor(width / 5);
</script>

<div class="particletext" bind:clientWidth={width}>
	<slot />
	{#if active}
		{#each sizes(amount) as size}
			<span
				aria-hidden="true"
				class="particle"
				style={createStyle(size)}
			/>
		{/each}
	{/if}
</div>

<style>
	/* https://codepen.io/z-/pen/bpxgWZ */
	.particletext {
		--bubble-color: rgba(26, 56, 130, 0.5);
		--animation-time: 3s;
		--animation-repeat: 1;

		position: relative;
	}

	.particletext > .particle {
		opacity: 0;
		position: absolute;
		background-color: var(--bubble-color);
		animation: none;
		border-radius: 100%;
		pointer-events: none;
	}
	@media screen and (prefers-reduced-motion: no-preference) {
		.particletext > .particle {
			animation: bubbles var(--animation-time) ease-in
				var(--animation-repeat);
		}
	}

	@keyframes bubbles {
		0% {
			opacity: 0;
		}
		20% {
			opacity: 1;
			transform: translate(0, -20%);
		}
		100% {
			opacity: 0;
			transform: translate(0, -1000%);
		}
	}
</style>

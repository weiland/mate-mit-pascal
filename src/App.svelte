<script lang="ts">
	import { onMount } from "svelte";
	import Form from "./Form.svelte";
	import Footer from "./Footer.svelte";
	import Bubbles from "./Bubbles.svelte";
	import Overview from "./Overview.svelte";
	import { DEFAULT_NAME } from "./config";
	import Meeting from "./Meeting.svelte";

	const pages = ["form", "meeting", "overview"] as const;
	type Page = (typeof pages)[number];

	let name: string;
	let state: string;
	let page: Page = "form";
	let showBubbles = false;

	let id: string;
	onMount(async () => {
		const meetingPrefix = "/meetings/";
		const { pathname } = new URL(location.href);
		if (pathname.startsWith(meetingPrefix)) {
			id = pathname
				.replace(meetingPrefix, "")
				.replace("/", "");
			page = "meeting";
			showBubbles = true;
		} else if (/\/overview(\/?)$/.test(pathname)) {
			page = "overview";
		} else if (pathname !== "/") {
			window.location.href = "/";
		}
	});
</script>

<Bubbles active={showBubbles}>
	<main class="la-✋">
		<h1 class="font--mate">
			{state}
			{#if page === "form"}
				Mate
			{:else}
				<a href="/" aria-label="Go to Startpage">Mate</a
				>
			{/if}
			with <span class={page === "form" ? 'break-words' : ''}>{name || DEFAULT_NAME}</span>
		</h1>
		<div class={`card${page === "overview" ? "" : " card--mini"}`}>
			<div class="card-content">
				{#if page === "meeting"}
					<Meeting {id} />
				{:else if page === "overview"}
					<Overview />
				{:else}
					<Form bind:name bind:state />
				{/if}
			</div>
		</div>
	</main>
</Bubbles>

<Footer />

<style>
	.break-words {
		word-break: break-all;
	}
	h1 a,
	h1 a:visited {
		color: var(--cm-text-blue);
	}
</style>

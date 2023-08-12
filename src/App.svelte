<script lang="ts">
	import { onMount } from "svelte";
	import Form from "./Form.svelte";
	import Footer from "./Footer.svelte";
	import Bubbles from "./Bubbles.svelte";
	import Overview from "./Overview.svelte";
	import { DEFAULT_NAME } from "./config";
	import Meeting from "./Meeting.svelte";

	type Page = "Form" | "Meeting" | "Overview";

	let name: string;
	let state: string;
	let page: Page = "Form";
	let showBubbles = false;

	let id: string;
	onMount(async () => {
		const meetingPrefix = "/meetings/";
		const { pathname } = new URL(location.href);
		if (pathname.startsWith(meetingPrefix)) {
			id = pathname
				.replace(meetingPrefix, "")
				.replace("/", "");
			if (!id) {
				page = "Overview";
				return;
			}
			page = "Meeting"
		}
	});
</script>

<Bubbles active={showBubbles}>
	<main class="la-✋">
		<h1 class="font--mate">
			{state} Mate with <span>{name || DEFAULT_NAME}</span>
		</h1>
		<div class={`card${page === "Overview" ? '' : ' card--mini'}`}>
			<div class="card-content">
				{#if page === "Meeting" && id}
					<Meeting {id} />
				{:else if page === "Overview"}
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
	h1 span {
		word-break: break-all;
	}
</style>

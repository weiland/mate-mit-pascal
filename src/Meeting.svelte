<script lang="ts">
	import { onMount } from "svelte";
	import { MEETINGS_API_URL } from "./config";
	// import { Meeting as MeetingWithoutId, MeetingId } from "./api/db";
	// export type MeetingType = MeetingWithoutId & { id: MeetingId };
	let meeting: object & { id: string, cancelledAt?: string };
	export let id: string;

	const cancelMeeting = async (id: string): Promise<void> => {
		const res = await fetch(`${MEETINGS_API_URL}/${id}/cancel`, {
			method: "PUT",
		});
		console.log("cancel status", res.status);
		await fetchMeeting();
	};

	const uncancelMeeting = async (id: string): Promise<void> => {
		const res = await fetch(`${MEETINGS_API_URL}/${id}/uncancel`);
		console.log("uncancel status", res.status);
		await fetchMeeting();
	};

	const deleteMeeting = async (id: string): Promise<void> => {
		const doDelete = confirm("Delete meeting?");
		if (!doDelete) {
			return;
		}
		const res = await fetch(`${MEETINGS_API_URL}/${id}`, {
			method: "DELETE",
		});
		console.log("delete status", res.status);
		window.location.href = "/";
	};

	const fetchMeeting = async () => {
		const res = await fetch(`${MEETINGS_API_URL}/${id}`);
		if (res.status >= 400) {
			throw new Error(
				`Status is ${res.status} (${res.statusText})`
			);
		}
		const json = await res.json();
		if (json.error) {
			throw new Error(`Meeting Error (${json.error})`);
		}
		meeting = { ...json, id };
		console.debug("meeting", meeting);
	};
	onMount(async () => {
		try {
			await fetchMeeting();
		} catch (e) {
			// Go back home from an non-existing meeting page.
			window.location.href = "/";
		}
	});
</script>

<div>
	{#if meeting}
		<ul>
			{#each Object.entries(meeting) as [key, value]}
				{#if value && !["id", "createdAt"].includes(key)}
					<li>{key}: {value}</li>
				{/if}
			{/each}
		</ul>

		{#if meeting.cancelledAt}
			<button
				class="btn"
				on:click={() => uncancelMeeting(meeting.id)}
				><i>un</i>cancel meeting</button
			>
		{:else}
			<button
				class="btn btn--danger"
				on:click={() => cancelMeeting(meeting.id)}
				>cancel meeting</button
			>
		{/if}
		<button
			class="btn btn--danger"
			on:click={() => deleteMeeting(meeting.id)}
			>delete meeting</button
		>
	{:else}
		no meeting loaded yet.
	{/if}
	<p>
		<a href="/">go back to startpage</a>
	</p>
</div>

<style>
	a,
	a:visited {
		color: var(--cm-blue);
		border-bottom: 0.125rem solid var(--cm-red);
	}
	a:hover {
		border-bottom: 0.125rem solid var(--cm-blue);
	}
	.btn--danger {
		--btn-text-color: var(--cm-red);
		--btn-accent-color: var(--cm-red);
	}
</style>

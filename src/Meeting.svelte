<script lang="ts">
	import { onMount } from "svelte";
	import { MEETINGS_API_URL } from "./config";
	// import { Meeting as MeetingWithoutId, MeetingId } from "./api/db";
	// export type MeetingType = MeetingWithoutId & { id: MeetingId };
	let meeting: object & {
		id: string;
		cancelledAt?: string;
		name: string;
		drink: string;
	};
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

{#if meeting}
	<div class={meeting.cancelledAt ? "cancelled" : ""}>
		See you, <b>{meeting.name}</b>! <span class="wave">👋</span>
		And looking forward for our <b>{meeting.drink}</b>.
		<ul>
			{#each Object.entries(meeting) as [key, value]}
				{#if value && !["id", "cancelledAt", "drink", "name", "createdAt"].includes(key)}
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
	</div>
{:else}
	no meeting loaded yet.
{/if}
<p>
	<a href="/">go back to startpage</a>
</p>

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

	.wave {
		display: inline-block;
		animation-duration: 10s;
		animation-fill-mode: both;
		animation-name: waving;
		animation-timing-function: ease-in;
		animation-duration: 0.75s;
		animation-iteration-count: 1;
		animation-delay: 0.5s;
	}

	@keyframes waving {
		0% {
			transform: rotate(9deg);
		}
		10% {
			transform: rotate(-8deg);
		}
		20% {
			transform: rotate(7deg);
		}
		30% {
			transform: rotate(-6deg);
		}
		40% {
			transform: rotate(5deg);
		}
		50% {
			transform: rotate(-4deg);
		}
		60% {
			transform: rotate(3deg);
		}
		70% {
			transform: rotate(-2deg);
		}
		80% {
			transform: rotate(1deg);
		}
		90% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}

	.wave:hover {
		animation-iteration-count: infinite;
		animation-delay: 0;
		cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='42' height='42' viewport='0 0 42 42' style='fill:black;font-size:42px;'><text y='80%'>👋</text></svg>")
				17 0,
			auto;
	}

	.cancelled {
		color: grey;
	}
</style>

<script lang="ts">
	import { onMount } from "svelte";
	import { MEETINGS_API_URL } from "./config";

	let loggedIn = true;
	let meetings: object[];
	let error: false | string = false;

	const fetchMeetings = async () => {
		try {
			const res = await fetch(`${MEETINGS_API_URL}`, {
				headers: {
					authorization: `${document.cookie}`,
				},
			});
			if (res.status >= 400) {
				throw new Error(
					`Status is ${res.status} (${res.statusText})`
				);
			}
			const json = await res.json();
			if (json.error) {
				console.error(json.error);
				error = "Could not fetch meetings from the db.";
				return;
			}

			meetings = json;

			console.debug("meetings", meetings);
		} catch (e) {
			console.error("could not fetch all meetings", e);
			error = "Could not fetch all meetings.";
		}
	};

	const setDrunk = async (id: string): Promise<void> => {
		const res = await fetch(`${MEETINGS_API_URL}/${id}/drunk`, {
			method: "PUT",
		});
		console.log(res.status);
		await fetchMeetings();
	};

	const deleteMeeting = async (id: string): Promise<void> => {
		const res = await fetch(`${MEETINGS_API_URL}/${id}`, {
			method: "DELETE",
		});
		console.log(res.status);
		await fetchMeetings();
	};

	onMount(async () => {
		if (!loggedIn) {
			window.location.href = "/";
			return;
		}
		await fetchMeetings();
	});
</script>

<div>
	{#if error}
		<p>
			{error}
		</p>
	{/if}
	{#if meetings}
		<table>
			<thead>
				<tr>
					<!-- <td>Id</td> -->
					<td>Name</td>
					<td>Drink</td>
					<td>Note</td>
					<td>Created</td>
					<td>Cancelled</td>
					<td>Drunk</td>
					<td>Drunk</td>
					<td>Delete</td>
				</tr>
			</thead>
			<tbody>
				{#each meetings as meeting}
					<tr>
						<!-- <td>{meeting.id}</td> -->
						<td
							><a
								href={`/meetings/${meeting.id}`}
								>{meeting.name}</a
							></td
						>
						<td>{meeting.drink}</td>
						<td>{meeting.extra}</td>
						<td>{meeting.createdAt}</td>
						<td>{meeting.cancelledAt}</td>
						<td>{meeting.drunkAt}</td>
						<td
							><button
								on:click={() =>
									setDrunk(
										meeting.id
									)}
								>✅</button
							></td
						>
						<td
							><button
								on:click={() =>
									deleteMeeting(
										meeting.id
									)}
								>␡</button
							></td
						>
						<!-- <td>{meeting.drankAt}</td> -->
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		no meeting loaded yet.
	{/if}
	<a href="/">go back to startpage</a>
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
	table {
		position: relative;
	}
	thead {
		position: sticky;
		top: 0.25rem;
	}
</style>

<script lang="ts">
	import { onMount } from "svelte";
	import Push from "./Push.svelte";
	import { MEETINGS_API_URL } from "./config";
	import { isLoggedIn } from "./stores";
	import Login from "./Login.svelte";

	let loggedIn = false;
	let meetings: object[];
	let error: false | string = false;

	const fetchMeetings = async () => {
		error = "";
		try {
			const res = await fetch(`${MEETINGS_API_URL}`, {
				mode: "cors",
				credentials: "include",
			});
			if (res.status >= 400) {
				if (res.status === 403) {
					loggedIn = false;
				}
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

			loggedIn = true;
			meetings = json;

			console.debug("meetings", meetings);
		} catch (e) {
			console.error("could not fetch all meetings", e);
			error = "Could not fetch all meetings.";
		}
	};

	isLoggedIn?.subscribe(async (value: boolean) => {
		console.log("login update (in overview) to:", value);
		loggedIn = value;
		if (value === true && typeof meetings === "undefined") {
			await fetchMeetings();
		}
	});

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
		await fetchMeetings();
		if (!loggedIn) {
			return;
		}
	});
</script>

<div class="container">
	{#if error}
		<p>
			{error}
		</p>
	{/if}
	{#if loggedIn && meetings}
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
		<Push />
	{:else if !loggedIn}
		<Login />
	{:else}
		no meeting loaded yet.
	{/if}
</div>

<style>
	.container {
		width: 100%;
		overflow-x: scroll;
		position: relative;
	}
	a,
	a:visited {
		color: var(--cm-blue);
		border-bottom: 0.125rem solid var(--cm-red);
	}
	a:hover {
		border-bottom: 0.125rem solid var(--cm-blue);
	}
	table {
		/* position: relative; */
	}
	thead {
		position: sticky;
		top: 0.25rem;
	}
</style>

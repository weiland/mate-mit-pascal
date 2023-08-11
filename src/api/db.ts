/// <reference lib="deno.unstable" />
//
export interface Meeting {
	id: string;
	name: string;
	where: string;
	when: string;
	extra: string;
}

const kv = await Deno.openKv();

/**
 * List all meetings.
 * @param meeting
 * @returns Array<Meeting>
 */

export async function getAllMeetings() {
	const meetings = [];
	for await (const res of kv.list({ prefix: ['meeting'] })) {
		meetings.push(res.value);
	}
	return meetings;
}

/**
 * List meeting.
 * @param meeting
 */

export async function getMeeting(id: string) {
	const meetingKey = ['meeting', id];
	const ok = await kv.get(meetingKey);
	if (!ok) throw new Error('Something went wrong when creating.');
	return ok;
}

/**
 * Create or update meeting.
 * @param meeting
 */

export async function createMeeting(meeting: Meeting) {
	const meetingKey = ['meeting', meeting.id];
	const ok = await kv.set(meetingKey, meeting);
	if (!ok) throw new Error('Something went wrong when creating.');
}

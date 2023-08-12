/// <reference lib="deno.unstable" />
import { crypto } from "https://deno.land/std@0.194.0/crypto/mod.ts";

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

export async function createMeeting(meeting: Partial<Meeting>) {
	const uuid = crypto.randomUUID();
	meeting.id = uuid;
	const meetingKey = ['meeting', uuid];
	const ok = await kv.set(meetingKey, meeting);
	if (!ok) throw new Error('Something went wrong when creating.');
}

/// <reference lib="deno.unstable" />
import { crypto } from 'https://deno.land/std@0.194.0/crypto/mod.ts';
import { sendPush } from './push.ts';

export type MeetingId = string;

export interface Meeting {
	id?: MeetingId;
	name: string;
	where: string;
	when: string;
	extra: string;
	createdAt: string;
	confirmedAt?: string;
	note?: string; // my note (not yet used)
	cancelledAt?: string;
	drunkAt?: string; // when a meeting took place
}

type ErrorResponse = { error: string };
type SuccessResponse = true;
type DBResponse = Promise<SuccessResponse | ErrorResponse>;
type DBMeetingResponse = Promise<Meeting | Meeting[] | ErrorResponse>;

const kv = await Deno.openKv();

/**
 * List all meetings.
 * @param meeting
 * @returns Array<Meeting>
 */
export async function getAllMeetings(): DBMeetingResponse {
	const meetings: Meeting[] = [];
	for await (const res of kv.list<Meeting>({ prefix: ['meeting'] })) {
		meetings.push(res.value);
	}
	return meetings;
}

/**
 * List meeting.
 * @param meeting
 */
export async function getMeeting(id: MeetingId): DBMeetingResponse {
	const meetingKey = ['meeting', id];
	const response = await kv.get<Meeting>(meetingKey);
	if (!response || !response.value) {
		return {
			error:
				`Something went wrong when receiving the meeting db entry with the id '${id}'.`,
		};
	}
	return response.value;
}

/**
 * Create meeting.
 * @param meeting
 */
export async function createMeeting(meeting: Meeting): DBMeetingResponse {
	const uuid: MeetingId = crypto.randomUUID();
	meeting.createdAt = (new Date()).toLocaleString();
	const meetingKey = ['meeting', uuid];
	const response = await kv.set(meetingKey, meeting);
	if (!response) {
		return {
			error: 'Something went wrong when creating the meeting db entry.',
		};
	}
	await sendPush(meeting.name, uuid).catch(e => console.error('push-error', e));
	return { ...meeting, id: uuid };
}

export async function confirmMeeting(id: MeetingId): DBResponse {
	const meetingKey = ['meeting', id];
	try {
		const response = await kv.get(meetingKey);
		const meeting = response.value as Meeting;
		meeting.confirmedAt = (new Date()).toLocaleString();
		await kv.set(meetingKey, meeting);
	} catch (error) {
		console.error('meeting confirmation failed', error);
		return {
			error: 'Something went wrong when confirming the meeting db entry.',
		};
	}

	return true;
}

export async function uncancelMeeting(id: MeetingId): DBResponse {
	const meetingKey = ['meeting', id];
	try {
		const response = await kv.get(meetingKey);
		const cancelledMeeting = response.value as Meeting;
		cancelledMeeting.cancelledAt = undefined;
		await kv.set(meetingKey, cancelledMeeting);
	} catch (error) {
		console.error('meeting uncancellation failed', error);
		return {
			error: 'Something went wrong when uncancelling the meeting db entry.',
		};
	}

	return true;
}

export async function cancelMeeting(id: MeetingId): DBResponse {
	const meetingKey = ['meeting', id];
	try {
		const response = await kv.get(meetingKey);
		const cancelledMeeting = response.value as Meeting;
		cancelledMeeting.cancelledAt = (new Date()).toLocaleString();
		await kv.set(meetingKey, cancelledMeeting);
	} catch (error) {
		console.error('meeting cancellation failed', error);
		return {
			error: 'Something went wrong when cancelling the meeting db entry.',
		};
	}

	return true;
}

export async function finishMeeting(id: MeetingId, note?: string): DBResponse {
	const meetingKey = ['meeting', id];
	try {
		const response = await kv.get(meetingKey);
		const cancelledMeeting = response.value as Meeting;
		cancelledMeeting.drunkAt = (new Date()).toLocaleString();
		await kv.set(meetingKey, cancelledMeeting);
	} catch (error) {
		console.error('meeting cancellation failed', error);
		return {
			error: 'Something went wrong when cancelling the meeting db entry.',
		};
	}

	return true;
}

export async function deleteMeeting(id: MeetingId): DBResponse {
	const meetingKey = ['meeting', id];
	try {
		await kv.delete(meetingKey);
	} catch (error) {
		console.error('meeting deletion failed', error);
		return {
			error: 'Something went wrong when celeting the meeting db entry.',
		};
	}

	return true;
}

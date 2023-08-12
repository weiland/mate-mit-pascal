import {
	Context,
	helpers,
	Router,
} from 'https://deno.land/x/oak@v12.4.0/mod.ts';
import { createMeeting, getAllMeetings, getMeeting, cancelMeeting, finishMeeting, deleteMeeting, Meeting } from './db.ts';
const { getQuery } = helpers;

export const apiRouter = new Router();
apiRouter
	.get('/api/meetings', async (context: Context) => {
		context.response.body = await getAllMeetings();
	})
	.get('/api/meetings/:id', async (context: Context) => {
		const { id } = getQuery(context, { mergeParams: true });
		const found = await getMeeting(id);
		if (found) {
			context.response.body = found;
		} else {
			context.response.status = 404;
			context.response.body = { error: 'No meetings found.' };
		}
	})
	.put('/api/meetings/:id/drunk', async (context: Context) => {
		const { id } = getQuery(context, { mergeParams: true });
		const cancelled = await finishMeeting(id);
		if (cancelled) {
			context.response.body = { status: 'ok' };
		} else {
			context.response.status = 404;
			context.response.body = { error: 'No meetings found.' };
		}
	})
	.put('/api/meetings/:id/cancel', async (context: Context) => {
		const { id } = getQuery(context, { mergeParams: true });
		const cancelled = await cancelMeeting(id);
		if (cancelled) {
			context.response.body = { status: 'ok' };
		} else {
			context.response.status = 404;
			context.response.body = { error: 'No meetings found.' };
		}
	})
	.delete('/api/meetings/:id', async (context: Context) => {
		const { id } = getQuery(context, { mergeParams: true });
		const deleted = await deleteMeeting(id);
		if (deleted) {
			context.response.body = { status: 'ok' };
		} else {
			context.response.status = 404;
			context.response.body = { error: 'No meetings found.' };
		}
	})
	.post('/api/meetings', async (context: Context) => {
		const form = context.request.body({ type: 'form-data' });
		const json = await form.value.read();
		const meeting = json.fields as Meeting;
		console.log('meeting', meeting);
		const body = await createMeeting(meeting);
		context.response.body = body;
	})
	.post('/api/login', async (context: Context) => {
		const form = context.request.body();
		const { password } = await form.value;
		const loggedIn = password === PASSWORD;
		if (loggedIn) {
			context.response.headers = {
				'set-cookie': `token=${TOKEN}`
			}
		}
		const body = loggedIn ? { status: 'ok' } : { error: 'invalid password' };
		context.response.body = body;
	})
	.all('/api/:rest*', (context: Context) => {
		context.response.status = 404;
		context.response.body = { error: 'not found' };
	});

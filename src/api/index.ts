import {
	Context,
	helpers,
	Router,
} from 'https://deno.land/x/oak@v12.4.0/mod.ts';
import {
	cancelMeeting,
	confirmMeeting,
	createMeeting,
	deleteMeeting,
	finishMeeting,
	getAllMeetings,
	getMeeting,
	Meeting,
} from './db.ts';
import { sendPush, setPushSubscription } from './push.ts';

const { getQuery } = helpers;

if (Deno.env.has('IS_DEV') && Deno.env.get('IS_DEV') === 'true') {
	// local env -> source dotenv
	await import('https://deno.land/std@0.194.0/dotenv/load.ts');
	// env = await load({ allowEmptyValues: true }); // TODO(pascal): find out how to set it with autoload
}

const TOKEN = Deno.env.get('TOKEN');

const isLoggedIn = async (context: Context): Promise<boolean> =>
	TOKEN === await context.cookies.get('token');

export const apiRouter = new Router();
apiRouter
	.get('/api/meetings', async (context: Context) => {
		if (!await isLoggedIn(context)) {
			context.response.status = 403;
			context.response.body = { error: 'Not authorized.' };
			return;
		}
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
		if (!await isLoggedIn(context)) {
			context.response.status = 403;
			return;
		}
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
	.put('/api/meetings/:id/confirm', async (context: Context) => {
		const { id } = getQuery(context, { mergeParams: true });
		const cancelled = await confirmMeeting(id);
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
		const meeting = json.fields as unknown as Meeting;
		console.log('meeting', meeting);
		const body = await createMeeting(meeting);
		context.response.body = body;
	})
	.post('/api/push', async (context: Context) => {
		const form = context.request.body();
		const data = await form.value;
		await setPushSubscription(data).catch((e) =>
			console.error('set push user error:', e)
		);
		console.log('set push data', data);
		context.response.body = 'ok';
	})
	.post('/api/login', async (context: Context) => {
		const PASSWORD = Deno.env.get('PASSWORD');

		if (!PASSWORD || !TOKEN) {
			console.error('There are missing credentials.');
			context.response.status = 500;
			context.response.body = { error: 'There are missing credentials.' };
			return;
		}

		const form = context.request.body({ type: 'form-data' });
		const data = await form.value.read();
		const fields = data.fields;
		const loggedIn = fields.password &&
			fields.password === PASSWORD;
		if (loggedIn) {
			await context.cookies.set('token', TOKEN);
		}
		const body = loggedIn
			? { status: 'ok' }
			: { error: 'invalid password' };
		context.response.body = body;
	})
	.get('/api/logout', async (context: Context) => {
		context.response.body = '';
		await context.cookies.delete('token');
	})
	.all('/api/:rest*', (context: Context) => {
		context.response.status = 404;
		context.response.body = { error: 'not found' };
	});

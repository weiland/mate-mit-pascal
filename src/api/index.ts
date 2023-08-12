import {
	Context,
	helpers,
	Router,
} from 'https://deno.land/x/oak@v12.4.0/mod.ts';
import {
	cancelMeeting,
	createMeeting,
	deleteMeeting,
	finishMeeting,
	getAllMeetings,
	getMeeting,
	Meeting,
} from './db.ts';
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
		const meeting = json.fields as unknown as Meeting;
		console.log('meeting', meeting);
		const body = await createMeeting(meeting);
		context.response.body = body;
	})
	.post('/api/login', async (context: Context, next) => {
		console.log('login')
		const PASSWORD = import.meta.env.VITE_PASSWORD ??
			Deno.env.get('PASSWORD');
		const TOKEN = import.meta.env.VITE_TOKEN ?? Deno.env.get('TOKEN');

		if (!PASSWORD || !TOKEN) {
			console.error('There are missing credentials.');
			context.response.status = 500;
			context.response.body = { error: 'There are missing credentials.' };
			next();
			return;
		}

		const form = context.request.body({ type: 'form-data' });
		console.log(form)
		const data = await form.value.read();
		const password = data.fields.password;
		const loggedIn = password === PASSWORD;
		if (loggedIn) {
			await context.cookies.set('token', TOKEN);
			// context.response.headers = {
			// 	'set-cookie': `token=${TOKEN}`,
			// };
		}
		const body = loggedIn
			? { status: 'ok' }
			: { error: 'invalid password' };
		context.response.body = body;
		next();
	})
	.all('/api/:rest*', (context: Context) => {
		context.response.status = 404;
		context.response.body = { error: 'not found' };
	});

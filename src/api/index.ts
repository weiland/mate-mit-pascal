import {
	Context,
	helpers,
	Router,
} from 'https://deno.land/x/oak@v12.4.0/mod.ts';
import { createMeeting, getAllMeetings, getMeeting } from './db.ts';
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
			context.response.body = { error: 'No meetings found.' };
		}
	})
	.post('/api/meetings', async (context: Context) => {
		const body = context.request.body();
		const meeting = await body.value;
		await createMeeting(meeting);
		context.response.body = { status: 'ok' };
	});

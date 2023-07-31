import { Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { createMeeting } from './db.ts';

export const apiRouter = new Router();
apiRouter
	.get('/api', (context) => {
		context.response.body = { message: 'ok' };
	})
	.get('/api/:message', (context) => {
		if (context?.params?.dinosaur) {
			const found = data.find((item) =>
				item.name.toLowerCase() ===
					context.params.dinosaur.toLowerCase()
			);
			if (found) {
				context.response.body = found;
			} else {
				context.response.body = { error: 'No dinosaurs found.' };
			}
		}
	});

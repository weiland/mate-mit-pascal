import {
	Application,
	Context,
	Next,
	send,
} from 'https://deno.land/x/oak@v12.4.0/mod.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import { apiRouter } from './src/api/index.ts';

const PORT = 8000;

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

async function serveStaticFiles(context: Context, next: Next) {
	const root = `${Deno.cwd()}/dist`;
	try {
		// attempt to load public files (static assets) or sub-directories
		context.response.headers.set('x-clacks-overhead', 'GNU Terry Pratchett');
		await context.send({
			root,
			index: 'index.html',
		});
	} catch {
		try {
			// fallback to index.html
			await context.send({
				path: 'index.html',
				root,
			});
		} catch (e) {
			console.error(e);
			next();
		}
	}
}

app.use(serveStaticFiles);

await app.listen({ port: PORT });

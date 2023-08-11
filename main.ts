import { Application, Context, Next } from 'https://deno.land/x/oak@v12.4.0/mod.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import { apiRouter } from './src/api/index.ts';

const PORT = 8000;

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

async function serveStaticFiles (context: Context, next: Next) {
	const root = `${Deno.cwd()}/dist`;
	try {
		await context.send({
			root,
			index: 'index.html',
		});
	} catch {
		next();
	}
}

app.use(serveStaticFiles);

await app.listen({ port: PORT });

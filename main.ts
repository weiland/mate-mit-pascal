import { Application, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import data from './data.json' assert { type: 'json' };

const router = new Router();
router
	// .get("/", (context) => {
	//   context.response.body = "Welcome to dinosaur API!";
	// })
	.get('/api', (context) => {
		context.response.body = data;
	})
	.get('/api/:dinosaur', (context) => {
		if (context?.params?.dinosaur) {
			const found = data.find((item) =>
				item.name.toLowerCase() ===
					context.params.dinosaur.toLowerCase()
			);
			if (found) {
				context.response.body = found;
			} else {
				context.response.body = 'No dinosaurs found.';
			}
		}
	});

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());

// static content
app.use(async (context, next) => {
	const root = `${Deno.cwd()}/dist`;
	try {
		await context.send({
			root,
			index: 'index.html',
		});
	} catch {
		next();
	}
});

// TODO: page not found

await app.listen({ port: 8000 });

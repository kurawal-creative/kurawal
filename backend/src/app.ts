import express, { type Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import envRoutes from './routes/envRoutes';
import mediaRoutes from './routes/mediaRoutes';
import tagRoutes from './routes/tagRoutes';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';

const app: Express = express();

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/envs', envRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/tags', tagRoutes);

app.get('/api', async (req: Request, res: Response) => {
    try {
        const { apiReference } = await import('@scalar/express-api-reference');
        apiReference({ url: '/swagger.json', theme: 'kepler' })(req, res);
    } catch (error) {
        console.error('Error loading API documentation:', error);
        res.status(500).json({ error: 'Failed to load API documentation' });
    }
});

// const staticDir = path.resolve(__dirname, "../..", "frontend", "dist");

// app.use(express.static(staticDir));

// app.use((req, res, next) => {
//     return res.sendFile(path.join(staticDir, "index.html"));
// });

export default app;

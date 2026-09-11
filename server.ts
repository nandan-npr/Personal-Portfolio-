import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables from .env
dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Parse JSON bodies
  app.use(express.json({ limit: '64kb' }));

  // Health endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY || process.env.VITE_WEB3FORMS_ACCESS_KEY || '';
    res.json({
      status: 'ok',
      time: new Date().toISOString(),
      service: 'web3forms',
      web3FormsConfigured: Boolean(web3FormsKey && web3FormsKey.trim().length > 0),
    });
  });

  // Client configuration endpoint (safely provides the Web3Forms public access key to the client browser)
  app.get('/api/config', (_req: Request, res: Response) => {
    const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY || process.env.VITE_WEB3FORMS_ACCESS_KEY || '';
    res.json({
      web3FormsKey: web3FormsKey.trim(),
    });
  });

  // Informative endpoint if /api/contact is accessed
  app.all('/api/contact', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      service: 'web3forms',
      message: 'Portfolio uses direct client-side Web3Forms API delivery as required by Web3Forms documentation.',
    });
  });

  // Vite middleware for development vs Static file serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server listening on http://localhost:${PORT}`);
  });
}

startServer();

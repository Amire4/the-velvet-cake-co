import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import authRoutes from './server/src/routes/authRoutes.ts';
import productRoutes from './server/src/routes/productRoutes.ts';
import flavorRoutes from './server/src/routes/flavorRoutes.ts';
import orderRoutes from './server/src/routes/orderRoutes.ts';
import customCakeRoutes from './server/src/routes/customCakeRoutes.ts';
import contactRoutes from './server/src/routes/contactRoutes.ts';
import newsletterRoutes from './server/src/routes/newsletterRoutes.ts';
import chatRoutes from './server/src/routes/chatRoutes.ts';
import adminRoutes from './server/src/routes/adminRoutes.ts';
import { errorMiddleware } from './server/src/middleware/errorMiddleware.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic Middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'The Velvet Cake Co. API',
      timestamp: new Date().toISOString()
    });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/flavors', flavorRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/custom-cakes', customCakeRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/newsletter', newsletterRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/admin', adminRoutes);

  // Central Error Handler for API
  app.use(errorMiddleware);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback for all SPA page routes in development
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎂 The Velvet Cake Co. server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});

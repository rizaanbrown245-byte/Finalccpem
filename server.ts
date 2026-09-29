import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { communityStore } from './server/dataStore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logger
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // ============================================================================
  // CITIZEN OF PE METRO COMMUNITY PORTAL API ROUTES
  // ============================================================================

  // Health and Portal Status
  app.get('/api/status', (req, res) => {
    res.json({
      portal_status: 'operational',
      organization: 'Concerned Citizens of PE Metro Task Team',
      metro_area: 'Nelson Mandela Bay Metropolitan Municipality',
      timestamp: new Date().toISOString(),
    });
  });

  // Issues Endpoint
  app.get('/api/issues', (req, res) => {
    res.json(communityStore.getIssues());
  });

  app.get('/api/issues/:ref', (req, res) => {
    const issue = communityStore.getIssueByRef(req.params.ref);
    if (!issue) {
      return res.status(404).json({ error: 'Issue reference not found' });
    }
    res.json(issue);
  });

  app.post('/api/issues', (req, res) => {
    try {
      const newIssue = communityStore.createIssue(req.body);
      res.status(201).json(newIssue);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create issue' });
    }
  });

  // Crime & Safety Bulletins
  app.get('/api/safety-notices', (req, res) => {
    res.json(communityStore.getSafetyNotices());
  });

  app.post('/api/safety-notices', (req, res) => {
    try {
      const created = communityStore.createSafetyNotice(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to post safety notice' });
    }
  });

  // Community Work & Relief Projects
  app.get('/api/community-work', (req, res) => {
    res.json(communityStore.getCommunityWork());
  });

  // Community Posts & Updates
  app.get('/api/posts', (req, res) => {
    res.json(communityStore.getPosts());
  });

  app.post('/api/posts', (req, res) => {
    try {
      const created = communityStore.createPost(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create post' });
    }
  });

  // Community Stats
  app.get('/api/stats', (req, res) => {
    res.json(communityStore.getStats());
  });

  // Facebook Integration Proxy
  app.post('/api/facebook/fetch-page', async (req, res) => {
    const { pageId, accessToken } = req.body;
    if (accessToken && pageId) {
      try {
        const fbUrl = `https://graph.facebook.com/v19.0/${pageId}/posts?fields=id,message,created_time,full_picture,permalink_url,reactions.summary(total_count),comments.summary(total_count)&access_token=${accessToken}`;
        const response = await fetch(fbUrl);
        const data = await response.json();
        return res.json(data);
      } catch (err: any) {
        return res.status(500).json({ error: 'Failed to contact Facebook API: ' + err.message });
      }
    }
    res.json({ status: 'ok', message: 'Ready for Facebook sync' });
  });

  // Settings & Banking Details
  app.get('/api/settings', (req, res) => {
    res.json(communityStore.getSettings());
  });

  // Emergency Contacts
  app.get('/api/emergency-contacts', (req, res) => {
    res.json(communityStore.getEmergencyContacts());
  });

  // ============================================================================
  // FRONTEND INTEGRATION (Vite Middleware in Dev / Static dist in Prod)
  // ============================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Citizen of PE Metro Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

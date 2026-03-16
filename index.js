// Entry point — boots Express, wires middleware and routes.
// Kept intentionally thin. No business logic lives here.

import express, { json } from 'express';
import messageRoutes from './src/routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(json());

// All message-related routes live under /messages
app.use('/messages', messageRoutes);

// Health check — good habit even on small projects.
// Load balancers and AWS Lambda warmers can ping this.
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});

export default app;

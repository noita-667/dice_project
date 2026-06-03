import app from './app';
import { migrate } from './db/migrate';

const PORT = parseInt(process.env.PORT ?? '3000', 10);

migrate()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch((err) => { console.error('[DB] Migration failed:', err); process.exit(1); });

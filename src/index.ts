import { BootstrapServer, router, Server } from './config/server';
import { typeormConfig } from './config/db';
const port = Number(process.env.NODE_PORT || 3000);

typeormConfig.initialize();

const healthz = router.get('/', (req, res) => {
  res.json({ msg: 'fuck' });
});

BootstrapServer({
  port,
  message: `Server is running on port: ${port}`,
  routes: healthz,
});

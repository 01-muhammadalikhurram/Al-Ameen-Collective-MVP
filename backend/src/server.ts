import app from './app';
import { config } from './config';
import { logger } from './config/logger';

const PORT = config.PORT;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  logger.info(`🚀 Al Ameen Collective API running on http://${HOST}:${PORT}`);
  logger.info(`📚 API Docs available at http://${HOST}:${PORT}/api-docs`);
  logger.info(`🔗 Health check: http://${HOST}:${PORT}/api/v1/health`);
  logger.info(`🌍 Environment: ${config.NODE_ENV}`);
});

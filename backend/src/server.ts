import app from './app';
import { config } from './config';
import { logger } from './config/logger';

const PORT = config.PORT;

app.listen(PORT, () => {
  logger.info(`🚀 Al Ameen Collective API running on port ${PORT}`);
  logger.info(`📚 API Docs available at http://localhost:${PORT}/api-docs`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/api/v1/health`);
  logger.info(`🌍 Environment: ${config.NODE_ENV}`);
});

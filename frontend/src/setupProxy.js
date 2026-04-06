const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Ensures DELETE/PATCH/etc. to /api and auth routes reach Express.
 * When this file exists, the "proxy" field in package.json is ignored.
 */
module.exports = function setupProxy(app) {
  const target = process.env.REACT_APP_PROXY_TARGET || 'http://127.0.0.1:5001';

  const apiProxy = createProxyMiddleware({
    target,
    changeOrigin: true,
  });

  app.use('/api', apiProxy);
  app.use('/uploads', apiProxy);
  app.use('/register', apiProxy);
  app.use('/login', apiProxy);
  app.use('/me', apiProxy);
};

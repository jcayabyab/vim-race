const { createProxyMiddleware } = require("http-proxy-middleware");
const { clientProxyTarget } = require("./config/keys");

module.exports = function (app) {
  app.use(
    "/auth",
    createProxyMiddleware({
      target: clientProxyTarget,
      changeOrigin: true,
    })
  );
  app.use(
    "/api",
    createProxyMiddleware({
      target: clientProxyTarget,
      changeOrigin: true,
    })
  );
};

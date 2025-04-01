export default () => ({
  app: {
    port: parseInt(process.env.PORT as string, 10) || 3000,
    name: process.env.APP_NAME || 'nestjs-app',
    env: process.env.NODE_ENV || 'development',
  },
});

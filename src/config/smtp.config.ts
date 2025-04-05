export default () => ({
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    mail: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASS,
    name: process.env.SERVICE_NAME,
  },
});

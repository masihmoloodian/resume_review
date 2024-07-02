export default () => ({
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },
  app: {
    host: process.env.APP_HOST,
    port: parseInt(process.env.APP_PORT, 10) || 3000,
  },
  auth: {
    saltHash: process.env.SALT_HASH,
    jwtSecret: process.env.JWT_SECRET,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },
});

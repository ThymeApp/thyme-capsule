import * as Sentry from '@sentry/node';


export default function setupErrorLogging(app) {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  Sentry.init({ dsn: process.env.SENTRY_DSN });

  app.use(Sentry.Handlers.requestHandler());
}

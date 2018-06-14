# Thyme Capsule

This service provides user authentication and state syncing for the [Thyme](https://github.com/Gaya/thyme) time tracking app.

Run this service on your own server or used the hosted version on [https://usethyme.com](https://github.com/Gaya/thyme).

### Starting the service
`$ npm start`

### Running linting and tests
`$ npm test`

## Running your own instance

This repository has deployment setup for deploying on [Heroku](https://www.heroku.com/) or Herokish systems like [dokku](http://dokku.viewdocs.io/dokku/).

Make sure you link a database container using MySQL or MariaDB and expose the connection URL as the `DATABASE_URL` environment variable.

Set the [environment variables](#available-environment-variables) when running in production for security, especially the encryption key and JWT secret.

Read more about connecting the Thyme app to your instance in the [Thyme docs](https://github.com/Gaya/thyme).

## Available environment variables

```
ENV=production/development/test
PORT=5000
ENCRYPTION_KEY=secret-key-for-encryption
SALT_ROUNDS=10
DATABASE_URL=database://connection-url
JWT_SECRET=jwt-hash-secret
```

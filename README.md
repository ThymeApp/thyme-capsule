# Thyme Capsule

This service allows user authentication and save syncing for the Thyme app.

Every feature is in early beta.

## Useful commands

### Starting the service
`$ npm start`

### Running linting and tests
`$ npm test`

## Environment variables

```
ENV=production/development
PORT=5000
ENCRYPTION_KEY=key-to-encrypt-the-files
SALT_ROUNDS=20
DATABASE_URL=mysql://connection-url
JWT_SECRET=jwt-hash-secret
```

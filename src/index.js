import express from 'express';

import passport from './passport';

const app = express();

app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('Running');
});

app.listen(process.env.PORT || 4000, () => {
  console.log('Server started');
});

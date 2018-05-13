import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Running');
});

app.listen(process.env.PORT || 4000, () => {
  console.log('Server started');
});

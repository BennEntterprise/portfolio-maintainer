import express from 'express';
import env from './src/config/env';

const app = express();

// Serve static files (built react app)
app.use(express.static('built-frontend'));

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log(`Server is running on http://${env.HOST}:${env.PORT}`);
})
import express from 'express';
import env from './src/config/env';

const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!');
});


app.listen(3000, () => {
  console.log(`Server is running on http://${env.HOST}:${env.PORT}`);
})
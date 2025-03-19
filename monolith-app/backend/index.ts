import express from 'express';
import {z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3000'),
  HOST: z.string().default('localhost'),
});

const env = envSchema.parse(process.env);
type envTypes = z.infer<typeof envSchema>;


const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!');
});


app.listen(3000, () => {
  console.log(`Server is running on http://${env.HOST}:${env.PORT}`);
})
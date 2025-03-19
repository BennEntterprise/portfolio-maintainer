import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  HOST: z.string().default('localhost')
});

const env = envSchema.parse(process.env);

type envTypes = z.infer<typeof envSchema>;

export default env
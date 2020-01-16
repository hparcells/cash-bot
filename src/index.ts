import { AkairoClient } from 'discord-akairo';
import { config as setupEnv } from 'dotenv';

import { connectToDatabase } from './database';
import { botLog } from './utils/logger';

// Get access to our env variables in the .env file.
setupEnv();

// Setup database.
connectToDatabase();

// Create a client instance.
const client = new AkairoClient({
  prefix: '$',
  commandDirectory: './dist/commands/'
}, {});

// Login using the token.
client.login(process.env.TOKEN as string);

// Log.
botLog('Bot started.');

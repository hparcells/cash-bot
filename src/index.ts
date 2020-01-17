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

const activitiesList = [
  'Depositing Money',
  'Withdrawing Money',
  'Betting',
  'Counting Money',
  `in ${client.guilds.size} Guilds`,
  '$help'
];

// Change activites every 30 seconds.
setInterval(() => {
  const index = Math.floor(Math.random() * (activitiesList.length - 1) + 1);
  client.user.setActivity(activitiesList[index]);
}, 30000);

// Log.
botLog('Bot started.');

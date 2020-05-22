import { MongoClient, Db } from 'mongodb';

import { Account, Guild } from './types';

export let database: Db;

/** Connects to the database and sets everything up. */
export function connectToDatabase() {
  const CONNECTION_URL = `mongodb+srv://hparcells:${process.env.DATABASE_PASSWORD}@cashbotcluster-6o98e.mongodb.net/test?retryWrites=true&w=majority`
  const client = new MongoClient(CONNECTION_URL, { useNewUrlParser: true });

  client.connect(() => {
    database = client.db("cashBot");
  });
}
export async function accountExists(id: string, guild: string): Promise<boolean> {
  return await database.collection('accounts').find({ id, guild }).count() === 1;
}
export async function guildExists(id: string): Promise<boolean> {
  return await database.collection('guilds').find({ id }).count() === 1;
}
export async function getAccount(id: string, guild: string): Promise<Account> {
  const accounts: Account[] = await database.collection('accounts').find({ id, guild }).toArray();

  return accounts[0];
}
export async function getGuild(id: string): Promise<Guild> {
  const guilds: Guild[] = await database.collection('guilds').find({ id }).toArray();

  return guilds[0];
}

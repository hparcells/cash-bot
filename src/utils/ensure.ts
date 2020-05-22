import { database, accountExists, guildExists } from '../database';

import { Account, Guild } from '../types';
import {
  DEFAULT_STARTING_AMOUNT,
  DEFAULT_PRIVATE_STATUS,
  DEFAULT_CURRENCY,
  DEFAULT_EMBED_COLOR,
  DEFAULT_DAILY_AMOUNT,
  DEFAULT_DAILY_INCREMENT,
  DEFAULT_DO_DAILY_STREAK
} from '../defaults';

/**
 * Ensures that an account exists for a user in the database.
 * @param id The ID of the account holder.
 * @param guild The guild ID where this account is first being generated.
 */
export async function ensureUserAccount(id: string, guild: string) {
  // Check if the person has a number yet.
  if (!(await accountExists(id, guild))) {
    // Add to database.
    database.collection('accounts').insertOne({
      id,
      guild,
      cash: DEFAULT_STARTING_AMOUNT,
      private: DEFAULT_PRIVATE_STATUS,
      dailyStreak: 0,
      lastDaily: 0
    } as Account);
  }
}

/**
 * Ensures that guild settings exist for a guild.
 * @param guildId The guild ID.
 */
export async function ensureGuildSettings(guildId: string) {
  // Check if the server has settings yet.
  if (!(await guildExists(guildId))) {
    // Acc to database.
    database.collection('guilds').insertOne({
      id: guildId,
      currency: DEFAULT_CURRENCY,
      embedColor: DEFAULT_EMBED_COLOR,
      dailyOptions: {
        dailyAmount: DEFAULT_DAILY_AMOUNT,
        doDailyStreak: DEFAULT_DO_DAILY_STREAK,
        dailyStreakIncrement: DEFAULT_DAILY_INCREMENT
      }
    } as Guild);
  }
}

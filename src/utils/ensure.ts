import { runDb, db } from '../database';

import { Account, GuildSettings } from '../types';
import {
  DEFAULT_STARTING_AMOUNT,
  DEFAULT_PRIVATE_STATUS,
  DEFAULT_CURRENCY,
  DEFAULT_EMEBED_COLOR,
  DEFAULT_DAILY_AMOUNT,
  DEFAULT_DAILY_INCREMENT,
  DEFAULT_DO_DAILY_STREAK
} from '../defaults';

/**
 * Ensures that an account exists for a user in the database.
 * @param authorId The ID of the account holder.
 * @param initialGuildId The guild ID where this account is first being generated.
 */
export async function ensureUserAccount(authorId: string, initialGuildId: string) {
  // Check if the person has a number yet.
  if(!(await runDb(db().table('accounts').getAll(`${authorId}-${initialGuildId}`).count().eq(1)))) {
    // Acc to database.
    await runDb(db().table('accounts').insert({
      id: `${authorId}-${initialGuildId}`,
      user: authorId,
      guild: initialGuildId,
      cash: DEFAULT_STARTING_AMOUNT,
      private: DEFAULT_PRIVATE_STATUS,
      dailyStreak: 0,
      lastDaily: 0
    } as Account));
  }
}

/**
 * Ensures that guild settings exist for a guild.
 * @param guildId The guild ID.
 */
export async function ensureGuildSettings(guildId: string, maintainerRole: string) {
  // Check if the server has settings yet.
  if(!(await runDb(db().table('guildSettings').getAll(guildId).count().eq(1)))) {
    // Acc to database.
    await runDb(db().table('guildSettings').insert({
      id: guildId,
      currency: DEFAULT_CURRENCY,
      embedColor: DEFAULT_EMEBED_COLOR,
      dailyOptions: {
        dailyAmount: DEFAULT_DAILY_AMOUNT,
        doDailyStreak: DEFAULT_DO_DAILY_STREAK,
        dailyStreakIncrement: DEFAULT_DAILY_INCREMENT
      },
      maintainerRole
    } as GuildSettings));
  }

  await runDb(db().table('guildSettings').get(guildId).update({ maintainerRole }));
}

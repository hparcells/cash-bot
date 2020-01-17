import { runDb, db } from '../database';

import { Account, EmbedImage } from '../types';
import { DEFAULT_STARTING_AMOUNT, DEFAULT_PRIVATE_STATUS } from '../defaults';

/**
 * Ensures that an account exists for a user in the database.
 * @param authorId The ID of the account holder.
 * @param initialGuildId The guild ID where this account is first being generated.
 */
async function ensureAccount(authorId: string, initialGuildId: string) {
  // Check if the person has a number yet.
  if(!(await runDb(db().table('accounts').getAll(authorId).count().eq(1)))) {
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

export default ensureAccount;

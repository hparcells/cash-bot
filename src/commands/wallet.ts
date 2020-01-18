import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { runDb, db } from '../database';
import { ensureUserAccount } from '../utils/ensure';

import { Account, EmbedImage, GuildSettings } from '../types';

import { DEFAULT_EMEBED_COLOR, DEFAULT_CURRENCY } from '../defaults';

class WalletCommand extends Command {
  constructor() {
    super('wallet', {
      aliases: ['wallet', 'balance', 'bal', 'cash']
    });
  }

  async exec(message: Message) {
    // Make sure the user has an account
    await ensureUserAccount(message.author.id, message.guild.id);

    // Get the guild settings.
    const guildSettings: GuildSettings = await runDb(db().table('guildSettings').get(message.guild.id));

    // Get the account.
    const account: Account = await runDb(db().table('accounts').get(`${message.author.id}-${message.guild.id}`));
    const cash = account?.cash;

    // Send message.
    return message.channel.send({embed: {
      title: 'Your Wallet',
      description: `You have ${cash} ${guildSettings?.currency || DEFAULT_CURRENCY} in ${message.guild.name}.`,
      thumbnail: {
        url: EmbedImage.MoneyBag
      },
      color: guildSettings?.embedColor || DEFAULT_EMEBED_COLOR
    }});
  }
}

export default WalletCommand;

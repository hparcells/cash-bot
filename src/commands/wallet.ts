import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { getGuild, getAccount } from '../database';
import { ensureUserAccount } from '../utils/ensure';

import { Account, EmbedImage, Guild } from '../types';

import { DEFAULT_EMBED_COLOR, DEFAULT_CURRENCY } from '../defaults';

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
    const guildSettings: Guild = await getGuild(message.guild.id);

    // Get the account.
    const account: Account = await getAccount(message.author.id, message.guild.id);

    // Send message.
    return message.channel.send({embed: {
      title: 'Your Wallet',
      description: `You have ${account?.cash} ${guildSettings?.currency || DEFAULT_CURRENCY} in ${message.guild.name}.`,
      thumbnail: {
        url: EmbedImage.MoneyBag
      },
      color: guildSettings?.embedColor || DEFAULT_EMBED_COLOR
    }});
  }
}

export default WalletCommand;

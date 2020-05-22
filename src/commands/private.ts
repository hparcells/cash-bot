import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { getAccount, database, getGuild } from '../database';
import { ensureUserAccount } from '../utils/ensure';

import { Account, Guild, EmbedImage } from '../types';

import { DEFAULT_EMBED_COLOR } from '../defaults';

class PrivateCommand extends Command {
  constructor() {
    super('private', {
      aliases: ['private']
    });
  }

  async exec(message: Message) {
    // Make sure the user has an account
    await ensureUserAccount(message.author.id, message.guild.id);

    // Get the account.
    const account: Account = await getAccount(message.author.id, message.guild.id);

    // Get the guild settings.
    const guildSettings: Guild = await getGuild(message.guild.id);

    // Update the user.
    await database.collection('accounts').updateOne({ id: message.author.id, guild: message.guild.id }, { $set: { private: !account?.private } });

    if(!account.private) {
      // Send message.
      return await message.channel.send({embed: {
        title: ':lock: Private',
        description: `You have privated your account in ${message.guild.name}.`,
        thumbnail: {
          url: EmbedImage.Lock
        },
        color: guildSettings?.embedColor || DEFAULT_EMBED_COLOR
      }});
    }

    // Send message.
    return await message.channel.send({embed: {
      title: ':unlock: Private',
      description: `You have publicised your account in ${message.guild.name}.`,
      thumbnail: {
        url: EmbedImage.Unlock
      },
      color: guildSettings?.embedColor || DEFAULT_EMBED_COLOR
    }});
  }
}

export default PrivateCommand;

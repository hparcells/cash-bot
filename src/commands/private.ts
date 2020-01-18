import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { runDb, db } from '../database';
import { ensureUserAccount } from '../utils/ensure';

import { Account, EmbedImage } from '../types';

import { DEFAULT_EMEBED_COLOR } from '../defaults';

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
    const account: Account = await runDb(db().table('accounts').get(`${message.author.id}-${message.guild.id}`));
    const privateStatus = account?.private;

    // Update the user.
    await runDb(db().table('accounts').get(`${message.author.id}-${message.guild.id}`).update({ private: !privateStatus }));

    if(!privateStatus) {
      // Send message.
      return message.channel.send({embed: {
        title: ':lock: Private',
        description: `You have privated your account in ${message.guild.name}.`,
        thumbnail: {
          url: EmbedImage.Lock
        },
        color: DEFAULT_EMEBED_COLOR
      }});
    }

    // Send message.
    return message.channel.send({embed: {
      title: ':unlock: Private',
      description: `You have publicised your account in ${message.guild.name}.`,
      thumbnail: {
        url: EmbedImage.Unlock
      },
      color: DEFAULT_EMEBED_COLOR
    }});
  }
}

export default PrivateCommand;

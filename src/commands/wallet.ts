import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { runDb, db } from '../database';
import ensureAccount from '../utils/ensure-account';

import { Account, EmbedImage } from '../types';

import { DEFAULT_EMEBED_COLOR, DEFAULT_CURRENCY } from '../defaults';
import { client } from '..';

class WalletCommand extends Command {
  constructor() {
    super('wallet', {
      aliases: ['wallet', 'balance', 'bal', 'cash']
    });
  }

  async exec(message: Message) {
    // Make sure the user has an account
    await ensureAccount(message.author.id, message.guild.id);

    // Get the account.
    const account: Account = await runDb(db().table('accounts').get(`${message.author.id}-${message.guild.id}`));
    const cash = account?.cash;

    // Send message.
    return message.channel.send({embed: {
      title: 'Your Cash',
      description: `You have ${cash} ${DEFAULT_CURRENCY} in ${message.guild.name}.`,
      thumbnail: {
        url: EmbedImage.MoneyBag
      },
      color: DEFAULT_EMEBED_COLOR
    }});
  }
}

export default WalletCommand;

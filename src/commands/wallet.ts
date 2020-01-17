import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { runDb, db } from '../database';

import { Account, EmbedImage } from '../types';

import { DEFAULT_EMEBED_COLOR, DEFAULT_CURRENCY, DEFAULT_STARTING_AMOUNT } from '../defaults';

class WalletCommand extends Command {
  constructor() {
    super('wallet', {
      aliases: ['balance', 'bal', 'cash']
    });
  }

  async exec(message: Message) {
    // Check if the person has a number yet.
    if(!(await runDb(db().table('accounts').getAll(message.author.id).count().eq(1)))) {
      // Acc to database.
      await runDb(db().table('accounts').insert({
        id: message.author.id,
        cash: {
          [message.guild.id]: 20
        },
        dailyStreak: 0,
        lastDaily: 0,
        private: false
      } as Account));
    }

    // Get the number.
    const account: Account = await runDb(db().table('accounts').get(message.author.id));
    const cash = (account && account.cash[message.guild.id]) || DEFAULT_STARTING_AMOUNT;

    // Send message.
    return message.channel.send({embed: {
      title: 'Your Cash',
      description: `You have ${cash} ${DEFAULT_CURRENCY}.`,
      thumbnail: {
        url: EmbedImage.MoneyBag
      },
      color: DEFAULT_EMEBED_COLOR
    }});
  }
}

export default WalletCommand;

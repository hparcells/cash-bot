import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { EmbedImage } from '../types';

import { DEFAULT_EMEBED_COLOR } from '../defaults';

import { client } from '..';

class StatsCommand extends Command {
  constructor() {
    super('stats', {
      aliases: ['stats'],
      ownerOnly: 'true'
    });
  }

  exec(message: Message) {
    // Send message.
    return message.channel.send({embed: {
      title: 'Stats',
      description: 'Statistics of Cash Bot',
      fields: [{
        name: 'Servers',
        value: client.guilds.size
      }, {
        name: 'Users',
        value: client.users.size
      }, {
        name: 'Channels',
        value: client.channels.size
      }, {
        name: 'Memory Usage',
        value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
      }],
      thumbnail: {
        url: EmbedImage.MoneyBag
      },
      color: DEFAULT_EMEBED_COLOR
    }});
  }
}

export default StatsCommand;

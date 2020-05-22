import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { EmbedImage, Guild } from '../types';

import { DEFAULT_EMBED_COLOR } from '../defaults';

import { client } from '..';
import { getGuild } from '../database';

class StatsCommand extends Command {
  constructor() {
    super('stats', {
      aliases: ['stats'],
      ownerOnly: 'true'
    });
  }

  async exec(message: Message) {
    // Get the guild settings.
    const guildSettings: Guild = await getGuild(message.guild.id);

    // Send message.
    return await message.channel.send({
      embed: {
        title: 'Stats',
        description: 'Statistics of Cash Bot',
        fields: [
          {
            name: 'Servers',
            value: client.guilds.size
          },
          {
            name: 'Users',
            value: client.users.size
          },
          {
            name: 'Channels',
            value: client.channels.size
          },
          {
            name: 'Memory Usage',
            value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
          }
        ],
        thumbnail: {
          url: EmbedImage.MoneyBag
        },
        color: guildSettings?.embedColor || DEFAULT_EMBED_COLOR
      }
    });
  }
}

export default StatsCommand;

import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { getGuild } from '../database';

import { EmbedImage, Guild } from '../types';

import { DEFAULT_EMBED_COLOR } from '../defaults';

class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping']
    });
  }

  async exec(message: Message) {
    // Get the guild settings.
    const guildSettings: Guild = await getGuild(message.guild.id);

    // Send the first message.
    const sent = (await message.channel.send({
      embed: {
        title: ':ping_pong: Ponging in Process',
        description: 'Ponging...',
        thumbnail: {
          url: EmbedImage.PingPong
        },
        color: guildSettings?.embedColor || DEFAULT_EMBED_COLOR
      }
    })) as Message;

    // Get the difference between the two.
    const timeDiff = sent.createdAt.valueOf() - message.createdAt.valueOf();

    // Update message.
    return sent.edit({
      embed: {
        title: ':ping_pong: Pong!',
        description: `${timeDiff} ms`,
        thumbnail: {
          url: EmbedImage.PingPong
        },
        color: guildSettings?.embedColor || DEFAULT_EMBED_COLOR
      }
    });
  }
}

export default PingCommand;

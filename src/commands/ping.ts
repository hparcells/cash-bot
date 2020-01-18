import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { runDb, db } from '../database';

import { EmbedImage, GuildSettings } from '../types';

import { DEFAULT_EMEBED_COLOR } from '../defaults';

class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping']
    });
  }

  async exec(message: Message) {
    // Get the guild settings.
    const guildSettings: GuildSettings = await runDb(db().table('guildSettings').get(message.guild.id));

    // Send the first message.
    const sent = await message.channel.send({embed: {
      title: ':ping_pong: Ponging in Process',
      description: 'Ponging...',
      thumbnail: {
        url: EmbedImage.PingPong
      },
      color: guildSettings?.embedColor || DEFAULT_EMEBED_COLOR
    }}) as Message;

    // Get the difference between the two.
    const timeDiff = sent.createdAt.valueOf() - message.createdAt.valueOf();

    // Update message.
    return sent.edit({embed: {
      title: ':ping_pong: Pong!',
      description: `${timeDiff} ms`,
      thumbnail: {
        url: EmbedImage.PingPong
      },
      color: guildSettings?.embedColor || DEFAULT_EMEBED_COLOR
    }});
  }
}

export default PingCommand;
